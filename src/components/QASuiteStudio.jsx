import { useState, useEffect } from "react";
import N8NOrchestrator from "./N8NOrchestrator";

export default function QASuiteStudio({ onOpenContact }) {
  // SEGURIDAD INVISIBLE
  useEffect(() => {
    const handler = (e) => {
      if (
        e.keyCode === 123 ||
        (e.ctrlKey &&
          e.shiftKey &&
          (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67))
      )
        e.preventDefault();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const [pestanaActiva, setPestanaActiva] = useState("matriz");
  const [pasoMP, setPasoMP] = useState(1);
  const [nivel, setNivel] = useState("MED");
  const totalCasos = nivel === "JR" ? 50 : nivel === "MED" ? 100 : 150;
  const costo = (totalCasos * 250).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const listaCasos = Array.from({ length: 10 }, (_, i) => ({
    id: `TC-SPEI-${i + 1}`,
    tipo: i % 2 === 0 ? "Happy Path" : "Test to Fail",
    severidad: "Crítica",
  }));

  return (
    <section
      id="automatizaciones"
      className="max-w-6xl mx-auto px-4 py-16"
      onContextMenu={(e) => e.preventDefault()}
      style={{ WebkitUserSelect: "none", userSelect: "none" }}
    >
      {/* Pestañas Premium */}
      <div className="text-center mb-8">
        <div className="inline-flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
          <button
            onClick={() => setPestanaActiva("matriz")}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${pestanaActiva === "matriz" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            📋 1. Generador de Matriz QA
          </button>
          <button
            onClick={() => setPestanaActiva("n8n")}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${pestanaActiva === "n8n" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            ⚙️ 2. Orquestador n8n
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {pestanaActiva === "matriz" ? (
          <div className="space-y-6 animate-fadeIn">
            {/* Tarjetas de Pasos Premium */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  onClick={() => setPasoMP(p)}
                  className={`p-4 rounded-2xl border text-left transition ${pasoMP === p ? "bg-emerald-950 border-emerald-500" : "bg-slate-950 border-slate-800"}`}
                >
                  <p className="text-[10px] text-emerald-400 font-bold uppercase">
                    Paso {p}
                  </p>
                  <p className="text-sm font-bold text-white">
                    {p === 1
                      ? "Requerimientos"
                      : p === 2
                        ? "Estructura"
                        : "Generación"}
                  </p>
                </button>
              ))}
            </div>

            {/* Contenido Paso 1 */}
            {pasoMP === 1 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-emerald-400 uppercase">
                  1. Requerimientos
                </h4>
                <input
                  type="file"
                  className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-xs text-slate-400"
                />
                <textarea
                  placeholder="Notas u observaciones..."
                  className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-white text-xs"
                  rows="4"
                />
                <button
                  onClick={() => setPasoMP(2)}
                  className="bg-emerald-600 w-full py-3 rounded-xl text-xs font-bold text-white uppercase"
                >
                  Siguiente
                </button>
              </div>
            )}

            {/* Contenido Paso 3 (Tabla) */}
            {pasoMP === 3 && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {["JR", "MED", "SR"].map((n) => (
                    <button
                      key={n}
                      onClick={() => setNivel(n)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold ${nivel === n ? "bg-purple-600" : "bg-slate-800 text-slate-400"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900 text-emerald-400 uppercase">
                      <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Tipo</th>
                        <th className="p-4">Severidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {listaCasos.map((c, i) => (
                        <tr key={i}>
                          <td className="p-4">{c.id}</td>
                          <td className="p-4">{c.tipo}</td>
                          <td className="p-4">{c.severidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gradient-to-r from-emerald-950 to-teal-950 p-6 rounded-2xl flex justify-between items-center border border-emerald-500/30">
                  <span className="text-3xl font-black text-white">
                    {costo}
                  </span>
                  <button
                    onClick={() =>
                      onOpenContact(
                        `Solicito MP de ${totalCasos} casos. Costo: ${costo}`,
                      )
                    }
                    className="bg-white text-emerald-900 font-bold px-6 py-3 rounded-xl text-xs"
                  >
                    Solicitar MP Completa
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <N8NOrchestrator />
        )}
      </div>
    </section>
  );
}
