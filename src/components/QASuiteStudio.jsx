import { useState } from 'react';

export default function QASuiteStudio({ onOpenContact }) {
  // Generador de suite masiva (mínimo 50 casos)
  const generarSuiteMasiva = (cantidad) => {
    const areas = ['HP', 'TTF', 'Smoke', 'Concurrencia', 'Seguridad', 'Resiliencia', 'Auditoria'];
    return Array.from({ length: Math.max(50, cantidad) }, (_, i) => {
      const area = areas[i % areas.length];
      return {
        id: `TC-${area.toUpperCase()}-${i + 1}`,
        modulo: 'CORE_SPEI_V2',
        area: area,
        titulo: `Caso Senior ${i + 1}: Validación profunda de ${area}`,
        severidad: i < 10 ? 'Crítica' : 'Alta',
        descripcion: `Análisis detallado del caso ${i + 1} enfocado en ${area} para el requerimiento bancario activo.`,
        pasos: '1. Preparar ambiente.\n2. Ejecutar payload de prueba.\n3. Validar integridad BD.',
        resultado: 'Sistema responde bajo los criterios de aceptación definidos.'
      };
    });
  };

  const [suite] = useState(generarSuiteMasiva(50));
  const [pagina, setPagina] = useState(1);
  const casosPorPagina = 10;
  
  const inicio = (pagina - 1) * casosPorPagina;
  const casosVisibles = suite.slice(inicio, inicio + casosPorPagina);

  return (
    <section id="automatizaciones" className="max-w-6xl mx-auto px-4 py-16 w-full">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Suite QA Senior: {suite.length} Casos</h2>
            <p className="text-slate-400 text-sm">Validación exhaustiva de requerimientos (Mínimo 50 casos).</p>
          </div>
          <button 
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition"
            onClick={() => {
              const csvContent = "\uFEFF" + "ID,Area,Titulo,Severidad\n" + suite.map(c => `${c.id},${c.area},"${c.titulo}",${c.severidad}`).join("\n");
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = "Suite_QA_Completa.csv";
              link.click();
            }}
          >
            📥 Exportar Suite Completa (CSV)
          </button>
        </div>

        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Escenario Técnico</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Severidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {casosVisibles.map(c => (
                <tr key={c.id} className="hover:bg-slate-800/50">
                  <td className="p-4 font-mono text-cyan-400">{c.id}</td>
                  <td className="p-4 text-white">{c.titulo}</td>
                  <td className="p-4"><span className="bg-slate-800 px-2 py-1 rounded">{c.area}</span></td>
                  <td className="p-4 text-rose-400 font-bold">{c.severidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: Math.ceil(suite.length / casosPorPagina) }).map((_, i) => (
            <button 
              key={i}
              onClick={() => setPagina(i + 1)}
              className={'px-4 py-2 rounded-lg text-xs font-bold ' + (pagina === i + 1 ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400')}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}