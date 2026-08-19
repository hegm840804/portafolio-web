import { useState } from 'react';

export default function N8NOrchestrator() {
  const [tipoEvento, setTipoEvento] = useState('lead');
  const [endpointUrl, setEndpointUrl] = useState('https://automation.martin-qa.dev/webhook/v1/lead-dispatcher');
  const [nodoActivoIndex, setNodoActivoIndex] = useState(-1);
  const [ejecutandoN8n, setEjecutandoN8n] = useState(false);
  const [errorJson, setErrorJson] = useState('');

  const [payloadJson, setPayloadJson] = useState(JSON.stringify({
    evento: "NUEVO_LEAD_PORTAFOLIO",
    cliente: {
      nombre: "Martin Tonatiuh Hernandez Garfias",
      email: "hegmtona2024@gmail.com"
    }
  }, null, 2));

  const [logSalida, setLogSalida] = useState({
    status: 200,
    mensaje: 'Flujo independiente listo para recibir eventos HTTP POST.',
    tiempoTotal: '38ms',
    idEjecucion: 'EXEC-N8N-84920',
    datosResultado: { statusProcesamiento: "COMPLETADO", canalAlertas: "WhatsApp & Gmail" },
    nodos: [
      { id: 1, nombre: '1. Webhook Receiver', tipo: 'POST /webhook', estado: 'Listo', latencia: '12ms' },
      { id: 2, nombre: '2. Schema Validator', tipo: 'n8n-nodes-base.if', estado: 'Listo', latencia: '8ms' },
      { id: 3, nombre: '3. Data Transform & QA', tipo: 'n8n-nodes-base.set', estado: 'Listo', latencia: '11ms' },
      { id: 4, nombre: '4. Gmail & WhatsApp Dispatch', tipo: 'n8n-nodes-base.emailSend', estado: 'Listo', latencia: '7ms' }
    ]
  });

  const cambiarEvento = (e) => {
    const val = e.target.value;
    setTipoEvento(val);
    if (val === 'lead') {
      setEndpointUrl('https://automation.martin-qa.dev/webhook/v1/lead-dispatcher');
    } else if (val === 'bug') {
      setEndpointUrl('https://automation.martin-qa.dev/webhook/v1/jira-bug-sync');
    } else {
      setEndpointUrl('https://automation.martin-qa.dev/webhook/v1/api-monitor');
    }
  };

  const ejecutarFlujoN8n = () => {
    try {
      JSON.parse(payloadJson);
      setErrorJson('');
    } catch {
      setErrorJson('Formato JSON inválido.');
      return;
    }
    setEjecutandoN8n(true);
    setNodoActivoIndex(0);
    setTimeout(() => setNodoActivoIndex(1), 250);
    setTimeout(() => setNodoActivoIndex(2), 550);
    setTimeout(() => {
      setNodoActivoIndex(3);
      setEjecutandoN8n(false);
      setNodoActivoIndex(-1);
    }, 900);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Orquestación de Flujos & Webhooks en Vivo</h2>
          <p className="text-xs text-slate-400 mt-1">Módulo independiente de n8n para pruebas y validación de schemas JSON.</p>
        </div>
        <select
          value={tipoEvento}
          onChange={cambiarEvento}
          className="bg-slate-950 border border-slate-700 text-xs text-cyan-300 font-semibold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
        >
          <option value="lead">📁 Captura de Lead / Cotización</option>
          <option value="bug">🐛 Reporte de Defecto (Jira QA)</option>
          <option value="api-health">🖥️ Health-Check API SPEI</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 text-xs">
            <label className="block text-slate-400 font-semibold mb-1">Endpoint HTTP POST:</label>
            <input
              type="text"
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-cyan-300 focus:outline-none"
            />
            <label className="block text-slate-400 font-semibold mb-1">Cuerpo JSON (Editable):</label>
            <textarea
              rows="6"
              value={payloadJson}
              onChange={(e) => setPayloadJson(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-200 focus:border-cyan-500 focus:outline-none resize-none"
            ></textarea>
            {errorJson && <p className="text-rose-400 text-[11px] font-semibold">{errorJson}</p>}
            <button
              onClick={ejecutarFlujoN8n}
              disabled={ejecutandoN8n}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              {ejecutandoN8n ? 'Ejecutando Nodos n8n...' : 'Disparar Webhook & Flujo en Vivo'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-slate-200 block">Pipeline de Nodos n8n (Independiente)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {logSalida.nodos.map((nodo, idx) => (
                <div
                  key={nodo.id}
                  className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                    nodoActivoIndex === idx
                      ? 'bg-cyan-950 border-cyan-400 scale-[1.03] shadow-lg shadow-cyan-950/50'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${nodoActivoIndex === idx ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`}></span>
                    <div>
                      <p className="font-bold text-white text-[11px]">{nodo.nombre}</p>
                      <p className="text-[10px] text-slate-400">{nodo.tipo}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {nodo.estado}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl font-mono text-xs text-slate-300 space-y-2">
            <span className="text-emerald-400 font-bold text-[11px]">HTTP 200 OK • Latencia: {logSalida.tiempoTotal}</span>
            <p className="text-cyan-300 text-[11px]">{logSalida.mensaje}</p>
          </div>
        </div>
      </div>
    </div>
  );
}