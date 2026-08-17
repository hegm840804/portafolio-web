export default function About({ onOpenContact }) {
  return (
    <section id="sobre-mi" className="max-w-6xl mx-auto px-4 py-16 w-full">
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
              <span>👨‍💻 Perfil Profesional</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Calidad Funcional, Automatización & Desarrollo Frontend
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Especialista enfocado en la construcción de interfaces de usuario modernas y robustas, así como en el diseño y ejecución de estrategias de prueba automatizadas para asegurar software estable, escalable y libre de errores.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl text-center">
                <span className="text-xl sm:text-2xl font-extrabold text-cyan-400 font-mono">100%</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Mobile First & Responsive</p>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl text-center">
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">E2E</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Automation & QA</p>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl text-center col-span-2 sm:col-span-1">
                <span className="text-xl sm:text-2xl font-extrabold text-purple-400 font-mono">CI/CD</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Workflows & n8n</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 justify-center items-stretch">
            <button
              onClick={onOpenContact}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold py-3 px-5 rounded-2xl shadow-lg shadow-cyan-950/50 transition transform active:scale-95 cursor-pointer"
            >
              <span>🚀</span>
              <span>Iniciar Proyecto / Contactar</span>
            </button>
            <button
              onClick={onOpenContact}
              className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-semibold py-3 px-5 rounded-2xl border border-slate-700 transition cursor-pointer"
            >
              <span>📄</span>
              <span>Solicitar CV en PDF</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
