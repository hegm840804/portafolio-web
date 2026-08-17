export default function About({ onOpenContact }) {
  const competencias = [
    {
      categoria: 'QA Automation & Funcional',
      icono: '🧪',
      habilidades: ['Playwright', 'Selenium', 'Karate DSL', 'Gherkin / BDD', 'Pruebas E2E & Regresión', 'Diseño de Test Cases']
    },
    {
      categoria: 'Desarrollo Web Frontend',
      icono: '💻',
      habilidades: ['React 18', 'JavaScript Moderno', 'Tailwind CSS', 'Vite', 'HTML5 / CSS3 Semántico', 'Mobile-First Design']
    },
    {
      categoria: 'APIs & Integraciones',
      icono: '🔌',
      habilidades: ['Testing de APIs REST', 'Postman Collections', 'Automatización con n8n', 'Validación de JSON Payloads', 'Consultas SQL']
    },
    {
      categoria: 'Gestión, CI/CD & Herramientas',
      icono: '⚙️',
      habilidades: ['Git & GitHub', 'Jira Software & XRay', 'GitHub Actions (CI/CD)', 'Scrum / Agile', 'Documentación Técnica']
    }
  ];

  return (
    <section id="sobre-mi" className="max-w-6xl mx-auto px-4 py-16 w-full">
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Efecto de luz ambiental */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-10">
          
          {/* Encabezado y Resumen Profesional */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
                <span>👨‍💻 Perfil Profesional & Resumen</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Martin Tonatiuh Hernandez Garfias
              </h2>
              
              <p className="text-sm sm:text-base text-cyan-400 font-medium">
                QA Test Engineer & Frontend Developer
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Especialista técnico con experiencia en el ciclo de vida completo del desarrollo y aseguramiento de calidad de software (QA). Combino la construcción de interfaces web intuitivas y responsivas en <strong className="text-white">React y Tailwind CSS</strong> con el diseño riguroso de planes de prueba, análisis funcional y automatización de pruebas de extremo a extremo (<strong className="text-white">Playwright, APIs REST y n8n</strong>).
              </p>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Mi enfoque está centrado en prevenir defectos de forma temprana (<em>Shift-Left Testing</em>), garantizar estabilidad funcional, validar flujos críticos de negocio y optimizar la experiencia de usuario final en múltiples resoluciones y plataformas.
              </p>
            </div>

            {/* Tarjeta de Métricas y CTA */}
            <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">
                Pilares de Trabajo
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-slate-300">🎯 Calidad & Estabilidad</span>
                  <span className="font-bold text-emerald-400">Sin Regresiones</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-slate-300">⚡ Automatización E2E</span>
                  <span className="font-bold text-cyan-400">Playwright / API</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-slate-300">📱 Interfaz Moderna</span>
                  <span className="font-bold text-purple-400">100% Adaptable</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={onOpenContact}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-cyan-950/40 transition transform active:scale-95 cursor-pointer"
                >
                  <span>🚀</span>
                  <span>Iniciar Proyecto / Contactar</span>
                </button>
                <button
                  onClick={onOpenContact}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl border border-slate-700 transition cursor-pointer"
                >
                  <span>📄</span>
                  <span>Solicitar CV en PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cuadrícula de Perfil Técnico */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-base sm:text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span>🛠️</span>
              <span>Habilidades y Tecnologías Clave</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {competencias.map((comp, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{comp.icono}</span>
                    <h4 className="text-xs font-bold text-slate-200">
                      {comp.categoria}
                    </h4>
                  </div>
                  <ul className="space-y-1.5">
                    {comp.habilidades.map((hab, hIdx) => (
                      <li key={hIdx} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/70"></span>
                        <span>{hab}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
