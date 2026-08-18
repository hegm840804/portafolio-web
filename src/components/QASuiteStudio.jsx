import { useState } from 'react';

export default function QASuiteStudio({ onOpenContact }) {
  const [pestanaActiva, setPestanaActiva] = useState('matriz'); // 'matriz' | 'n8n'

  // =========================================================================
  // 1. GENERADOR DE MATRIZ CON FLUJO DE 3 PASOS Y 50+ CASOS SENIOR
  // =========================================================================
  const [pasoMP, setPasoMP] = useState(1);
  const [alertaSeguridad, setAlertaSeguridad] = useState(false);
  const [modalCotizador, setModalCotizador] = useState(false);
  const [cotizacionEnviada, setCotizacionEnviada] = useState(false);
  const [procesandoPaso, setProcesandoPaso] = useState(false);

  // ARCHIVO 1: REQUERIMIENTOS
  const [modoEntradaReq, setModoEntradaReq] = useState('subir');
  const [archivoReqNombre, setArchivoReqNombre] = useState(null);
  const [vistaPreviaReqImg, setVistaPreviaReqImg] = useState(null);
  const [textoLibreReq, setTextoLibreReq] = useState('');

  const [requerimiento, setRequerimiento] = useState({
    idHU: 'HU-SPEI-104',
    titulo: 'Módulo de Transferencias Interbancarias SPEI en Tiempo Real',
    descripcion: 'Como cuentahabiente, deseo transferir fondos a cuentas CLABE de otros bancos para realizar pagos inmediatos de forma segura.',
    origen: 'Especificación Core Bancario / FinTech',
    criterios: [
      'La cuenta CLABE debe contener exactamente 18 dígitos numéricos válidos bajo algoritmo Módulo 10 Banxico.',
      'El monto a transferir debe ser mayor a $0.00 y menor o igual al saldo líquido disponible.',
      'Toda transacción aprobada debe generar un folio de rastreo CEP único y persistir en base de datos.',
      'Si el servicio bancario tarda más de 10 segundos, aplicar rollback automático sin afectación al saldo.'
    ]
  });

  // ARCHIVO 2: PLANTILLA / ESTRUCTURA DE MATRIZ
  const [modoEntradaFormato, setModoEntradaFormato] = useState('subir');
  const [archivoFormatoNombre, setArchivoFormatoNombre] = useState(null);
  const [vistaPreviaFormatoImg, setVistaPreviaFormatoImg] = useState(null);

  const [columnasPersonalizadas, setColumnasPersonalizadas] = useState([
    'ID_Caso',
    'Modulo_Core',
    'Requerimiento_Asociado',
    'Descripcion_Escenario',
    'Tipo_Validacion',
    'Precondiciones',
    'Pasos_Detallados',
    'Valores_Entrada_TestData',
    'Comportamiento_Esperado',
    'Severidad',
    'Estado'
  ]);

  const [nuevaColumna, setNuevaColumna] = useState('');

  // MANEJO DE CARGA DE ARCHIVO 1 (REQUERIMIENTO)
  const manejarSubidaReq = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoReqNombre(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setVistaPreviaReqImg(ev.target.result);
        reader.readAsDataURL(file);
      } else {
        setVistaPreviaReqImg(null);
      }
      setRequerimiento({
        idHU: 'DOC-' + file.name.slice(0, 8).toUpperCase(),
        titulo: 'Requerimiento: ' + file.name,
        descripcion: `Especificación cargada desde ${file.name} (${(file.size / 1024).toFixed(1)} KB). Analizando flujos transaccionales.`,
        origen: 'Archivo local (' + file.name + ')',
        criterios: [
          'Validación de campos obligatorios y reglas de entrada.',
          'Verificación de flujos alternos y excepciones en transacciones.',
          'Comprobación de tiempos de respuesta y consistencia en BD.'
        ]
      });
    }
  };

  // MANEJO DE CARGA DE ARCHIVO 2 (PLANTILLA / FORMATO)
  const manejarSubidaFormato = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoFormatoNombre(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setVistaPreviaFormatoImg(ev.target.result);
        reader.readAsDataURL(file);
      } else {
        setVistaPreviaFormatoImg(null);
      }
    }
  };

  // GENERADOR DE 50+ CASOS MASIVOS
  const generarSuiteCompleta = (cantidad) => {
    const areas = ['HP', 'TTF', 'Smoke', 'Concurrencia', 'Seguridad', 'Resiliencia', 'Auditoria'];
    let suite = [];
    for (let i = 1; i <= Math.max(50, cantidad); i++) {
      const area = areas[(i - 1) % areas.length];
      suite.push({
        id: `TC-${area.toUpperCase()}-${i}`,
        tipo: `Validación ${area} #${i}`,
        categoriaMetrica: area,
        pasosArray: [
          { num: 1, accion: `Configurar ambiente para escenario ${area} #${i}.`, data: `Param_${i}=Activo`, esperado: 'Contexto inicializado.' },
          { num: 2, accion: `Ejecutar transacción de prueba para ${area} #${i}.`, data: `Payload_ID: ${i}`, esperado: 'Respuesta conforme a requerimiento.' },
          { num: 3, accion: 'Verificar persistencia en base de datos.', data: `Query: SELECT * FROM audit WHERE id = ${i}`, esperado: 'Registros inmutables guardados.' }
        ],
        valores: {
          'ID_Caso': `TC-${area.toUpperCase()}-${i}`,
          'Modulo_Core': `SPEI / Módulo ${area}`,
          'Requerimiento_Asociado': requerimiento.idHU,
          'Descripcion_Escenario': `Prueba técnica avanzada #${i} enfocada en ${area} para garantizar la calidad del software.`,
          'Tipo_Validacion': `Validación Senior (${area})`,
          'Precondiciones': `Ambiente configurado y servicios en línea para caso ${i}.`,
          'Pasos_Detallados': `1. Inicializar contexto ${i}.\n2. Enviar petición.\n3. Validar BD.`,
          'Valores_Entrada_TestData': `Dataset_ID: ${i}`,
          'Comportamiento_Esperado': `El sistema responde con HTTP 200 y cumple el criterio ${i}.`,
          'Severidad': i <= 10 ? 'Crítica' : 'Alta',
          'Estado': 'Listo para Ejecución'
        }
      });
    }
    return suite;
  };

  const [suiteCompleta] = useState(generarSuiteCompleta(50));
  const [pagina, setPagina] = useState(1);
  const casosPorPagina = 10;
  const inicio = (pagina - 1) * casosPorPagina;
  const casosVisibles = suiteCompleta.slice(inicio, inicio + casosPorPagina);

  // TEST RUNNER PASO A PASO
  const [ejecutorActivo, setEjecutorActivo] = useState(false);
  const [casoEnEjecucion, setCasoEnEjecucion] = useState(null);
  const [pasoActualIdx, setPasoActualIdx] = useState(0);
  const [historialPasos, setHistorialPasos] = useState([]);
  const [veredictoFinal, setVeredictoFinal] = useState(null);

  const iniciarEjecucionPasoAPaso = (caso) => {
    setCasoEnEjecucion(caso);
    setPasoActualIdx(0);
    setHistorialPasos(new Array(caso.pasosArray.length).fill(null));
    setVeredictoFinal(null);
    setEjecutorActivo(true);
  };

  const registrarResultadoPaso = (resultado) => {
    const nuevoHistorial = [...historialPasos];
    nuevoHistorial[pasoActualIdx] = resultado;
    setHistorialPasos(nuevoHistorial);

    if (resultado === 'fail') {
      setVeredictoFinal('FAILED');
    } else if (pasoActualIdx + 1 < casoEnEjecucion.pasosArray.length) {
      setPasoActualIdx(pasoActualIdx + 1);
    } else {
      const hayFallo = nuevoHistorial.includes('fail');
      setVeredictoFinal(hayFallo ? 'FAILED' : 'PASSED');
    }
  };

  const reiniciarEjecucion = () => {
    setPasoActualIdx(0);
    setHistorialPasos(new Array(casoEnEjecucion.pasosArray.length).fill(null));
    setVeredictoFinal(null);
  };

  // EXPORTAR CSV UTF-8 BOM
  const exportarCSVLimpo = () => {
    let csv = '\uFEFF' + columnasPersonalizadas.join(',') + '\n';
    suiteCompleta.forEach((c) => {
      const fila = columnasPersonalizadas.map(col => {
        let val = c.valores[col] || 'N/A';
        if (typeof val === 'string') {
          val = val.replace(/^[=+\-@]/, "'").replace(/"/g, '""').replace(/\r?\n/g, ' ');
        }
        return '"' + val + '"';
      });
      csv += fila.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Suite_QA_Completa_50_Casos.csv';
    link.click();
    setModalCotizador(true);
  };

  // =========================================================================
  // 2. MÓDULO N8N & WEBHOOKS
  // =========================================================================
  const [tipoEvento, setTipoEvento] = useState('lead');
  const [endpointUrl, setEndpointUrl] = useState('https://automation.martin-qa.dev/webhook/v1/lead-dispatcher');
  const [nodoActivoIndex, setNodoActivoIndex] = useState(-1);
  const [ejecutandoN8n, setEjecutandoN8n] = useState(false);
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

  const ejecutarFlujoN8n = () => {
    try {
      JSON.parse(payloadJson);
      setErrorJson('');
    } catch {
      setErrorJson('El formato JSON contiene errores. Corrige la sintaxis.');
      return;
    }

    setEjecutandoN8n(true);
    setNodoActivoIndex(0);

    setTimeout(() => setNodoActivoIndex(1), 250);
    setTimeout(() => setNodoActivoIndex(2), 550);
    setTimeout(() => {
      setNodoActivoIndex(3);
      const parsed = JSON.parse(payloadJson);
      const randomLat = Math.floor(Math.random() * 15 + 32);
      const randomExec = 'EXEC-N8N-' + Math.floor(Math.random() * 89999 + 10000);

      setLogSalida({
        status: 200,
        mensaje: "Evento '" + (parsed.evento || 'HTTP_EVENT') + "' procesado exitosamente por la canalización.",
        tiempoTotal: randomLat + 'ms',
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

      setEjecutandoN8n(false);
      setNodoActivoIndex(-1);
    }, 900);
  };

  const descargarBlueprintN8N = () => {
    const workflowJSON = {
      name: "Workflow_n8n_" + tipoEvento.toUpperCase() + "_Oficial",
      nodes: [
        { name: "Webhook Receiver", type: "n8n-nodes-base.webhook", parameters: { httpMethod: "POST", path: "contacto-portafolio" } },
        { name: "Validate Schema", type: "n8n-nodes-base.if", parameters: { conditions: { string: [{ value1: "={{ $json.evento }}", operation: "isNotEmpty" }] } } },
        { name: "Transform QA Data", type: "n8n-nodes-base.set", parameters: { values: { string: [{ name: "status", value: "PROCESADO_QA" }] } } },
        { name: "Send Alerts & Gmail", type: "n8n-nodes-base.emailSend", parameters: { toEmail: "hegmtona2024@gmail.com" } }
      ]
    };

    const blob = new Blob([JSON.stringify(workflowJSON, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', "n8n_Workflow_" + tipoEvento.toUpperCase() + ".json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="automatizaciones" className="max-w-6xl mx-auto px-4 py-16 w-full scroll-mt-24">
      
      {/* MODAL EJECUTOR PASO A PASO */}
      {ejecutorActivo && casoEnEjecucion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-5 max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setEjecutorActivo(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition cursor-pointer"
            >
              ✕
            </button>

            <div className="border-b border-slate-800 pb-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-xs font-bold px-2.5 py-1 rounded-lg">
                  {casoEnEjecucion.id}
                </span>
                <span className="text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-semibold">
                  {casoEnEjecucion.tipo}
                </span>
                <span className="text-[11px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded font-semibold">
                  Severidad: {casoEnEjecucion.valores.Severidad}
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">
                {casoEnEjecucion.valores.Descripcion_Escenario}
              </h3>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
              <span className="font-bold text-cyan-300 block text-[11px]">🎯 Precondiciones:</span>
              <p className="text-slate-300 leading-relaxed">{casoEnEjecucion.valores.Precondiciones}</p>
            </div>

            {/* Barra de Progreso */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>Paso {pasoActualIdx + 1} de {casoEnEjecucion.pasosArray.length}</span>
                <span>{Math.round(((historialPasos.filter(x => x !== null).length) / casoEnEjecucion.pasosArray.length) * 100)}% Completado</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${((historialPasos.filter(x => x !== null).length) / casoEnEjecucion.pasosArray.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {!veredictoFinal ? (
              <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    👉 Paso {casoEnEjecucion.pasosArray[pasoActualIdx].num} en Progreso
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">📋 Acción:</span>
                    <p className="text-white font-medium text-sm mt-0.5">{casoEnEjecucion.pasosArray[pasoActualIdx].accion}</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-cyan-300 font-semibold block text-[11px]">🧪 Datos de Prueba:</span>
                    <p className="text-cyan-100 font-mono text-xs">{casoEnEjecucion.pasosArray[pasoActualIdx].data}</p>
                  </div>
                  <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-900/60">
                    <span className="text-emerald-400 font-semibold block text-[11px]">✅ Resultado Esperado:</span>
                    <p className="text-emerald-200 text-xs">{casoEnEjecucion.pasosArray[pasoActualIdx].esperado}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => registrarResultadoPaso('fail')}
                    className="flex-1 py-2.5 px-4 bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    ❌ Registrar Falla (Fail)
                  </button>
                  <button
                    onClick={() => registrarResultadoPaso('pass')}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    ✓ Paso Exitoso (Pass) ➔
                  </button>
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-2xl border text-center space-y-4 ${
                veredictoFinal === 'PASSED' ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-100' : 'bg-rose-950/80 border-rose-500/60 text-rose-100'
              }`}>
                <div className="text-4xl">{veredictoFinal === 'PASSED' ? '🏆' : '🐛'}</div>
                <div>
                  <h4 className="text-lg font-extrabold">
                    {veredictoFinal === 'PASSED' ? '¡Caso Ejecutado con Éxito (PASS)!' : 'Defecto Detectado (FAIL)'}
                  </h4>
                </div>
                <div className="flex justify-center gap-3">
                  <button onClick={reiniciarEjecucion} className="bg-slate-800 text-white text-xs px-4 py-2 rounded-xl cursor-pointer">🔄 Re-ejecutar</button>
                  <button onClick={() => setEjecutorActivo(false)} className="bg-emerald-500 text-slate-950 text-xs font-bold px-5 py-2 rounded-xl cursor-pointer">Finalizar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SELECTOR DE PESTAÑAS PRINCIPALES */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 rounded-2xl shadow-xl">
          <button
            onClick={() => setPestanaActiva('matriz')}
            className={'px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ' + (
              pestanaActiva === 'matriz'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <span>📋</span>
            <span>1. Generador de Matriz QA (Flujo 3 Pasos - 50 Casos)</span>
          </button>

          <button
            onClick={() => setPestanaActiva('n8n')}
            className={'px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ' + (
              pestanaActiva === 'n8n'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <span>🤖</span>
            <span>2. Orquestador n8n & Webhooks</span>
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* PESTAÑA 1: MATRIZ QA CON LOS 3 PASOS */}
        {pestanaActiva === 'matriz' && (
          <div className="space-y-6">
            
            {/* Pasos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-slate-800 pb-5">
              <button
                onClick={() => setPasoMP(1)}
                className={'p-3 rounded-2xl border text-left transition cursor-pointer ' + (
                  pasoMP === 1 ? 'bg-emerald-950 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono text-xs font-bold">1</span>
                  <span className="text-xs font-bold">Archivo 1: Requerimientos</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Sube doc, imagen o describe el flujo</p>
              </button>

              <button
                onClick={() => setPasoMP(2)}
                className={'p-3 rounded-2xl border text-left transition cursor-pointer ' + (
                  pasoMP === 2 ? 'bg-cyan-950 border-cyan-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono text-xs font-bold">2</span>
                  <span className="text-xs font-bold">Archivo 2: Tu Plantilla / Columnas</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Sube formato (imagen, Excel o texto)</p>
              </button>

              <button
                onClick={() => setPasoMP(3)}
                className={'p-3 rounded-2xl border text-left transition cursor-pointer ' + (
                  pasoMP === 3 ? 'bg-purple-950 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono text-xs font-bold">3</span>
                  <span className="text-xs font-bold">Archivo 3: Suite QA (50+ Casos)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Ejecución interactiva & CSV UTF-8</p>
              </button>
            </div>

            {/* FASE 1: SUBIR REQUERIMIENTO (CON LECTOR REAL DE ARCHIVOS) */}
            {pasoMP === 1 && (
              <div className="space-y-5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      Archivo 1: Ingreso de Requerimiento (Doc / Imagen / Texto)
                    </span>
                    <p className="text-[11px] text-slate-400">Sube la especificación o historia de usuario que deseas probar.</p>
                  </div>
                </div>

                <div className="bg-slate-950 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center space-y-3 transition">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl mx-auto">
                    📄
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {archivoReqNombre ? ('Archivo Cargado: ' + archivoReqNombre) : 'Arrastra o selecciona el archivo del requerimiento'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Soporta: Imágenes (.png, .jpg), Documentos (.pdf, .docx), Excel (.xlsx) o Texto (.txt)
                    </p>
                  </div>

                  {vistaPreviaReqImg && (
                    <div className="max-w-xs mx-auto p-2 bg-slate-900 rounded-xl border border-slate-800">
                      <img src={vistaPreviaReqImg} alt="Preview Requerimiento" className="rounded-lg max-h-36 mx-auto object-cover" />
                      <span className="text-[10px] text-emerald-400 block mt-1">✓ Imagen de requerimiento cargada</span>
                    </div>
                  )}

                  <label className="inline-block bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 font-semibold px-4 py-2 rounded-xl transition cursor-pointer">
                    Seleccionar Archivo de Requerimiento
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf,.docx,.doc,.xlsx,.xls,.txt"
                      onChange={manejarSubidaReq}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-xs">{requerimiento.titulo}</span>
                    <span className="font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 text-[11px]">{requerimiento.idHU}</span>
                  </div>
                  <p className="text-slate-300"><strong className="text-slate-400">Origen:</strong> {requerimiento.origen}</p>
                  <p className="text-slate-300"><strong className="text-slate-400">Descripción:</strong> {requerimiento.descripcion}</p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setPasoMP(2)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2"
                  >
                    <span>Siguiente: Subir Formato de Matriz (Archivo 2)</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>
            )}

            {/* FASE 2: SUBIR PLANTILLA / FORMATO (CON LECTOR REAL DE ARCHIVOS) */}
            {pasoMP === 2 && (
              <div className="space-y-5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                      Archivo 2: Subir Formato de Matriz del Usuario (Imagen, Excel, Doc o Texto)
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Sube tu plantilla y el motor mapeará automáticamente las columnas.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 border-2 border-dashed border-cyan-700/60 hover:border-cyan-400 rounded-2xl p-6 text-center space-y-3 transition">
                  <div className="h-12 w-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl mx-auto">
                    📊
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {archivoFormatoNombre ? ('Plantilla Cargada: ' + archivoFormatoNombre) : 'Arrastra una captura de tu Excel, documento o plantilla de casos'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Soporta: Capturas (.png, .jpg), Archivos Excel (.xlsx, .csv), Word (.docx) o Texto
                    </p>
                  </div>

                  {vistaPreviaFormatoImg && (
                    <div className="max-w-xs mx-auto p-2 bg-slate-900 rounded-xl border border-slate-800">
                      <img src={vistaPreviaFormatoImg} alt="Preview Formato" className="rounded-lg max-h-36 mx-auto object-cover" />
                      <span className="text-[10px] text-cyan-400 block mt-1">✓ Captura de formato escaneada</span>
                    </div>
                  )}

                  <label className="inline-block bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-semibold px-4 py-2 rounded-xl transition cursor-pointer">
                    Seleccionar Archivo de Formato
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.xlsx,.xls,.csv,.docx,.doc,.txt"
                      onChange={manejarSubidaFormato}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-xs">📐 Estructura de Columnas Activa ({columnasPersonalizadas.length} Columnas)</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {columnasPersonalizadas.map((col, idx) => (
                      <span key={idx} className="bg-slate-900 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-2 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                        <span>{col}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setPasoMP(1)}
                    className="bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs px-4 py-2 rounded-xl cursor-pointer"
                  >
                    ← Volver
                  </button>

                  <button
                    onClick={() => setPasoMP(3)}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    <span>⚡ Generar Suite QA (50+ Casos)</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>
            )}

            {/* FASE 3: SUITE QA CON 50+ CASOS */}
            {pasoMP === 3 && (
              <div className="space-y-5">
                
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                      Resumen Ejecutivo: Suite Completa (50 Casos Exhaustivos de QA)
                    </h4>
                    <span className="text-[11px] text-cyan-400 font-mono">Total: {suiteCompleta.length} Casos</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💼</span>
                    <div>
                      <p className="font-bold text-emerald-300">Descarga CSV en UTF-8 o Ejecuta Paso a Paso en Vivo</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportarCSVLimpo}
                      className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-600 text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>📥</span>
                      <span>Exportar Suite (CSV UTF-8)</span>
                    </button>
                  </div>
                </div>

                {/* TABLA FORMAL CON ESTRUCTURA COMPLETA */}
                <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-xs text-slate-300 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-3">ID Caso</th>
                        <th className="py-3 px-3">Escenario Técnico</th>
                        <th className="py-3 px-3">Área / Métrica</th>
                        <th className="py-3 px-3">Precondiciones</th>
                        <th className="py-3 px-2 text-center">Severidad</th>
                        <th className="py-3 px-2 text-center">Test Runner</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {casosVisibles.map((caso) => (
                        <tr key={caso.id} className="hover:bg-slate-950/60 transition">
                          <td className="py-3 px-3 font-mono font-bold text-cyan-400 whitespace-nowrap">{caso.id}</td>
                          <td className="py-3 px-3">
                            <p className="font-semibold text-white">{caso.valores.Descripcion_Escenario}</p>
                            <span className="text-[10px] text-slate-400">{caso.valores.Modulo_Core}</span>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="bg-slate-950 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                              {caso.categoriaMetrica}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[11px] text-slate-400 max-w-xs truncate">{caso.valores.Precondiciones}</td>
                          <td className="py-3 px-2 text-center">
                            <span className={'px-2 py-0.5 rounded-full text-[10px] font-bold ' + (
                              caso.valores.Severidad === 'Crítica' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                            )}>
                              {caso.valores.Severidad}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center whitespace-nowrap">
                            <button
                              onClick={() => iniciarEjecucionPasoAPaso(caso)}
                              className="text-[10px] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-bold px-3 py-1.5 rounded-xl shadow transition transform active:scale-95 cursor-pointer flex items-center gap-1 mx-auto"
                            >
                              <span>▶️</span>
                              <span>Ejecutar Paso a Paso</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                <div className="flex justify-between items-center pt-2 text-xs">
                  <button onClick={() => setPasoMP(2)} className="text-slate-400 underline cursor-pointer">← Volver al Formato</button>
                  <div className="flex gap-1.5">
                    {Array.from({ length: Math.ceil(suiteCompleta.length / casosPorPagina) }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPagina(i + 1)}
                        className={'w-8 h-8 rounded-xl font-bold text-xs cursor-pointer ' + (
                          pagina === i + 1 ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* PESTAÑA 2: ORQUESTADOR N8N */}
        {pestanaActiva === 'n8n' && (
          <div className="space-y-6">
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
                  onClick={descargarBlueprintN8N}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>📥</span>
                  <span>Descargar Workflow (.JSON)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                      <label className="block text-slate-400 font-semibold">Cuerpo JSON (Editable):</label>
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
                    onClick={ejecutarFlujoN8n}
                    disabled={ejecutandoN8n}
                    className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition transform active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>{ejecutandoN8n ? '⚙️' : '⚡'}</span>
                    <span>{ejecutandoN8n ? 'Ejecutando Nodos n8n...' : 'Disparar Webhook & Flujo en Vivo'}</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
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
                        className={'p-3 rounded-xl border transition-all duration-300 flex items-center justify-between ' + (
                          nodoActivoIndex === idx
                            ? 'bg-cyan-950 border-cyan-400 scale-[1.03] shadow-lg shadow-cyan-950/50'
                            : 'bg-slate-900 border-slate-800'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className={'h-2.5 w-2.5 rounded-full ' + (
                            nodoActivoIndex === idx ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'
                          )}></span>
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
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}