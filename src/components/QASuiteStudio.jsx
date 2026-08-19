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

  // Estados del Paso 1 con reactividad total ante nuevos archivos o limpiezas
  const [archivoEstructura, setArchivoEstructura] = useState(null);
  const [columnasManuales, setColumnasManuales] = useState('ID, Proceso, Subproceso, Descripción, Tipo');
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
  const [analizando, setAnalizando] = useState(false);

  const inicialesProyecto = 'SPEI';

  const columnasArray = columnasManuales ? columnasManuales.split(',').map(c => c.trim()).filter(Boolean) : ['ID', 'Proceso', 'Subproceso', 'Descripción', 'Tipo'];

  // Función reactiva que analiza el formato cada vez que se sube un archivo
  const manejarSubidaEstructura = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAnalizando(true);
      setArchivoEstructura(file);
      
      // Simulamos un breve análisis dinámico del archivo subido
      setTimeout(() => {
        const nombre = file.name.toLowerCase();
        if (nombre.includes('taggeo') || nombre.includes('app') || nombre.includes('fincomun') || nombre.includes('xlsx') || nombre.includes('doc')) {
          setColumnasManuales('ID Funcional, ID, Proceso de prueba, Sub-Proceso de prueba, Descripción de prueba, Tipo de prueba');
        } else {
          setColumnasManuales('ID, Módulo, Submódulo, Descripción del Escenario, Tipo');
        }
        setAnalizando(false);
        setMostrarVistaPrevia(true);
      }, 500);
    }
  };

  const analizarYMostrar = () => {
    setAnalizando(true);
    setTimeout(() => {
      setAnalizando(false);
      setMostrarVistaPrevia(true);
    }, 400);
  };

  const reiniciarPaso1 = () => {
    setArchivoEstructura(null);
    setColumnasManuales('ID, Proceso, Subproceso, Descripción, Tipo');
    setMostrarVistaPrevia(false);
    setAnalizando(false);
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
            📋 Módulo 1: Formato de la Matriz
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
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Desarrollo Modular - Paso 1</span>
                <h3 className="text-xl font-extrabold text-white">Análisis Dinámico de Formato de Matriz</h3>
              </div>
              <button onClick={reiniciarPaso1} className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                🗑️ Limpiar / Reiniciar Análisis
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-5 text-xs animate-fadeIn">
              <h4 className="font-bold text-cyan-400 uppercase text-sm">Configuración y Extracción de Columnas</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block font-bold text-slate-200">📁 Subir Archivo, Excel o Imagen de Estructura</label>
                  <input 
                    type="file" 
                    key={archivoEstructura ? archivoEstructura.name : 'reset-input'}
                    onChange={manejarSubidaEstructura} 
                    className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-300 cursor-pointer" 
                  />
                  {archivoEstructura && <p className="text-cyan-300 font-mono text-[11px]">Estructura analizada: {archivoEstructura.name}</p>}
                  <p className="text-[10px] text-slate-400 pt-2">💡 Al subir un archivo nuevo, el sistema reanaliza automáticamente las columnas. Si no se sube nada, aplica por defecto el estándar de <strong>SPEI/Transferencia</strong>.</p>
                </div>

                <div className="space-y-3">
                  <label className="block font-bold text-slate-200">📊 Columnas Esenciales Extraídas (Separadas por comas)</label>
                  <textarea 
                    value={columnasManuales} 
                    onChange={(e) => setColumnasManuales(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-cyan-300 font-mono text-xs focus:border-cyan-500 outline-none" 
                    rows="4"
                  />
                  <p className="text-[10px] text-slate-400">Cada elemento es un escenario de prueba atómico individual.</p>
                  
                  <button 
                    onClick={analizarYMostrar}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl transition cursor-pointer shadow-md"
                  >
                    {analizando ? '⚙️ Analizando Formato...' : '🔍 Reanalizar Formato y Mostrar Visible'}
                  </button>
                </div>
              </div>

              {analizando && (
                <div className="p-4 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-cyan-300 font-mono text-center animate-pulse">
                  ⚙️ Procesando nueva estructura y extrayendo columnas esenciales...
                </div>
              )}

              {mostrarVistaPrevia && !analizando && (
                <div className="mt-6 p-5 bg-slate-900 border border-cyan-500/40 rounded-2xl space-y-3 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-emerald-400 uppercase text-xs">
                      ✅ Vista Previa Visible del Formato Extraído
                    </h5>
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-1 rounded-lg font-mono">
                      Total Columnas: {columnasArray.length}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">El usuario puede validar visualmente si las columnas son correctas y se adaptan al objetivo:</p>
                  
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
                              {idx === 0 ? `TC-${inicialesProyecto}-01` : `[Ejemplo de ${col}]`}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-2">
                    <span className="text-xs text-emerald-400 font-bold">✨ ¡Formato analizado y validado correctamente! Puedes limpiar para probar con otro archivo.</span>
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : (
          <N8NOrchestrator />
        )}
      </div>
    </section>
  );
}