import { useState } from 'react'
import Logo from './Logo'

export default function Navbar({ onOpenContact }) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <>
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-pink-500 via-purple-600 via-cyan-400 to-emerald-400"></div>

      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="text-slate-300 hover:text-cyan-400 focus:outline-none p-1"
              aria-label="Abrir menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <Logo />

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#capacidades" className="hover:text-cyan-400 transition">Capacidades</a>
            <a href="#servicios" className="hover:text-cyan-400 transition">Servicios</a>
            <a href="#stack" className="hover:text-cyan-400 transition">Tecnologías</a>
            <button onClick={onOpenContact} className="hover:text-cyan-400 transition focus:outline-none">Contacto</button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenContact}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-md shadow-cyan-500/20 transition transform active:scale-95 cursor-pointer"
            >
              Iniciar Proyecto
            </button>
          </div>
        </div>

        {menuAbierto && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2 text-sm font-medium text-slate-300 bg-slate-900/95 p-3 rounded-2xl">
            <a href="#capacidades" onClick={() => setMenuAbierto(false)} className="py-2 px-3 hover:bg-slate-800 rounded-lg hover:text-cyan-400">Capacidades</a>
            <a href="#servicios" onClick={() => setMenuAbierto(false)} className="py-2 px-3 hover:bg-slate-800 rounded-lg hover:text-cyan-400">Servicios</a>
            <a href="#stack" onClick={() => setMenuAbierto(false)} className="py-2 px-3 hover:bg-slate-800 rounded-lg hover:text-cyan-400">Tecnologías</a>
            <button onClick={() => { setMenuAbierto(false); onOpenContact(); }} className="text-left py-2 px-3 hover:bg-slate-800 rounded-lg hover:text-cyan-400">Contacto</button>
          </div>
        )}
      </header>
    </>
  )
}
