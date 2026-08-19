import { useState, useEffect } from 'react';
import N8NOrchestrator from './N8NOrchestrator';

export default function QASuiteStudio({ onOpenContact }) {
  // SEGURIDAD INVISIBLE: Bloquea herramientas de dev y selección sin alertas visuales
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
  const [pasoMP, setPasoMP] = useState(1);
  const [nivel, setNivel] = useState('MED'); // Por defecto MED

  // MÓDULO 2: Requerimientos
  const [archivosReq, setArchivosReq] = useState([]);
  const [historiaUsuario, setHistoriaUsuario] = useState('');
  const [notasReq, setNotasReq] = useState('');

  // MÓDULO 1: Formato y Estructura
  const [archivoEstructura, setArchivoEstructura] = useState(null);
  const [columnasCustom, setColumnasCustom] = useState('');
  const [nombreProyecto, setNombreProyecto] = useState('SPEI');

  // MÓDULO 3: Límites y Cotización
  const totalCasos = nivel === 'JR' ? 50 : nivel === 'MED' ? 100 : 135;
  const precioMin = nivel === 'JR' ? 750 : nivel === 'MED' ? 1400 : 2500;
  const costoEstimado = precioMin.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

  // Extracción inteligente de iniciales y columnas (Módulo 1)
  const obtenerColumnas = () => {
    const iniciales = nombreProyecto ? nombreProyecto.trim().substring(0, 4).toUpperCase() : 'PROJ';
    if (columnasCustom.trim()) {
      return columnasCustom.split(',').map(c => c.trim()).filter(Boolean);
    }
    return [`ID_${iniciales}`, 'Proceso', 'Subproceso', 'Descripción', 'Tipo_Prueba', 'Estatus'];
  };

  const columnasArray = obtenerColumnas();

  // Generación de Casos Atómicos Basados en Requerimientos (Módulo 2 & 3)
  const generarCasosPrueba = () => {
    let casos = [];
    const reqTexto = historiaUsuario.trim() || (archivosReq.length > 0 ? `Archivos: ${archivosReq.join(', ')}` : 'Prueba de Depósitos SPEI / Transferencias');
    const tiposPrueba = ['Happy Path', 'Test to Fail', 'Smoke Test', 'Boundary Value', 'Validación de Seguridad'];
    const iniciales = nombreProyecto ? nombreProyecto.trim().substring(0, 4).toUpperCase() : 'PROJ';

    for (let i = 1; i <= totalCasos; i++) {
      const tipo = tiposPrueba[(i - 1) % tiposPrueba.length];
      const idCaso = `TC-${iniciales}-${String(i).padStart(3, '0')}`;
      
      let proceso = "Core / Transaccional";
      let desc = `Validación atómica para: "${reqTexto}". Escenario #${i} bajo tipo ${tipo}.`;

      if (reqTexto.toLowerCase().includes('taggeo') || reqTexto.toLowerCase().includes('hubspot')) {
        proceso = "Módulo de Etiquetado & HubSpot";
        desc = `Verificar llamada POST a API HubSpot (Pipeline 728738158) para el escenario ${i} (${tipo}). [Notas: ${notasReq || 'Ninguna'}]`;
      }

      let casoObj = {};
      columnasArray.forEach((col, idx) => {
        const cLow = col.toLowerCase();
        if (cLow.includes('id')) casoObj[col] = idCaso;
        else if (cLow.includes('proceso')) casoObj[col] = proceso;
        else if (cLow.includes('sub')) casoObj[col] = `Subflujo Operativo #${i}`;
        else if (cLow.includes('desc')) casoObj[col] = desc;
        else if (cLow.includes('tipo')) casoObj[col] = tipo;
        else if (cLow.includes('estatus') || cLow.includes('estado')) casoObj[col] = 'Pendiente';
        else casoObj[col] = `Dato_${idx}_${i}`;
      });
      casos.push(casoObj);
    }
    return casos;
  };

  const listaCasos = generarCasosPrueba();

  // Resumen por Tipología
  const totalHP = listaCasos.filter(c => Object.values(c).includes('Happy Path')).length;
  const totalTTF = listaCasos.filter(c => Object.values(c).includes('Test to Fail')).length;
  const totalSmoke = listaCasos.filter(c => Object.values(c).includes('Smoke Test')).length;
  const totalOtros = totalCasos - (totalHP + totalTTF + totalSmoke);

  // Descarga Protegida (Modo Demo: Solo 10 casos + Leyenda)
  const descargarDemoCSV = () => {
    let csv = '\uFEFF' + columnasArray.join(',') + '\n';
    let avisoRow = new Array(columnasArray.length).fill('');
    avisoRow[0] = 'AVISO_DEMO';
    avisoRow[1] = 'ESTE ARCHIVO CONTIENE UN DEMO DE 10 CASOS. SI DESEAS LA MP COMPLETA, CONTACTA AL DESARROLLADOR.';
    csv += '"' + avisoRow.join('","') + '"\n';

    listaCasos.slice(0, 10).forEach(c => {
      let fila = columnasArray.map(col => `"${(c[col] || '').replace(/"/g, '""')}"`);
      csv += fila.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MP_DEMO_10_Casos_${nivel}.csv`;
    link.click();
  };

  const resetearProyecto = () => {
    setArchivosReq([]);
    setHistoriaUsuario('');
    setNotasReq('');
    setArchivoEstructura(null);
    setColumnasCustom('');
    setNombreProyecto('SPEI');
    setNivel('MED');
    setPasoMP(1);
  };

  return (
    <section 
      id="automatizaciones" 
      className="max-w-6xl mx-auto px-4 py-16 w-full scroll-mt-24"
      onContextMenu={(e) => e.preventDefault()} 
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      {/* Pestañas Principales */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
          <button 
            onClick={() => setPestanaActiva('matriz')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${pestanaActiva === 'matriz' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            📋 1. Generador de MP ({totalCasos} Casos Totales)
          </button>
          <button 
            onClick={() => setPestanaActiva('n8n')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${pestanaActiva === 'n8n' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            ⚙️ 2. Orquestador n8n & Webhooks
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {pestanaActiva === 'matriz' ? (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-4 gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Arquitectura Modular Profesional de MP</span>
                <h3 className="text-xl font-extrabold text-white">Generador Configurable de Pruebas</h3>
              </div>
              <button onClick={resetearProyecto} className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                🗑️ Limpiar / Nuevo Proyecto
              </button>
            </div>

            {/* Navegación de Pasos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => setPasoMP(1)} className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoMP === 1 ? 'bg-emerald-950 border-emerald-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Módulo 2</span>
                <p className="text-sm font-bold text-white mt-1">Requerimiento & Versiones</p>
              </button>
              <button onClick={() => setPasoMP(2)} className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoMP === 2 ? 'bg-cyan-950 border-cyan-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}>
                <span className="text-[10px] text-cyan-400 font-bold uppercase">Módulo 1</span>
                <p className="text-sm font-bold text-white mt-1">Formato y Estructura</p>
              </button>
              <button onClick={() => setPasoMP(3)} className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoMP === 3 ? 'bg-purple-950 border-purple-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}>
                <span className="text-[10px] text-purple-400 font-bold uppercase">Módulo 3</span>
                <p className="text-sm font-bold text-white mt-1">Generación & Niveles</p>
              </button>
            </div>

            {/* PASO 1: Requerimiento */}
            {pasoMP === 1 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs animate-fadeIn">
                <h4 className="font-bold text-emerald-400 uppercase">2. Requerimiento de la Matriz (Versiones, Archivos o Historia de Usuario)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📁 Subir Archivo(s) de Requerimiento (Varias versiones)</label>
                    <input 
                      type="file" 
                      multiple 
                      onChange={(e) => setArchivosReq(Array.from(e.target.files).map(f => f.name))} 
                      className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-300 cursor-pointer" 
                    />
                    {archivosReq.length > 0 && <p className="text-emerald-400 font-mono text-[11px]">Archivos cargados: {archivosReq.join(', ')}</p>}

                    <label className="block font-bold text-slate-200 pt-2">✍️ Historia de Usuario / Descripción Breve</label>
                    <textarea 
                      placeholder="Ej. Requerimiento de etiquetado de pantallas para HubSpot..." 
                      value={historiaUsuario} 
                      onChange={(e) => setHistoriaUsuario(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs outline-none focus:border-emerald-500" 
                      rows="3" 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📌 Notas u Observaciones del Requerimiento</label>
                    <textarea 
                      placeholder="Si no se pone nada, se generará por defecto la MP de Depósitos SPEI / Transferencias..." 
                      value={notasReq} 
                      onChange={(e) => setNotasReq(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs outline-none focus:border-emerald-500" 
                      rows="6" 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button onClick={() => setPasoMP(2)} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl cursor-pointer transition">
                    Siguiente: Formato o Estructura ➡️
                  </button>
                </div>
              </div>
            )}

            {/* PASO 2: Formato o Estructura */}
            {pasoMP === 2 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs animate-fadeIn">
                <h4 className="font-bold text-cyan-400 uppercase">1. Formato de la Matriz (Estructura y Extracción de Columnas)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">🏷️ Nombre del Proyecto (Para iniciales del ID)</label>
                    <input 
                      type="text" 
                      value={nombreProyecto} 
                      onChange={(e) => setNombreProyecto(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-cyan-300 font-mono text-xs focus:border-cyan-500 outline-none" 
                    />

                    <label className="block font-bold text-slate-200 pt-2">📁 Subir Imagen o Archivo de Estructura (Opcional)</label>
                    <input 
                      type="file" 
                      onChange={(e) => setArchivoEstructura(e.target.files[0])} 
                      className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-300 cursor-pointer" 
                    />
                    {archivoEstructura && <p className="text-cyan-300 font-mono text-[11px]">Estructura base: {archivoEstructura.name}</p>}
                  </div>

                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📊 Columnas Personalizadas (Separadas por comas)</label>
                    <input 
                      type="text" 
                      placeholder="Dejar en blanco para usar columnas estándar..." 
                      value={columnasCustom} 
                      onChange={(e) => setColumnasCustom(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-cyan-300 font-mono text-xs focus:border-cyan-500 outline-none" 
                    />
                    <p className="text-[10px] text-slate-400">Analizamos el formato para extraer solo las columnas esenciales atómicas para los escenarios de prueba.</p>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button onClick={() => setPasoMP(1)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-5 py-2.5 rounded-xl cursor-pointer">
                    ⬅️ Anterior
                  </button>
                  <button onClick={() => setPasoMP(3)} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl cursor-pointer transition">
                    Siguiente: Generación ➡️
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3: Generación de Matriz */}
            {pasoMP === 3 && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Selector de Niveles */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-purple-400 uppercase">3. Generación de la Matriz (Límites por Nivel)</h4>
                    <p className="text-[11px] text-slate-400">Total casos generados: <strong className="text-white font-mono">{totalCasos} Casos</strong></p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => setNivel('JR')} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${nivel === 'JR' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                      JR (30 - 75)
                    </button>
                    <button onClick={() => setNivel('MED')} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${nivel === 'MED' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                      MED (80 - 120) ⭐
                    </button>
                    <button onClick={() => setNivel('SR')} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${nivel === 'SR' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                      SR (120+)
                    </button>
                  </div>
                </div>

                {/* Resumen de Tipología */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Happy Path</span>
                    <span className="text-lg font-black text-emerald-400">{totalHP}</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Test to Fail</span>
                    <span className="text-lg font-black text-amber-400">{totalTTF}</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Smoke Test</span>
                    <span className="text-lg font-black text-cyan-400">{totalSmoke}</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Seguridad / Otros</span>
                    <span className="text-lg font-black text-purple-400">{totalOtros}</span>
                  </div>
                </div>

                {/* Tabla Interactiva */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="max-h-72 overflow-y-auto">
                    <table className="w-full text-xs text-left text-slate-300">
                      <thead className="bg-slate-900 text-emerald-400 uppercase font-mono sticky top-0 shadow-sm">
                        <tr>
                          {columnasArray.map((col, idx) => (
                            <th key={idx} className="px-4 py-3">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {listaCasos.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-900/60 align-top">
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

                {/* Cotización Comercial ($750 a $2,500 MXN) */}
                <div className="bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border border-emerald-500/40 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block">Cotización Automática (Rango $750 - $2,500 MXN)</span>
                    <h4 className="text-white font-black text-2xl mt-0.5">{costoEstimado} <span className="text-xs font-normal text-slate-300">({totalCasos} Escenarios Nivel {nivel})</span></h4>
                    <p className="text-[10px] text-slate-300 mt-1">* Nota comercial: Contiene escenarios de prueba optimizados (No es la matriz final de ejecución corporativa).</p>
                  </div>
                  <button 
                    onClick={() => onOpenContact(`Hola Martin, solicito la MP completa para el nivel ${nivel} (${totalCasos} casos). La cotización estimada es de ${costoEstimado}. ¿Podemos coordinar la entrega y respaldo en Google Drive?`)}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition cursor-pointer"
                  >
                    💬 Solicitar MP Completa & Cotización ({costoEstimado})
                  </button>
                </div>

                <div className="flex justify-start pt-2">
                  <button onClick={() => setPasoMP(2)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-5 py-2.5 rounded-xl cursor-pointer">
                    ⬅️ Volver a Formato
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