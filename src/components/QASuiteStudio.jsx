import { useState, useEffect } from 'react';
import N8NOrchestrator from './N8NOrchestrator';
import * as XLSX from 'xlsx';

export default function QASuiteStudio({ onOpenContact }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67))) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const [pestanaActiva, setPestanaActiva] = useState('matriz');
  const [pasoActual, setPasoActual] = useState(1);

  // --- MÓDULO 1: FORMATO (Lector real de Excel con SheetJS) ---
  const [archivoEstructura, setArchivoEstructura] = useState(null);
  const [columnasDetectadas, setColumnasDetectadas] = useState('Id, Caso de Prueba, Descripción, Fecha, Área Funcional, Funcionalidad');
  const [analizandoFormato, setAnalizandoFormato] = useState(false);
  const [formatoValidado, setFormatoValidado] = useState(false);

  // --- MÓDULO 2: REQUERIMIENTO ---
  const [archivosReqLista, setArchivosReqLista] = useState([]);
  const [historiaUsuario, setHistoriaUsuario] = useState('');
  const [nombreProyectoDetectado, setNombreProyectoDetectado] = useState('');
  const [notasReq, setNotasReq] = useState('');
  const [requerimientoAnalizado, setRequerimientoAnalizado] = useState(false);

  // --- MÓDULO 3: GENERACIÓN DE MP ---
  const [nivelMatriz, setNivelMatriz] = useState('MED');

  const manejarSeleccionArchivo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoEstructura(file);
      setFormatoValidado(false);
    }
  };

  // Lector real de Excel usando XLSX
  const ejecutarAnalisisExcelReal = () => {
    if (!archivoEstructura) {
      setFormatoValidado(true);
      return;
    }

    setAnalizandoFormato(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Tomar la primera hoja del Excel
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convertir la hoja a JSON (matriz de filas)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Buscar la fila de cabeceras (la primera fila no vacía)
        let headers = [];
        for (let row of jsonData) {
          if (row && row.length > 0) {
            // Filtrar celdas con texto válido
            const validCols = row.filter(cell => cell !== null && cell !== undefined && String(cell).trim() !== '');
            if (validCols.length >= 2) {
              headers = validCols.map(c => String(c).trim());
              break;
            }
          }
        }

        if (headers.length > 0) {
          setColumnasDetectadas(headers.join(', '));
        } else {
          setColumnasDetectadas('Id, Caso de Prueba, Descripción, Fecha, Área Funcional, Funcionalidad');
        }
      } catch (err) {
        console.error("Error al procesar el Excel:", err);
        setColumnasDetectadas('Id, Caso de Prueba, Descripción, Fecha, Área Funcional, Funcionalidad');
      }
      setAnalizandoFormato(false);
      setFormatoValidado(true);
    };

    reader.onerror = () => {
      setAnalizandoFormato(false);
      setFormatoValidado(true);
    };

    reader.readAsArrayBuffer(archivoEstructura);
  };

  const columnasArray = columnasDetectadas ? columnasDetectadas.split(',').map(c => c.trim()).filter(Boolean) : ['Id', 'Caso de Prueba', 'Descripción'];

  const obtenerNombreProyecto = () => {
    if (nombreProyectoDetectado.trim()) return nombreProyectoDetectado.trim();
    if (historiaUsuario.trim()) return historiaUsuario.trim().substring(0, 15).toUpperCase();
    if (archivosReqLista.length > 0) return archivosReqLista[0].replace(/\.[^/.]+$/, "").toUpperCase();
    return "SPEI_TRANSFERENCIAS";
  };

  const nombreProjFinal = obtenerNombreProyecto();
  const inicialesID = nombreProjFinal.substring(0, 4).toUpperCase();

  const totalCasos = nivelMatriz === 'JR' ? 50 : nivelMatriz === 'MED' ? 100 : 135;
  const costoMin = nivelMatriz === 'JR' ? 750 : nivelMatriz === 'MED' ? 1400 : 2500;
  const costoEstimado = costoMin.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

  const generarCasosPruebaAtomicos = () => {
    let casos = [];
    const contextoReq = historiaUsuario.trim() || (archivosReqLista.length > 0 ? `Versiones: ${archivosReqLista.join(', ')}` : 'Prueba de Depósitos SPEI / Transferencias (Demo por Defecto)');
    const tipos = ['Happy Path', 'Test to Fail', 'Smoke Test', 'Boundary Value', 'Seguridad'];

    for (let i = 1; i <= totalCasos; i++) {
      const tipoActual = tipos[(i - 1) % tipos.length];
      const idCaso = `TC-${inicialesID}-${String(i).padStart(3, '0')}`;
      
      let procesoVal = "Core Transaccional / SPEI";
      let descVal = `Verificación atómica para requerimiento: "${contextoReq}". Escenario #${i} bajo tipología ${tipoActual}.`;

      let casoObj = {};
      columnasArray.forEach((col, idx) => {
        const cLower = col.toLowerCase();
        if (cLower.includes('id') || cLower.includes('caso')) casoObj[col] = idCaso;
        else if (cLower.includes('proceso') || cLower.includes('área') || cLower.includes('area')) casoObj[col] = procesoVal;
        else if (cLower.includes('sub') || cLower.includes('sub-proceso')) casoObj[col] = `Subflujo Operativo #${i}`;
        else if (cLower.includes('desc')) casoObj[col] = descVal;
        else if (cLower.includes('tipo')) casoObj[col] = tipoActual;
        else if (cLower.includes('fecha')) casoObj[col] = new Date().toISOString().split('T')[0];
        else if (cLower.includes('funcionalidad')) casoObj[col] = `Característica Operativa #${i}`;
        else if (cLower.includes('estatus') || cLower.includes('estado')) casoObj[col] = 'Pendiente';
        else if (cLower.includes('tester')) casoObj[col] = 'Martin Tonatiuh Hernandez Garfias';
        else casoObj[col] = `Valor_${idx}_${i}`;
      });
      casos.push(casoObj);
    }
    return casos;
  };

  const listaCasosGenerados = generarCasosPruebaAtomicos();
  const totalHP = listaCasosGenerados.filter(c => Object.values(c).includes('Happy Path')).length;
  const totalTTF = listaCasosGenerados.filter(c => Object.values(c).includes('Test to Fail')).length;
  const totalSmoke = listaCasosGenerados.filter(c => Object.values(c).includes('Smoke Test')).length;
  const totalOtros = totalCasos - (totalHP + totalTTF + totalSmoke);

  const descargarDemoCSV = () => {
    let csv = '\uFEFF' + columnasArray.join(',') + '\n';
    let avisoRow = new Array(columnasArray.length).fill('');
    avisoRow[0] = 'AVISO_DEMO';
    avisoRow[1] = 'ESTE ARCHIVO CONTIENE UN DEMO DE 10 CASOS. SI DESEAS LA MP COMPLETA, CONTACTA AL DESARROLLADOR.';
    csv += '"' + avisoRow.join('","') + '"\n';

    listaCasosGenerados.slice(0, 10).forEach(c => {
      let fila = columnasArray.map(col => `"${(c[col] || '').replace(/"/g, '""')}"`);
      csv += fila.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MP_DEMO_10_Casos_${nivelMatriz}.csv`;
    link.click();
  };

  const reiniciarTodo = () => {
    setArchivoEstructura(null);
    setColumnasDetectadas('Id, Caso de Prueba, Descripción, Fecha, Área Funcional, Funcionalidad');
    setFormatoValidado(false);
    setAnalizandoFormato(false);
    setArchivosReqLista([]);
    setHistoriaUsuario('');
    setNombreProyectoDetectado('');
    setNotasReq('');
    setRequerimientoAnalizado(false);
    setNivelMatriz('MED');
    setPasoActual(1);
  };

  return (
    <section 
      id="automatizaciones" 
      className="max-w-6xl mx-auto px-4 py-16 w-full scroll-mt-24"
      onContextMenu={(e) => e.preventDefault()} 
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
          <button 
            onClick={() => setPestanaActiva('matriz')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${pestanaActiva === 'matriz' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            📋 Generador de MP (Lector Excel Real)
          </button>
          <button 
            onClick={() => setPestanaActiva('n8n')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${pestanaActiva === 'n8n' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            ⚙️ Orquestador n8n & Webhooks
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {pestanaActiva === 'matriz' ? (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-4 gap-4">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Arquitectura Modular Profesional</span>
                <h3 className="text-xl font-extrabold text-white">Módulo 1: Lector Real de Archivos Excel (.xlsx / .xls)</h3>
              </div>
              <button onClick={reiniciarTodo} className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                🗑️ Reiniciar Todo
              </button>
            </div>

            {/* Pestañas de Navegación por Módulos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button 
                onClick={() => setPasoActual(1)} 
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${pasoActual === 1 ? 'bg-cyan-950 border-cyan-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}
              >
                <span className="text-[10px] text-cyan-400 font-bold uppercase">Módulo 1</span>
                <p className="text-xs font-bold text-white mt-0.5">Formato & Columnas (Excel)</p>
              </button>
              <button 
                onClick={() => setPasoActual(2)} 
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoActual === 2 ? 'bg-emerald-950 border-emerald-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}
              >
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Módulo 2</span>
                <p className="text-xs font-bold text-white mt-0.5">Análisis de Requerimiento</p>
              </button>
              <button 
                onClick={() => setPasoActual(3)} 
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoActual === 3 ? 'bg-purple-950 border-purple-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}
              >
                <span className="text-[10px] text-purple-400 font-bold uppercase">Módulo 3</span>
                <p className="text-xs font-bold text-white mt-0.5">Generación de MP ({totalCasos} Casos)</p>
              </button>
            </div>

            {/* MÓDULO 1: FORMATO CON LECTOR DE EXCEL */}
            {pasoActual === 1 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-5 text-xs animate-fadeIn">
                <h4 className="font-bold text-cyan-400 uppercase text-sm">Módulo 1: Análisis de Formato (.xlsx / .xls / .csv)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📁 Subir Archivo Excel o CSV de Formato</label>
                    <input 
                      type="file" 
                      accept=".xlsx, .xls, .csv"
                      key={archivoEstructura ? archivoEstructura.name : 'reset-fmt'}
                      onChange={manejarSeleccionArchivo} 
                      className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-300 cursor-pointer" 
                    />
                    {archivoEstructura && <p className="text-cyan-300 font-mono text-[11px]">Excel seleccionado: {archivoEstructura.name}</p>}
                    <p className="text-[10px] text-slate-400 pt-1">💡 Al subir tu archivo de Excel, el motor leerá las cabeceras reales de la hoja de cálculo.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📊 Columnas Esenciales Extraídas (Editables)</label>
                    <textarea 
                      value={columnasDetectadas} 
                      onChange={(e) => setColumnasDetectadas(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-cyan-300 font-mono text-xs focus:border-cyan-500 outline-none" 
                      rows="3"
                    />
                  </div>
                </div>

                <div>
                  <button 
                    onClick={ejecutarAnalisisExcelReal}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition cursor-pointer shadow-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <span>🔍</span>
                    <span>Analizar Excel & Extraer Columnas Reales</span>
                  </button>
                </div>

                {analizandoFormato && (
                  <div className="p-4 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-cyan-300 font-mono text-center animate-pulse">
                    ⚙️ Leyendo celdas y extrayendo cabeceras reales del Excel...
                  </div>
                )}

                {formatoValidado && !analizandoFormato && (
                  <div className="mt-6 p-5 bg-slate-900 border border-cyan-500/40 rounded-2xl space-y-3 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-emerald-400 uppercase text-xs">
                        ✅ Formato Extraído del Excel Real
                      </h5>
                      <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-1 rounded-lg font-mono">
                        {columnasArray.length} Columnas Leídas
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-slate-300 border border-slate-800 rounded-xl overflow-hidden">
                        <thead className="bg-slate-950 text-emerald-400 font-mono">
                          <tr>
                            {columnasArray.map((col, idx) => (
                              <th key={idx} className="px-4 py-2.5 border-b border-slate-800">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-slate-900/40">
                            {columnasArray.map((col, idx) => (
                              <td key={idx} className="px-4 py-2 text-slate-300 font-mono text-[11px] border-r border-slate-800 last:border-r-0">
                                {idx === 0 ? `TC-${inicialesID}-01` : `[${col}]`}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        onClick={() => setPasoActual(2)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-lg transition cursor-pointer text-xs"
                      >
                        Siguiente: Módulo 2 (Requerimiento) ➡️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MÓDULO 2: REQUERIMIENTO */}
            {pasoActual === 2 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-5 text-xs animate-fadeIn">
                <h4 className="font-bold text-emerald-400 uppercase text-sm">Módulo 2: Análisis de Requerimiento y Versiones</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📁 Subir Versiones del Requerimiento (Múltiples archivos)</label>
                    <input 
                      type="file" 
                      multiple 
                      onChange={(e) => setArchivosReqLista(Array.from(e.target.files).map(f => f.name))} 
                      className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-300 cursor-pointer" 
                    />
                    {archivosReqLista.length > 0 && (
                      <p className="text-emerald-400 font-mono text-[11px]">Versiones detectadas: {archivosReqLista.join(', ')}</p>
                    )}

                    <label className="block font-bold text-slate-200 pt-2">✍️ Historia de Usuario o Descripción Breve</label>
                    <textarea 
                      placeholder="Describe tu historia de usuario..." 
                      value={historiaUsuario} 
                      onChange={(e) => setHistoriaUsuario(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs outline-none focus:border-emerald-500" 
                      rows="3" 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">🏷️ Nombre del Proyecto (Opcional)</label>
                    <input 
                      type="text" 
                      placeholder="Si se deja vacío, se aplicará el demo SPEI/Transferencia"
                      value={nombreProyectoDetectado} 
                      onChange={(e) => setNombreProyectoDetectado(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs outline-none focus:border-emerald-500" 
                    />

                    <label className="block font-bold text-slate-200 pt-1">📌 Notas / Observaciones</label>
                    <textarea 
                      placeholder="Notas especiales..." 
                      value={notasReq} 
                      onChange={(e) => setNotasReq(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs outline-none focus:border-emerald-500" 
                      rows="2" 
                    />
                  </div>
                </div>

                <div>
                  <button 
                    onClick={() => setRequerimientoAnalizado(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition cursor-pointer shadow-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <span>🔍</span>
                    <span>Analizar Requerimiento & Generar Prefijo ID</span>
                  </button>
                </div>

                {requerimientoAnalizado && (
                  <div className="mt-6 p-5 bg-slate-900 border border-emerald-500/40 rounded-2xl space-y-3 animate-fadeIn">
                    <h5 className="font-bold text-emerald-400 uppercase text-xs">
                      ✅ Resultado del Análisis de Requerimiento
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase block">Nombre del Proyecto</span>
                        <strong className="text-white text-xs">{nombreProjFinal}</strong>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase block">Prefijo ID Generado</span>
                        <strong className="text-cyan-400 text-xs">TC-{inicialesID}-01</strong>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase block">Estado del Requerimiento</span>
                        <strong className="text-emerald-400 text-xs">{archivosReqLista.length > 0 || historiaUsuario.trim() ? 'Requerimiento Cargado' : 'Modo Demo SPEI por Defecto'}</strong>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button onClick={() => setPasoActual(1)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-lg text-xs">
                        ⬅️ Volver a Módulo 1
                      </button>
                      <button 
                        onClick={() => setPasoActual(3)}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2 rounded-lg transition cursor-pointer text-xs shadow-md"
                      >
                        Siguiente: Módulo 3 (Generación de MP) ➡️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MÓDULO 3: GENERACIÓN DE MP */}
            {pasoActual === 3 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h4 className="font-bold text-purple-400 uppercase text-sm">Módulo 3: Generación de Matriz de Pruebas (MP)</h4>
                    <p className="text-[11px] text-slate-400">Total de casos atómicos generados: <strong className="text-white font-mono">{totalCasos} Casos (Prefijo: TC-{inicialesID})</strong></p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => setNivelMatriz('JR')} className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${nivelMatriz === 'JR' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                      JR (50)
                    </button>
                    <button onClick={() => setNivelMatriz('MED')} className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${nivelMatriz === 'MED' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                      MED (100) ⭐
                    </button>
                    <button onClick={() => setNivelMatriz('SR')} className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${nivelMatriz === 'SR' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                      SR (135)
                    </button>
                  </div>
                </div>

                {/* Resumen por Tipología */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Happy Path</span>
                    <span className="text-lg font-black text-emerald-400">{totalHP}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Test to Fail</span>
                    <span className="text-lg font-black text-amber-400">{totalTTF}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Smoke Test</span>
                    <span className="text-lg font-black text-cyan-400">{totalSmoke}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Seguridad / Otros</span>
                    <span className="text-lg font-black text-purple-400">{totalOtros}</span>
                  </div>
                </div>

                {/* Tabla Interactiva Adaptada al Formato Módulo 1 */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="max-h-72 overflow-y-auto">
                    <table className="w-full text-xs text-left text-slate-300">
                      <thead className="bg-slate-950 text-emerald-400 uppercase font-mono sticky top-0 shadow-sm">
                        <tr>
                          {columnasArray.map((col, idx) => (
                            <th key={idx} className="px-4 py-3">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {listaCasosGenerados.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-950/60 align-top">
                            {columnasArray.map((col, idx) => (
                              <td key={idx} className="px-4 py-3 font-mono text-slate-200 whitespace-pre-line">
                                {c[col]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Descarga Demo Protegida */}
                <div className="flex justify-end">
                  <button 
                    onClick={descargarDemoCSV}
                    className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-md"
                  >
                    <span>📥 Descargar Archivo Demo (10 Casos)</span>
                  </button>
                </div>

                {/* Cotización Automática */}
                <div className="bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border border-emerald-500/40 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block">Cotización Automática ($750 - $2,500 MXN)</span>
                    <h4 className="text-white font-black text-2xl mt-0.5">{costoEstimado} <span className="text-xs font-normal text-slate-300">({totalCasos} Escenarios Nivel {nivelMatriz})</span></h4>
                    <p className="text-[10px] text-slate-300 mt-1">* Nota comercial: Contiene escenarios de prueba optimizados (No es la matriz final de ejecución corporativa).</p>
                  </div>
                  <button 
                    onClick={() => onOpenContact(`Hola Martin, solicito la MP completa para el proyecto ${nombreProjFinal} nivel ${nivelMatriz} (${totalCasos} casos). Cotización: ${costoEstimado}. ¿Podemos coordinar la entrega?`)}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition cursor-pointer"
                  >
                    💬 Solicitar MP Completa & Cotización ({costoEstimado})
                  </button>
                </div>

                <div className="flex justify-start pt-2">
                  <button onClick={() => setPasoActual(2)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-lg text-xs">
                    ⬅️ Volver a Módulo 2
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          <N8NOrchestrator />
        )}
      </div>
    </section>
  );
}