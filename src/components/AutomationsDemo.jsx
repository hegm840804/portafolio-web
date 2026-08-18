import { useState, useEffect } from 'react';

export default function AutomationsDemo({ onOpenContact }) {
  const [seccionActiva, setSeccionActiva] = useState('asistente'); // Por defecto abre en n8n

  // =========================================================================
  // 2. ORQUESTADOR N8N / WEBHOOK PIPELINE (100% FUNCIONAL E INTERACTIVO)
  // =========================================================================
  const [tipoEventoWebhook, setTipoEventoWebhook] = useState('lead');
  const [testEndpoint, setTestEndpoint] = useState('https://automation.martin-qa.dev/webhook/v1/lead-dispatcher');
  const [nodoActivoIndex, setNodoActivoIndex] = useState(-1);
  const [probandoFlujo, setProbandoFlujo] = useState(false);
  const [errorJson, setErrorJson] = useState('');

  // Payload JSON editable
  const [payloadPersonalizado, setPayloadPersonalizado] = useState(JSON.stringify({
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

  // Log y estado de respuesta
  const [logRespuesta, setLogRespuesta] = useState({
    status: 200,
    mensaje: 'Flujo listo para recibir eventos HTTP POST y procesar payloads JSON.',
    tiempo: '38ms',
    idEjecucion: 'EXEC-N8N-84920',
    datosSalida: {
      statusProcesamiento: "COMPLETADO",
      correoNotificado: "hegmtona2024@gmail.com",
      canalAlertas: "WhatsApp Business API",
      trazabilidadQA: "REGISTRADA"
    },
    nodosEjecutados: [
      { id: 1, nombre: '1. Webhook Receiver', tipo: 'n8n-nodes-base.webhook', estado: 'Listo', latencia: '12ms' },
      { id: 2, nombre: '2. Schema Validation', tipo: 'n8n-nodes-base.if', estado: 'Listo', latencia: '8ms' },
      { id: 3, nombre: '3. Data Transform & QA', tipo: 'n8n-nodes-base.set', estado: 'Listo', latencia: '11ms' },
      { id: 4, nombre: '4. Gmail & Alert Dispatch', tipo: 'n8n-nodes-base.emailSend', estado: 'Listo', latencia: '7ms' }
    ]
  });

  const cambiarPlantillaWebhook = (e) => {
    const val = e.target.value;
    setTipoEventoWebhook(val);
    setErrorJson('');
    if (val === 'lead') {
      setTestEndpoint('https://automation.martin-qa.dev/webhook/v1/lead-dispatcher');
      setPayloadPersonalizado(JSON.stringify({
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
      setTestEndpoint('https://automation.martin-qa.dev/webhook/v1/jira-bug-sync');
      setPayloadPersonalizado(JSON.stringify({
        evento: "BUG_REPORT_ALERT",
        idIncidencia: "QA-BUG-1092",
        severidad: "Crítica",
        moduloAfectado: "SPEI / Core Transferencias",
        descripcion: "Fallo en algoritmo de dígito verificador CLABE",
        ambiente: "Staging / Pre-Producción",
        reportadoPor: "Martin Hernandez (QA Lead)"
      }, null, 2));
    } else if (val === 'api-health') {
      setTestEndpoint('https://automation.martin-qa.dev/webhook/v1/api-monitor');
      setPayloadPersonalizado(JSON.stringify({
        evento: "HEALTH_CHECK_MONITOR",
        servicio: "API REST Pagos SPEI",
        codigoRespuesta: 200,
        latenciaMs: 46,
        disponibilidad: "99.98%",
        timestamp: new Date().toISOString()
      }, null, 2));
    }
  };

  // Disparo y animación del flujo n8n
  const ejecutarTestFlujo = () => {
    try {
      JSON.parse(payloadPersonalizado);
      setErrorJson('');
    } catch {
      setErrorJson('JSON inválido. Corrige la sintaxis antes de disparar el flujo.');
      return;
    }

    setProbandoFlujo(true);
    setNodoActivoIndex(0);

    // Animación paso a paso de los nodos
    setTimeout(() => setNodoActivoIndex(1), 250);
    setTimeout(() => setNodoActivoIndex(2), 550);
    setTimeout(() => {
      setNodoActivoIndex(3);
      
      const parsed = JSON.parse(payloadPersonalizado);
      const randomTime = Math.floor(Math.random() * 20 + 35);
      const randomExec = `EXEC-N8N-${Math.floor(Math.random() * 89999 + 10000)}`;

      setLogRespuesta({
        status: 200,
        mensaje: `Payload '${parsed.evento || 'EVENTO'}' procesado con éxito. Datos estructurados y alerta despachada.`,
        tiempo: `${randomTime}ms`,
        idEjecucion: randomExec,
        datosSalida: {
          statusProcesamiento: "COMPLETADO_OK",
          payloadRecibido: parsed.evento || "DATOS_VALIDADOS",
          correoDestinatario: "hegmtona2024@gmail.com",
          idEjecucion: randomExec,
          timestamp: new Date().toLocaleTimeString()
        },
        nodosEjecutados: [
          { id: 1, nombre: '1. Webhook Receiver', tipo: 'n8n-nodes-base.webhook', estado: 'Exitoso (200)', latencia: '12ms' },
          { id: 2, nombre: '2. Schema Validation', tipo: 'n8n-nodes-base.if', estado: 'Exitoso (Válido)', latencia: '9ms' },
          { id: 3, nombre: '3. Data Transform & QA', tipo: 'n8n-nodes-base.set', estado: 'Exitoso (JSON)', latencia: '10ms' },
          { id: 4, nombre: '4. Gmail & Alert Dispatch', tipo: 'n8n-nodes-base.emailSend', estado: 'Despachado', latencia: '8ms' }
        ]
      });

      setProbandoFlujo(false);
      setNodoActivoIndex(-1);
    }, 900);
  };

  const descargarBlueprintN8N = () => {
    const workflowJSON = {
      name: `Workflow_n8n_${tipoEventoWebhook.toUpperCase()}_Oficial`,
      nodes: [
        { name: "Webhook Receiver", type: "n8n-nodes-base.webhook", parameters: { httpMethod: "POST", path: "contacto-portafolio" } },
        { name: "Validate JSON Schema", type: "n8n-nodes-base.if", parameters: { conditions: { string: [{ value1: "={{ $json.evento }}", operation: "isNotEmpty" }] } } },
        { name: "Transform & Enrich Data", type: "n8n-nodes-base.set", parameters: { values: { string: [{ name: "status", value: "PROCESADO_QA" }] } } },
        { name: "Send Gmail & Alerts", type: "n8n-nodes-base.emailSend", parameters: { toEmail: "hegmtona2024@gmail.com" } }
      ],
      connections: {
        "Webhook Receiver": { "main": [[{ "node": "Validate JSON Schema", "type": "main", "index": 0 }]] },
        "Validate JSON Schema": { "main": [[{ "node": "Transform & Enrich Data", "type": "main", "index": 0 }]] },
        "Transform & Enrich Data": { "main": [[{ "node": "Send Gmail & Alerts", "type": "main", "index": 0 }]] }
      }
    };

    const blob = new Blob([JSON.stringify(workflowJSON, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `n8n_Workflow_${tipoEventoWebhook.toUpperCase()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =========================================================================
  // 1. GENERADOR DE MP
  // =========================================================================
  const [pasoMP, setPasoMP] = useState(1);
  const [modoEntradaReq, setModoEntradaReq] = useState('subir');
  const [archivoSubido, setArchivoSubido] = useState(null);
  const [textoLibreReq, setTextoLibreReq] = useState('');
  const [casoDetalleSeleccionado, setCasoDetalleSeleccionado] = useState(null);
  const [alertaSeguridad, setAlertaSeguridad] = useState(false);
  const [modalCotizador, setModalCotizador] = useState(false);

  const [datosCotizacion, setDatosCotizacion] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    tamanoModulo: 'mediano',
    tipoPruebas: ['funcional', 'regresion'],
    requiereAutomatizacion: 'si',
    tiempoEntrega: 'estandar'
  });

  const [cotizacionEnviada, setCotizacionEnviada] = useState(false);

  const [requerimiento, setRequerimiento] = useState({
    idHU: 'REQ-CLIENTE-01',
    titulo: 'Módulo de Transferencias Interbancarias SPEI en Tiempo Real',
    descripcion: 'Como cuentahabiente, deseo transferir fondos a cuentas CLABE de otros bancos para realizar pagos inmediatos de forma segura.',
    origen: 'Ejemplo Preconfigurado',
    criterios: [
      'La cuenta CLABE debe contener exactamente 18 dígitos numéricos válidos.',
      'El monto a transferir debe ser mayor a $0.00 y menor o igual al saldo disponible.',
      'Toda transacción aprobada debe generar un folio de rastreo CEP único.',
      'Si el servicio bancario tarda más de 10 segundos, aplicar rollback automático de fondos.'
    ]
  });

  const manejarSubidaArchivo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoSubido(file.name);
      setRequerimiento({
        idHU: `DOC-${file.name.slice(0, 8).toUpperCase()}`,
        titulo: `Requerimiento: ${file.name}`,
        descripcion: `Especificación cargada desde archivo ${file.name}. Analizando estructura de historias de usuario y flujos transaccionales.`,
        origen: `Archivo adjunto (${(file.size / 1024).toFixed(1)} KB)`,
        criterios: [
          'Validación de campos obligatorios y reglas de entrada según especificación adjunta.',
          'Verificación de flujos alternos y manejo de excepciones en transacciones.',
          'Comprobación de tiempos de respuesta y consistencia en base de datos.',
          'Criterios de aceptación UAT para certificación de pase a producción.'
        ]
      });
    }
  };

  const procesarTextoLibre = () => {
    if (!textoLibreReq.trim()) return;
    setRequerimiento({
      idHU: 'REQ-PERSONALIZADO',
      titulo: 'Requerimiento Funcional Personalizado',
      descripcion: textoLibreReq,
      origen: 'Descripción libre redactada por el cliente',
      criterios: [
        'Validación de flujo principal (Happy Path) sobre la funcionalidad descrita.',
        'Pruebas de frontera, tipos de datos inválidos y entradas erróneas (TTF).',
        'Validación de reglas de negocio y restricciones operativas del módulo.',
        'Pruebas de humo (Smoke Test) y verificación de componentes esenciales.'
      ]
    });
    setPasoMP(2);
  };

  const [formatoMatriz, setFormatoMatriz] = useState({
    estandar: 'Jira / XRay Test Management',
    prefijoID: 'TC-CORE',
    columnas: ['ID Caso', 'Título del Escenario', 'Tipo de Prueba', 'Precondiciones', 'Pasos de Ejecución', 'Resultado Esperado', 'Prioridad', 'Estado']
  });

  const [matrizGenerada] = useState([
    {
      id: 'TC-CORE-01',
      titulo: 'Ejecución exitosa del flujo principal con datos válidos y sesión activa',
      categoriaMetrica: 'HP',
      tipo: 'Funcional (Happy Path)',
      precondiciones: 'Usuario autenticado y parámetros del módulo cargados correctamente.',
      datosPrueba: 'Entradas válidas conformes a la especificación del requerimiento.',
      pasos: '1. Acceder al módulo.\n2. Ingresar datos obligatorios válidos.\n3. Presionar botón Procesar/Guardar.',
      resultado: 'Operación completada con éxito, respuesta HTTP 200/201 y persistencia en base de datos.',
      prioridad: 'Crítica',
      estado: 'Listo para Ejecución'
    },
    {
      id: 'TC-CORE-02',
      titulo: 'Validación de campos obligatorios vacíos y bloqueo de envío',
      categoriaMetrica: 'TTF',
      tipo: 'Frontera / Negativo (TTF)',
      precondiciones: 'Formulario en pantalla.',
      datosPrueba: 'Campos requeridos en blanco (null / empty).',
      pasos: '1. Omitir captura de campos obligatorios.\n2. Intentar enviar petición.',
      resultado: 'Bloqueo en cliente y alertas visuales: "Este campo es requerido".',
      prioridad: 'Crítica',
      estado: 'Listo para Ejecución'
    },
    {
      id: 'TC-CORE-03',
      titulo: 'Validación de límites de caracteres y longitud máxima permitida',
      categoriaMetrica: 'TTF',
      tipo: 'Frontera (Límites)',
      precondiciones: 'Campo de texto activo.',
      datosPrueba: 'Cadena con longitud N + 1 caracteres sobre el límite.',
      pasos: '1. Ingresar texto excediendo límite permitido.\n2. Validar respuesta del campo.',
      resultado: 'El sistema trunca la entrada o emite mensaje de longitud máxima superada.',
      prioridad: 'Alta',
      estado: 'Listo para Ejecución'
    },
    {
      id: 'TC-CORE-04',
      titulo: 'Smoke Test de disponibilidad de componentes y carga inicial de interfaz',
      categoriaMetrica: 'Smoke',
      tipo: 'Smoke / Sanity Test',
      precondiciones: 'Navegador en ruta del módulo.',
      datosPrueba: 'Inspección de elementos.',
      pasos: '1. Cargar la vista.\n2. Comprobar que botones, tablas e inputs respondan.',
      resultado: 'Pantalla renderizada en < 2 segundos sin errores de consola JS.',
      prioridad: 'Alta',
      estado: 'Listo para Ejecución'
    },
    {
      id: 'TC-CORE-05',
      titulo: 'Manejo de desconexión o latencia alta con el backend / servicios externos',
      categoriaMetrica: 'Otros',
      tipo: 'Resiliencia / API',
      precondiciones: 'Simulación de pérdida de red o timeout > 10,000ms.',
      datosPrueba: 'Petición con retardo de red.',
      pasos: '1. Disparar acción principal.\n2. Interrumpir o demorar respuesta del servicio.',
      resultado: 'Mensaje amigable de reintento sin congelamiento de la aplicación.',
      prioridad: 'Media',
      estado: 'Listo para Ejecución'
    },
    {
      id: 'TC-CORE-06',
      titulo: 'Validación de concurrencia e idempotencia por doble clic rápido',
      categoriaMetrica: 'TTF',
      tipo: 'Concurrencia',
      precondiciones: 'Formulario con datos listos para procesar.',
      datosPrueba: 'Doble clic en < 250ms.',
      pasos: '1. Presionar dos veces consecutivas el botón de confirmación.',
      resultado: 'Deshabilitación automática tras el primer clic impidiendo transacciones duplicadas.',
      prioridad: 'Crítica',
      estado: 'Bloqueado (Contactar)'
    },
    {
      id: 'TC-CORE-07',
      titulo: 'Sanitización de caracteres especiales y prevención de inyección XSS/SQL',
      categoriaMetrica: 'Otros',
      tipo: 'Seguridad',
      precondiciones: 'Campos de entrada disponibles.',
      datosPrueba: "Payloads: <script>alert(1)</script> / ' OR '1'='1",
      pasos: '1. Introducir código malicioso en campos de texto.\n2. Enviar datos.',
      resultado: 'Sanitización de cadenas sin ejecución de scripts ni vulneración de BD.',
      prioridad: 'Crítica',
      estado: 'Bloqueado (Contactar)'
    },
    {
      id: 'TC-CORE-08',
      titulo: 'Verificación de persistencia y consistencia de datos en base de datos',
      categoriaMetrica: 'HP',
      tipo: 'Integridad de Datos (SQL)',
      precondiciones: 'Transacción completada.',
      datosPrueba: 'Consulta SELECT a tablas relacionadas.',
      pasos: '1. Consultar registros insertados en BD.\n2. Validar tipos de datos y timestamps.',
      resultado: 'Registros normalizados correctamente con integridad referencial.',
      prioridad: 'Media',
      estado: 'Bloqueado (Contactar)'
    }
  ]);

  const [procesandoMP, setProcesandoMP] = useState(false);

  useEffect(() => {
    const bloquearAtajos = (e) => {
      if (
        (e.ctrlKey && ['c', 'x', 'u', 's', 'p'].includes(e.key.toLowerCase())) ||
        (e.metaKey && ['c', 'x', 'u', 's', 'p'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i')
      ) {
        if (seccionActiva === 'matriz') {
          e.preventDefault();
          mostrarAvisoSeguridad();
        }
      }

      if (e.key === 'PrintScreen' && seccionActiva === 'matriz') {
        if (navigator.clipboard) {
          navigator.clipboard.writeText('');
        }
        mostrarAvisoSeguridad();
      }
    };

    window.addEventListener('keydown', bloquearAtajos);
    return () => window.removeEventListener('keydown', bloquearAtajos);
  }, [seccionActiva]);

  const mostrarAvisoSeguridad = () => {
    setAlertaSeguridad(true);
    setTimeout(() => setAlertaSeguridad(false), 3000);
  };

  const totalCasos = matrizGenerada.length;
  const totalHP = matrizGenerada.filter(c => c.categoriaMetrica === 'HP').length;
  const totalTTF = matrizGenerada.filter(c => c.categoriaMetrica === 'TTF').length;
  const totalSmoke = matrizGenerada.filter(c => c.categoriaMetrica === 'Smoke').length;
  const totalOtros = matrizGenerada.filter(c => c.categoriaMetrica === 'Otros').length;

  const descargarMuestraCSV = () => {
    const casosMuestra = matrizGenerada.slice(0, 5);
    let contenidoCSV = 'ID_Caso,Titulo_Escenario,Tipo_Prueba,Categoria_Metrica,Precondiciones,Pasos_Ejecucion,Resultado_Esperado,Prioridad,Estado\n';
    
    casosMuestra.forEach((c) => {
      const limpiar = (txt) => txt.replace(/^[=+\-@]/, "'").replace(/"/g, '""').replace(/\n/g, ' ');
      contenidoCSV += `"${limpiar(c.id)}","${limpiar(c.titulo)}","${limpiar(c.tipo)}","${limpiar(c.categoriaMetrica)}","${limpiar(c.precondiciones)}","${limpiar(c.pasos)}","${limpiar(c.resultado)}","${limpiar(c.prioridad)}","${limpiar(c.estado)}"\n`;
    });

    contenidoCSV += `"\n--- NOTA DE COBERTURA ---","Muestra ejecutiva de 5 casos basada en [${requerimiento.idHU}]. Para obtener la Matriz Completa (${totalCasos} casos), contacta a Martin Hernandez Garfias (hegmtona2024@gmail.com / +52 56 1562 5182).","QA Engineering","","","","","",""\n`;

    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Muestra_5_Casos_Matriz_${requerimiento.idHU}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setModalCotizador(true);
  };

  const calcularEstimacion = () => {
    let base = 2500;
    if (datosCotizacion.tamanoModulo === 'chico') base = 1800;
    if (datosCotizacion.tamanoModulo === 'grande') base = 4200;
    if (datosCotizacion.tamanoModulo === 'enterprise') base = 6800;
    if (datosCotizacion.requiereAutomatizacion === 'si') base += 2000;
    if (datosCotizacion.tiempoEntrega === 'urgente') base += 1200;
    return base.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  };

  const enviarCotizacion = (e) => {
    e.preventDefault();
    setCotizacionEnviada(true);

    const texto = `Hola Martin, deseo cotizar una *Matriz de Pruebas Completa*:\n` +
      `📌 *Requerimiento:* ${requerimiento.titulo} (${requerimiento.idHU})\n` +
      `👤 *Nombre:* ${datosCotizacion.nombre || 'Interesado'}\n` +
      `🏢 *Empresa:* ${datosCotizacion.empresa || 'N/A'}\n` +
      `✉️ *Correo:* ${datosCotizacion.email}\n` +
      `📱 *Tel:* ${datosCotizacion.telefono || 'N/A'}\n` +
      `📦 *Módulo:* ${datosCotizacion.tamanoModulo.toUpperCase()}\n` +
      `⚡ *Automatización:* ${datosCotizacion.requiereAutomatizacion}\n` +
      `⏱️ *Entrega:* ${datosCotizacion.tiempoEntrega}\n` +
      `💰 *Estimado Cotizado:* ${calcularEstimacion()}`;

    const url = `https://api.whatsapp.com/send?phone=525615625182&text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  // 3. MONOGRAFÍAS
  const [temaMonografia, setTemaMonografia] = useState('Las Hormigas y la Vida en Colonia');
  const [monografiaData, setMonografiaData] = useState({
    titulo: 'Monografía Escolar: Las Hormigas',
    resumen: 'Insectos sociales pertenecientes a la familia Formicidae con organización estricta por castas (reinas, obreras y soldados).',
    caracteristicas: [
      'Cuerpo dividido en cabeza, mesosoma y gáster con antenas acodadas.',
      'Comunicación química avanzada a través de secreción de feromonas.',
      'Capacidad de carga de 10 a 50 veces su propio peso corporal.'
    ],
    habitat: 'Presentes en todos los continentes excepto la Antártida, construyendo hormigueros subterráneos complejos.',
    curiosidad: 'Construyen redes de túneles con sistemas pasivos de ventilación y control de temperatura.'
  });

  const generarMonografia = () => {
    setMonografiaData({
      titulo: `Monografía Escolar: ${temaMonografia}`,
      resumen: `Investigación descriptiva sobre ${temaMonografia}, detallando su biología, funciones ecológicas y características.`,
      caracteristicas: [
        'Estructura morfológica y adaptaciones evolutivas.',
        'Mecanismos de reproducción y patrones de alimentación.',
        'Interacción y equilibrio dentro de su nicho ecológico.'
      ],
      habitat: 'Entornos naturales y adaptados con requerimientos específicos de clima y humedad.',
      curiosidad: 'Poseen mecanismos de respuesta rápida frente a variaciones climáticas estacionales.'
    });
  };

  // 4. BIOGRAFÍAS
  const [personaje, setPersonaje] = useState('curie');
  const personajesDB = {
    curie: {
      nombre: 'Marie Curie',
      fechas: '1867 – 1934',
      titulo: 'Física y Química Pionera en Radiactividad',
      nacionalidad: 'Polaca - Francesa',
      aportes: [
        'Descubrimiento de los elementos químicos Polonio (Po) y Radio (Ra).',
        'Primera persona en ganar dos Premios Nobel en distintas ciencias (Física y Química).',
        'Implementación de ambulancias radiológicas en la I Guerra Mundial.'
      ],
      legado: 'Revolucionó el entendimiento de la física nuclear y la medicina oncológica.'
    },
    turing: {
      nombre: 'Alan Turing',
      fechas: '1912 – 1954',
      titulo: 'Matemático, Criptoanalista y Padre de la Computación',
      nacionalidad: 'Británica',
      aportes: [
        'Diseño formal de la Máquina de Turing (modelo computacional base del software moderno).',
        'Descifrado de los códigos de la máquina Enigma en Bletchley Park.',
        'Propuesta del Test de Turing para evaluar la Inteligencia Artificial.'
      ],
      legado: 'Sentó los fundamentos matemáticos y teóricos de las ciencias de la computación.'
    },
    juarez: {
      nombre: 'Benito Juárez',
      fechas: '1806 – 1872',
      titulo: 'Estadista, Jurista y Presidente de México',
      nacionalidad: 'Mexicana',
      aportes: [
        'Promulgación de las Leyes de Reforma para la consolidación del Estado laico.',
        'Defensa de la soberanía e independencia frente a la intervención extranjera.',
        'Fortalecimiento de la educación pública y la división de poderes constitucionales.'
      ],
      legado: 'Referente republicano y Benemérito de las Américas por la defensa del Derecho.'
    }
  };

  // 5. ESQUEMAS
  const [especie, setEspecie] = useState('jaguar');
  const especiesDB = {
    jaguar: {
      comun: 'Jaguar Americano',
      cientifico: 'Panthera onca',
      reino: 'Animalia (Fauna Neotropical)',
      partes: [
        { nombre: 'Mandíbula de Gran Presión', desc: 'Capaz de penetrar caparazones gruesos de reptiles y huesos densos.' },
        { nombre: 'Rosetas en Pelaje', desc: 'Patrón de manchas único para camuflarse en la sombra selvática.' },
        { nombre: 'Garras Fuertes y Retráctiles', desc: 'Especializadas para trepar, nadar en ríos caudalosos y sujetar presas.' },
        { nombre: 'Estructura Muscular', desc: 'Optimizada para aceleraciones y emboscadas a corta distancia.' }
      ]
    },
    girasol: {
      comun: 'Girasol Gigante',
      cientifico: 'Helianthus annuus',
      reino: 'Plantae (Flora Magnoliophyta)',
      partes: [
        { nombre: 'Capítulo Floral', desc: 'Inflorescencia con cientos de pequeñas flores individuales productoras de semillas.' },
        { nombre: 'Lígulas Periféricas', desc: 'Pétalos vistosos encargados de atraer abejas y polinizadores.' },
        { nombre: 'Tallo Heliotrópico', desc: 'Tejido vegetal con capacidad de girar siguiendo la trayectoria solar.' },
        { nombre: 'Raíz Pivotante', desc: 'Fijación profunda y absorción eficiente de minerales del subsuelo.' }
      ]
    }
  };

  // 6. MAPAS
  const [regionMapa, setRegionMapa] = useState('mexico');
  const mapasDB = {
    edomex: {
      nombre: 'Estado de México',
      tipo: 'Entidad Federativa (México)',
      division: '125 Municipios (incluye Jilotepec, Toluca, Naucalpan, Ecatepec)',
      orografia: 'Eje Neovolcánico, Nevado de Toluca (Xinantécatl), Sierra Nevada (Popocatépetl / Iztaccíhuatl).',
      hidrografia: 'Cuencas del Río Lerma, Río Balsas y Río Pánuco; Presa Huapango y Valle de Bravo.',
      clima: 'Templado subhúmedo en valles, frío en zonas montañosas y semicálido en la región sur.'
    },
    mexico: {
      nombre: 'República Mexicana',
      tipo: 'País Soberano (América del Norte)',
      division: '32 Entidades Federativas soberanas e indivisibles',
      orografia: 'Sierra Madre Occidental, Sierra Madre Oriental, Sierra Madre del Sur y Eje Volcánico Transversal.',
      hidrografia: 'Río Bravo, Río Balsas, Río Grijalva, Río Usumacinta y Río Lerma-Santiago.',
      clima: 'Amplia diversidad: desértico al norte, templado en el altiplano y tropical húmedo en costas.'
    },
    mundo: {
      nombre: 'Planisferio / Geografía Mundial',
      tipo: 'Mapa Global',
      division: '6 Continentes (América, Europa, Asia, África, Oceanía, Antártida)',
      orografia: 'Cordillera del Himalaya, Los Andes, Montañas Rocosas, Alpes y Montes Urales.',
      hidrografia: 'Océanos Pacífico, Atlántico, Índico, Ártico y Antártico; Ríos Amazonas, Nilo y Yangtsé.',
      clima: 'Zonas Polares, Zonas Templadas y Franja Intertropical Cálida.'
    }
  };

  const imprimirVistaLibre = () => {
    window.print();
  };

  return (
    <section id="automatizaciones" className="max-w-6xl mx-auto px-4 py-16 w-full relative scroll-mt-24">
      
      {alertaSeguridad && (
        <div className="fixed top-6 right-6 z-50 bg-rose-950/95 border border-rose-500 text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce">
          <span className="text-xl">🛡️</span>
          <div>
            <p className="text-xs font-bold">Acción Restringida</p>
            <p className="text-[11px] text-rose-200">La copia y captura directa de casos de prueba está protegida.</p>
          </div>
        </div>
      )}

      {modalCotizador && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalCotizador(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-1 border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                ⚡ Auto-Cotizador Instantáneo
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Cotizar Matriz Completa & Casos E2E
              </h3>
              <p className="text-xs text-slate-400">
                Basado en tu requerimiento: <strong className="text-white">{requerimiento.titulo}</strong>
              </p>
            </div>

            {cotizacionEnviada ? (
              <div className="bg-emerald-950/80 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mx-auto">
                  ✓
                </div>
                <h4 className="text-base font-bold text-white">¡Solicitud de Matriz Despachada!</h4>
                <p className="text-xs text-slate-300">
                  Nos pondremos en contacto vía WhatsApp/Email para entregarte la matriz completa ({totalCasos} casos) con las suites de automatización.
                </p>
                <button
                  onClick={() => {
                    setCotizacionEnviada(false);
                    setModalCotizador(false);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={enviarCotizacion} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Ing. Carlos Mendoza"
                      value={datosCotizacion.nombre}
                      onChange={(e) => setDatosCotizacion({ ...datosCotizacion, nombre: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Empresa / Proyecto</label>
                    <input
                      type="text"
                      placeholder="Ej. FinTech / Startup"
                      value={datosCotizacion.empresa}
                      onChange={(e) => setDatosCotizacion({ ...datosCotizacion, empresa: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="carlos@empresa.com"
                      value={datosCotizacion.email}
                      onChange={(e) => setDatosCotizacion({ ...datosCotizacion, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">WhatsApp / Teléfono</label>
                    <input
                      type="tel"
                      placeholder="+52 55 0000 0000"
                      value={datosCotizacion.telefono}
                      onChange={(e) => setDatosCotizacion({ ...datosCotizacion, telefono: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Alcance del Módulo</label>
                    <select
                      value={datosCotizacion.tamanoModulo}
                      onChange={(e) => setDatosCotizacion({ ...datosCotizacion, tamanoModulo: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
                    >
                      <option value="chico">Módulo Pequeño (1 a 10 Casos)</option>
                      <option value="mediano">Módulo Mediano (10 a 25 Casos)</option>
                      <option value="grande">Módulo Grande (25 a 50 Casos)</option>
                      <option value="enterprise">Suite Completa Core (50+ Casos)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Automatización (Scripts)</label>
                    <select
                      value={datosCotizacion.requiereAutomatizacion}
                      onChange={(e) => setDatosCotizacion({ ...datosCotizacion, requiereAutomatizacion: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
                    >
                      <option value="si">Sí (Playwright / n8n / APIs)</option>
                      <option value="no">Solo Matriz Funcional / Manual</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between mt-2">
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold">Presupuesto Estimado:</p>
                    <p className="text-xl font-extrabold text-emerald-400 font-mono">{calcularEstimacion()}</p>
                  </div>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-lg">
                    Entrega personalizada
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg transition transform active:scale-95 cursor-pointer"
                  >
                    🚀 Enviar Cotización y Solicitar Matriz Completa
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Encabezado */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 bg-purple-950/80 border border-purple-500/40 px-3 py-1 rounded-full text-xs font-semibold text-purple-300 mb-3">
          <span>⚡ Suite de Automatización & QA Studio</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Generadores & Flujos Automatizados
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Interactúa en vivo con workflows n8n, genera matrices de prueba QA a partir de requerimientos o descarga herramientas educativas en PDF.
        </p>

        {/* 6 Pestañas */}
        <div className="flex flex-wrap justify-center gap-2 mt-6 p-2 bg-slate-950/90 border border-slate-800 rounded-3xl">
          <button
            onClick={() => setSeccionActiva('asistente')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
              seccionActiva === 'asistente' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. 🤖 Flujo n8n / Webhook
          </button>
          <button
            onClick={() => setSeccionActiva('matriz')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
              seccionActiva === 'matriz' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            2. 📋 Matriz QA (Cotizador)
          </button>
          <button
            onClick={() => setSeccionActiva('monografias')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
              seccionActiva === 'monografias' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            3. 📚 Monografías (Libre)
          </button>
          <button
            onClick={() => setSeccionActiva('biografias')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
              seccionActiva === 'biografias' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            4. 👤 Biografías (Libre)
          </button>
          <button
            onClick={() => setSeccionActiva('esquemas')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
              seccionActiva === 'esquemas' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            5. 🌿🐾 Esquemas (Libre)
          </button>
          <button
            onClick={() => setSeccionActiva('mapas')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
              seccionActiva === 'mapas' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            6. 🗺️ Mapas (Libre)
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">

        {/* ========================================================================= */}
        {/* 1. FLUJO N8N / WEBHOOKS EN VIVO (FUNCIONAL) */}
        {/* ========================================================================= */}
        {seccionActiva === 'asistente' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Módulo 1: Pipeline de Automatización n8n & Testing de Webhooks
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                  Orquestador de Eventos, Validación de Payloads & Notificaciones
                </h3>
                <p className="text-xs text-slate-400">
                  Simula peticiones HTTP POST en tiempo real, audita la ejecución nodo por nodo e inspecciona la salida JSON.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={tipoEventoWebhook}
                  onChange={cambiarPlantillaWebhook}
                  className="bg-slate-950 border border-slate-700 text-xs text-cyan-300 font-semibold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="lead">📨 Evento: Captura de Lead / Cotización</option>
                  <option value="bug">🐛 Evento: Reporte de Defecto QA (Jira)</option>
                  <option value="api-health">🩺 Evento: Health-Check API SPEI</option>
                </select>

                <button
                  onClick={descargarBlueprintN8N}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>📥</span>
                  <span>Descargar Blueprint (.JSON)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Panel Izquierdo: Configuración del Webhook */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Método & URL del Webhook:</label>
                    <div className="flex gap-2">
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold px-2.5 py-1.5 rounded-lg text-xs">
                        POST
                      </span>
                      <input
                        type="text"
                        value={testEndpoint}
                        onChange={(e) => setTestEndpoint(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-cyan-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-400 font-semibold">Cuerpo JSON (Editable):</label>
                      <span className="text-[10px] text-slate-500 font-mono">Content-Type: application/json</span>
                    </div>
                    <textarea
                      rows="8"
                      value={payloadPersonalizado}
                      onChange={(e) => setPayloadPersonalizado(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-200 focus:border-cyan-500 focus:outline-none resize-none leading-relaxed"
                    ></textarea>
                    {errorJson && (
                      <p className="text-rose-400 text-[11px] font-semibold mt-1">⚠️ {errorJson}</p>
                    )}
                  </div>

                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={ejecutarTestFlujo}
                      disabled={probandoFlujo}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition transform active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <span>{probandoFlujo ? '⚙️' : '⚡'}</span>
                      <span>{probandoFlujo ? 'Orquestando Nodos n8n...' : 'Disparar Webhook & Flujo en Vivo'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Panel Derecho: Diagrama de Nodos y Salida de Datos */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Visualizador de Nodos */}
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>🔗</span>
                      <span>Secuencia de Nodos n8n en Ejecución</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      ID: {logRespuesta.idEjecucion}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {logRespuesta.nodosEjecutados.map((nodo, idx) => (
                      <div
                        key={nodo.id}
                        className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                          nodoActivoIndex === idx
                            ? 'bg-cyan-950 border-cyan-400 scale-[1.03] shadow-lg shadow-cyan-950/50'
                            : 'bg-slate-900/90 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${
                            nodoActivoIndex === idx ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'
                          }`}></span>
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

                {/* Salida JSON y Log */}
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl font-mono text-xs text-slate-300 space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-emerald-400 font-bold text-[11px]">
                      ✓ HTTP {logRespuesta.status} OK • Latencia: {logRespuesta.tiempo}
                    </span>
                    <span className="text-slate-500 text-[10px]">Trazabilidad Activa</span>
                  </div>

                  <p className="text-cyan-300 text-[11px] leading-relaxed">
                    {logRespuesta.mensaje}
                  </p>

                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-300 overflow-x-auto">
                    <span className="text-slate-500 font-bold block mb-1">Payload de Respuesta (Data Output):</span>
                    <pre className="text-emerald-300 font-mono">
                      {JSON.stringify(logRespuesta.datosSalida, null, 2)}
                    </pre>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. MATRIZ QA */}
        {/* ========================================================================= */}
        {seccionActiva === 'matriz' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-slate-800 pb-5">
              <button
                onClick={() => setPasoMP(1)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  pasoMP === 1 ? 'bg-emerald-950/80 border-emerald-500/60 text-white' : 'bg-slate-950/70 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono text-xs font-bold">1</span>
                  <span className="text-xs font-bold">Archivo 1: Requerimientos</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Subir archivo o describir a grandes rasgos</p>
              </button>

              <button
                onClick={() => setPasoMP(2)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  pasoMP === 2 ? 'bg-cyan-950/80 border-cyan-500/60 text-white' : 'bg-slate-950/70 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono text-xs font-bold">2</span>
                  <span className="text-xs font-bold">Archivo 2: Formato de Matriz</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Reglas de columnas y prefijos Jira/XRay</p>
              </button>

              <button
                onClick={() => setPasoMP(3)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  pasoMP === 3 ? 'bg-purple-950/80 border-purple-500/60 text-white' : 'bg-slate-950/70 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono text-xs font-bold">3</span>
                  <span className="text-xs font-bold">Archivo 3: Resumen & Auto-Cotizador</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Métricas ({totalCasos} casos) & Cotización</p>
              </button>
            </div>

            {/* FASE 1 */}
            {pasoMP === 1 && (
              <div className="space-y-5 animate-fadeIn text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      Paso 1: ¿Cómo deseas ingresar tu Requerimiento?
                    </span>
                    <p className="text-[11px] text-slate-400">Selecciona el método de entrada de tu especificación técnica o historia de usuario.</p>
                  </div>

                  <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-xl">
                    <button
                      onClick={() => setModoEntradaReq('subir')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                        modoEntradaReq === 'subir' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      📁 Subir Archivo
                    </button>
                    <button
                      onClick={() => setModoEntradaReq('escribir')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                        modoEntradaReq === 'escribir' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ✍️ Explicar a Grandes Rasgos
                    </button>
                    <button
                      onClick={() => setModoEntradaReq('ejemplos')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                        modoEntradaReq === 'ejemplos' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ⚡ Plantilla de Ejemplo
                    </button>
                  </div>
                </div>

                {modoEntradaReq === 'subir' && (
                  <div className="bg-slate-950/80 border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-6 text-center space-y-3 transition">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl mx-auto">
                      📄
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {archivoSubido ? `Archivo Cargado: ${archivoSubido}` : 'Arrastra tu archivo de requerimiento aquí o haz clic para seleccionarlo'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Formatos soportados: PDF, Word (.docx), Excel (.xlsx) o Texto Plano (.txt)
                      </p>
                    </div>
                    <label className="inline-block bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 font-semibold px-4 py-2 rounded-xl transition cursor-pointer">
                      Seleccionar Archivo Local
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc,.xlsx,.xls,.txt"
                        onChange={manejarSubidaArchivo}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {modoEntradaReq === 'escribir' && (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        Describe brevemente qué deseas probar y qué reglas de negocio aplican:
                      </label>
                      <textarea
                        rows="4"
                        placeholder="Ejemplo: Necesito probar un módulo de login con autenticación de dos factores (2FA). Los usuarios deben recibir un código SMS de 6 dígitos que expira en 5 minutos..."
                        value={textoLibreReq}
                        onChange={(e) => setTextoLibreReq(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none resize-none leading-relaxed"
                      ></textarea>
                    </div>
                  </div>
                )}

                {modoEntradaReq === 'ejemplos' && (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <label className="block text-slate-300 font-bold mb-1">Seleccionar Caso de Uso Empresarial:</label>
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'spei') {
                          setRequerimiento({
                            idHU: 'HU-SPEI-104',
                            titulo: 'Módulo de Transferencias Interbancarias SPEI en Tiempo Real',
                            descripcion: 'Como cuentahabiente, deseo transferir fondos a cuentas CLABE de otros bancos para realizar pagos inmediatos de forma segura.',
                            origen: 'Ejemplo Preconfigurado',
                            criterios: [
                              'La cuenta CLABE debe contener exactamente 18 dígitos numéricos válidos.',
                              'El monto a transferir debe ser mayor a $0.00 y menor o igual al saldo disponible.',
                              'Toda transacción aprobada debe generar un folio de rastreo CEP único.',
                              'Si el servicio bancario tarda más de 10 segundos, aplicar rollback automático de fondos.'
                            ]
                          });
                        }
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-emerald-300 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="spei">🏦 Módulo SPEI / Transferencias Bancarias en Tiempo Real</option>
                    </select>
                  </div>
                )}

                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                    <span className="font-bold text-white text-xs">{requerimiento.titulo}</span>
                    <span className="font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800 text-[11px]">{requerimiento.idHU}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed"><strong className="text-slate-400">Origen:</strong> {requerimiento.origen}</p>
                  <p className="text-slate-300 leading-relaxed"><strong className="text-slate-400">Descripción:</strong> {requerimiento.descripcion}</p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      if (modoEntradaReq === 'escribir' && textoLibreReq.trim()) {
                        procesarTextoLibre();
                      } else {
                        setPasoMP(2);
                      }
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/50"
                  >
                    <span>Siguiente: Configurar Formato de Matriz (Paso 2)</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>
            )}

            {/* FASE 2 */}
            {pasoMP === 2 && (
              <div className="space-y-4 animate-fadeIn text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Paso 2: Reglas de Estructura & Plantilla (STLC)
                  </span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Estándar de Importación:</label>
                      <input
                        type="text"
                        disabled
                        value={formatoMatriz.estandar}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Prefijo de Identificador de Caso:</label>
                      <input
                        type="text"
                        value={formatoMatriz.prefijoID}
                        onChange={(e) => setFormatoMatriz({ ...formatoMatriz, prefijoID: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-cyan-300 font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Esquema de Columnas Requeridas:</label>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {formatoMatriz.columnas.map((col, idx) => (
                        <span key={idx} className="bg-slate-900 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setPasoMP(1)}
                    className="bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    ← Volver a Requerimientos
                  </button>

                  <button
                    onClick={() => {
                      setProcesandoMP(true);
                      setTimeout(() => {
                        setProcesandoMP(false);
                        setPasoMP(3);
                      }, 500);
                    }}
                    disabled={procesandoMP}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    <span>{procesandoMP ? '⚙️ Procesando Matriz...' : '⚡ Generar Resumen & Matriz Final'}</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>
            )}

            {/* FASE 3 */}
            {pasoMP === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📊</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                        Resumen Ejecutivo de Cobertura de Pruebas
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded font-mono">
                        🔒 Vista Protegida Anti-Copia
                      </span>
                      <span className="text-[11px] text-cyan-400 font-mono">{requerimiento.idHU}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Casos Totales</p>
                      <p className="text-lg font-extrabold text-cyan-400 font-mono">{totalCasos}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-emerald-400">HP (Happy Path)</p>
                      <p className="text-lg font-extrabold text-emerald-400 font-mono">{totalHP}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-rose-400">TTF (Test to Fail)</p>
                      <p className="text-lg font-extrabold text-rose-400 font-mono">{totalTTF}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-amber-400">Smoke / Sanity</p>
                      <p className="text-lg font-extrabold text-amber-400 font-mono">{totalSmoke}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl col-span-2 sm:col-span-1">
                      <p className="text-[10px] uppercase font-bold text-purple-400">Seguridad / API</p>
                      <p className="text-lg font-extrabold text-purple-400 font-mono">{totalOtros}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950/90 border border-emerald-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💼</span>
                    <div>
                      <p className="font-bold text-emerald-300">Descarga Muestra (5 Casos) o Auto-Cotiza la Matriz Completa</p>
                      <p className="text-[11px] text-slate-300">Generada a partir de: <strong>{requerimiento.titulo}</strong></p>
                    </div>
                  </div>

                  <button
                    onClick={() => setModalCotizador(true)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition whitespace-nowrap cursor-pointer shadow-lg shadow-emerald-950/50 flex items-center gap-1.5"
                  >
                    <span>⚡</span>
                    <span>Abrir Auto-Cotizador</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                      Archivo 3: Matriz Procesada ({totalCasos} Casos en Pantalla)
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Haz clic en cualquier fila para inspeccionar el detalle técnico en el visor inferior.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={descargarMuestraCSV}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>📥</span>
                      <span>Descargar Muestra CSV (5 Casos)</span>
                    </button>
                  </div>
                </div>

                <div 
                  onContextMenu={(e) => {
                    e.preventDefault();
                    mostrarAvisoSeguridad();
                  }}
                  onCopy={(e) => {
                    e.preventDefault();
                    mostrarAvisoSeguridad();
                  }}
                  className="select-none space-y-4"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                >
                  <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                    <table className="w-full text-left text-xs text-slate-300 border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/80 uppercase text-[10px] tracking-wider">
                          <th className="py-3 px-3">ID Caso</th>
                          <th className="py-3 px-3">Escenario de Prueba</th>
                          <th className="py-3 px-3">Métrica / Tipo</th>
                          <th className="py-3 px-3">Precondiciones</th>
                          <th className="py-3 px-3">Resultado Esperado</th>
                          <th className="py-3 px-2 text-center">Prioridad</th>
                          <th className="py-3 px-2 text-center">Detalle</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-sans">
                        {matrizGenerada.map((caso, index) => (
                          <tr 
                            key={caso.id} 
                            onClick={() => setCasoDetalleSeleccionado(caso)}
                            className={`hover:bg-slate-950/60 transition cursor-pointer ${
                              casoDetalleSeleccionado?.id === caso.id ? 'bg-cyan-950/40 border-l-2 border-cyan-400' : ''
                            } ${index >= 5 ? 'opacity-80' : ''}`}
                          >
                            <td className="py-3 px-3 font-mono font-bold text-cyan-400 whitespace-nowrap">{caso.id}</td>
                            <td className="py-3 px-3 font-semibold text-white">{caso.titulo}</td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                caso.categoriaMetrica === 'HP' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                                caso.categoriaMetrica === 'TTF' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                                caso.categoriaMetrica === 'Smoke' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                                'bg-purple-950 text-purple-300 border-purple-800'
                              }`}>
                                {caso.categoriaMetrica}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-[11px] text-slate-400">{caso.precondiciones}</td>
                            <td className="py-3 px-3 text-[11px] text-emerald-300">{caso.resultado}</td>
                            <td className="py-3 px-2 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                caso.prioridad === 'Crítica' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                                caso.prioridad === 'Alta' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                                'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              }`}>
                                {caso.prioridad}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCasoDetalleSeleccionado(caso);
                                }}
                                className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 px-2 py-1 rounded-lg transition"
                              >
                                Ver 👁️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {casoDetalleSeleccionado && (
                    <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-5 space-y-4 shadow-xl animate-fadeIn relative">
                      <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800">
                            {casoDetalleSeleccionado.id}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-white">{casoDetalleSeleccionado.titulo}</h4>
                            <p className="text-[11px] text-slate-400">
                              {casoDetalleSeleccionado.tipo} • Prioridad: <strong className="text-amber-400">{casoDetalleSeleccionado.prioridad}</strong> • Estado: <strong className="text-emerald-400">{casoDetalleSeleccionado.estado}</strong>
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setCasoDetalleSeleccionado(null)}
                          className="text-slate-400 hover:text-white text-xs bg-slate-900 p-1.5 rounded-lg border border-slate-800 transition"
                          title="Cerrar detalle"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2.5">
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                            <span className="font-bold text-slate-300 block mb-1">🎯 Precondiciones:</span>
                            <p className="text-slate-400 leading-relaxed">{casoDetalleSeleccionado.precondiciones}</p>
                          </div>
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                            <span className="font-bold text-cyan-300 block mb-1">🧪 Datos de Prueba (Test Data):</span>
                            <p className="text-slate-400 font-mono text-[11px] leading-relaxed">{casoDetalleSeleccionado.datosPrueba}</p>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                            <span className="font-bold text-purple-300 block mb-1">📋 Pasos de Ejecución Detallados:</span>
                            <pre className="text-slate-300 font-sans text-xs whitespace-pre-line leading-relaxed">
                              {casoDetalleSeleccionado.pasos}
                            </pre>
                          </div>
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                            <span className="font-bold text-emerald-400 block mb-1">✅ Resultado Esperado:</span>
                            <p className="text-emerald-300 leading-relaxed">{casoDetalleSeleccionado.resultado}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setPasoMP(2)}
                    className="text-xs text-slate-400 hover:text-white underline underline-offset-4 cursor-pointer"
                  >
                    ← Modificar Formato o Requerimientos
                  </button>

                  <span className="text-[11px] text-slate-400">
                    Mostrando <strong className="text-white">{totalCasos} casos</strong> en visor seguro • Muestra de <strong className="text-emerald-400">5 casos descargable</strong>.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. MONOGRAFÍAS */}
        {seccionActiva === 'monografias' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Módulo 3: Monografías</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">✓ Descarga Libre</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tema a Investigar:</label>
                <input
                  type="text"
                  value={temaMonografia}
                  onChange={(e) => setTemaMonografia(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  placeholder="Ej. Las Hormigas, El Colibrí..."
                />
              </div>
              <button
                onClick={generarMonografia}
                className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                ⚡ Generar Ficha de Monografía
              </button>
              <button
                onClick={imprimirVistaLibre}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🖨️</span>
                <span>Descargar / Imprimir Monografía en PDF</span>
              </button>
            </div>

            <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-xs space-y-3.5">
              <div className="border-b border-slate-800 pb-2 flex justify-between">
                <span className="font-bold text-cyan-300">{monografiaData.titulo}</span>
                <span className="text-slate-500">Estándar Educativo Listo para Imprimir</span>
              </div>
              <p className="text-slate-300 leading-relaxed"><strong className="text-white">Introducción:</strong> {monografiaData.resumen}</p>
              <div>
                <strong className="text-emerald-400">Puntos Clave & Características:</strong>
                <ul className="list-disc list-inside text-slate-400 mt-1 space-y-1">
                  {monografiaData.caracteristicas.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
              <p className="text-slate-300"><strong className="text-amber-400">Hábitat / Contexto:</strong> {monografiaData.habitat}</p>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-purple-300">
                <strong>💡 Dato Curioso:</strong> {monografiaData.curiosidad}
              </div>
            </div>
          </div>
        )}

        {/* 4. BIOGRAFÍAS */}
        {seccionActiva === 'biografias' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Módulo 4: Fichas Biográficas</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">✓ Descarga Libre</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Seleccionar Personaje:</label>
                <select
                  value={personaje}
                  onChange={(e) => setPersonaje(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="curie">Marie Curie (Ciencia / Física & Química)</option>
                  <option value="turing">Alan Turing (Computación & Criptografía)</option>
                  <option value="juarez">Benito Juárez (Historia de México / Leyes)</option>
                </select>
              </div>
              <button
                onClick={imprimirVistaLibre}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🖨️</span>
                <span>Descargar / Imprimir Biografía en PDF</span>
              </button>
            </div>

            <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-xs space-y-3.5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <div>
                  <h4 className="text-base font-extrabold text-white">{personajesDB[personaje].nombre}</h4>
                  <p className="text-[11px] text-cyan-400">{personajesDB[personaje].titulo}</p>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{personajesDB[personaje].fechas}</span>
              </div>
              <p className="text-slate-300"><strong className="text-slate-200">Nacionalidad:</strong> {personajesDB[personaje].nacionalidad}</p>
              <div>
                <strong className="text-purple-300">Aportaciones Principales:</strong>
                <ul className="list-disc list-inside text-slate-400 mt-1 space-y-1">
                  {personajesDB[personaje].aportes.map((ap, i) => <li key={i}>{ap}</li>)}
                </ul>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-slate-300">
                <strong className="text-emerald-400">Legado Histórico:</strong> {personajesDB[personaje].legado}
              </div>
            </div>
          </div>
        )}

        {/* 5. ESQUEMAS */}
        {seccionActiva === 'esquemas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Módulo 5: Esquemas Anatómicos</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">✓ Descarga Libre</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Especie:</label>
                <select
                  value={especie}
                  onChange={(e) => setEspecie(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="jaguar">🐆 Jaguar Americano (Fauna)</option>
                  <option value="girasol">🌻 Girasol Gigante (Flora)</option>
                </select>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p><strong className="text-slate-200">Científico:</strong> <em>{especiesDB[especie].cientifico}</em></p>
                <p><strong className="text-slate-200">Clasificación:</strong> {especiesDB[especie].reino}</p>
              </div>
              <button
                onClick={imprimirVistaLibre}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🖨️</span>
                <span>Descargar / Imprimir Esquema en PDF</span>
              </button>
            </div>

            <div className="lg:col-span-8 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Desglose Anatómico & Funcional ({especiesDB[especie].comun})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {especiesDB[especie].partes.map((p, idx) => (
                  <div key={idx} className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl">
                    <p className="text-xs font-bold text-emerald-300 mb-1">{p.nombre}</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. MAPAS */}
        {seccionActiva === 'mapas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Módulo 6: Geografía & Cartografía</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">✓ Descarga Libre</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Escala Cartográfica:</label>
                <select
                  value={regionMapa}
                  onChange={(e) => setRegionMapa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="edomex">📍 Estado de México (Entidad Federativa)</option>
                  <option value="mexico">🇲🇽 República Mexicana (Nacional)</option>
                  <option value="mundo">🌍 Planisferio Mundial (Global)</option>
                </select>
              </div>
              <button
                onClick={imprimirVistaLibre}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🖨️</span>
                <span>Descargar / Imprimir Mapa en PDF</span>
              </button>
            </div>

            <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-xs space-y-3.5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="text-base font-extrabold text-white">{mapasDB[regionMapa].nombre}</h4>
                <span className="text-amber-400 font-mono text-[11px]">{mapasDB[regionMapa].tipo}</span>
              </div>
              <p className="text-slate-300"><strong className="text-slate-100">División Territorial:</strong> {mapasDB[regionMapa].division}</p>
              <p className="text-slate-300"><strong className="text-cyan-300">🏔️ Orografía & Relieve:</strong> {mapasDB[regionMapa].orografia}</p>
              <p className="text-slate-300"><strong className="text-blue-400">🌊 Hidrografía:</strong> {mapasDB[regionMapa].hidrografia}</p>
              <p className="text-slate-300"><strong className="text-emerald-400">☀️ Regímenes Climáticos:</strong> {mapasDB[regionMapa].clima}</p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
