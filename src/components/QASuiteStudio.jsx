import { useState, useEffect } from 'react';

export default function QASuiteStudio({ onOpenContact }) {
  const [pestanaActiva, setPestanaActiva] = useState('matriz'); // 'matriz' | 'n8n'

  // =========================================================================
  // 1. GENERADOR DE MATRIZ CON PARSER DE ESTRUCTURA PROPIA (3 ARCHIVOS)
  // =========================================================================
  const [pasoMP, setPasoMP] = useState(1);
  const [alertaSeguridad, setAlertaSeguridad] = useState(false);
  const [modalCotizador, setModalCotizador] = useState(false);
  const [cotizacionEnviada, setCotizacionEnviada] = useState(false);
  const [procesandoPaso, setProcesandoPaso] = useState(false);

  // ARCHIVO 1: REQUERIMIENTOS
  const [modoEntradaReq, setModoEntradaReq] = useState('ejemplos');
  const [archivoReqNombre, setArchivoReqNombre] = useState(null);
  const [archivoReqTipo, setArchivoReqTipo] = useState(null);
  const [vistaPreviaReqImg, setVistaPreviaReqImg] = useState(null);
  const [textoLibreReq, setTextoLibreReq] = useState('');

  const [requerimiento, setRequerimiento] = useState({
    idHU: 'HU-SPEI-104',
    titulo: 'Módulo de Transferencias Interbancarias SPEI en Tiempo Real',
    descripcion: 'Como cuentahabiente, deseo transferir fondos a cuentas CLABE de otros bancos para realizar pagos inmediatos de forma segura.',
    origen: 'Especificación Core Bancario / FinTech',
    criterios: [
      'La cuenta CLABE debe contener exactamente 18 dígitos numéricos válidos.',
      'El monto a transferir debe ser mayor a $0.00 y menor o igual al saldo disponible.',
      'Toda transacción aprobada debe generar un folio de rastreo CEP único.',
      'Si el servicio bancario tarda más de 10 segundos, aplicar rollback automático de fondos.'
    ]
  });

  // ARCHIVO 2: PLANTILLA / ESTRUCTURA DE MATRIZ DEL USUARIO
  const [modoEntradaFormato, setModoEntradaFormato] = useState('subir'); // 'subir' | 'texto' | 'predefinido'
  const [archivoFormatoNombre, setArchivoFormatoNombre] = useState(null);
  const [vistaPreviaFormatoImg, setVistaPreviaFormatoImg] = useState(null);
  const [analizandoEstructura, setAnalizandoEstructura] = useState(false);
  const [textoEstructuraUsuario, setTextoEstructuraUsuario] = useState('');

  // Columnas detectadas/analizadas de la plantilla del usuario
  const [columnasPersonalizadas, setColumnasPersonalizadas] = useState([
    'ID Caso',
    'Historia / Requerimiento',
    'Escenario de Prueba',
    'Tipo de Prueba',
    'Precondiciones',
    'Pasos de Ejecución',
    'Datos de Prueba (Input)',
    'Resultado Esperado',
    'Severidad',
    'Estado'
  ]);

  const [nuevaColumna, setNuevaColumna] = useState('');

  // Manejo de carga de Archivo 1 (Requerimientos)
  const manejarSubidaReq = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoReqNombre(file.name);
      setArchivoReqTipo(file.type);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setVistaPreviaReqImg(ev.target.result);
        reader.readAsDataURL(file);
      } else {
        setVistaPreviaReqImg(null);
      }

      setRequerimiento({
        idHU: 'DOC-' + file.name.slice(0, 8).toUpperCase(),
        titulo: 'Requerimiento Extraído: ' + file.name,
        descripcion: 'Especificación técnica cargada desde ' + file.name + ' (' + (file.size / 1024).toFixed(1) + ' KB). Se analizaron reglas de validación, flujos transaccionales y casos de excepción.',
        origen: 'Archivo de entrada (' + file.name + ')',
        criterios: [
          'Validación de campos obligatorios y reglas de entrada.',
          'Flujos alternos, límites de frontera y códigos de error.',
          'Idempotencia, concurrencia y consistencia en base de datos.',
          'Criterios de aceptación UAT para certificación a producción.'
        ]
      });
    }
  };

  // Manejo de carga de Archivo 2 (Plantilla / Estructura del Usuario)
  const manejarSubidaFormato = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoFormatoNombre(file.name);
      setAnalizandoEstructura(true);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setVistaPreviaFormatoImg(ev.target.result);
        reader.readAsDataURL(file);
      } else {
        setVistaPreviaFormatoImg(null);
      }

      // Simulación de análisis OCR y parsing de estructura
      setTimeout(() => {
        setAnalizandoEstructura(false);
        if (file.name.toLowerCase().includes('jira') || file.name.toLowerCase().includes('xray')) {
          setColumnasPersonalizadas([
            'Test Issue Key',
            'Summary',
            'Test Type',
            'Preconditions',
            'Action / Steps',
            'Test Data',
            'Expected Result',
            'Priority',
            'Execution Status'
          ]);
        } else if (file.name.toLowerCase().includes('banco') || file.name.toLowerCase().includes('finan')) {
          setColumnasPersonalizadas([
            'ID Caso',
            'Módulo Core',
            'Escenario de Negocio',
            'Precondición Bancaria',
            'Pasos de Transacción',
            'Datos (CLABE / Monto)',
            'Resultado Esperado CEP',
            'Severidad Crítica',
            'Veredicto'
          ]);
        } else {
          setColumnasPersonalizadas([
            'ID_Caso',
            'Requerimiento_Asociado',
            'Descripcion_Escenario',
            'Tipo_Validacion',
            'Precondiciones',
            'Pasos_Detallados',
            'Valores_Entrada',
            'Comportamiento_Esperado',
            'Impacto',
            'Estado'
          ]);
        }
      }, 700);
    }
  };

  const procesarTextoEstructura = () => {
    if (!textoEstructuraUsuario.trim()) return;
    const cols = textoEstructuraUsuario
      .split(/[,\n|\t]/)
      .map(c => c.trim())
      .filter(c => c.length > 1);

    if (cols.length > 0) {
      setColumnasPersonalizadas(cols);
    }
  };

  const agregarColumnaManual = () => {
    if (nuevaColumna.trim() && !columnasPersonalizadas.includes(nuevaColumna.trim())) {
      setColumnasPersonalizadas([...columnasPersonalizadas, nuevaColumna.trim()]);
      setNuevaColumna('');
    }
  };

  const eliminarColumna = (colName) => {
    if (columnasPersonalizadas.length > 3) {
      setColumnasPersonalizadas(columnasPersonalizadas.filter(c => c !== colName));
    }
  };

  // ARCHIVO 3: Generación dinámica adaptada a las columnas detectadas
  const [casoDetalle, setCasoDetalle] = useState(null);

  const matrizCasosDinamicos = [
    {
      id: 'TC-CORE-01',
      tipo: 'Funcional (Happy Path)',
      categoriaMetrica: 'HP',
      valores: {
        'ID Caso': 'TC-CORE-01',
        'ID_Caso': 'TC-CORE-01',
        'Test Issue Key': 'TC-CORE-01',
        'Historia / Requerimiento': requerimiento.idHU,
        'Requerimiento_Asociado': requerimiento.idHU,
        'Módulo Core': 'SPEI / Transacciones',
        'Summary': 'Ejecución exitosa de flujo principal con datos válidos',
        'Escenario de Prueba': 'Ejecución exitosa de flujo principal con datos válidos',
        'Descripcion_Escenario': 'Ejecución exitosa de flujo principal con datos válidos',
        'Escenario de Negocio': 'Transferencia interbancaria exitosa en tiempo real',
        'Tipo de Prueba': 'Funcional (Happy Path)',
        'Tipo_Validacion': 'Happy Path (Positivo)',
        'Test Type': 'Manual / Automated',
        'Precondiciones': 'Sesión activa con saldo disponible mayor al monto a transferir',
        'Precondición Bancaria': 'Cuenta origen con saldo líquido suficiente y CLABE destino activa',
        'Preconditions': 'User logged in with active account and positive balance',
        'Pasos de Ejecución': '1. Acceder al módulo.\n2. Capturar CLABE de 18 dígitos y monto válido.\n3. Presionar botón Transferir.',
        'Pasos_Detallados': '1. Ingresar al formulario.\n2. Llenar campos obligatorios válidos.\n3. Confirmar transacción.',
        'Pasos de Transacción': '1. Seleccionar cuenta retiro.\n2. Ingresar CLABE 18 dígitos.\n3. Autorizar con Token.',
        'Action / Steps': '1. Navigate to module.\n2. Enter valid 18-digit CLABE.\n3. Click Submit.',
        'Datos de Prueba (Input)': 'CLABE: 012180015678901234, Monto: $1,500.00 MXN',
        'Valores_Entrada': 'CLABE: 012180015678901234, Monto: $1,500.00 MXN',
        'Datos (CLABE / Monto)': 'CLABE: 012180015678901234 | Monto: $1,500.00',
        'Test Data': 'CLABE: 012180015678901234, Amount: 1500.00',
        'Resultado Esperado': 'Transacción procesada con éxito, generación de folio CEP y débito inmediato',
        'Comportamiento_Esperado': 'Respuesta HTTP 200 OK y actualización de balance en tiempo real',
        'Resultado Esperado CEP': 'Folio de rastreo CEP generado y dispersión SPEI en < 5 seg',
        'Expected Result': 'Transaction processed with HTTP 200 and receipt ID generated',
        'Severidad': 'Crítica',
        'Impacto': 'Alto',
        'Severidad Crítica': 'Crítica (Bloqueante)',
        'Priority': 'Highest',
        'Estado': 'Listo para Ejecución',
        'Veredicto': 'Aprobado (Pass)',
        'Execution Status': 'Ready for Test'
      }
    },
    {
      id: 'TC-CORE-02',
      tipo: 'Frontera / Negativo (TTF)',
      categoriaMetrica: 'TTF',
      valores: {
        'ID Caso': 'TC-CORE-02',
        'ID_Caso': 'TC-CORE-02',
        'Test Issue Key': 'TC-CORE-02',
        'Historia / Requerimiento': requerimiento.idHU,
        'Requerimiento_Asociado': requerimiento.idHU,
        'Módulo Core': 'SPEI / Validación CLABE',
        'Summary': 'Validación de longitud menor a 18 dígitos en CLABE destino',
        'Escenario de Prueba': 'Validación de longitud menor a 18 dígitos en CLABE destino',
        'Descripcion_Escenario': 'Intento de transferencia con CLABE incompleta (16 dígitos)',
        'Escenario de Negocio': 'Rechazo de formato inválido en cuenta receptora',
        'Tipo de Prueba': 'Validación de Frontera (TTF)',
        'Tipo_Validacion': 'Negativa / Frontera',
        'Test Type': 'Functional Negative',
        'Precondiciones': 'Formulario de transferencias abierto en pantalla',
        'Precondición Bancaria': 'Módulo de transferencias activo',
        'Preconditions': 'Transfer view displayed',
        'Pasos de Ejecución': '1. Ingresar CLABE de 16 dígitos.\n2. Intentar continuar con el envío.',
        'Pasos_Detallados': '1. Ingresar cadena corta.\n2. Presionar Enviar.',
        'Pasos de Transacción': '1. Capturar CLABE truncada.\n2. Presionar Validar.',
        'Action / Steps': '1. Type 16 digits CLABE.\n2. Trigger transfer button.',
        'Datos de Prueba (Input)': 'CLABE: 01218001567890 (16 dígitos)',
        'Valores_Entrada': 'CLABE: 01218001567890 (16 dígitos)',
        'Datos (CLABE / Monto)': 'CLABE incompleta (16 dígitos)',
        'Test Data': 'CLABE: 01218001567890',
        'Resultado Esperado': 'Bloqueo en interfaz: "La CLABE debe contener exactamente 18 dígitos"',
        'Comportamiento_Esperado': 'Validación de schema en cliente impidiendo el disparo HTTP',
        'Resultado Esperado CEP': 'Alerta en rojo: Formato de cuenta inválido',
        'Expected Result': 'Field validation error displayed and submission blocked',
        'Severidad': 'Crítica',
        'Impacto': 'Alto',
        'Severidad Crítica': 'Alta',
        'Priority': 'High',
        'Estado': 'Listo para Ejecución',
        'Veredicto': 'Listo',
        'Execution Status': 'Ready for Test'
      }
    },
    {
      id: 'TC-CORE-03',
      tipo: 'Regla de Negocio (TTF)',
      categoriaMetrica: 'TTF',
      valores: {
        'ID Caso': 'TC-CORE-03',
        'ID_Caso': 'TC-CORE-03',
        'Test Issue Key': 'TC-CORE-03',
        'Historia / Requerimiento': requerimiento.idHU,
        'Requerimiento_Asociado': requerimiento.idHU,
        'Módulo Core': 'SPEI / Saldo y Fondos',
        'Summary': 'Intento de transferencia por monto superior al saldo disponible',
        'Escenario de Prueba': 'Intento de transferencia por monto superior al saldo disponible',
        'Descripcion_Escenario': 'Validación de fondos insuficientes en cuenta de origen',
        'Escenario de Negocio': 'Control de sobregiro no autorizado',
        'Tipo de Prueba': 'Regla de Negocio (Negativo)',
        'Tipo_Validacion': 'Negativa (Fondos)',
        'Test Type': 'Business Rule Validation',
        'Precondiciones': 'Cuenta con saldo de $500.00 MXN',
        'Precondición Bancaria': 'Saldo disponible = $500.00 MXN',
        'Preconditions': 'Account balance is $500.00',
        'Pasos de Ejecución': '1. Capturar monto de $1,000.00 MXN.\n2. Intentar confirmar envío.',
        'Pasos_Detallados': '1. Capturar monto excedente.\n2. Presionar Transferir.',
        'Pasos de Transacción': '1. Solicitar transferencia > saldo.\n2. Autorizar.',
        'Action / Steps': '1. Enter $1,000.00.\n2. Submit transfer.',
        'Datos de Prueba (Input)': 'Saldo: $500.00, Monto solicitado: $1,000.00',
        'Valores_Entrada': 'Saldo: $500.00, Monto: $1,000.00',
        'Datos (CLABE / Monto)': 'Monto = $1,000.00 vs Saldo = $500.00',
        'Test Data': 'Balance: $500, Amount: $1000',
        'Resultado Esperado': 'Mensaje de error: "Saldo insuficiente para completar la operación"',
        'Comportamiento_Esperado': 'Rechazo inmediato sin afectar saldo en base de datos',
        'Resultado Esperado CEP': 'Error 422: Fondos no disponibles',
        'Expected Result': 'Rejection: Insufficient funds error message displayed',
        'Severidad': 'Crítica',
        'Impacto': 'Alto',
        'Severidad Crítica': 'Crítica',
        'Priority': 'High',
        'Estado': 'Listo para Ejecución',
        'Veredicto': 'Listo',
        'Execution Status': 'Ready for Test'
      }
    },
    {
      id: 'TC-CORE-04',
      tipo: 'Smoke Test / Disponibilidad',
      categoriaMetrica: 'Smoke',
      valores: {
        'ID Caso': 'TC-CORE-04',
        'ID_Caso': 'TC-CORE-04',
        'Test Issue Key': 'TC-CORE-04',
        'Historia / Requerimiento': requerimiento.idHU,
        'Requerimiento_Asociado': requerimiento.idHU,
        'Módulo Core': 'SPEI / Interfaz UI',
        'Summary': 'Smoke Test de renderizado de componentes y conexión a catálogo bancario',
        'Escenario de Prueba': 'Smoke Test de renderizado de componentes y conexión a catálogo bancario',
        'Descripcion_Escenario': 'Verificación de carga inicial de vista y catálogo de bancos',
        'Escenario de Negocio': 'Disponibilidad del módulo transaccional',
        'Tipo de Prueba': 'Smoke / Sanity Test',
        'Tipo_Validacion': 'Sanity UI',
        'Test Type': 'Smoke Test',
        'Precondiciones': 'Navegador con conectividad a red',
        'Precondición Bancaria': 'Servicio de catálogo de bancos en línea',
        'Preconditions': 'System online',
        'Pasos de Ejecución': '1. Cargar ruta del módulo.\n2. Validar despliegue de campos e inputs.',
        'Pasos_Detallados': '1. Abrir pantalla.\n2. Inspeccionar elementos.',
        'Pasos de Transacción': '1. Abrir vista de pagos.\n2. Verificar lista de instituciones.',
        'Action / Steps': '1. Load transfer page.\n2. Check all UI components.',
        'Datos de Prueba (Input)': 'Navegador Web / Mobile Safari',
        'Valores_Entrada': 'Render inicial',
        'Datos (CLABE / Monto)': 'Carga general de vista',
        'Test Data': 'UI elements',
        'Resultado Esperado': 'Pantalla renderizada en < 2 segundos sin errores de consola',
        'Comportamiento_Esperado': 'Componentes reactivos e inputs habilitados',
        'Resultado Esperado CEP': 'Catálogo de bancos sincronizado al 100%',
        'Expected Result': 'Page rendered in < 2 seconds without JS errors',
        'Severidad': 'Alta',
        'Impacto': 'Medio',
        'Severidad Crítica': 'Alta',
        'Priority': 'Medium',
        'Estado': 'Listo para Ejecución',
        'Veredicto': 'Listo',
        'Execution Status': 'Ready for Test'
      }
    },
    {
      id: 'TC-CORE-05',
      tipo: 'Resiliencia / Timeout API',
      categoriaMetrica: 'Otros',
      valores: {
        'ID Caso': 'TC-CORE-05',
        'ID_Caso': 'TC-CORE-05',
        'Test Issue Key': 'TC-CORE-05',
        'Historia / Requerimiento': requerimiento.idHU,
        'Requerimiento_Asociado': requerimiento.idHU,
        'Módulo Core': 'SPEI / Conectividad Core',
        'Summary': 'Rollback automático de fondos ante timeout del servicio bancario (>10s)',
        'Escenario de Prueba': 'Rollback automático de fondos ante timeout del servicio bancario (>10s)',
        'Descripcion_Escenario': 'Manejo de desconexión con el switch SPEI',
        'Escenario de Negocio': 'Consistencia contable en fallos de red',
        'Tipo de Prueba': 'Resiliencia / Rollback',
        'Tipo_Validacion': 'Resiliencia / Red',
        'Test Type': 'API Resilience',
        'Precondiciones': 'Simulación de timeout en endpoint de dispersión',
        'Precondición Bancaria': 'Conexión con switch demorada > 10,000ms',
        'Preconditions': 'Simulated network timeout > 10s',
        'Pasos de Ejecución': '1. Disparar transferencia.\n2. Forzar latencia de 12 segundos en backend.',
        'Pasos_Detallados': '1. Iniciar pago.\n2. Interrumpir respuesta.',
        'Pasos de Transacción': '1. Enviar dispersión.\n2. Registrar evento de timeout.',
        'Action / Steps': '1. Execute transfer.\n2. Delay backend response > 10s.',
        'Datos de Prueba (Input)': 'Monto: $2,000.00, Latencia simulada: 12000ms',
        'Valores_Entrada': 'Timeout: 12000ms',
        'Datos (CLABE / Monto)': 'Transacción con retardo de red',
        'Test Data': 'Delay: 12000ms',
        'Resultado Esperado': 'Rollback automático de saldo y mensaje: "Operación no completada, tu saldo no fue afectado"',
        'Comportamiento_Esperado': 'Rollback ACID en BD y log de auditoría registrado',
        'Resultado Esperado CEP': 'Saldo intacto y reverso contable aplicado',
        'Expected Result': 'Automatic rollback applied and safe user alert shown',
        'Severidad': 'Crítica',
        'Impacto': 'Alto',
        'Severidad Crítica': 'Crítica',
        'Priority': 'Highest',
        'Estado': 'Listo para Ejecución',
        'Veredicto': 'Listo',
        'Execution Status': 'Ready for Test'
      }
    },
    {
      id: 'TC-CORE-06',
      tipo: 'Concurrencia / Idempotencia',
      categoriaMetrica: 'TTF',
      valores: {
        'ID Caso': 'TC-CORE-06',
        'ID_Caso': 'TC-CORE-06',
        'Test Issue Key': 'TC-CORE-06',
        'Historia / Requerimiento': requerimiento.idHU,
        'Requerimiento_Asociado': requerimiento.idHU,
        'Módulo Core': 'SPEI / Idempotencia',
        'Summary': 'Prevención de transferencias duplicadas por doble clic rápido',
        'Escenario de Prueba': 'Prevención de transferencias duplicadas por doble clic rápido',
        'Descripcion_Escenario': 'Validación de token de idempotencia en peticiones continuas',
        'Escenario de Negocio': 'Blindaje antifraude y no duplicidad',
        'Tipo de Prueba': 'Concurrencia (TTF)',
        'Tipo_Validacion': 'Concurrencia',
        'Test Type': 'Idempotency Test',
        'Precondiciones': 'Formulario con datos válidos listo para confirmar',
        'Precondición Bancaria': 'Header Idempotency-Key activo en la petición',
        'Preconditions': 'Valid form ready to submit',
        'Pasos de Ejecución': '1. Presionar dos veces consecutivas el botón Transferir en < 200ms.',
        'Pasos_Detallados': '1. Doble clic rápido sobre Enviar.',
        'Pasos de Transacción': '1. Disparo concurrente de confirmación.',
        'Action / Steps': '1. Double click confirm button in < 200ms.',
        'Datos de Prueba (Input)': 'Peticiones simultáneas con el mismo Correlation-ID',
        'Valores_Entrada': 'Doble submit rápido',
        'Datos (CLABE / Monto)': 'Doble petición en milisegundos',
        'Test Data': 'Rapid consecutive clicks',
        'Resultado Esperado': 'El sistema procesa 1 sola transferencia y desactiva el botón tras el primer clic',
        'Comportamiento_Esperado': 'Bloqueo de request duplicada y respuesta 409 o 200 idempotente',
        'Resultado Esperado CEP': '1 solo folio CEP emitido',
        'Expected Result': 'Single transaction processed, duplicate request ignored',
        'Severidad': 'Crítica',
        'Impacto': 'Alto',
        'Severidad Crítica': 'Crítica',
        'Priority': 'Highest',
        'Estado': 'Bloqueado (Solicitar Completa)',
        'Veredicto': 'Protegido',
        'Execution Status': 'Protected'
      }
    },
    {
      id: 'TC-CORE-07',
      tipo: 'Seguridad / Inyección XSS & SQL',
      categoriaMetrica: 'Otros',
      valores: {
        'ID Caso': 'TC-CORE-07',
        'ID_Caso': 'TC-CORE-07',
        'Test Issue Key': 'TC-CORE-07',
        'Historia / Requerimiento': requerimiento.idHU,
        'Requerimiento_Asociado': requerimiento.idHU,
        'Módulo Core': 'SPEI / Seguridad',
        'Summary': 'Sanitización de campos de texto y concepto frente a inyecciones de código',
        'Escenario de Prueba': 'Sanitización de campos de texto y concepto frente a inyecciones de código',
        'Descripcion_Escenario': 'Inyección de scripts en el campo "Concepto / Referencia"',
        'Escenario de Negocio': 'Seguridad en pasarelas de pago',
        'Tipo de Prueba': 'Seguridad / Sanitización',
        'Tipo_Validacion': 'Seguridad (XSS/SQLi)',
        'Test Type': 'Security Penetration',
        'Precondiciones': 'Campo de concepto de pago habilitado',
        'Precondición Bancaria': 'Filtro WAF y sanitizador en backend activos',
        'Preconditions': 'Reference field active',
        'Pasos de Ejecución': '1. Ingresar payload malicioso en concepto.\n2. Enviar transferencia.',
        'Pasos_Detallados': '1. Capturar script en concepto.\n2. Confirmar envío.',
        'Pasos de Transacción': '1. Inyectar cadenas especiales.\n2. Procesar.',
        'Action / Steps': '1. Enter malicious script in reference field.\n2. Submit transfer.',
        'Datos de Prueba (Input)': "Concepto: <script>alert('XSS')</script> / ' OR 1=1 --",
        'Valores_Entrada': "<script>alert('XSS')</script>",
        'Datos (CLABE / Monto)': 'Payload de prueba de seguridad',
        'Test Data': "<script>alert('XSS')</script>",
        'Resultado Esperado': 'El texto se escapa y sanitiza sin ejecutarse scripts ni alterar la BD',
        'Comportamiento_Esperado': 'Texto plano almacenado sin ejecución en front ni en back',
        'Resultado Esperado CEP': 'Sanitización estricta en comprobante',
        'Expected Result': 'Input safely sanitized and rendered as plain text',
        'Severidad': 'Crítica',
        'Impacto': 'Alto',
        'Severidad Crítica': 'Crítica',
        'Priority': 'Highest',
        'Estado': 'Bloqueado (Solicitar Completa)',
        'Veredicto': 'Protegido',
        'Execution Status': 'Protected'
      }
    },
    {
      id: 'TC-CORE-08',
      tipo: 'Persistencia & SQL Integrity',
      categoriaMetrica: 'HP',
      valores: {
        'ID Caso': 'TC-CORE-08',
        'ID_Caso': 'TC-CORE-08',
        'Test Issue Key': 'TC-CORE-08',
        'Historia / Requerimiento': requerimiento.idHU,
        'Requerimiento_Asociado': requerimiento.idHU,
        'Módulo Core': 'SPEI / Base de Datos',
        'Summary': 'Verificación de persistencia, integridad referencial y auditoría en tablas SQL',
        'Escenario de Prueba': 'Verificación de persistencia, integridad referencial y auditoría en tablas SQL',
        'Descripcion_Escenario': 'Auditoría en base de datos tras transacción exitosa',
        'Escenario de Negocio': 'Trazabilidad y cumplimiento regulatorio',
        'Tipo de Prueba': 'Integridad de Datos (SQL)',
        'Tipo_Validacion': 'Auditoría SQL',
        'Test Type': 'Database Verification',
        'Precondiciones': 'Transacción completada en el sistema',
        'Precondición Bancaria': 'Acceso de lectura a tablas de transacciones y logs',
        'Preconditions': 'Transaction completed in core system',
        'Pasos de Ejecución': '1. Ejecutar consulta SQL en tabla `spei_transfers` y `audit_logs`.\n2. Validar timestamps y estados.',
        'Pasos_Detallados': '1. Consultar SELECT * por ID de transacción.\n2. Comprobar llaves foráneas.',
        'Pasos de Transacción': '1. Consultar movimientos en BD.\n2. Validar saldo final.',
        'Action / Steps': '1. Query SQL tables spei_transfers and audit_logs.\n2. Verify integrity.',
        'Datos de Prueba (Input)': 'SELECT * FROM spei_transfers WHERE tracking_key = CEP_FOLIO',
        'Valores_Entrada': 'Query SQL por tracking_key',
        'Datos (CLABE / Monto)': 'Validación directa en base de datos',
        'Test Data': 'SQL query validation',
        'Resultado Esperado': 'Registro creado con estado "COMPLETED", montos exactos y clave CEP persistida',
        'Comportamiento_Esperado': 'Integridad referencial y congruencia contable al 100%',
        'Resultado Esperado CEP': 'Registro contable inmutable generado',
        'Expected Result': 'Record persisted with status COMPLETED and valid timestamps',
        'Severidad': 'Alta',
        'Impacto': 'Alto',
        'Severidad Crítica': 'Alta',
        'Priority': 'High',
        'Estado': 'Bloqueado (Solicitar Completa)',
        'Veredicto': 'Protegido',
        'Execution Status': 'Protected'
      }
    }
  ];

  const totalCasos = matrizCasosDinamicos.length;
  const totalHP = matrizCasosDinamicos.filter(c => c.categoriaMetrica === 'HP').length;
  const totalTTF = matrizCasosDinamicos.filter(c => c.categoriaMetrica === 'TTF').length;
  const totalSmoke = matrizCasosDinamicos.filter(c => c.categoriaMetrica === 'Smoke').length;
  const totalOtros = matrizCasosDinamicos.filter(c => c.categoriaMetrica === 'Otros').length;

  const [datosCotizacion, setDatosCotizacion] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    tamanoModulo: 'mediano',
    requiereAutomatizacion: 'si',
    tiempoEntrega: 'estandar'
  });

  const descargarMuestraCSVPersonalizada = () => {
    const casosMuestra = matrizCasosDinamicos.slice(0, 5);
    let csv = columnasPersonalizadas.map(c => '"' + c.replace(/"/g, '""') + '"').join(',') + '\n';
    
    casosMuestra.forEach((caso) => {
      const fila = columnasPersonalizadas.map((col) => {
        let val = caso.valores[col] || caso.valores[col.trim()] || caso[col] || caso.id || 'N/A';
        if (typeof val === 'string') {
          val = val.replace(/^[=+\-@]/, "'").replace(/"/g, '""').replace(/\n/g, ' ');
        }
        return '"' + val + '"';
      });
      csv += fila.join(',') + '\n';
    });

    csv += '\n"--- NOTA DE ESTRUCTURA PERSONALIZADA ---","Muestra de 5 casos adaptada a tus columnas [' + columnasPersonalizadas.join(' | ') + ']. Para la Matriz Completa (' + totalCasos + ' casos) contacta a Martin Hernandez Garfias (hegmtona2024@gmail.com / +52 56 1562 5182)."\n';

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Muestra_Matriz_Formato_Personalizado_' + requerimiento.idHU + '.csv');
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

    const texto = 'Hola Martin, deseo cotizar una *Matriz de Pruebas con mi Formato Personalizado*:\n' +
      '📌 *Requerimiento:* ' + requerimiento.titulo + ' (' + requerimiento.idHU + ')\n' +
      '📊 *Columnas Solicitadas:* ' + columnasPersonalizadas.join(', ') + '\n' +
      '👤 *Nombre:* ' + (datosCotizacion.nombre || 'Interesado') + '\n' +
      '🏢 *Empresa:* ' + (datosCotizacion.empresa || 'N/A') + '\n' +
      '✉️ *Correo:* ' + datosCotizacion.email + '\n' +
      '📱 *Tel:* ' + (datosCotizacion.telefono || 'N/A') + '\n' +
      '📦 *Módulo:* ' + datosCotizacion.tamanoModulo.toUpperCase() + '\n' +
      '⚡ *Automatización:* ' + datosCotizacion.requiereAutomatizacion + '\n' +
      '⏱️ *Entrega:* ' + datosCotizacion.tiempoEntrega + '\n' +
      '💰 *Estimado Cotizado:* ' + calcularEstimacion();

    const url = 'https://api.whatsapp.com/send?phone=525615625182&text=' + encodeURIComponent(texto);
    window.open(url, '_blank');
  };

  const mostrarAvisoSeguridad = () => {
    setAlertaSeguridad(true);
    setTimeout(() => setAlertaSeguridad(false), 3000);
  };

  return (
    <section id="automatizaciones" className="max-w-6xl mx-auto px-4 py-16 w-full scroll-mt-24">
      
      {/* Alerta de Seguridad */}
      {alertaSeguridad && (
        <div className="fixed top-6 right-6 z-50 bg-rose-950/95 border border-rose-500 text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3">
          <span className="text-xl">🛡️</span>
          <div>
            <p className="text-xs font-bold">Vista Protegida</p>
            <p className="text-[11px] text-rose-200">Para obtener todos los casos completos utiliza el Auto-Cotizador.</p>
          </div>
        </div>
      )}

      {/* Modal Auto-Cotizador */}
      {modalCotizador && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
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
                Cotizar Matriz Completa & Scripts E2E
              </h3>
              <p className="text-xs text-slate-400">
                Adaptada a tus columnas: <strong className="text-white">{columnasPersonalizadas.slice(0, 4).join(', ')}...</strong>
              </p>
            </div>

            {cotizacionEnviada ? (
              <div className="bg-emerald-950/80 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mx-auto">
                  ✓
                </div>
                <h4 className="text-base font-bold text-white">¡Solicitud Despachada con Éxito!</h4>
                <p className="text-xs text-slate-300">
                  Nos pondremos en contacto contigo para entregarte la matriz completa ({totalCasos} casos) en tu plantilla y con los scripts de automatización listos.
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

      {/* Selector de Pestañas Principales */}
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
            <span>1. Generador de Matriz QA (Extractor de Tu Estructura)</span>
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
        
        {/* ========================================================================= */}
        {/* PESTAÑA MATRIZ QA CON INGESTIÓN DE ESTRUCTURA DEL USUARIO */}
        {/* ========================================================================= */}
        {pestanaActiva === 'matriz' && (
          <div className="space-y-6">
            
            {/* Flujo de 3 Pasos */}
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
                  <span className="text-xs font-bold">Archivo 2: Tu Estructura / Plantilla</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Sube tu formato (imagen, Excel o texto)</p>
              </button>

              <button
                onClick={() => setPasoMP(3)}
                className={'p-3 rounded-2xl border text-left transition cursor-pointer ' + (
                  pasoMP === 3 ? 'bg-purple-950 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono text-xs font-bold">3</span>
                  <span className="text-xs font-bold">Archivo 3: Matriz Adaptada & CSV</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Generada con tus columnas exactas</p>
              </button>
            </div>

            {/* FASE 1: REQUERIMIENTOS (Doc, Imagen, Texto o Ejemplo) */}
            {pasoMP === 1 && (
              <div className="space-y-5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      Archivo 1: Ingreso de Requerimiento (Doc / Imagen / Texto)
                    </span>
                    <p className="text-[11px] text-slate-400">Provee la especificación de lo que deseas probar.</p>
                  </div>

                  <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-xl">
                    <button
                      onClick={() => setModoEntradaReq('ejemplos')}
                      className={'px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ' + (
                        modoEntradaReq === 'ejemplos' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      )}
                    >
                      ⚡ Plantilla Ejemplo
                    </button>
                    <button
                      onClick={() => setModoEntradaReq('subir')}
                      className={'px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ' + (
                        modoEntradaReq === 'subir' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      )}
                    >
                      📁 Subir Archivo / Imagen
                    </button>
                    <button
                      onClick={() => setModoEntradaReq('escribir')}
                      className={'px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ' + (
                        modoEntradaReq === 'escribir' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      )}
                    >
                      ✍️ Escribir Requerimiento
                    </button>
                  </div>
                </div>

                {modoEntradaReq === 'ejemplos' && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <label className="block text-slate-300 font-bold mb-1">Caso de Uso Bancario / FinTech Preconfigurado:</label>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-emerald-300 font-semibold">
                      🏦 Módulo SPEI / Transferencias Bancarias en Tiempo Real (FinTech & Banca)
                    </div>
                  </div>
                )}

                {modoEntradaReq === 'subir' && (
                  <div className="bg-slate-950 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center space-y-3 transition">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl mx-auto">
                      📄
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {archivoReqNombre ? ('Archivo Cargado: ' + archivoReqNombre) : 'Arrastra o selecciona el archivo del requerimiento'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Acepta: Capturas de pantalla (.png, .jpg), Documentos (.pdf, .docx), Hojas de cálculo (.xlsx) o Texto (.txt)
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
                )}

                {modoEntradaReq === 'escribir' && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <label className="block text-slate-300 font-bold mb-1">
                      Describe las reglas y funcionalidades del módulo a probar:
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Ejemplo: Necesito probar un módulo de login bancario con autenticación biométrica y OTP SMS..."
                      value={textoLibreReq}
                      onChange={(e) => setTextoLibreReq(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-emerald-500 focus:outline-none resize-none leading-relaxed"
                    ></textarea>
                  </div>
                )}

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
                    onClick={() => {
                      if (modoEntradaReq === 'escribir' && textoLibreReq.trim()) {
                        setRequerimiento({
                          idHU: 'REQ-PERSONALIZADO',
                          titulo: 'Requerimiento Funcional Redactado',
                          descripcion: textoLibreReq,
                          origen: 'Descripción técnica provista por el usuario',
                          criterios: ['Happy path', 'Frontera/TTF', 'Smoke', 'Seguridad']
                        });
                      }
                      setPasoMP(2);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2"
                  >
                    <span>Siguiente: Analizar Mi Formato de Casos (Archivo 2)</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>
            )}

            {/* FASE 2: ANALIZADOR DE LA ESTRUCTURA / PLANTILLA DEL USUARIO */}
            {pasoMP === 2 && (
              <div className="space-y-5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                      Archivo 2: Subir Formato de Matriz del Usuario (Imagen, Excel, Doc o Texto)
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Sube tu plantilla habitual y el motor extraerá automáticamente las columnas para estructurar la matriz como tú la usas.
                    </p>
                  </div>

                  <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-xl">
                    <button
                      onClick={() => setModoEntradaFormato('subir')}
                      className={'px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ' + (
                        modoEntradaFormato === 'subir' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                      )}
                    >
                      📷 Subir Imagen / Archivo Plantilla
                    </button>
                    <button
                      onClick={() => setModoEntradaFormato('texto')}
                      className={'px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ' + (
                        modoEntradaFormato === 'texto' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                      )}
                    >
                      ✍️ Pegar Columnas / Formato
                    </button>
                  </div>
                </div>

                {modoEntradaFormato === 'subir' && (
                  <div className="bg-slate-950 border-2 border-dashed border-cyan-700/60 hover:border-cyan-400 rounded-2xl p-6 text-center space-y-3 transition">
                    <div className="h-12 w-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl mx-auto">
                      📊
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {archivoFormatoNombre ? ('Plantilla Analizada: ' + archivoFormatoNombre) : 'Arrastra una captura de tu Excel, documento o archivo de matriz'}
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

                    {analizandoEstructura && (
                      <p className="text-cyan-400 font-bold animate-pulse text-[11px] mt-2">
                        ⚙️ Analizando estructura de columnas y mapeando campos...
                      </p>
                    )}
                  </div>
                )}

                {modoEntradaFormato === 'texto' && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <label className="block text-slate-300 font-bold mb-1">
                      Pega los nombres de tus columnas separadas por comas, saltos de línea o tabulaciones:
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Ejemplo: ID Caso, Historia, Escenario, Precondiciones, Pasos, Test Data, Resultado Esperado, Severidad, Estado"
                      value={textoEstructuraUsuario}
                      onChange={(e) => setTextoEstructuraUsuario(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-cyan-500 focus:outline-none resize-none"
                    ></textarea>
                    <button
                      onClick={procesarTextoEstructura}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      Aplicar Columnas
                    </button>
                  </div>
                )}

                {/* VISUALIZADOR Y EDITOR DE LAS COLUMNAS EXTRAÍDAS */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-xs flex items-center gap-2">
                      <span>📐</span>
                      <span>Estructura de Columnas Detectada para tus Casos ({columnasPersonalizadas.length} Columnas)</span>
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">100% Personalizada</span>
                  </div>

                  {/* Chips de Columnas con opción de eliminar */}
                  <div className="flex flex-wrap gap-2">
                    {columnasPersonalizadas.map((col, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-900 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-2 font-medium"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                        <span>{col}</span>
                        <button
                          onClick={() => eliminarColumna(col)}
                          className="text-slate-500 hover:text-rose-400 font-bold ml-1 text-xs cursor-pointer"
                          title="Eliminar columna"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Agregar columna manual */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Agregar otra columna (ej. Postcondiciones, Sprint, Evidencia...)"
                      value={nuevaColumna}
                      onChange={(e) => setNuevaColumna(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') agregarColumnaManual(); }}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                    <button
                      onClick={agregarColumnaManual}
                      className="bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      + Agregar
                    </button>
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
                      setProcesandoPaso(true);
                      setTimeout(() => {
                        setProcesandoPaso(false);
                        setPasoMP(3);
                      }, 400);
                    }}
                    disabled={procesandoPaso}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    <span>{procesandoPaso ? '⚙️ Mapeando Casos a tu Formato...' : '⚡ Generar Matriz en Mi Formato'}</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>
            )}

            {/* FASE 3: MATRIZ GENERADA CON LA ESTRUCTURA DEL USUARIO */}
            {pasoMP === 3 && (
              <div className="space-y-5">
                
                {/* Resumen de Métricas */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📊</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                        Resumen Ejecutivo con tu Estructura de Columnas
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

                {/* Banner de Descarga de Muestra en el Formato del Usuario */}
                <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💼</span>
                    <div>
                      <p className="font-bold text-emerald-300">Descarga Muestra (5 Casos en tu Formato) o Solicita la Matriz Completa</p>
                      <p className="text-[11px] text-slate-300">
                        Estructurado con tus columnas: <strong>{columnasPersonalizadas.slice(0, 3).join(', ')}...</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={descargarMuestraCSVPersonalizada}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>📥</span>
                      <span>Descargar CSV (5 Casos con Mis Columnas)</span>
                    </button>

                    <button
                      onClick={() => setModalCotizador(true)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-950/50 flex items-center gap-1.5"
                    >
                      <span>⚡</span>
                      <span>Auto-Cotizador</span>
                    </button>
                  </div>
                </div>

                {/* TABLA DINÁMICA RENDERIZADA CON LAS COLUMNAS DEL USUARIO */}
                <div 
                  onContextMenu={(e) => { e.preventDefault(); mostrarAvisoSeguridad(); }}
                  onCopy={(e) => { e.preventDefault(); mostrarAvisoSeguridad(); }}
                  className="select-none space-y-4"
                >
                  <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                    <table className="w-full text-left text-xs text-slate-300 border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950 uppercase text-[10px] tracking-wider">
                          {columnasPersonalizadas.slice(0, 6).map((col, idx) => (
                            <th key={idx} className="py-3 px-3 whitespace-nowrap">{col}</th>
                          ))}
                          <th className="py-3 px-2 text-center">Detalle Completo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-sans">
                        {matrizCasosDinamicos.map((caso, index) => (
                          <tr 
                            key={caso.id} 
                            onClick={() => setCasoDetalle(caso)}
                            className={'hover:bg-slate-950/60 transition cursor-pointer ' + (
                              casoDetalle?.id === caso.id ? 'bg-cyan-950/40 border-l-2 border-cyan-400 ' : ''
                            ) + (index >= 5 ? 'opacity-75 ' : '')}
                          >
                            {columnasPersonalizadas.slice(0, 6).map((col, colIdx) => {
                              const valor = caso.valores[col] || caso.valores[col.trim()] || caso[col] || (colIdx === 0 ? caso.id : 'Conforme a especificación');
                              return (
                                <td key={colIdx} className="py-3 px-3 text-[11px] max-w-xs truncate">
                                  {colIdx === 0 ? (
                                    <span className="font-mono font-bold text-cyan-400">{valor}</span>
                                  ) : (
                                    <span>{valor}</span>
                                  )}
                                </td>
                              );
                            })}
                            <td className="py-3 px-2 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCasoDetalle(caso);
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

                  {/* Visor de Detalle Técnico con todas las columnas detectadas */}
                  {casoDetalle && (
                    <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
                      <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800">
                            {casoDetalle.id}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-white">Detalle Técnico Mapeado a tus Columnas</h4>
                            <p className="text-[11px] text-slate-400">
                              Tipo: <strong className="text-emerald-400">{casoDetalle.tipo}</strong>
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setCasoDetalle(null)}
                          className="text-slate-400 hover:text-white text-xs bg-slate-900 p-1.5 rounded-lg border border-slate-800 transition"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {columnasPersonalizadas.map((col, idx) => {
                          const val = casoDetalle.valores[col] || casoDetalle.valores[col.trim()] || casoDetalle[col] || 'Definido según especificación';
                          return (
                            <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                              <span className="font-bold text-cyan-300 block text-[11px]">{col}:</span>
                              <p className="text-slate-300 font-sans text-xs whitespace-pre-line leading-relaxed">{val}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 text-xs">
                  <button
                    onClick={() => setPasoMP(2)}
                    className="text-slate-400 hover:text-white underline underline-offset-4 cursor-pointer"
                  >
                    ← Modificar Formato de Columnas o Archivo 2
                  </button>

                  <span className="text-[11px] text-slate-400">
                    Mostrando <strong className="text-white">{totalCasos} casos</strong> adaptados a tu estructura • Muestra de <strong className="text-emerald-400">5 casos descargable</strong>.
                  </span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA ORQUESTADOR N8N */}
        {/* ========================================================================= */}
        {pestanaActiva === 'n8n' && (
          <div>
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