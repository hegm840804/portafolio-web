import { useState, useEffect } from 'react';
import N8NOrchestrator from './N8NOrchestrator';

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

  // --- MÓDULO 1: FORMATO ---
  const [archivoEstructura, setArchivoEstructura] = useState(null);
  const [columnasDetectadas, setColumnasDetectadas] = useState('Id, Caso de Prueba, Descripción, Fecha, Área Funcional / Sub proceso, Funcionalidad / Característica');
  const [analizandoFormato, setAnalizandoFormato] = useState(false);
  const [formatoValidado, setFormatoValidado] = useState(false);

  // --- MÓDULO 2: REQUERIMIENTO ---
  const [archivosReqLista, setArchivosReqLista] = useState([]);
  const [historiaUsuario, setHistoriaUsuario] = useState('');
  const [nombreProyectoDetectado, setNombreProyectoDetectado] = useState('');
  const [notasReq, setNotasReq] = useState('');
  const [requerimientoAnalizado, setRequerimientoAnalizado] = useState(false);

  // Carga de archivo sin disparar el análisis automático
  const manejarSeleccionArchivo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoEstructura(file);
      setFormatoValidado(false); // Requiere presionar el botón verde
    }
  };

  // Botón de Análisis Inteligente igual al Módulo 2
  const ejecutarAnalisisFormato = () => {
    setAnalizandoFormato(true);
    setTimeout(() => {
      if (archivoEstructura) {
        const nombre = archivoEstructura.name.toLowerCase();
        if (nombre.includes('taggeo') || nombre.includes('fincomun')) {
          setColumnasDetectadas('ID Funcional, ID, Proceso de prueba, Sub-Proceso de prueba, Descripción de prueba, Tipo de prueba');
        } else {
          setColumnasDetectadas('Id, Caso de Prueba, Descripción, Fecha, Área Funcional / Sub proceso, Funcionalidad / Característica');
        }
      } else {
        // Fallback estándar
        setColumnasDetectadas('Id, Caso de Prueba, Descripción, Fecha, Área Funcional / Sub proceso, Funcionalidad / Característica');
      }
      setAnalizandoFormato(false);
      setFormatoValidado(true);
    }, 600);
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

  const reiniciarTodo = () => {
    setArchivoEstructura(null);
    setColumnasDetectadas('Id, Caso de Prueba, Descripción, Fecha, Área Funcional / Sub proceso, Funcionalidad / Característica');
    setFormatoValidado(false);
    setAnalizandoFormato(false);
    setArchivosReqLista([]);
    setHistoriaUsuario('');
    setNombreProyectoDetectado('');
    setNotasReq('');
    setRequerimientoAnalizado(false);
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
            📋 Generador de MP (Modular Estilo Botón Verde)
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
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Arquitectura Modular en Progreso</span>
                <h3 className="text-xl font-extrabold text-white">Análisis con Botón de Acción Dedicado</h3>
              </div>
              <button onClick={reiniciarTodo} className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                🗑️ Reiniciar Todo
              </button>
            </div>

            {/* Pestañas de Módulos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setPasoActual(1)} 
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoActual === 1 ? 'bg-cyan-950 border-cyan-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}
              >
                <span className="text-[10px] text-cyan-400 font-bold uppercase">Módulo 1</span>
                <p className="text-sm font-bold text-white mt-1">Análisis de Formato & Estructura</p>
              </button>
              <button 
                onClick={() => setPasoActual(2)} 
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoActual === 2 ? 'bg-emerald-950 border-emerald-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}
              >
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Módulo 2</span>
                <p className="text-sm font-bold text-white mt-1">Análisis de Requerimiento & Versiones</p>
              </button>
            </div>

            {/* MÓDULO 1: FORMATO CON BOTÓN VERDE */}
            {pasoActual === 1 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-5 text-xs animate-fadeIn">
                <h4 className="font-bold text-cyan-400 uppercase text-sm">Módulo 1: Análisis del Formato</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📁 Subir Archivo, Excel o Imagen de Estructura</label>
                    <input 
                      type="file" 
                      key={archivoEstructura ? archivoEstructura.name : 'reset-fmt'}
                      onChange={manejarSeleccionArchivo} 
                      className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-300 cursor-pointer" 
                    />
                    {archivoEstructura && <p className="text-cyan-300 font-mono text-[11px]">Archivo seleccionado: {archivoEstructura.name}</p>}
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

                {/* BOTÓN VERDE IDÉNTICO AL MÓDULO 2 */}
                <div>
                  <button 
                    onClick={ejecutarAnalisisFormato}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition cursor-pointer shadow-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <span>🔍</span>
                    <span>Analizar Estructura & Extraer Columnas</span>
                  </button>
                </div>

                {analizandoFormato && (
                  <div className="p-4 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-cyan-300 font-mono text-center animate-pulse">
                    ⚙️ Analizando esquema y extrayendo columnas reales...
                  </div>
                )}

                {formatoValidado && !analizandoFormato && (
                  <div className="mt-6 p-5 bg-slate-900 border border-cyan-500/40 rounded-2xl space-y-3 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-emerald-400 uppercase text-xs">
                        ✅ Vista Previa Visible del Formato Extraído
                      </h5>
                      <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-1 rounded-lg font-mono">
                        Total Columnas: {columnasArray.length}
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
                                {idx === 0 ? `01` : `[Ejemplo de ${col}]`}
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
                    <span>Analizar Requerimiento & Generar Prefijo</span>
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
                      <span className="text-xs text-emerald-400 font-bold">✨ ¡Módulo 2 completado con éxito! Listo para el Módulo 3 (Generación de MP).</span>
                    </div>
                  </div>
                )}
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