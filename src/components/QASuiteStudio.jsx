import { useState, useEffect } from 'react';
import N8NOrchestrator from './N8NOrchestrator';

export default function QASuiteStudio({ onOpenContact }) {
  // Detector invisible de DevTools
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
  const [requerimiento, setRequerimiento] = useState({ notas: '' });

  const totalCasos = nivel === 'JR' ? 50 : nivel === 'MED' ? 100 : 150;
  const costoEstimado = (totalCasos * 250).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

  const listaCasos = Array.from({ length: totalCasos }, (_, i) => ({
    id: `TC-SPEI-${String(i + 1).padStart(3, '0')}`,
    modulo: 'Core SPEI',
    tipo: i % 5 === 0 ? 'Happy Path' : 'Test to Fail',
    severidad: i <= 10 ? 'Crítica' : 'Alta'
  }));

  return (
    <section 
      id="automatizaciones" 
      className="max-w-6xl mx-auto px-4 py-16 w-full"
      onContextMenu={(e) => e.preventDefault()}
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      {/* Tu estructura de pestañas y pasos se mantiene igual, pero ahora protegida */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 rounded-2xl shadow-xl">
          <button onClick={() => setPestanaActiva('matriz')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${pestanaActiva === 'matriz' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>1. Generador de MP</button>
          <button onClick={() => setPestanaActiva('n8n')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${pestanaActiva === 'n8n' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}>2. Orquestador</button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        {pestanaActiva === 'matriz' ? (
          <div className="animate-fadeIn">
            {/* ... Resto de tu lógica de pasos y tabla ... */}
            <div className="max-h-60 overflow-y-auto border border-slate-800 rounded-xl">
               <table className="w-full text-[10px] text-slate-300">
                  <thead className="bg-slate-950 text-emerald-400">
                    <tr><th className="p-2">ID</th><th className="p-2">Tipo</th><th className="p-2">Severidad</th></tr>
                  </thead>
                  <tbody>
                    {listaCasos.map((c, i) => (
                      <tr key={i} className="border-t border-slate-800">
                        <td className="p-2">{c.id}</td>
                        <td className="p-2">{c.tipo}</td>
                        <td className="p-2">{c.severidad}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
            {/* Cotización */}
            <div className="bg-emerald-950 p-4 mt-4 rounded-xl flex justify-between items-center">
              <span className="text-xl font-black text-white">{costoEstimado}</span>
              <button 
                onClick={() => onOpenContact(`Solicito MP completa de ${totalCasos} casos. Costo: ${costoEstimado}`)}
                className="bg-white text-emerald-900 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Solicitar MP Completa
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