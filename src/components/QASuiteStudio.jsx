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

  // --- MÓDULO 1: FORMATO (Solo para extraer columnas de la plantilla) ---
  const [archivoEstructura, setArchivoEstructura] = useState(null);
  const [columnasDetectadas, setColumnasDetectadas] = useState('ID Funcional, ID Prueba, Proceso de prueba, Sub-Proceso de prueba, Descripción de prueba, Tipo de prueba');
  const [analizandoFormato, setAnalizandoFormato] = useState(false);
  const [formatoValidado, setFormatoValidado] = useState(false);

  // --- MÓDULO 2: ANÁLISIS DE REQUERIMIENTO ---
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

  // Leer exclusivamente las columnas de la plantilla Excel
  const ejecutarAnalisisPlantillaFormato = () => {
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
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        let headersEncontradas = [];
        for (let row of jsonData) {
          if (row && row.length > 0) {
            const rowStr = row.map(cell => cell !== null && cell !== undefined ? String(cell).toLowerCase() : '').join(' ');
            if ((rowStr.includes('id') || rowStr.includes('caso')) && (rowStr.includes('proceso') || rowStr.includes('descripci') || rowStr.includes('sub'))) {
              headersEncontradas = row.filter(cell => cell !== null && cell !== undefined && String(cell).trim() !== '').map(c => String(c).trim());
              break;
            }
          }
        }

        if (headersEncontradas.length > 0) {
          setColumnasDetectadas(headersEncontradas.join(', '));
        }
      } catch (err) {
        console.error("Error al leer plantilla:", err);
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

  const columnasArray = columnasDetectadas ? columnasDetectadas.split(',').map(c => c.trim()).filter(Boolean) : ['ID Funcional', 'ID Prueba', 'Descripción de prueba'];

  // Obtener Nombre del Proyecto o Fallback SPEI
  const obtenerNombreProyecto = () => {
    if (nombreProyectoDetectado.trim()) return nombreProyectoDetectado.trim();
    if (historiaUsuario.trim()) return historiaUsuario.trim().substring(0, 15).toUpperCase();
    if (archivosReqLista.length > 0) return archivosReqLista[0].replace(/\.[^/.]+$/, "").toUpperCase();
    return "SPEI_TRANSFERENCIAS";
  };

  const nombreProjFinal = obtenerNombreProyecto();
  const inicialesID = nombreProjFinal.substring(0, 4).toUpperCase();

  // Límites según el Nivel (Módulo 3)
  const totalCasos = nivelMatriz === 'JR' ? 50 : nivelMatriz === 'MED' ? 100 : 135;
  const costoMin = nivelMatriz === 'JR' ? 750 : nivelMatriz === 'MED' ? 1400 : 2500;
  const costoEstimado = costoMin.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

  // GENERADOR INTELIGENTE DE CASOS BASADOS EN EL REQUERIMIENTO (Módulo 2 & 3)
  const generarCasosPruebaSegunRequerimiento = () => {
    let casos = [];
    const reqTexto = historiaUsuario.trim() || (archivosReqLista.length > 0 ? `Archivos de requerimiento: ${archivosReqLista.join(', ')}` : 'Prueba de Depósitos SPEI / Transferencias (Demo por Defecto)');
    const tiposPrueba = ['Happy Path', 'Test to Fail', 'Smoke Test', 'Boundary Value', 'Validación de Seguridad'];

    for (let i = 1; i <= totalCasos; i++) {
      const tipoActual = tiposPrueba[(i - 1) % tiposPrueba.length];
      const idCaso = `TC-${inicialesID}-${String(i).padStart(3, '0')}`;
      const idFuncional = `MP-${inicialesID}-V2-${String(i).padStart(3, '0')}`;
      
      let proceso = "Core Transaccional / Funcional";
      let subproceso = `Módulo Operativo #${i}`;
      let descripcion = `Validar el escenario atómico número ${i} derivado del requerimiento: "${reqTexto}". Tipo de ejecución esperado: ${tipoActual}. [Notas: ${notasReq || 'Ninguna'}]`;

      if (reqTexto.toLowerCase().includes('taggeo') || reqTexto.toLowerCase().includes('hubspot') || reqTexto.toLowerCase().includes('riesgo')) {
        proceso = "Módulo de Integración & Reportes Regulatorios";
        subproceso = `Pantalla / Layout #${i}`;
        descripcion = `Verificar la correcta integración y respuesta de la API para el requerimiento (${reqTexto}) en el flujo ${i} bajo tipología ${tipoActual}.`;
      }

      let casoObj = {};
      columnasArray.forEach((col, idx) => {
        const cLow = col.toLowerCase();
        if (cLow.includes('funcional')) casoObj[col] = idFuncional;
        else if (cLow.includes('id') || cLow.includes('caso')) casoObj[col] = idCaso;
        else if (cLow.includes('proceso') || cLow.includes('área') || cLow.includes('area')) casoObj[col] = proceso;
        else if (cLow.includes('sub')) casoObj[col] = subproceso;
        else if (cLow.includes('desc')) casoObj[col] = descripcion;
        else if (cLow.includes('tipo')) casoObj[col] = tipoActual;
        else if (cLow.includes('fecha')) casoObj[col] = new Date().toISOString().split('T')[0];
        else if (cLow.includes('estatus') || cLow.includes('estado')) casoObj[col] = 'Pendiente';
        else if (cLow.includes('tester')) casoObj[col] = 'Martin Tonatiuh Hernandez Garfias';
        else casoObj[col] = `Dato_${idx}_${i}`;
      });
      casos.push(casoObj);
    }
    return casos;
  };

  const listaCasosGenerados = generarCasosPruebaSegunRequerimiento();

  // Conteo de Tipología
  const totalHP = listaCasosGenerados.filter(c => Object.values(c).some(v => String(v).includes('Happy Path'))).length;
  const totalTTF = listaCasosGenerados.filter(c => Object.values(c).some(v => String(v).includes('Test to Fail'))).length;
  const totalSmoke = listaCasosGenerados.filter(c => Object.values(c).some(v => String(v).includes('Smoke Test'))).length;
  const totalOtros = totalCasos - (totalHP + totalTTF + totalSmoke);

  const descargarDemoCSV = () => {
    let csv = '\uFEFF' + columnasArray.join(',') + '\n';
    let avisoRow = new Array(columnasArray.length).fill('');
    avisoRow[0] = 'AVISO_DEMO';
    avisoRow[1] = 'ESTE ARCHIVO CONTIENE UN DEMO DE 10 CASOS GENERADOS. SI DESEAS LA MP COMPLETA, CONTACTA AL DESARROLLADOR.';
    csv += '"' + avisoRow.join('","') + '"\n';

    listaCasosGenerados.slice(0, 10).forEach(c => {
      let fila = columnasArray.map(col => `"${(c[col] || '').toString().replace(/"/g, '""')}"`);
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
    setColumnasDetectadas('ID Funcional, ID Prueba, Proceso de prueba, Sub-Proceso de prueba, Descripción de prueba, Tipo de prueba, Estatus, Tester');
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
            📋 Generador de MP (Basado en Requerimiento)
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
                <h3 className="text-xl font-extrabold text-white">Generador Inteligente de Casos por Requerimiento</h3>
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
                <p className="text-xs font-bold text-white mt-0.5">Plantilla & Columnas</p>
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
                <p className="text-xs font-bold text-white mt-0.5">Generación MP ({totalCasos} Casos)</p>
              </button>
            </div>

            {/* MÓDULO 1: FORMATO (PLANTILLA) */}
            {pasoActual === 1 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-5 text-xs animate-fadeIn">
                <h4 className="font-bold text-cyan-400 uppercase text-sm">Módulo 1: Extracción de Columnas de la Plantilla</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📁 Subir Plantilla Excel de Referencia (Opcional)</label>
                    <input 
                      type="file" 
                      accept=".xlsx, .xls, .csv"
                      key={archivoEstructura ? archivoEstructura.name : 'reset-fmt'}
                      onChange={manejarSeleccionArchivo} 
                      className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-300 cursor-pointer" 
                    />
                    {archivoEstructura && <p className="text-cyan-300 font-mono text-[11px]">Plantilla cargada: {archivoEstructura.name}</p>}
                    <p className="text-[10px] text-slate-400 pt-1">💡 Sube tu Excel de referencia para extraer las columnas exactas que usará la matriz generada.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📊 Columnas Esenciales Detectadas (Editables)</label>
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
                    onClick={ejecutarAnalisisPlantillaFormato}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition cursor-pointer shadow-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <span>🔍</span>
                    <span>Analizar Plantilla & Guardar Columnas</span>
                  </button>
                </div>

                {analizandoFormato && (
                  <div className="p-4 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-cyan-300 font-mono text-center animate-pulse">
                    ⚙️ Leyendo estructura y columnas de la plantilla...
                  </div>
                )}

                {formatoValidado && !analizandoFormato && (
                  <div className="mt-6 p-5 bg-slate-900 border border-cyan-500/40 rounded-2xl space-y-3 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-emerald-400 uppercase text-xs">
                        ✅ Columnas Listas para Generación
                      </h5>
                      <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-1 rounded-lg font-mono">
                        {columnasArray.length} Columnas
                      </span>
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
                      placeholder="Describe tu historia de usuario o requerimiento..." 
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
                    <span>Analizar Requerimiento & Generar Casos Atómicos</span>
                  </button>
                </div>

                {requerimientoAnalizado && (
                  <div className="mt-6 p-5 bg-slate-900 border border-emerald-500/40 rounded-2xl space-y-3 animate-fadeIn">
                    <h5 className="font-bold text-emerald-400 uppercase text-xs">
                      ✅ Requerimiento Analizado Exitosamente
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
                        <span className="text-[10px] text-slate-400 uppercase block">Generación Lista</span>
                        <strong className="text-emerald-400 text-xs">Motor Activo</strong>
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

            {/* MÓDULO 3: GENERACIÓN DE MP SEGÚN REQUERIMIENTO */}
            {pasoActual === 3 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h4 className="font-bold text-purple-400 uppercase text-sm">Módulo 3: Generación de Matriz de Pruebas (MP)</h4>
                    <p className="text-[11px] text-slate-400">Total casos generados por requerimiento: <strong className="text-white font-mono">{totalCasos} Casos (Prefijo: TC-{inicialesID})</strong></p>
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

                {/* Tabla Interactiva con Casos Generados por Requerimiento */}
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
                              <td key={idx} className="px-4 py-3 font-mono text-slate-200 whitespace-pre-line max-w-xs truncate">
                                {c[col] !== undefined && c[col] !== null ? String(c[col]) : ''}
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
                    <span>📥 Descargar Archivo Demo (10 Casos Generados)</span>
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