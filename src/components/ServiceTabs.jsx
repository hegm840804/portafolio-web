export default function ServiceTabs({ servicioActivo, setServicioActivo }) {
  return (
    <section id="servicios" className="max-w-4xl mx-auto px-4 -mt-4 relative z-20 w-full">
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <div
          onClick={() => setServicioActivo('dev')}
          className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col items-center justify-center text-center backdrop-blur-md ${
            servicioActivo === 'dev'
              ? 'bg-gradient-to-b from-cyan-950/80 to-slate-900 border-2 border-cyan-500 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl mb-2">
            💻
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white">Desarrollo Frontend</h2>
          <p className="text-xs text-slate-400 mt-1">Sitios dinámicos, adaptables y estilizados.</p>
        </div>

        <div
          onClick={() => setServicioActivo('qa')}
          className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col items-center justify-center text-center backdrop-blur-md ${
            servicioActivo === 'qa'
              ? 'bg-gradient-to-b from-emerald-950/80 to-slate-900 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl mb-2">
            🛡️
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white">QA & Automatización</h2>
          <p className="text-xs text-slate-400 mt-1">Pruebas UI, REST APIs y orquestación con n8n.</p>
        </div>
      </div>
    </section>
  )
}
