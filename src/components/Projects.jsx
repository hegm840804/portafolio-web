export default function Projects() {
  const proyectos = [
    {
      titulo: 'E2E Testing & Test Automation Suite',
      categoria: 'QA Automation',
      descripcion: 'Framework de pruebas automatizadas multidispositivo (Desktop, Mobile Safari, Tablet) con Playwright, aserciones dinámicas y generación de reportes con capturas de pantalla y trazas.',
      tags: ['Playwright', 'JavaScript', 'E2E Testing', 'Multi-device'],
      icono: '🧪',
      color: 'from-emerald-500 to-teal-600',
      borde: 'hover:border-emerald-500/50',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800'
    },
    {
      titulo: 'Orquestación de Flujos & Webhooks',
      categoria: 'APIs & Integration',
      descripcion: 'Automatización de flujos de trabajo con n8n, consumo de servicios REST, validación de payloads JSON y despacho de notificaciones automáticas ante eventos de integración.',
      tags: ['n8n', 'REST APIs', 'Webhooks', 'Automation'],
      icono: '⚙️',
      color: 'from-purple-500 to-pink-600',
      borde: 'hover:border-purple-500/50',
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-800'
    },
    {
      titulo: 'Arquitectura Frontend Full Responsive',
      categoria: 'Frontend Development',
      descripcion: 'Plataforma web moderna basada en componentes modulares, diseño visual estilizado con Tailwind CSS, validación de formularios en tiempo real y optimización de carga con Vite.',
      tags: ['React 18', 'Tailwind CSS', 'Vite', 'Mobile First'],
      icono: '💻',
      color: 'from-cyan-500 to-blue-600',
      borde: 'hover:border-cyan-500/50',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800'
    }
  ];

  return (
    <section id="proyectos" className="max-w-6xl mx-auto px-4 py-16 w-full">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-full text-xs font-semibold text-cyan-300 mb-3">
          <span>💼 Casos de Estudio</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Proyectos & Soluciones Técnicas
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Implementaciones prácticas enfocadas en calidad de software, diseño interactivo y automatización de procesos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {proyectos.map((p, idx) => (
          <div
            key={idx}
            className={`bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl backdrop-blur-sm transition duration-300 ${p.borde} group`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  {p.icono}
                </span>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${p.badgeColor}`}>
                  {p.categoria}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition">
                {p.titulo}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {p.descripcion}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5">
              {p.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
