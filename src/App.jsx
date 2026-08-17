import { useState } from 'react'
import Navbar from './components/Navbar'
import HeroCarousel from './components/HeroCarousel'
import ServiceTabs from './components/ServiceTabs'
import Projects from './components/Projects'
import TechStack from './components/TechStack'
import About from './components/About'
import FloatingCTA from './components/FloatingCTA'
import ContactModal from './components/ContactModal'

export default function App() {
  const [servicioActivo, setServicioActivo] = useState('dev')
  const [modalAbierto, setModalAbierto] = useState(false)

  return (
    <div
      translate="no"
      className="notranslate min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 flex flex-col font-sans pb-24 selection:bg-cyan-500 selection:text-white"
    >
      <Navbar onOpenContact={() => setModalAbierto(true)} />
      <main className="flex-1">
        <HeroCarousel />
        <ServiceTabs
          servicioActivo={servicioActivo}
          setServicioActivo={setServicioActivo}
        />
        <Projects />
        <TechStack />
        <About onOpenContact={() => setModalAbierto(true)} />
      </main>
      <FloatingCTA onOpenContact={() => setModalAbierto(true)} />

      <ContactModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
      />
    </div>
  )
}
