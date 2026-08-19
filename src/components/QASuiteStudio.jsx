import { useState } from 'react';
import N8NOrchestrator from './N8NOrchestrator';

export default function QASuiteStudio({ onOpenContact }) {
  const [pestanaActiva, setPestanaActiva] = useState('matriz'); // 'matriz' | 'n8n'

  const [pasoMP, setPasoMP] = useState(1);
  const [nivel, setNivel] = useState('MED'); // JR, MED, SR
  const [archivoReqNombre, setArchivoReqNombre] = useState(null);

  const [requerimiento, setRequerimiento] = useState({
    idHU: 'HU-SPEI-104',
    prefijoID: 'SPEI',
    descripcionManual: '',
    notas: ''
  });

  const totalCasos = nivel === 'JR' ? 50 : nivel === 'MED' ? 100 : 150;
  const costoEstimado = (totalCasos * 250).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

  const generarCasosMock = () => {
    let suite = [];
    const tipos = ['Happy Path', 'Test to Fail', 'Smoke Test', 'Concurrencia', 'Seguridad'];
    for (let i = 1; i <= totalCasos; i++) {
      const tipoActual = tipos[(i - 1) % tipos.length];
      suite.push({
        id: `TC-SPEI-${String(i).padStart(3, '0')}`,
        modulo: 'Core SPEI / Transferencias',
        hu: requerimiento.idHU || 'HU-SPEI-GENERAL',
        descripcion: `Validación de flujo ${tipoActual} #${i} [Notas: ${requerimiento.notas || 'Ninguna'}]`,
        tipo: tipoActual,
        severidad: i <= 5 ? 'Crítica' : 'Alta',
        estado: 'Listo'
      });
    }
    return suite;
  };

  const listaCasos = generarCasosMock();

  const resetearProyecto = () => {
    setRequerimiento({ idHU: '', prefijoID: '', descripcionManual: '', notas: '' });
    setArchivoReqNombre(null);
  };

  return (
    <section id="automatizaciones" className="max-w-6xl mx-auto px-4 py-16 w-full scroll-mt-24">
      {/* SELECTOR DE PESTAÑAS PRINCIPALES */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 rounded-2xl shadow-xl">
          <button
            onClick={() => setPestanaActiva('matriz')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              pestanaActiva === 'matriz'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📋</span>
            <span>1. Generador de MP ({totalCasos} Casos)</span>
          </button>

          <button
            onClick={() => setPestanaActiva('n8n')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              pestanaActiva === 'n8n'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⚙️</span>
            <span>2. Orquestador n8n & Webhooks</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        {pestanaActiva === 'matriz' ? (
          <div className="space-y-6 text-slate-100">
            
            {/* Cabecera y Pasos */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Generador de Matriz de Pruebas (MP)</span>
                <h3 className="text-xl font-extrabold text-white">Configuración del Requerimiento & Niveles</h3>
              </div>
              <button 
                onClick={resetearProyecto} 
                className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition"
              >
                🗑️ Limpiar / Nuevo Proyecto
              </button>
            </div>

            {/* Formulario de Entrada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                <label className="block font-bold text-slate-200">📁 Requerimiento / Archivo</label>
                <input 
                  type="file" 
                  onChange={(e) => setArchivoReqNombre(e.target.files[0]?.name)} 
                  className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-300 hover:file:bg-slate-700 cursor-pointer"
                />
                {archivoReqNombre && <p className="text-emerald-400 font-mono text-[11px]">Cargado: {archivoReqNombre}</p>}

                <label className="block font-bold text-slate-200 pt-2">✍️ Redacción Manual (Opcional)</label>
                <textarea
                  value={requerimiento.descripcionManual}
                  onChange={(e) => setRequerimiento({ ...requerimiento, descripcionManual: e.target.value })}
                  placeholder="Si no subes archivo, escribe tu historia de usuario aquí..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  rows="2"
                />
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                <label className="block font-bold text-slate-200">📌 Notas u Observaciones</label>
                <textarea
                  value={requerimiento.notas}
                  onChange={(e) => setRequerimiento({ ...requerimiento, notas: e.target.value })}
                  placeholder="Puntos a tomar en cuenta, restricciones, validaciones especiales..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  rows="3"
                />

                <label className="block font-bold text-slate-200 pt-1">📊 Seleccionar Nivel Técnico</label>
                <div className="flex gap-2">
                  <button onClick={() => setNivel('JR')} className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer ${nivel === 'JR' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>JR (50)</button>
                  <button onClick={() => setNivel('MED')} className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer ${nivel === 'MED' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>MED (100)</button>
                  <button onClick={() => setNivel('SR')} className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer ${nivel === 'SR' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>SR (150)</button>
                </div>
              </div>
            </div>

            {/* TABLA DE VISUALIZACIÓN DE CASOS */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Visualización de Casos Generados ({totalCasos} Totales)</h4>
                <span className="text-[11px] text-slate-400 font-mono">Mostrando vista previa completa</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-900 text-emerald-400 uppercase font-mono sticky top-0">
                      <tr>
                        <th className="px-4 py-2.5">ID Caso</th>
                        <th className="px-4 py-2.5">Módulo</th>
                        <th className="px-4 py-2.5">Tipo</th>
                        <th className="px-4 py-2.5">Descripción & Notas</th>
                        <th className="px-4 py-2.5">Severidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-sans">
                      {listaCasos.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-900/60 transition">
                          <td className="px-4 py-2 font-mono text-cyan-300 font-bold">{c.id}</td>
                          <td className="px-4 py-2 text-slate-300">{c.modulo}</td>
                          <td className="px-4 py-2 text-emerald-300">{c.tipo}</td>
                          <td className="px-4 py-2 text-slate-300">{c.descripcion}</td>
                          <td className="px-4 py-2">
                            <span className="bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                              {c.severidad}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* MÓDULO DE COTIZACIÓN AUTOMÁTICA */}
            <div className="bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block">Cotización Estándar QA Automática</span>
                <h4 className="text-white font-black text-2xl mt-0.5">{costoEstimado} <span className="text-xs font-normal text-slate-300">({totalCasos} Casos de Prueba)</span></h4>
              </div>
              <button 
                onClick={() => onOpenContact(`Hola Martin, quiero solicitar la MP completa con los ${totalCasos} casos generados para mi proyecto. El costo estimado es de ${costoEstimado}. ¿Podemos coordinar la entrega y respaldo en Drive?`)}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition cursor-pointer"
              >
                💬 Solicitar MP Completa & Cotización
              </button>
            </div>

          </div>
        ) : (
          <N8NOrchestrator />
        )}
      </div>
    </section>
  );
}