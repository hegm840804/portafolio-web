import { useState, useEffect } from 'react';
import N8NOrchestrator from './N8NOrchestrator';

export default function QASuiteStudio({ onOpenContact }) {
  // SEGURIDAD INVISIBLE: Bloquea herramientas de desarrollador y menú contextual sin avisos
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
  const [nivel, setNivel] = useState('MED');
  const [archivoReqNombre, setArchivoReqNombre] = useState(null);
  const [requerimiento, setRequerimiento] = useState({ descripcionManual: '', notas: '' });
  const [columnasPersonalizadas, setColumnasPersonalizadas] = useState('ID_Caso, Módulo, Tipo_Prueba, Descripción, Severidad');

  const totalCasos = nivel === 'JR' ? 50 : nivel === 'MED' ? 100 : 150;
  const costoEstimado = (totalCasos * 250).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

  const listaCasos = Array.from({ length: totalCasos }, (_, i) => ({
    id: `TC-SPEI-${String(i + 1).padStart(3, '0')}`,
    modulo: 'Core SPEI / Transferencias',
    tipo: i % 5 === 0 ? 'Happy Path' : i % 3 === 0 ? 'Smoke Test' : 'Test to Fail',
    descripcion: `Validación de flujo #${i + 1} [Notas: ${requerimiento.notas || 'Ninguna'}]`,
    severidad: i <= 5 ? 'Crítica' : 'Alta'
  }));

  const resetearProyecto = () => {
    setRequerimiento({ descripcionManual: '', notas: '' });
    setArchivoReqNombre(null);
    setPasoMP(1);
  };

  return (
    <section 
      id="automatizaciones" 
      className="max-w-6xl mx-auto px-4 py-16 w-full scroll-mt-24"
      onContextMenu={(e) => e.preventDefault()} 
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      {/* Selector de Pestañas */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex gap-2 bg-slate-950 p-1.5 rounded-2xl shadow-xl border border-slate-800">
          <button onClick={() => setPestanaActiva('matriz')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${pestanaActiva === 'matriz' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>1. Generador de MP</button>
          <button onClick={() => setPestanaActiva('n8n')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${pestanaActiva === 'n8n' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>2. Orquestador</button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {pestanaActiva === 'matriz' ? (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-4 gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Generador Profesional de MP</span>
                <h3 className="text-xl font-extrabold text-white">Flujo Guiado por Pasos</h3>
              </div>
              <button onClick={resetearProyecto} className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                🗑️ Limpiar / Nuevo Proyecto
              </button>
            </div>

            {/* Navegación de Pasos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button onClick={() => setPasoMP(1)} className={`p-3 rounded-xl border text-left transition ${pasoMP === 1 ? 'bg-emerald-950 border-emerald-500' : 'bg-slate-950 border-slate-800'}`}>
                <span className="font-mono text-xs font-bold text-emerald-400">Paso 1</span>
                <p className="text-xs font-bold text-white">Requerimiento & Notas</p>
              </button>
              <button onClick={() => setPasoMP(2)} className={`p-3 rounded-xl border text-left transition ${pasoMP === 2 ? 'bg-cyan-950 border-cyan-500' : 'bg-slate-950 border-slate-800'}`}>
                <span className="font-mono text-xs font-bold text-cyan-400">Paso 2</span>
                <p className="text-xs font-bold text-white">Formato & Estructura</p>
              </button>
              <button onClick={() => setPasoMP(3)} className={`p-3 rounded-xl border text-left transition ${pasoMP === 3 ? 'bg-purple-950 border-purple-500' : 'bg-slate-950 border-slate-800'}`}>
                <span className="font-mono text-xs font-bold text-purple-400">Paso 3</span>
                <p className="text-xs font-bold text-white">Generación & Cotización</p>
              </button>
            </div>

            {/* PASO 1 */}
            {pasoMP === 1 && (
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 text-xs">
                <h4 className="font-bold text-emerald-400 uppercase tracking-wider">1. Ingreso de Requerimiento</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📁 Subir Archivo</label>
                    <input type="file" onChange={(e) => setArchivoReqNombre(e.target.files[0]?.name)} className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-300 hover:file:bg-slate-700 cursor-pointer" />
                    {archivoReqNombre && <p className="text-emerald-400 font-mono text-[11px]">Cargado: {archivoReqNombre}</p>}
                    
                    <label className="block font-bold text-slate-200 pt-2">✍️ Redacción Manual</label>
                    <textarea placeholder="Describe la historia de usuario..." value={requerimiento.descripcionManual} onChange={(e) => setRequerimiento({...requerimiento, descripcionManual: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs focus:border-emerald-500 outline-none" rows="3" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-200 mb-1">📌 Notas u Observaciones</label>
                    <textarea placeholder="Puntos a considerar, validaciones especiales..." value={requerimiento.notas} onChange={(e) => setRequerimiento({...requerimiento, notas: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs focus:border-emerald-500 outline-none" rows="6" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => setPasoMP(2)} className="bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl cursor-pointer">Siguiente: Estructura ➡️</button>
                </div>
              </div>
            )}

            {/* PASO 2 */}
            {pasoMP === 2 && (
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 text-xs">
                <h4 className="font-bold text-cyan-400 uppercase tracking-wider">2. Estructura y Columnas</h4>
                <div className="space-y-3">
                  <label className="block font-bold text-slate-200">📊 Columnas (Separadas por comas)</label>
                  <input type="text" value={columnasPersonalizadas} onChange={(e) => setColumnasPersonalizadas(e.target.value)} placeholder="Ej: ID, Módulo, Tipo, Descripción, Severidad..." className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-cyan-300 font-mono focus:border-cyan-500 outline-none" />
                </div>
                <div className="flex justify-between pt-2">
                  <button onClick={() => setPasoMP(1)} className="bg-slate-800 text-slate-300 font-bold px-5 py-2.5 rounded-xl cursor-pointer">⬅️ Anterior</button>
                  <button onClick={() => setPasoMP(3)} className="bg-cyan-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl cursor-pointer">Siguiente: Generación ➡️</button>
                </div>
              </div>
            )}

            {/* PASO 3 */}
            {pasoMP === 3 && (
              <div className="space-y-6">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">3. Selección de Nivel</h4>
                    <p className="text-[11px] text-slate-400">Total: {totalCasos} Casos generados</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {['JR', 'MED', 'SR'].map(n => (
                      <button key={n} onClick={() => setNivel(n)} className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${nivel === n ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}>
                        {n} ({n === 'JR' ? '50' : n === 'MED' ? '100' : '150+'})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="max-h-72 overflow-y-auto">
                    <table className="w-full text-[11px] text-left text-slate-300">
                      <thead className="bg-slate-900 text-emerald-400 uppercase font-mono sticky top-0 shadow-sm">
                        <tr>
                          <th className="px-4 py-3">ID Caso</th>
                          <th className="px-4 py-3">Módulo</th>
                          <th className="px-4 py-3">Tipo</th>
                          <th className="px-4 py-3">Descripción & Notas</th>
                          <th className="px-4 py-3">Severidad</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {listaCasos.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-900/60">
                            <td className="px-4 py-2 font-mono text-cyan-300 font-bold">{c.id}</td>
                            <td className="px-4 py-2">{c.modulo}</td>
                            <td className="px-4 py-2 text-emerald-300">{c.tipo}</td>
                            <td className="px-4 py-2">{c.descripcion}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${c.severidad === 'Crítica' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                                {c.severidad}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border border-emerald-500/40 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block">Cotización Automática</span>
                    <h4 className="text-white font-black text-2xl mt-0.5">{costoEstimado} <span className="text-xs font-normal text-slate-300">({totalCasos} Casos)</span></h4>
                  </div>
                  <button 
                    onClick={() => onOpenContact(`Hola Martin, solicito la MP completa de ${totalCasos} casos. El costo estimado es de ${costoEstimado}. ¿Podemos coordinar?`)}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition cursor-pointer"
                  >
                    💬 Solicitar MP Completa
                  </button>
                </div>
                
                <div className="flex justify-start pt-2">
                  <button onClick={() => setPasoMP(2)} className="bg-slate-800 text-slate-300 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer">⬅️ Volver</button>
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