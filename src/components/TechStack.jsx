export default function TechStack() {
  return (
    <section id="stack" className="max-w-6xl mx-auto px-4 py-16 text-center w-full">
      <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
        Stack Tecnológico & Soluciones
      </h2>
      <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
        Herramientas integradas para desarrollo frontend moderno y aseguramiento de calidad automatizado.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-4xl mx-auto">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-slate-800/90 p-6 text-left flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-cyan-500/50 transition">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition"></div>
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-cyan-400">◈</span> Desarrollo Web
              </h3>
              <span className="text-[11px] bg-cyan-950 text-cyan-300 font-semibold px-2.5 py-0.5 rounded-full border border-cyan-800">
                UI / Responsive
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Diseño centrado en la experiencia de usuario y rendimiento óptimo.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Adaptabilidad total en móvil, tablet y PC.</li>
              <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Componentes modulares con React y Tailwind CSS.</li>
              <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Estructura semántica, carga veloz y accesibilidad.</li>
              <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Control de versiones estructurado con Git y GitHub.</li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex gap-2 flex-wrap">
            <span className="text-[11px] bg-slate-800/80 text-cyan-200 px-2.5 py-1 rounded-lg border border-slate-700">HTML5 / CSS3</span>
            <span className="text-[11px] bg-slate-800/80 text-cyan-200 px-2.5 py-1 rounded-lg border border-slate-700">JavaScript</span>
            <span className="text-[11px] bg-slate-800/80 text-cyan-200 px-2.5 py-1 rounded-lg border border-slate-700">React</span>
            <span className="text-[11px] bg-slate-800/80 text-cyan-200 px-2.5 py-1 rounded-lg border border-slate-700">Tailwind CSS</span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-slate-800/90 p-6 text-left flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition"></div>
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">◈</span> QA & Automation
              </h3>
              <span className="text-[11px] bg-emerald-950 text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-800">
                Testing
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Estrategias de prueba para garantizar software confiable y sin defectos.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Pruebas automatizadas E2E y funcionales de UI.</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Verificación y consumo de REST APIs.</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Orquestación y ejecución de flujos con n8n.</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Pruebas unitarias y de integración con Maven.</li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex gap-2 flex-wrap">
            <span className="text-[11px] bg-slate-800/80 text-emerald-200 px-2.5 py-1 rounded-lg border border-slate-700">Playwright</span>
            <span className="text-[11px] bg-slate-800/80 text-emerald-200 px-2.5 py-1 rounded-lg border border-slate-700">Java / Maven</span>
            <span className="text-[11px] bg-slate-800/80 text-emerald-200 px-2.5 py-1 rounded-lg border border-slate-700">n8n</span>
            <span className="text-[11px] bg-slate-800/80 text-emerald-200 px-2.5 py-1 rounded-lg border border-slate-700">Postman / Thunder</span>
          </div>
        </div>
      </div>
    </section>
  )
}
