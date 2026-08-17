export default function FloatingCTA({ onOpenContact }) {
  return (
    <div
      id="contacto"
      className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/90 backdrop-blur-lg py-3 px-4 flex justify-center items-center gap-3 border-t border-slate-800 shadow-2xl"
    >
      <button
        onClick={onOpenContact}
        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-emerald-900/30 transition transform active:scale-95 cursor-pointer"
      >
        <span>💬</span>
        <span>Contactar por WhatsApp</span>
      </button>
      <button
        onClick={onOpenContact}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-xl border border-cyan-400/30 shadow-lg shadow-cyan-900/30 transition transform active:scale-95 cursor-pointer"
      >
        <span>✉️</span>
        <span>Solicitar Cotización / Perfil</span>
      </button>
    </div>
  )
}
