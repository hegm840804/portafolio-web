import { useState, useEffect } from 'react';
import N8NOrchestrator from './N8NOrchestrator';

export default function QASuiteStudio({ onOpenContact }) {
  useEffect(() => {
    const handler = (e) => { if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67))) e.preventDefault(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const [pestanaActiva, setPestanaActiva] = useState('matriz');
  const [pasoMP, setPasoMP] = useState(1);
  const [nivel, setNivel] = useState('MED');
  const [archivoReqNombre, setArchivoReqNombre] = useState(null);
  const [archivoEstructura, setArchivoEstructura] = useState(null);
  const [requerimiento, setRequerimiento] = useState({ descripcionManual: '', notas: '' });
  const [columnasPersonalizadas, setColumnasPersonalizadas] = useState('ID_Caso, Módulo, Tipo_Prueba, Descripción, Severidad');

  const totalCasos = nivel === 'JR' ? 50 : nivel === 'MED' ? 100 : 150;
  const costoEstimado = (totalCasos * 250).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

  const listaCasos = Array.from({ length: totalCasos }, (_, i) => ({
    id: `TC-SPEI-${String(i + 1).padStart(3, '0')}`,
    modulo: 'Core SPEI',
    tipo: i % 5 === 0 ? 'Happy Path' : 'Test to Fail',
    descripcion: `Validación de flujo #${i + 1}`,
    severidad: i <= 10 ? 'Crítica' : 'Alta'
  }));

  return (
    <section id="automatizaciones" className="max-w-6xl mx-auto px-4 py-16 w-full scroll-mt-24" onContextMenu={(e) => e.preventDefault()} style={{ WebkitUserSelect: 'none', userSelect: 'none' }}>
      <div className="text-center mb-8">
        <div className="inline-flex gap-2 bg-slate-950 p-1.5 rounded-2xl shadow-xl border border-slate-800">
          <button onClick={() => setPestanaActiva('matriz')} className={`px-5 py-2 rounded-xl text-xs font-bold ${pestanaActiva === 'matriz' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>1. Generador de MP</button>
          <button onClick={() => setPestanaActiva('n8n')} className={`px-5 py-2 rounded-xl text-xs font-bold ${pestanaActiva === 'n8n' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}>2. Orquestador</button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {pestanaActiva === 'matriz' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map(p => (
                <button key={p} onClick={() => setPasoMP(p)} className={`p-3 rounded-xl border ${pasoMP === p ? 'bg-slate-800 border-emerald-500' : 'bg-slate-950 border-slate-800'}`}>
                  <p className="text-[10px] text-slate-400 font-bold">PASO {p}</p>
                </button>
              ))}
            </div>

            {pasoMP === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <input type="text" value={columnasPersonalizadas} onChange={(e) => setColumnasPersonalizadas(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white text-xs" />
                
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <label className="block text-slate-400 font-bold text-xs mb-2">📁 Subir Formato / Estructura (Excel, Imagen, PDF)</label>
                  <input type="file" onChange={(e) => setArchivoEstructura(e.target.files[0]?.name)} className="w-full text-slate-400 text-xs file:bg-slate-800 file:border-0 file:px-4 file:py-2 file:rounded-lg file:text-emerald-300" />
                  {archivoEstructura && <p className="text-emerald-400 text-[10px] mt-2">Cargado: {archivoEstructura}</p>}
                </div>
              </div>
            )}
            {/* ... Resto del código se mantiene igual ... */}
            {pasoMP === 1 && (
              <div className="space-y-3">
                <input type="file" onChange={(e) => setArchivoReqNombre(e.target.files[0]?.name)} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-xs text-slate-400" />
                <textarea placeholder="Notas u observaciones..." value={requerimiento.notas} onChange={(e) => setRequerimiento({...requerimiento, notas: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white text-xs" rows="3" />
                <button onClick={() => setPasoMP(2)} className="bg-emerald-600 w-full py-2 rounded-xl text-xs font-bold">Siguiente</button>
              </div>
            )}
            {pasoMP === 3 && (
              <div className="space-y-4">
                <table className="w-full text-[10px] text-slate-300 border border-slate-800">
                  <thead className="bg-slate-950 text-emerald-400"><tr><th className="p-2">ID</th><th className="p-2">Tipo</th><th className="p-2">Severidad</th></tr></thead>
                  <tbody>{listaCasos.map((c, i) => <tr key={i} className="border-t border-slate-800"><td className="p-2">{c.id}</td><td className="p-2">{c.tipo}</td><td className="p-2">{c.severidad}</td></tr>)}</tbody>
                </table>
                <div className="bg-emerald-950 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-xl font-black text-white">{costoEstimado}</span>
                  <button onClick={() => onOpenContact(`Solicito MP completa de ${totalCasos} casos. Costo: ${costoEstimado}`)} className="bg-white text-emerald-900 font-bold px-4 py-2 rounded-xl text-xs">Solicitar MP</button>
                </div>
              </div>
            )}
          </div>
        ) : <N8NOrchestrator />}
      </div>
    </section>
  );
}