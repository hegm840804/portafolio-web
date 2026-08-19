import { useState } from 'react';

export default function QASuiteStudio({ onOpenContact }) {
  const [pasoActual, setPasoActual] = useState(1);
  const [nivel, setNivel] = useState('MED');
  const [suite, setSuite] = useState([]);
  
  const calcularCosto = (totalCasos) => (totalCasos * 250).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  const totalCasos = nivel === 'JR' ? 50 : nivel === 'MED' ? 100 : 150;

  const generarSuite = () => {
    let nuevaSuite = [];
    for(let i=1; i<=totalCasos; i++) {
      nuevaSuite.push({ id: `TC-${i}`, modulo: 'SPEI', tipo: 'Happy Path', severidad: 'Alta', estado: 'Pendiente' });
    }
    setSuite(nuevaSuite);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-white mb-8">Generador de Matriz (MP)</h2>
      
      {/* Visualización de Tabla */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden mb-8">
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-950 text-emerald-400 uppercase">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Módulo</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Severidad</th>
            </tr>
          </thead>
          <tbody>
            {suite.slice(0, 10).map((c, i) => (
              <tr key={i} className="border-t border-slate-800 hover:bg-slate-800">
                <td className="px-4 py-3 font-mono">{c.id}</td>
                <td className="px-4 py-3">{c.modulo}</td>
                <td className="px-4 py-3">{c.tipo}</td>
                <td className="px-4 py-3">{c.severidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-slate-950 text-center text-xs text-slate-500">
          Mostrando 10 de {totalCasos} casos generados...
        </div>
      </div>

      {/* Cotización Automática */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-6 rounded-2xl flex justify-between items-center">
        <div>
          <h4 className="text-white font-bold">Costo Estimado de Matriz</h4>
          <p className="text-emerald-300 text-2xl font-black">{calcularCosto(totalCasos)}</p>
        </div>
        <button 
          onClick={() => onOpenContact(`Hola, quiero solicitar la MP completa de ${totalCasos} casos que generé en tu portafolio. El costo estimado es de ${calcularCosto(totalCasos)}. ¿Podemos agendar?`)}
          className="bg-white text-emerald-900 font-bold px-6 py-3 rounded-xl hover:scale-105 transition"
        >
          Solicitar MP Completa
        </button>
      </div>
    </section>
  );
}