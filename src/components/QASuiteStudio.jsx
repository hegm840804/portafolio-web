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
  const [pasoActual, setPasoActual] = useState(1); // 1: Formato, 2: Requerimiento

  // --- MÓDULO 1: FORMATO ---
  const [archivoEstructura, setArchivoEstructura] = useState(null);
  const [columnasManuales, setColumnasManuales] = useState('ID Funcional, ID, Proceso de prueba, Sub-Proceso de prueba, Descripción de prueba, Tipo de prueba');
  const [formatoValidado, setFormatoValidado] = useState(false);

  // --- MÓDULO 2: ANÁLISIS DE REQUERIMIENTO ---
  const [archivosReqLista, setArchivosReqLista] = useState([]);
  const [historiaUsuario, setHistoriaUsuario] = useState('');
  const [nombreProyectoDetectado, setNombreProyectoDetectado] = useState('');
  const [notasReq, setNotasReq] = useState('');
  const [requerimientoAnalizado, setRequerimientoAnalizado] = useState(false);

  // Obtener iniciales o Nombre del Proyecto (Fallback a SPEI / Transferencia si está vacío)
  const obtenerNombreProyecto = () => {
    if (nombreProyectoDetectado.trim()) {
      return nombreProyectoDetectado.trim();
    }
    if (historiaUsuario.trim()) {
      // Extrae las primeras palabras o usa la historia como base para el nombre
      return historiaUsuario.trim().substring(0, 15).toUpperCase();
    }
    if (archivosReqLista.length > 0) {
      return archivosReqLista[0].replace(/\.[^/.]+$/, "").toUpperCase();
    }
    return "SPEI_TRANSFERENCIAS"; // Fallback por defecto exigido
  };

  const nombreProjFinal = obtenerNombreProyecto();
  const inicialesID = nombreProjFinal.substring(0, 4).toUpperCase();

  const columnasArray = columnasManuales ? columnasManuales.split(',').map(c => c.trim()).filter(Boolean) : ['ID', 'Proceso', 'Subproceso', 'Descripción', 'Tipo'];

  // Manejador Formato (Módulo 1)
  const manejarSubidaEstructura = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoEstructura(file);
      const nombre = file.name.toLowerCase();
      if (nombre.includes('taggeo') || nombre.includes('app') || nombre.includes('fincomun')) {
        setColumnasManuales('ID Funcional, ID, Proceso de prueba, Sub-Proceso de prueba, Descripción de prueba, Tipo de prueba');
      }
      setFormatoValidado(true);
    }
  };

  // Manejador Requerimientos (Módulo 2)
  const manejarSubidaRequerimiento = (e) => {
    const files = Array.from(e.target.files).map(f => f.name);
    setArchivosReqLista(files);
  };

  const ejecutarAnalisisRequerimiento = () => {
    setRequerimientoAnalizado(true);
  };

  const reiniciarTodo = () => {
    setArchivoEstructura(null);
    setColumnasManuales('ID Funcional, ID, Proceso de prueba, Sub-Proceso de prueba, Descripción de prueba, Tipo de prueba');
    setFormatoValidado(false);
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
            📋 Generador de MP (Modular)
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
            
            {/* Cabecera y Navegación de Módulos */}
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-4 gap-4">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Arquitectura Modular en Progreso</span>
                <h3 className="text-xl font-extrabold text-white">Construcción de Módulos Independientes</h3>
              </div>
              <button onClick={reiniciarTodo} className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                🗑️ Reiniciar Todo
              </button>
            </div>

            {/* Pestañas de Navegación por Pasos/Módulos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setPasoActual(1)} 
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoActual === 1 ? 'bg-cyan-950 border-cyan-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}
              >
                <span className="text-[10px] text-cyan-400 font-bold uppercase">Módulo 1</span>
                <p className="text-sm font-bold text-white mt-1">Formato de la Matriz & Columnas</p>
              </button>
              <button 
                onClick={() => setPasoActual(2)} 
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoActual === 2 ? 'bg-emerald-950 border-emerald-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}
              >
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Módulo 2</span>
                <p className="text-sm font-bold text-white mt-1">Análisis de Requerimiento & Versiones</p>
              </button>
            </div>

            {/* MÓDULO 1: FORMATO DE LA MATRIZ */}
            {pasoActual === 1 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-5 text-xs animate-fadeIn">
                <h4 className="font-bold text-cyan-400 uppercase text-sm">Módulo 1: Análisis del Formato</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📁 Subir Archivo, Excel o Imagen de Estructura</label>
                    <input 
                      type="file" 
                      key={archivoEstructura ? archivoEstructura.name : 'reset-fmt'}
                      onChange={manejarSubidaEstructura} 
                      className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-300 cursor-pointer" 
                    />
                    {archivoEstructura && <p className="text-cyan-300 font-mono text-[11px]">Estructura cargada: {archivoEstructura.name}</p>}
                  </div>

                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📊 Columnas Esenciales Extraídas (Atómicas)</label>
                    <textarea 
                      value={columnasManuales} 
                      onChange={(e) => setColumnasManuales(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-cyan-300 font-mono text-xs focus:border-cyan-500 outline-none" 
                      rows="3"
                    />
                    <button 
                      onClick={() => setFormatoValidado(true)}
                      className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl transition cursor-pointer shadow-md"
                    >
                      ✅ Validar y Guardar Formato
                    </button>
                  </div>
                </div>

                {formatoValidado && (
                  <div className="mt-4 p-4 bg-slate-900 border border-cyan-500/40 rounded-xl space-y-2">
                    <p className="font-bold text-emerald-400 text-xs">✔ Formato validado con éxito. Columnas activas: {columnasArray.join(', ')}</p>
                    <div className="flex justify-end">
                      <button 
                        onClick={() => setPasoActual(2)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-lg transition cursor-pointer"
                      >
                        Siguiente: Módulo 2 (Requerimiento) ➡️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MÓDULO 2: ANÁLISIS DE REQUERIMIENTO */}
            {pasoActual === 2 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-5 text-xs animate-fadeIn">
                <h4 className="font-bold text-emerald-400 uppercase text-sm">Módulo 2: Análisis de Requerimiento y Versiones</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📁 Subir Versiones del Requerimiento (Múltiples archivos)</label>
                    <input 
                      type="file" 
                      multiple 
                      onChange={manejarSubidaRequerimiento} 
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
                    <label className="block font-bold text-slate-200">🏷️ Nombre del Proyecto (Opcional, se extrae del requerimiento)</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Taggeo App Fincomun (Vacío = SPEI / Transferencia por defecto)"
                      value={nombreProyectoDetectado} 
                      onChange={(e) => setNombreProyectoDetectado(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs outline-none focus:border-emerald-500" 
                    />

                    <label className="block font-bold text-slate-200 pt-1">📌 Notas / Observaciones</label>
                    <textarea 
                      placeholder="Agrega notas especiales..." 
                      value={notasReq} 
                      onChange={(e) => setNotasReq(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs outline-none focus:border-emerald-500" 
                      rows="2" 
                    />

                    <button 
                      onClick={ejecutarAnalisisRequerimiento}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition cursor-pointer shadow-md"
                    >
                      🔍 Analizar Requerimiento & Generar ID/Prefijo
                    </button>
                  </div>
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
                        <span className="text-[10px] text-slate-400 uppercase block">Tipo de ID Generado</span>
                        <strong className="text-cyan-400 text-xs">TC-{inicialesID}-01</strong>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase block">Versiones / Archivos</span>
                        <strong className="text-emerald-400 text-xs">{archivosReqLista.length > 0 ? `${archivosReqLista.length} Versión(es)` : 'Modo Demo SPEI por Defecto'}</strong>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button onClick={() => setPasoActual(1)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-lg text-xs">
                        ⬅️ Volver a Módulo 1
                      </button>
                      <span className="text-xs text-emerald-400 font-bold">✨ ¡Requerimiento analizado con éxito! Listo para el Módulo 3 (Generación de MP).</span>
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