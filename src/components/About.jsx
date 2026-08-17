export default function About({ onOpenContact, onOpenCV }) {
  const competencias = [
    {
      categoria: 'QA Funcional & Manual',
      icono: '📋',
      habilidades: ['Diseño de Matrices & Test Cases', 'Pruebas E2E & Regresión', 'Smoke & Sanity Testing', 'UAT / Pruebas de Aceptación', 'Plataformas Web, Móvil & Siebel', 'Ciclo de Vida STLC']
    },
    {
      categoria: 'Automatización & Innovación',
      icono: '⚡',
      habilidades: ['Orquestación con n8n', 'Automatización de Flujos', 'Testing con Playwright', 'Lógica de Automatización', 'Optimización de Regresiones', 'Scripts en Java / JS']
    },
    {
      categoria: 'APIs, Datos & Backend',
      icono: '🔌',
      habilidades: ['Pruebas de API REST (Postman)', 'Validación de JSON Payloads', 'Consultas SQL Avanzadas', 'Integridad y Normalización', 'Verificación de Bases de Datos']
    },
    {
      categoria: 'Gestión, Agile & Desarrollo',
      icono: '🛠️',
      habilidades: ['Jira Software & XRay', 'Git & GitHub', 'Metodologías Ágiles (Scrum)', 'Desarrollo Web (React, HTML5, CSS3)', 'Reporte y Trazabilidad de Bugs']
    }
  ];

  return (
    <section id="sobre-mi" className="max-w-6xl mx-auto px-4 py-16 w-full">
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
                <span>👨‍💻 Perfil Profesional & Trayectoria</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Martin Tonatiuh Hernandez Garfias
              </h2>
              
              <p className="text-sm sm:text-base text-cyan-400 font-medium">
                Ingeniero de Pruebas QA Funcional & Automatización de Procesos
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Ingeniero de Pruebas QA con sólida experiencia práctica en <strong className="text-white">pruebas manuales, análisis funcional y gestión integral del ciclo de pruebas (STLC)</strong> en plataformas empresariales core (Siebel, banca y plataformas web/móviles). Experto en diseñar matrices exhaustivas, validar reglas de negocio de punta a punta y certificar la estabilidad de cada entrega.
              </p>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Complemento mi enfoque funcional incorporando activamente la <strong className="text-white">automatización de flujos y procesos (n8n, lógica de automatización y Playwright)</strong>, validación de APIs REST con Postman y verificación de bases de datos con SQL, respaldado por una base sólida en desarrollo web e integración técnica con equipos ágiles.
              </p>
            </div>

            <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">
                Especialidades Clave
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-slate-300">📋 QA Funcional & Manual</span>
                  <span className="font-bold text-emerald-400">Matrices & E2E</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-slate-300">⚡ Automatización</span>
                  <span className="font-bold text-cyan-400">n8n / Playwright</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-slate-300">🔌 Backend & APIs</span>
                  <span className="font-bold text-purple-400">Postman / SQL</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={onOpenContact}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-cyan-950/40 transition transform active:scale-95 cursor-pointer"
                >
                  <span>🚀</span>
                  <span>Iniciar Conversación / Contactar</span>
                </button>
                <button
                  onClick={onOpenCV}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-semibold py-2.5 px-4 rounded-xl border border-cyan-500/30 hover:border-cyan-400 transition cursor-pointer"
                >
                  <span>📄</span>
                  <span>Descargar CV Ejecutivo (ES / EN)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-base sm:text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span>🛠️</span>
              <span>Matriz de Competencias Técnicas</span>
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
