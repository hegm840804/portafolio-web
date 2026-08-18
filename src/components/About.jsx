export default function About({ onOpenContact, onOpenCV }) {
  const competencias = [
    {
      categoria: 'QA Funcional & Manual Core',
      icono: '📋',
      subtitulo: 'Aseguramiento de Calidad & STLC',
      habilidades: [
        'Diseño de Matrices Exhaustivas & Test Cases (Excel / Jira)',
        'Pruebas End-to-End (E2E), Regresión & Sanity/Smoke',
        'Validación en Plataformas Web, Móviles & Core Siebel',
        'Pruebas de Aceptación de Usuario (UAT) & Reglas de Negocio',
        'Gestión de Ciclo Completo de Pruebas (STLC & Trazabilidad)',
        'Reporte Técnico de Anomalías con Evidencia Detallada'
      ]
    },
    {
      categoria: 'Automatización & Workflow Engineering',
      icono: '⚡',
      subtitulo: 'Innovación en Procesos & Regresión',
      habilidades: [
        'Orquestación de Flujos de Trabajo y Regresión con n8n',
        'Testing Automatizado E2E con Playwright & Selenium',
        'Lógica de Automatización de Tareas & Reducción de Tiempos',
        'Validación de Payloads JSON & Respuestas de Servicios',
        'Construcción de Scripts en JavaScript, Java & Python',
        'Optimización de Tiempos de Ejecución de Plataforma'
      ]
    },
    {
      categoria: 'Backend, APIs & Data Integrity',
      icono: '🔌',
      subtitulo: 'Validación de Servicios & Datos',
      habilidades: [
        'Pruebas de APIs RESTful con Postman (Status, Schema, Headers)',
        'Consultas SQL Avanzadas para Validación de Integridad',
        'Normalización y Verificación de Bases de Datos Transaccionales',
        'Análisis de Logs y Manejo de Errores en Servidores Unix/Windows',
        'Testing de Integraciones entre Sistemas Core y Pasarelas'
      ]
    },
    {
      categoria: 'Desarrollo Web & Metodologías Ágiles',
      icono: '🛠️',
      subtitulo: 'Sinergia Técnica con Equipos de Ingeniería',
      habilidades: [
        'Desarrollo Frontend Moderno (React, JavaScript ES6+, HTML5, CSS3)',
        'Control de Versiones Profesional (Git, GitHub, PRs & Branching)',
        'Gestión de Proyectos en Jira Software & XRay Test Management',
        'Metodologías Ágiles (Scrum, Sprints & Revisiones Técnicas)',
        'Alineación de Expectativas Directamente con Stakeholders'
      ]
    }
  ];

  return (
    <section id="sobre-mi" className="max-w-6xl mx-auto px-4 py-16 w-full">
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Efectos de luz ambiental */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-10">
          
          {/* Bloque Superior: Presentación Ejecutiva */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              
              <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-1 rounded-full text-xs font-semibold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Perfil Profesional Ejecutivo</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Martin Tonatiuh Hernández Garfias
              </h2>
              
              <p className="text-sm sm:text-base text-cyan-400 font-semibold tracking-wide">
                QA Test Engineer & Process Automation Specialist
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Ingeniero de Pruebas QA con trayectoria especializada en <strong className="text-white">aseguramiento de calidad de software (STLC), análisis funcional y diseño riguroso de matrices de prueba</strong> en plataformas core de alta criticidad transaccional (Banca y Servicios Financieros en <strong className="text-white">Fincomún</strong>, CRM Empresarial Siebel y Móvil en <strong className="text-white">SKY</strong>, y plataformas digitales en <strong className="text-white">People Media</strong>).
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Mi propuesta de valor integra una sólida capacidad analítica para identificar y prevenir defectos en fases tempranas (<em className="text-cyan-300 font-medium">Shift-Left Testing</em>) con el uso estratégico de la <strong className="text-white">automatización de flujos y procesos mediante n8n, pruebas E2E con Playwright, validación de APIs REST con Postman y consultas complejas en SQL</strong>. Cuento además con experiencia práctica en desarrollo web frontend (React, JavaScript, HTML5/CSS3) para colaborar en sinergia directa con equipos de ingeniería ágiles bajo marcos Scrum.
              </p>
            </div>

            {/* Tarjeta Lateral Ejecutiva: Pilares de Desempeño */}
            <div className="lg:col-span-4 bg-slate-950/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
              <div className="text-center border-b border-slate-800 pb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Pilares de Valor Corporativo
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Indicadores de Calidad & Entrega</p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-[11px]">🎯 Calidad & Estabilidad</p>
                    <p className="text-[10px] text-slate-400">Matrices E2E & Regresión Crítica</p>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    Cero Errores
                  </span>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-[11px]">⚡ Optimización con n8n</p>
                    <p className="text-[10px] text-slate-400">Automatización de Flujos & Tareas</p>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                    -40% Tiempos
                  </span>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-[11px]">🔌 Testing Multicapa</p>
                    <p className="text-[10px] text-slate-400">Validación de APIs & SQL Data</p>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                    Postman / SQL
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={onOpenContact}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-cyan-950/40 transition transform active:scale-95 cursor-pointer"
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

          {/* Bloque Inferior: Matriz de Competencias Técnicas */}
          <div className="pt-6 border-t border-slate-800">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>🛠️</span>
                <span>Matriz de Especialidades & Habilidades Técnicas</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Cobertura Funcional, Automatización & Desarrollo Web
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {competencias.map((comp, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4.5 hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-xl p-1.5 bg-slate-900 rounded-xl border border-slate-800">{comp.icono}</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 leading-tight">
                          {comp.categoria}
                        </h4>
                        <p className="text-[10px] text-slate-400">{comp.subtitulo}</p>
                      </div>
                    </div>

                    <ul className="space-y-2 mt-3">
                      {comp.habilidades.map((hab, hIdx) => (
                        <li key={hIdx} className="text-[11px] text-slate-300 flex items-start gap-2 leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1 flex-shrink-0"></span>
                          <span>{hab}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
