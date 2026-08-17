import React from 'react';

export default function CVDownloadModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const descargarArchivo = (ruta, nombreArchivo) => {
    const enlace = document.createElement('a');
    enlace.href = ruta;
    enlace.setAttribute('download', nombreArchivo);
    enlace.setAttribute('target', '_blank');
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-modal-title"
      >
        {/* Boton Cerrar */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Encabezado */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-500/40 px-3 py-0.5 rounded-full text-xs font-semibold text-cyan-300 mb-2">
            <span>📄 Curriculum Vitae</span>
          </div>
          <h2 id="cv-modal-title" className="text-xl sm:text-2xl font-bold text-white">
            Descargar CV Ejecutivo
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Elige el idioma en el que deseas obtener el documento en formato PDF:
          </p>
        </div>

        {/* Opciones de Descarga */}
        <div className="space-y-3">
          {/* Version Espanol */}
          <button
            onClick={() => descargarArchivo('/CV_Martin_Hernandez_ES.pdf', 'CV_Martin_Hernandez_ES.pdf')}
            className="w-full flex items-center justify-between p-4 bg-slate-950/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl p-2 bg-slate-900 rounded-xl border border-slate-800">🇲🇽</span>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                  Versión en Español (PDF)
                </p>
                <p className="text-[11px] text-slate-400">
                  QA Funcional, Matrices & Automatización
                </p>
              </div>
            </div>
            <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-700/60 px-3 py-1 rounded-xl font-semibold group-hover:bg-cyan-900 transition">
              Descargar ⬇
            </span>
          </button>

          {/* Version Ingles */}
          <button
            onClick={() => descargarArchivo('/CV_Martin_Hernandez_EN.pdf', 'CV_Martin_Hernandez_EN.pdf')}
            className="w-full flex items-center justify-between p-4 bg-slate-950/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl p-2 bg-slate-900 rounded-xl border border-slate-800">🇺🇸</span>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                  English Version (PDF)
                </p>
                <p className="text-[11px] text-slate-400">
                  Functional QA, Test Matrices & Automation
                </p>
              </div>
            </div>
            <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-700/60 px-3 py-1 rounded-xl font-semibold group-hover:bg-cyan-900 transition">
              Download ⬇
            </span>
          </button>
        </div>

        {/* Pie de modal */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 transition underline underline-offset-4 cursor-pointer"
          >
            Cerrar ventana
          </button>
        </div>
      </div>
    </div>
  );
}
