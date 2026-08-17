import { useState } from "react";

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    servicio: "Frontend & QA",
    mensaje: "",
  });

  const [errores, setErrores] = useState({});
  const [estadoEnvio, setEstadoEnvio] = useState({
    cargando: false,
    exito: false,
    error: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formData.nombre.trim())
      nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!formData.correo.trim()) {
      nuevosErrores.correo = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      nuevosErrores.correo = "Ingresa un correo electrónico válido.";
    }
    if (!formData.mensaje.trim())
      nuevosErrores.mensaje = "Describe brevemente tu proyecto o consulta.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // 1. Enviar a tu WhatsApp directo
  const enviarWhatsApp = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const texto =
      `Hola Martin, mi nombre es *${formData.nombre}*.\n` +
      `📧 *Correo:* ${formData.correo}\n` +
      (formData.telefono ? `📱 *Tel:* ${formData.telefono}\n` : "") +
      `🛠️ *Servicio de interés:* ${formData.servicio}\n` +
      `💬 *Detalles del proyecto:* ${formData.mensaje}`;

    const numeroWhatsApp = "525615625182";
    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(texto)}`;

    window.open(url, "_blank");
    setEstadoEnvio({ cargando: false, exito: true, error: "" });
  };

  // 2. Enviar a tu correo hegmtona2024@gmail.com
  const enviarCorreoAPI = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setEstadoEnvio({ cargando: true, exito: false, error: "" });

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/hegmtona2024@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            Nombre: formData.nombre,
            Correo: formData.correo,
            Telefono: formData.telefono || "No proporcionado",
            Servicio: formData.servicio,
            Mensaje: formData.mensaje,
            _subject: `Nuevo mensaje de portafolio web: ${formData.nombre}`,
          }),
        },
      );

      if (response.ok) {
        setEstadoEnvio({ cargando: false, exito: true, error: "" });
        setFormData({
          nombre: "",
          correo: "",
          telefono: "",
          servicio: "Frontend & QA",
          mensaje: "",
        });
      } else {
        throw new Error("Error en el envío");
      }
    } catch (err) {
      const asunto = `Propuesta de Proyecto - ${formData.servicio} (${formData.nombre})`;
      const cuerpo = `Nombre: ${formData.nombre}\nCorreo: ${formData.correo}\nTel: ${formData.telefono}\n\nMensaje:\n${formData.mensaje}`;
      window.location.href = `mailto:hegmtona2024@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
      setEstadoEnvio({ cargando: false, exito: true, error: "" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-500/40 px-3 py-0.5 rounded-full text-xs font-semibold text-cyan-300 mb-2">
            <span>🚀 Contacto Directo</span>
          </div>
          <h2
            id="modal-title"
            className="text-xl sm:text-2xl font-bold text-white"
          >
            Platiquemos sobre tu Proyecto
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Elige el medio de tu preferencia para coordinar requerimientos y
            alcance.
          </p>
        </div>

        {estadoEnvio.exito ? (
          <div className="bg-emerald-950/80 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mx-auto">
              ✓
            </div>
            <h3 className="text-base font-bold text-white">
              ¡Mensaje procesado con éxito!
            </h3>
            <p className="text-xs text-slate-300">
              Gracias por contactarme. Responderé a la brevedad posible.
            </p>
            <button
              onClick={() => {
                setEstadoEnvio({ cargando: false, exito: false, error: "" });
                onClose();
              }}
              className="mt-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
            >
              Cerrar Ventana
            </button>
          </div>
        ) : (
          <form className="space-y-4 text-xs sm:text-sm">
            <div>
              <label
                className="block font-semibold text-slate-300 mb-1"
                htmlFor="nombre"
              >
                Nombre Completo *
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej. Ing. Daniel Vargas"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full bg-slate-950 border ${
                  errores.nombre
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-slate-800 focus:border-cyan-500"
                } rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none transition`}
              />
              {errores.nombre && (
                <p className="text-[11px] text-rose-400 mt-1">
                  {errores.nombre}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  className="block font-semibold text-slate-300 mb-1"
                  htmlFor="correo"
                >
                  Correo Electrónico *
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  placeholder="contacto@empresa.com"
                  value={formData.correo}
                  onChange={handleChange}
                  className={`w-full bg-slate-950 border ${
                    errores.correo
                      ? "border-rose-500 ring-1 ring-rose-500"
                      : "border-slate-800 focus:border-cyan-500"
                  } rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none transition`}
                />
                {errores.correo && (
                  <p className="text-[11px] text-rose-400 mt-1">
                    {errores.correo}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block font-semibold text-slate-300 mb-1"
                  htmlFor="telefono"
                >
                  Teléfono / WhatsApp
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  placeholder="+52 55 0000 0000"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label
                className="block font-semibold text-slate-300 mb-1"
                htmlFor="servicio"
              >
                Servicio Requerido
              </label>
              <select
                id="servicio"
                name="servicio"
                value={formData.servicio}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none transition cursor-pointer"
              >
                <option value="Desarrollo Frontend">
                  Desarrollo Web Frontend (React / Tailwind)
                </option>
                <option value="QA Automation">
                  Automatización de Pruebas QA (Playwright / Java)
                </option>
                <option value="Integración APIs y n8n">
                  Integración de APIs y Flujos n8n
                </option>
                <option value="Frontend & QA">
                  Solución Completa (Frontend + QA)
                </option>
              </select>
            </div>

            <div>
              <label
                className="block font-semibold text-slate-300 mb-1"
                htmlFor="mensaje"
              >
                Detalles del Proyecto *
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows="3"
                placeholder="Describe los requerimientos, alcance o características de la web..."
                value={formData.mensaje}
                onChange={handleChange}
                className={`w-full bg-slate-950 border ${
                  errores.mensaje
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-slate-800 focus:border-cyan-500"
                } rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none transition resize-none`}
              ></textarea>
              {errores.mensaje && (
                <p className="text-[11px] text-rose-400 mt-1">
                  {errores.mensaje}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={enviarWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-950/40 transition transform active:scale-95 cursor-pointer"
              >
                <span>💬</span>
                <span>Enviar por WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={enviarCorreoAPI}
                disabled={estadoEnvio.cargando}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 px-4 rounded-xl border border-cyan-400/30 shadow-lg shadow-cyan-950/40 transition transform active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <span>✉️</span>
                <span>
                  {estadoEnvio.cargando ? "Enviando..." : "Enviar por Correo"}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
