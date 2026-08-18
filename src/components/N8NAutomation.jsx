import { useState } from 'react';

export default function N8NAutomation({ onOpenContact }) {
  const [tipoEvento, setTipoEvento] = useState('lead');
  const [endpointUrl, setEndpointUrl] = useState('https://automation.martin-qa.dev/webhook/v1/lead-dispatcher');
  const [nodoActivoIndex, setNodoActivoIndex] = useState(-1);
  const [ejecutando, setEjecutando] = useState(false);
  const [errorJson, setErrorJson] = useState('');

  const [payloadJson, setPayloadJson] = useState(JSON.stringify({
    evento: "NUEVO_LEAD_PORTAFOLIO",
    origen: "Portafolio Web Oficial",
    cliente: {
      nombre: "Martin Tonatiuh Hernandez Garfias",
      empresa: "Servicios de Automatización & QA",
      email: "hegmtona2024@gmail.com",
      telefono: "+52 56 1562 5182"
    },
    requerimiento: {
      servicio: "QA Functional & Automation Suite",
      prioridad: "Alta",
      fechaSolicitud: new Date().toISOString()
    }
  }, null, 2));

  const [logSalida, setLogSalida] = useState({
    status: 200,
    mensaje: 'Flujo listo para recibir eventos HTTP POST y procesar payloads JSON.',
    tiempoTotal: '38ms',
    idEjecucion: 'EXEC-N8N-84920',
    datosResultado: {
      statusProcesamiento: "COMPLETADO",
      correoNotificado: "hegmtona2024@gmail.com",
      canalAlertas: "WhatsApp API",
      trazabilidadQA: "REGISTRADA"
    },
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
    setErrorJson('');

    if (val === 'lead') {
      setEndpointUrl('https://automation.martin-qa.dev/webhook/v1/lead-dispatcher');
      setPayloadJson(JSON.stringify({
        evento: "NUEVO_LEAD_PORTAFOLIO",
        cliente: {
          nombre: "Martin Tonatiuh Hernandez Garfias",
          empresa: "Servicios de Automatización & QA",
          email: "hegmtona2024@gmail.com",
          telefono: "+52 56 1562 5182"
        },
        requerimiento: {
          servicio: "QA Functional & Automation Suite",
          prioridad: "Alta",
          fechaSolicitud: new Date().toISOString()
        }
      }, null, 2));
    } else if (val === 'bug') {
      setEndpointUrl('https://automation.martin-qa.dev/webhook/v1/jira-bug-sync');
      setPayloadJson(JSON.stringify({
        evento: "BUG_REPORT_ALERT",
        idIncidencia: "QA-BUG-1092",
        severidad: "Crítica",
        moduloAfectado: "SPEI / Core Transferencias",
        descripcion: "Fallo en algoritmo de dígito verificador CLABE",
        ambiente: "Staging / Pre-Producción",
        reportadoPor: "Martin Hernandez (QA Lead)"
      }, null, 2));
    } else if (val === 'api-health') {
      setEndpointUrl('https://automation.martin-qa.dev/webhook/v1/api-monitor');
      setPayloadJson(JSON.stringify({
        evento: "HEALTH_CHECK_MONITOR",
        servicio: "API REST Pagos SPEI",
        codigoRespuesta: 200,
        latenciaMs: 46,
        disponibilidad: "99.98%",
        timestamp: new Date().toISOString()
      }, null, 2));
    }
  };

  const ejecutarFlujo = () => {
    try {
      JSON.parse(payloadJson);
      setErrorJson('');
    } catch {
      setErrorJson('El formato JSON contiene errores. Corrige la sintaxis.');
      return;
    }

    setEjecutando(true);
    setNodoActivoIndex(0);

    setTimeout(() => setNodoActivoIndex(1), 250);
    setTimeout(() => setNodoActivoIndex(2), 550);
    setTimeout(() => {
      setNodoActivoIndex(3);
      const parsed = JSON.parse(payloadJson);
      const randomLat = Math.floor(Math.random() * 15 + 32);
      const randomExec = EXEC-N8N-;

      setLogSalida({
        status: 200,
        mensaje: Evento '' procesado exitosamente por la canalización.,
        tiempoTotal: ${randomLat}ms,
        idEjecucion: randomExec,
        datosResultado: {
          statusProcesamiento: "COMPLETADO_OK",
          payloadRecibido: parsed.evento || "EVENTO_VALIDO",
          correoDestinatario: "hegmtona2024@gmail.com",
          idEjecucion: randomExec,
          timestamp: new Date().toLocaleTimeString()
        },
        nodos: [
          { id: 1, nombre: '1. Webhook Receiver', tipo: 'POST /webhook', estado: '200 OK', latencia: '11ms' },
          { id: 2, nombre: '2. Schema Validator', tipo: 'n8n-nodes-base.if', estado: 'Validado', latencia: '8ms' },
          { id: 3, nombre: '3. Data Transform & QA', tipo: 'n8n-nodes-base.set', estado: 'Estructurado', latencia: '9ms' },
          { id: 4, nombre: '4. Gmail & WhatsApp Dispatch', tipo: 'n8n-nodes-base.emailSend', estado: 'Despachado', latencia: '7ms' }
        ]
      });

      setEjecutando(false);
      setNodoActivoIndex(-1);
    }, 900);
  };

  const descargarBlueprint = () => {
    const workflowJSON = {
      name: Workflow_n8n__Oficial,
      nodes: [
        { name: "Webhook Receiver", type: "n8n-nodes-base.webhook", parameters: { httpMethod: "POST", path: "contacto-portafolio" } },
        { name: "Validate Schema", type: "n8n-nodes-base.if", parameters: { conditions: { string: [{ value1: "={{ .evento }}", operation: "isNotEmpty" }] } } },
        { name: "Transform QA Data", type: "n8n-nodes-base.set", parameters: { values: { string: [{ name: "status", value: "PROCESADO_QA" }] } } },
        { name: "Send Alerts & Gmail", type: "n8n-nodes-base.emailSend", parameters: { toEmail: "hegmtona2024@gmail.com" } }
      ]
    };

    const blob = new Blob([JSON.stringify(workflowJSON, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 
8n_Workflow_.json);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="automatizaciones" className="max-w-6xl mx-auto px-4 py-16 w-full">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Encabezado */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-full text-xs font-semibold text-cyan-300 mb-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Módulo Funcional: Automatización con n8n</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Orquestación de Flujos & Webhooks en Vivo
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Prueba la recepción de peticiones HTTP, validación de schemas JSON y despacho de alertas en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={tipoEvento}
              onChange={cambiarEvento}
              className="bg-slate-950 border border-slate-700 text-xs text-cyan-300 font-semibold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="lead">📨 Captura de Lead / Cotización</option>
              <option value="bug">🐛 Reporte de Defecto (Jira QA)</option>
              <option value="api-health">🩺 Health-Check API SPEI</option>
            </select>

            <button
              onClick={descargarBlueprint}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <span>📥</span>
              <span>Descargar Workflow (.JSON)</span>
            </button>
          </div>
        </div>

        {/* Panel Interactivo: 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Columna Izquierda: Petición HTTP & JSON */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Método & Endpoint HTTP POST:</label>
                <div className="flex gap-2">
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold px-2.5 py-1.5 rounded-lg text-xs">
                    POST
                  </span>
                  <input
                    type="text"
                    value={endpointUrl}
                    onChange={(e) => setEndpointUrl(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-cyan-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-400 font-semibold">Cuerpo JSON (Editable):</label>
                  <span className="text-[10px] text-slate-500 font-mono">application/json</span>
                </div>
                <textarea
                  rows="8"
                  value={payloadJson}
                  onChange={(e) => setPayloadJson(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-200 focus:border-cyan-500 focus:outline-none resize-none leading-relaxed"
                ></textarea>
                {errorJson && (
                  <p className="text-rose-400 text-[11px] font-semibold mt-1">⚠️ {errorJson}</p>
                )}
              </div>

              <button
                onClick={ejecutarFlujo}
                disabled={ejecutando}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition transform active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{ejecutando ? '⚙️' : '⚡'}</span>
                <span>{ejecutando ? 'Ejecutando Nodos n8n...' : 'Disparar Webhook & Flujo en Vivo'}</span>
              </button>
            </div>
          </div>

          {/* Columna Derecha: Nodos n8n & Salida */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Tarjetas de los 4 Nodos */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <span>🔗</span>
                  <span>Pipeline de Nodos n8n</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  ID: {logSalida.idEjecucion}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {logSalida.nodos.map((nodo, idx) => (
                  <div
                    key={nodo.id}
                    className={p-3 rounded-xl border transition-all duration-300 flex items-center justify-between }
                  >
                    <div className="flex items-center gap-2">
                      <span className={h-2.5 w-2.5 rounded-full }></span>
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

            {/* Salida JSON */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl font-mono text-xs text-slate-300 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-emerald-400 font-bold text-[11px]">
                  ✓ HTTP {logSalida.status} OK • Latencia: {logSalida.tiempoTotal}
                </span>
                <span className="text-slate-500 text-[10px]">Trazabilidad Activa</span>
              </div>

              <p className="text-cyan-300 text-[11px] leading-relaxed">
                {logSalida.mensaje}
              </p>

              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-300 overflow-x-auto">
                <span className="text-slate-500 font-bold block mb-1">Payload de Respuesta:</span>
                <pre className="text-emerald-300 font-mono">
                  {JSON.stringify(logSalida.datosResultado, null, 2)}
                </pre>
              </div>

              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                <span>¿Deseas conectar este flujo con tu backend o base de datos?</span>
                <button
                  onClick={onOpenContact}
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
                >
                  Contactar →
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}