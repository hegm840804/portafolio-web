import { useState } from 'react'

export default function HeroCarousel() {
  const [slideActivo, setSlideActivo] = useState(0)

  const slides = [
    {
      subtitulo: 'Desarrollo Web Full Responsive',
      tituloPrincipal: 'Interfaces Modernas y Adaptables',
      descripcion: 'Construcción de aplicaciones web optimizadas para móviles, tablets y monitores de alta resolución con React, Tailwind CSS y buenas prácticas de arquitectura.',
      badge: 'Frontend & UI Engineering',
      badgeColor: 'from-cyan-500 to-blue-600',
      stats: '100% Mobile First',
      destacado: 'Rendimiento, accesibilidad y diseño visual dinámico'
    },
    {
      subtitulo: 'Aseguramiento de Calidad de Software',
      tituloPrincipal: 'Automatización de Pruebas & QA',
      descripcion: 'Diseño e implementación de suites de pruebas funcionales, E2E y validación de APIs con Playwright, Java, Selenium y Maven para entregas sin errores.',
      badge: 'QA Automation Specialist',
      badgeColor: 'from-emerald-500 to-teal-600',
      stats: 'Zero Defects Target',
      destacado: 'Ejecución continua, reportes detallados y regresiones robustas'
    },
    {
      subtitulo: 'Integración y Flujos Continuos',
      tituloPrincipal: 'Orquestación con n8n & APIs',
      descripcion: 'Automatización de tareas, consumo de endpoints REST y disparadores de eventos mediante Webhooks para conectar herramientas de desarrollo.',
      badge: 'APIs & Workflows',
      badgeColor: 'from-purple-500 to-pink-600',
      stats: 'Automatización 24/7',
      destacado: 'Monitoreo continuo y respuestas inmediatas a eventos'
    }
  ]

  const nextSlide = () => setSlideActivo((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setSlideActivo((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section id="capacidades" className="relative overflow-hidden pt-8 pb-16 lg:py-20">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[480px] relative z-10">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 self-center lg:self-start bg-slate-800/80 border border-slate-700/80 px-3 py-1 rounded-full text-xs font-semibold text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            {slides[slideActivo].subtitulo}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {slides[slideActivo].tituloPrincipal}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {slides[slideActivo].descripcion}
          </p>

          <div className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 border border-slate-700/80 rounded-2xl p-5 max-w-lg mx-auto lg:mx-0 shadow-xl backdrop-blur-sm w-full text-left">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5 mb-2.5">
              <span className={`text-xs uppercase tracking-wider font-bold bg-gradient-to-r ${slides[slideActivo].badgeColor} bg-clip-text text-transparent`}>
                {slides[slideActivo].badge}
              </span>
              <span className="text-xs bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-2.5 py-0.5 rounded-full font-mono font-semibold">
                {slides[slideActivo].stats}
              </span>
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-1.5">
              <span className="text-amber-400">⚡</span>
              <span><strong>Enfoque:</strong> {slides[slideActivo].destacado}</span>
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="w-full max-w-md bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-sm relative group hover:border-slate-700 transition">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500"></span>
                <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded-md border border-cyan-800/40">
                Ready for Production
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 flex justify-between items-center hover:border-cyan-500/40 transition">
                <span className="text-slate-400 flex items-center gap-2">
                  <span className="text-cyan-400">📱</span> Diseño Web
                </span>
                <span className="text-cyan-300 font-bold">Mobile • Tablet • Desktop</span>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 flex justify-between items-center hover:border-emerald-500/40 transition">
                <span className="text-slate-400 flex items-center gap-2">
                  <span className="text-emerald-400">🛡️</span> QA Automation
                </span>
                <span className="text-emerald-300 font-bold">Playwright & Java</span>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 flex justify-between items-center hover:border-purple-500/40 transition">
                <span className="text-slate-400 flex items-center gap-2">
                  <span className="text-purple-400">⚙️</span> Flujos y APIs
                </span>
                <span className="text-purple-300 font-bold">n8n + Webhooks</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-slate-800/70 hover:bg-slate-700 text-white rounded-full p-2.5 backdrop-blur-md transition border border-slate-700 shadow-lg z-20"
        aria-label="Anterior"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-slate-800/70 hover:bg-slate-700 text-white rounded-full p-2.5 backdrop-blur-md transition border border-slate-700 shadow-lg z-20"
        aria-label="Siguiente"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="flex justify-center items-center gap-2 pb-2 pt-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlideActivo(i)}
            className={`h-2 transition-all rounded-full ${
              slideActivo === i
                ? 'w-8 bg-gradient-to-r from-cyan-400 to-blue-500'
                : 'w-2 bg-slate-700'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
