import { useState } from "react";
import Navbar from "./components/Navbar";
import HeroCarousel from "./components/HeroCarousel";
import ServiceTabs from "./components/ServiceTabs";
import TechStack from "./components/TechStack";
import FloatingCTA from "./components/FloatingCTA";
import ContactModal from "./components/ContactModal";

export default function App() {
  const [servicioActivo, setServicioActivo] = useState("dev");
  const [modalAbierto, setModalAbierto] = useState(false);

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
        <TechStack />
      </main>
      <FloatingCTA onOpenContact={() => setModalAbierto(true)} />

      {/* Modal de Contacto Global */}
      <ContactModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
      />
    </div>
  );
}
