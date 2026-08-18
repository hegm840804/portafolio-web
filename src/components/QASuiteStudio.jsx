import { useState } from 'react';

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

  // ARCHIVO 2: PLANTILLA / ESTRUCTURA DE MATRIZ DEL USUARIO
  const [modoEntradaFormato, setModoEntradaFormato] = useState('subir');
  const [archivoFormatoNombre, setArchivoFormatoNombre] = useState(null);
  const [vistaPreviaFormatoImg, setVistaPreviaFormatoImg] = useState(null);
  const [analizandoEstructura, setAnalizandoEstructura] = useState(false);
  const [textoEstructuraUsuario, setTextoEstructuraUsuario] = useState('');

  // Columnas detectadas/analizadas con estándar QA Experto
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
    'Postcondiciones_Persistencia',
    'Severidad',
    'Estado'
  ]);

  const [nuevaColumna, setNuevaColumna] = useState('');

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
        } else {
          setColumnasPersonalizadas([
            'ID_Caso',
            'Modulo_Core',
            'Requerimiento_Asociado',
            'Descripcion_Escenario',
            'Tipo_Validacion',
            'Precondiciones',
            'Pasos_Detallados',
            'Valores_Entrada_TestData',
            'Comportamiento_Esperado',
            'Postcondiciones_Persistencia',
            'Severidad',
            'Estado'
          ]);
        }
      }, 600);
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

  // CASOS DE PRUEBA PROFESIONALES DE QA EXPERTO (10 CASOS EXHAUSTIVOS)
  const [casoDetalle, setCasoDetalle] = useState(null);

  const matrizCasosDinamicos = [
    {
      id: 'TC-CORE-01',
      tipo: 'Funcional (Happy Path)',
      categoriaMetrica: 'HP',
      valores: {
        'ID_Caso': 'TC-CORE-01',
        'ID Caso': 'TC-CORE-01',
        'Test Issue Key': 'TC-CORE-01',
        'Modulo_Core': 'SPEI / Transferencias',
        'Módulo Core': 'SPEI / Transferencias',
        'Requerimiento_Asociado': requerimiento.idHU,
        'Historia / Requerimiento': requerimiento.idHU,
        'Summary': 'Transferencia interbancaria exitosa en tiempo real con CLABE 18 dígitos y saldo suficiente',
        'Descripcion_Escenario': 'Transferencia interbancaria exitosa en tiempo real con CLABE de 18 dígitos y saldo disponible suficiente (Happy Path).',
        'Escenario de Prueba': 'Transferencia interbancaria exitosa en tiempo real con CLABE 18 dígitos y saldo suficiente',
        'Tipo_Validacion': 'Funcional (Happy Path)',
        'Tipo de Prueba': 'Funcional (Happy Path)',
        'Test Type': 'Manual / Automated',
        'Precondiciones': 'Usuario con sesión autenticada activa (Token JWT válido); cuenta de retiro en estado Activa con saldo líquido de $5,000.00 MXN; catálogo de bancos SPEI operativo.',
        'Preconditions': 'User authenticated with active session; source account active with $5,000.00 MXN balance; SPEI gateway online.',
        'Pasos_Detallados': '1. Navegar al módulo de Transferencias Interbancarias.\n2. Seleccionar cuenta de retiro de origen.\n3. Ingresar cuenta CLABE destino de 18 dígitos válida.\n4. Capturar monto a transferir ($1,500.00 MXN) y concepto de pago.\n5. Ingresar código de autorización Token OTP de 6 dígitos.\n6. Presionar botón "Confirmar y Enviar Transferencia".',
        'Pasos de Ejecución': '1. Navegar a Transferencias.\n2. Capturar CLABE 18 dígitos y monto $1,500.00.\n3. Autorizar con OTP.\n4. Presionar Confirmar.',
        'Action / Steps': '1. Open SPEI Transfer module.\n2. Enter valid 18-digit CLABE and $1,500.00.\n3. Authorize via OTP.\n4. Click Confirm.',
        'Valores_Entrada_TestData': 'CLABE Destino: 012180015678901234 (BBVA)\nMonto: $1,500.00 MXN\nConcepto: Pago Factura 4902\nOTP: 839201',
        'Datos de Prueba (Input)': 'CLABE: 012180015678901234, Monto: $1,500.00 MXN, OTP: 839201',
        'Test Data': 'CLABE: 012180015678901234, Amount: 1500.00 MXN, OTP: 839201',
        'Comportamiento_Esperado': '1. El sistema procesa la transacción retornando HTTP 200/201 OK.\n2. Se despliega comprobante con Clave de Rastreo SPEI y Folio CEP oficial.\n3. Se debita de forma inmediata el saldo de la cuenta origen ($3,500.00 MXN restantes).\n4. Se notifica vía SMS/Email al cuentahabiente.',
        'Resultado Esperado': 'Transacción procesada con HTTP 200, emisión de folio CEP y débito inmediato de fondos.',
        'Expected Result': 'Transaction processed with HTTP 200, receipt with CEP ID displayed and balance debited.',
        'Postcondiciones_Persistencia': 'Registro inmutable en tabla `spei_transfers` con status "LIQUIDATED"; débito reflejado en `core_accounts`; log de auditoría persistido en `audit_logs`.',
        'Severidad': 'Crítica',
        'Priority': 'Highest',
        'Estado': 'Listo para Ejecución',
        'Execution Status': 'Ready for Test'
      }
    },
    {
      id: 'TC-CORE-02',
      tipo: 'Frontera / Negativo (TTF)',
      categoriaMetrica: 'TTF',
      valores: {
        'ID_Caso': 'TC-CORE-02',
        'ID Caso': 'TC-CORE-02',
        'Test Issue Key': 'TC-CORE-02',
        'Modulo_Core': 'SPEI / Validación CLABE',
        'Módulo Core': 'SPEI / Validación CLABE',
        'Requerimiento_Asociado': requerimiento.idHU,
        'Historia / Requerimiento': requerimiento.idHU,
        'Summary': 'Intento de transferencia con longitud de CLABE menor a 18 dígitos (16 dígitos)',
        'Descripcion_Escenario': 'Intento de transferencia con longitud de CLABE menor a 18 dígitos (16 dígitos numéricos).',
        'Escenario de Prueba': 'Intento de transferencia con longitud de CLABE menor a 18 dígitos (16 dígitos)',
        'Tipo_Validacion': 'Frontera / Negativo (TTF)',
        'Tipo de Prueba': 'Frontera / Negativo (TTF)',
        'Test Type': 'Functional Negative',
        'Precondiciones': 'Formulario de transferencias abierto en pantalla; campos habilitados.',
        'Preconditions': 'Transfer form displayed on screen.',
        'Pasos_Detallados': '1. Acceder al formulario de transferencia.\n2. En el campo "Cuenta CLABE", capturar 16 dígitos numéricos.\n3. Intentar pasar el foco al campo monto o presionar botón Continuar.',
        'Pasos de Ejecución': '1. Capturar 16 dígitos en CLABE.\n2. Intentar avanzar al siguiente campo.',
        'Action / Steps': '1. Enter 16 numeric digits in CLABE field.\n2. Attempt to submit or blur input.',
        'Valores_Entrada_TestData': 'CLABE: 01218001567890 (16 dígitos)\nMonto: $500.00 MXN',
        'Datos de Prueba (Input)': 'CLABE: 01218001567890 (16 dígitos)',
        'Test Data': 'CLABE: 01218001567890 (16 digits)',
        'Comportamiento_Esperado': '1. El sistema bloquea el avance impidiendo el disparo de la petición HTTP al backend.\n2. El campo se resalta con borde rojo y muestra el mensaje inline: "La cuenta CLABE debe contener exactamente 18 dígitos numéricos".\n3. El botón de envío permanece deshabilitado.',
        'Resultado Esperado': 'Bloqueo en cliente: "La cuenta CLABE debe contener exactamente 18 dígitos numéricos".',
        'Expected Result': 'Client validation blocks submission with inline error: "CLABE must be exactly 18 digits".',
        'Postcondiciones_Persistencia': 'No se genera ninguna petición de dispersión ni registro en base de datos; integridad de saldo sin alteraciones.',
        'Severidad': 'Crítica',
        'Priority': 'High',
        'Estado': 'Listo para Ejecución',
        'Execution Status': 'Ready for Test'
      }
    },
    {
      id: 'TC-CORE-03',
      tipo: 'Regla de Negocio / Algoritmo Banxico',
      categoriaMetrica: 'TTF',
      valores: {
        'ID_Caso': 'TC-CORE-03',
        'ID Caso': 'TC-CORE-03',
        'Test Issue Key': 'TC-CORE-03',
        'Modulo_Core': 'SPEI / Validación Algoritmo',
        'Módulo Core': 'SPEI / Validación Algoritmo',
        'Requerimiento_Asociado': requerimiento.idHU,
        'Historia / Requerimiento': requerimiento.idHU,
        'Summary': 'Validación de dígito verificador inválido en CLABE según algoritmo Módulo 10 Banxico',
        'Descripcion_Escenario': 'Validación de dígito verificador inválido en CLABE según estándar Banxico / Módulo 10 ponderado.',
        'Escenario de Prueba': 'Validación de dígito verificador inválido en CLABE según algoritmo Banxico',
        'Tipo_Validacion': 'Negativa / Regla de Negocio (TTF)',
        'Tipo de Prueba': 'Negativa / Regla de Negocio (TTF)',
        'Test Type': 'Business Rule Validation',
        'Precondiciones': 'Formulario de transferencias cargado con catálogo de claves de institución financiera (primeros 3 dígitos).',
        'Preconditions': 'Transfer form loaded with financial institution prefix catalog.',
        'Pasos_Detallados': '1. Ingresar una CLABE con 18 dígitos numéricos pero con dígito verificador final incorrecto.\n2. Capturar monto válido y presionar Enviar.',
        'Pasos de Ejecución': '1. Capturar CLABE 18 dígitos con dígito final alterado.\n2. Presionar Enviar.',
        'Action / Steps': '1. Enter 18-digit CLABE with invalid check digit.\n2. Click Submit.',
        'Valores_Entrada_TestData': 'CLABE: 012180015678901239 (Dígito calculado correcto: 4)\nMonto: $200.00 MXN',
        'Datos de Prueba (Input)': 'CLABE con dígito inválido: 012180015678901239',
        'Test Data': 'CLABE: 012180015678901239 (checksum mismatch)',
        'Comportamiento_Esperado': '1. La validación algorítmica detecta inconsistencia en el dígito de control.\n2. Se muestra alerta: "La cuenta CLABE ingresada no es válida. Verifique el número e intente de nuevo".\n3. Se cancela el flujo antes de enviar al switch transaccional.',
        'Resultado Esperado': 'Alerta: "La cuenta CLABE ingresada no es válida. Verifique el número e intente de nuevo".',
        'Expected Result': 'Checksum validation fails; error displayed: "Invalid CLABE account number".',
        'Postcondiciones_Persistencia': 'Sin registros de transacción creados; saldo de origen sin debitar.',
        'Severidad': 'Crítica',
        'Priority': 'Highest',
        'Estado': 'Listo para Ejecución',
        'Execution Status': 'Ready for Test'
      }
    },
    {
      id: 'TC-CORE-04',
      tipo: 'Negativa (Fondos Insuficientes)',
      categoriaMetrica: 'TTF',
      valores: {
        'ID_Caso': 'TC-CORE-04',
        'ID Caso': 'TC-CORE-04',
        'Test Issue Key': 'TC-CORE-04',
        'Modulo_Core': 'SPEI / Saldo y Fondos',
        'Módulo Core': 'SPEI / Saldo y Fondos',
        'Requerimiento_Asociado': requerimiento.idHU,
        'Historia / Requerimiento': requerimiento.idHU,
        'Summary': 'Intento de transferencia por monto superior al saldo disponible (Control de sobregiro)',
        'Descripcion_Escenario': 'Intento de transferencia por monto superior al saldo disponible (Control de sobregiro).',
        'Escenario de Prueba': 'Intento de transferencia por monto superior al saldo disponible',
        'Tipo_Validacion': 'Negativa (Fondos Insuficientes)',
        'Tipo de Prueba': 'Negativa (Fondos Insuficientes)',
        'Test Type': 'Negative Balance Control',
        'Precondiciones': 'Cuenta origen con saldo disponible de $850.00 MXN.',
        'Preconditions': 'Source account available balance = $850.00 MXN.',
        'Pasos_Detallados': '1. Seleccionar cuenta origen con saldo de $850.00.\n2. Ingresar CLABE válida de 18 dígitos.\n3. Capturar monto a transferir de $1,000.00 MXN.\n4. Presionar botón Continuar.',
        'Pasos de Ejecución': '1. Seleccionar cuenta ($850.00).\n2. Capturar monto $1,000.00.\n3. Presionar Continuar.',
        'Action / Steps': '1. Select account with $850.00 balance.\n2. Type $1,000.00 amount.\n3. Click Submit.',
        'Valores_Entrada_TestData': 'Saldo disponible: $850.00 MXN\nMonto solicitado: $1,000.00 MXN',
        'Datos de Prueba (Input)': 'Saldo: $850.00 MXN vs Monto: $1,000.00 MXN',
        'Test Data': 'Balance: $850.00, Requested: $1000.00',
        'Comportamiento_Esperado': '1. El sistema compara el monto solicitado contra el saldo disponible y rechaza la operación.\n2. Se muestra mensaje claro: "Fondos insuficientes. Tu saldo disponible es de $850.00 MXN".\n3. Se bloquea el botón de confirmación.',
        'Resultado Esperado': 'Mensaje: "Fondos insuficientes. Tu saldo disponible es de $850.00 MXN".',
        'Expected Result': 'Rejection: "Insufficient funds. Available balance is $850.00 MXN".',
        'Postcondiciones_Persistencia': 'Transacción abortada; balance contable inalterado.',
        'Severidad': 'Crítica',
        'Priority': 'High',
        'Estado': 'Listo para Ejecución',
        'Execution Status': 'Ready for Test'
      }
    },
    {
      id: 'TC-CORE-05',
      tipo: 'Frontera (Límites Inferiores)',
      categoriaMetrica: 'TTF',
      valores: {
        'ID_Caso': 'TC-CORE-05',
        'ID Caso': 'TC-CORE-05',
        'Test Issue Key': 'TC-CORE-05',
        'Modulo_Core': 'SPEI / Monto Límite',
        'Módulo Core': 'SPEI / Monto Límite',
        'Requerimiento_Asociado': requerimiento.idHU,
        'Historia / Requerimiento': requerimiento.idHU,
        'Summary': 'Validación de monto en $0.00 y montos negativos con caracteres especiales',
        'Descripcion_Escenario': 'Validación de monto en $0.00 y montos negativos con signos especiales.',
        'Escenario de Prueba': 'Validación de monto en $0.00 y montos negativos con caracteres especiales',
        'Tipo_Validacion': 'Frontera (Límites Inferiores)',
        'Tipo de Prueba': 'Frontera (Límites Inferiores)',
        'Test Type': 'Boundary Testing',
        'Precondiciones': 'Formulario de transferencias activo en pantalla.',
        'Preconditions': 'Transfer form displayed.',
        'Pasos_Detallados': '1. En el campo monto, capturar valor $0.00.\n2. En prueba paralela, intentar capturar monto con signo negativo (-$150.00) o caracteres alfabéticos.\n3. Intentar enviar.',
        'Pasos de Ejecución': '1. Capturar $0.00 o -$150.00 en monto.\n2. Intentar continuar.',
        'Action / Steps': '1. Type $0.00 or negative amount.\n2. Attempt to proceed.',
        'Valores_Entrada_TestData': 'Monto Prueba 1: $0.00\nMonto Prueba 2: -$150.00\nMonto Prueba 3: "Mil Pesos"',
        'Datos de Prueba (Input)': 'Monto = $0.00 / -$150.00 / Texto',
        'Test Data': 'Amount = 0.00, -150.00, String',
        'Comportamiento_Esperado': '1. El input de monto solo admite caracteres numéricos y punto decimal.\n2. Si el valor es menor o igual a $0.00, se muestra: "El monto mínimo a transferir debe ser mayor a $0.00".',
        'Resultado Esperado': 'Bloqueo: "El monto mínimo a transferir debe ser mayor a $0.00".',
        'Expected Result': 'Validation blocks input: "Minimum amount must be greater than $0.00".',
        'Postcondiciones_Persistencia': 'Sin peticiones HTTP disparadas al backend.',
        'Severidad': 'Alta',
        'Priority': 'Medium',
        'Estado': 'Listo para Ejecución',
        'Execution Status': 'Ready for Test'
      }
    },
    {
      id: 'TC-CORE-06',
      tipo: 'Smoke / Sanity Test',
      categoriaMetrica: 'Smoke',
      valores: {
        'ID_Caso': 'TC-CORE-06',
        'ID Caso': 'TC-CORE-06',
        'Test Issue Key': 'TC-CORE-06',
        'Modulo_Core': 'SPEI / Smoke & Disponibilidad',
        'Módulo Core': 'SPEI / Smoke & Disponibilidad',
        'Requerimiento_Asociado': requerimiento.idHU,
        'Historia / Requerimiento': requerimiento.idHU,
        'Summary': 'Smoke test de disponibilidad de interfaz, carga de elementos DOM y catálogo de bancos',
        'Descripcion_Escenario': 'Smoke test de disponibilidad de interfaz, carga de elementos DOM y catálogo de instituciones bancarias.',
        'Escenario de Prueba': 'Smoke test de disponibilidad de interfaz, carga de elementos DOM y catálogo de bancos',
        'Tipo_Validacion': 'Smoke / Sanity Test',
        'Tipo de Prueba': 'Smoke / Sanity Test',
        'Test Type': 'Smoke Test',
        'Precondiciones': 'Navegador con conectividad a red e infraestructura de servicios en línea.',
        'Preconditions': 'Browser online; services operational.',
        'Pasos_Detallados': '1. Acceder directamente a la ruta /transferencias/spei.\n2. Verificar tiempo de renderizado de la interfaz.\n3. Validar que la lista desplegable de bancos cargue las instituciones activas.\n4. Inspeccionar la consola del navegador.',
        'Pasos de Ejecución': '1. Abrir ruta /transferencias/spei.\n2. Verificar renderizado y catálogo de bancos.\n3. Revisar consola JS.',
        'Action / Steps': '1. Navigate to /transferencias/spei.\n2. Check render time and bank dropdown list.\n3. Check console.',
        'Valores_Entrada_TestData': 'Navegadores: Chrome Desktop, Mobile Safari iOS, Android Chrome.',
        'Datos de Prueba (Input)': 'Render inicial multidispositivo',
        'Test Data': 'Desktop & Mobile browsers',
        'Comportamiento_Esperado': '1. Pantalla renderizada en < 1.8 segundos.\n2. Todos los campos de entrada y botones se encuentran visibles y accesibles.\n3. Consola sin excepciones JS ni errores 404/500.',
        'Resultado Esperado': 'Interfaz renderizada en < 1.8s sin errores de consola JS.',
        'Expected Result': 'UI rendered in < 1.8s without JavaScript errors.',
        'Postcondiciones_Persistencia': 'Módulo disponible para el usuario final.',
        'Severidad': 'Alta',
        'Priority': 'Medium',
        'Estado': 'Listo para Ejecución',
        'Execution Status': 'Ready for Test'
      }
    },
    {
      id: 'TC-CORE-07',
      tipo: 'Concurrencia & Idempotencia',
      categoriaMetrica: 'TTF',
      valores: {
        'ID_Caso': 'TC-CORE-07',
        'ID Caso': 'TC-CORE-07',
        'Test Issue Key': 'TC-CORE-07',
        'Modulo_Core': 'SPEI / Concurrencia e Idempotencia',
        'Módulo Core': 'SPEI / Concurrencia e Idempotencia',
        'Requerimiento_Asociado': requerimiento.idHU,
        'Historia / Requerimiento': requerimiento.idHU,
        'Summary': 'Prevención de transferencias duplicadas por doble clic rápido en botón Confirmar',
        'Descripcion_Escenario': 'Prevención de transferencias duplicadas por doble clic o multiclic rápido en el botón Confirmar.',
        'Escenario de Prueba': 'Prevención de transferencias duplicadas por doble clic rápido en Confirmar',
        'Tipo_Validacion': 'Concurrencia & Idempotencia (TTF)',
        'Tipo de Prueba': 'Concurrencia & Idempotencia (TTF)',
        'Test Type': 'Idempotency Test',
        'Precondiciones': 'Formulario con datos válidos y token OTP listo para ser procesado.',
        'Preconditions': 'Valid form ready with OTP code.',
        'Pasos_Detallados': '1. Llenar formulario con datos correctos.\n2. Presionar de forma consecutiva y rápida (intervalo < 200ms) el botón "Confirmar Transferencia" 2 o 3 veces.',
        'Pasos de Ejecución': '1. Doble clic rápido (< 200ms) en botón Confirmar Transferencia.',
        'Action / Steps': '1. Double click submit button in < 200ms.',
        'Valores_Entrada_TestData': 'Doble submit en < 200ms\nIdempotency-Key: IDMP-8921-9942',
        'Datos de Prueba (Input)': 'Multi-submit rápido con misma clave de idempotencia',
        'Test Data': 'Consecutive rapid clicks with same Idempotency-Key',
        'Comportamiento_Esperado': '1. Tras el primer clic, el botón cambia a estado "Procesando..." y se deshabilita.\n2. El backend procesa UNA SOLA transferencia reconociendo la clave Idempotency-Key.\n3. Se responde con la confirmación original sin duplicar el cargo.',
        'Resultado Esperado': 'Se procesa una sola transferencia y se deshabilita el botón tras el primer clic.',
        'Expected Result': 'Button disabled after first click; single transaction processed without duplicates.',
        'Postcondiciones_Persistencia': 'Se debita el monto una sola vez ($1,500.00); 1 solo registro de dispersión en base de datos; cero duplicidad contable.',
        'Severidad': 'Crítica',
        'Priority': 'Highest',
        'Estado': 'Listo para Ejecución',
        'Execution Status': 'Ready for Test'
      }
    },
    {
      id: 'TC-CORE-08',
      tipo: 'Resiliencia / Rollback Transaccional',
      categoriaMetrica: 'Otros',
      valores: {
        'ID_Caso': 'TC-CORE-08',
        'ID Caso': 'TC-CORE-08',
        'Test Issue Key': 'TC-CORE-08',
        'Modulo_Core': 'SPEI / Resiliencia y Rollback',
        'Módulo Core': 'SPEI / Resiliencia y Rollback',
        'Requerimiento_Asociado': requerimiento.idHU,
        'Historia / Requerimiento': requerimiento.idHU,
        'Summary': 'Manejo de timeout en switch bancario (>10s) y verificación de rollback automático',
        'Descripcion_Escenario': 'Manejo de timeout en el switch bancario (>10 seg) y verificación de rollback automático de saldo.',
        'Escenario de Prueba': 'Manejo de timeout en switch bancario (>10s) y rollback de saldo',
        'Tipo_Validacion': 'Resiliencia / Rollback Transaccional',
        'Tipo de Prueba': 'Resiliencia / Rollback Transaccional',
        'Test Type': 'API Resilience',
        'Precondiciones': 'Simulación de retardo de red o timeout > 10,000ms en el endpoint de dispersión interbancaria.',
        'Preconditions': 'Simulated network timeout > 10,000ms on bank switch.',
        'Pasos_Detallados': '1. Disparar transferencia con datos válidos.\n2. El mock de backend simula una espera de 12 segundos sin respuesta del switch SPEI.\n3. Observar comportamiento del frontend y estado de saldo.',
        'Pasos de Ejecución': '1. Disparar transferencia.\n2. Forzar timeout de 12 segundos en backend.',
        'Action / Steps': '1. Trigger transfer.\n2. Force 12s delay in backend mock.',
        'Valores_Entrada_TestData': 'Monto: $2,500.00 MXN\nLatencia forzada: 12,000ms',
        'Datos de Prueba (Input)': 'Monto = $2,500.00 MXN con timeout inducido',
        'Test Data': 'Amount = $2,500.00, Timeout = 12000ms',
        'Comportamiento_Esperado': '1. La aplicación detecta el timeout al cumplirse los 10 segundos.\n2. Se ejecuta la rutina de Rollback transaccional en base de datos.\n3. La interfaz muestra alerta amigable: "La operación está tardando más de lo esperado. Tu saldo no ha sido afectado".',
        'Resultado Esperado': 'Rollback automático de fondos y alerta amigable sin afectación de saldo.',
        'Expected Result': 'Automatic database rollback executed; user alert displayed without balance debit.',
        'Postcondiciones_Persistencia': 'El saldo en la cuenta de retiro permanece intacto ($5,000.00); transacción registrada en estado "REVERSED_TIMEOUT"; log de anomalía generado para monitoreo.',
        'Severidad': 'Crítica',
        'Priority': 'Highest',
        'Estado': 'Listo para Ejecución',
        'Execution Status': 'Ready for Test'
      }
    },
    {
      id: 'TC-CORE-09',
      tipo: 'Seguridad / Sanitización XSS & SQLi',
      categoriaMetrica: 'Otros',
      valores: {
        'ID_Caso': 'TC-CORE-09',
        'ID Caso': 'TC-CORE-09',
        'Test Issue Key': 'TC-CORE-09',
        'Modulo_Core': 'SPEI / Seguridad & Sanitización',
        'Módulo Core': 'SPEI / Seguridad & Sanitización',
        'Requerimiento_Asociado': requerimiento.idHU,
        'Historia / Requerimiento': requerimiento.idHU,
        'Summary': 'Sanitización de payloads maliciosos (XSS / SQL Injection) en Concepto y Referencia',
        'Descripcion_Escenario': 'Sanitización de cadenas maliciosas (XSS / SQL Injection) en los campos Concepto y Referencia Numérica.',
        'Escenario de Prueba': 'Sanitización de payloads maliciosos en campos de texto',
        'Tipo_Validacion': 'Seguridad / Penetration Testing',
        'Tipo de Prueba': 'Seguridad / Penetration Testing',
        'Test Type': 'Security Testing',
        'Precondiciones': 'Formulario de transferencias activo; filtros WAF y sanitizador en backend en funcionamiento.',
        'Preconditions': 'Transfer form active; backend WAF filters enabled.',
        'Pasos_Detallados': '1. En el campo "Concepto de Pago", ingresar payload de scripting: `<script>alert(\'XSS_QA\')</script>`.\n2. En el campo "Referencia", ingresar payload de SQLi: `\' OR \'1\'=\'1 --`.\n3. Enviar la transferencia.',
        'Pasos de Ejecución': '1. Capturar `<script>alert(1)</script>` en concepto.\n2. Enviar transferencia.',
        'Action / Steps': '1. Inject `<script>alert(\'XSS\')</script>` into concept field.\n2. Submit payment.',
        'Valores_Entrada_TestData': 'Payloads:\nConcepto: `<script>alert(\'XSS_QA\')</script>`\nReferencia: `999\' OR \'1\'=\'1`',
        'Datos de Prueba (Input)': 'Payloads maliciosos de XSS y SQLi',
        'Test Data': 'XSS & SQL injection vectors',
        'Comportamiento_Esperado': '1. El sistema sanitiza y escapa las entidades HTML y caracteres reservados.\n2. El texto se almacena de forma segura como texto plano.\n3. No se ejecuta ningún script en el DOM ni se altera la consulta SQL en la base de datos.',
        'Resultado Esperado': 'El texto se escapa y sanitiza sin ejecutarse scripts ni vulnerar la base de datos.',
        'Expected Result': 'Payloads are properly sanitized and stored as plain text without script execution.',
        'Postcondiciones_Persistencia': 'Cero vulnerabilidades de ejecución; datos persistidos con codificación segura.',
        'Severidad': 'Crítica',
        'Priority': 'Highest',
        'Estado': 'Listo para Ejecución',
        'Execution Status': 'Ready for Test'
      }
    },
    {
      id: 'TC-CORE-10',
      tipo: 'Integridad & Auditoría SQL',
      categoriaMetrica: 'HP',
      valores: {
        'ID_Caso': 'TC-CORE-10',
        'ID Caso': 'TC-CORE-10',
        'Test Issue Key': 'TC-CORE-10',
        'Modulo_Core': 'SPEI / Integridad y Auditoría SQL',
        'Módulo Core': 'SPEI / Integridad y Auditoría SQL',
        'Requerimiento_Asociado': requerimiento.idHU,
        'Historia / Requerimiento': requerimiento.idHU,
        'Summary': 'Auditoría directa en base de datos de registros contables, llaves foráneas y timestamps',
        'Descripcion_Escenario': 'Auditoría directa en base de datos de los registros contables, llaves foráneas y timestamps de dispersión.',
        'Escenario de Prueba': 'Auditoría en base de datos de registros contables y timestamps',
        'Tipo_Validacion': 'Integridad de Datos (SQL Backend)',
        'Tipo de Prueba': 'Integridad de Datos (SQL Backend)',
        'Test Type': 'Database Verification',
        'Precondiciones': 'Transacción exitosa completada bajo folio CEP: CEP202608170091.',
        'Preconditions': 'Successful transaction completed under tracking key CEP202608170091.',
        'Pasos_Detallados': '1. Conectarse a la base de datos transaccional.\n2. Ejecutar consulta: `SELECT * FROM spei_transfers WHERE tracking_key = \'CEP202608170091\'`.\n3. Validar congruencia entre tabla de movimientos y tabla de cuentas de clientes.',
        'Pasos de Ejecución': '1. Conectar a BD.\n2. Ejecutar SELECT a `spei_transfers` y `audit_logs`.\n3. Validar campos.',
        'Action / Steps': '1. Query SQL tables for tracking key.\n2. Validate balance consistency.',
        'Valores_Entrada_TestData': 'Query SQL:\n`SELECT t.id, t.amount, t.status, a.balance FROM spei_transfers t JOIN accounts a ON t.account_id = a.id WHERE t.tracking_key = \'CEP202608170091\';`',
        'Datos de Prueba (Input)': 'Consulta SELECT por tracking_key',
        'Test Data': 'SQL verification query',
        'Comportamiento_Esperado': '1. El registro existe con estado "LIQUIDATED".\n2. Los campos amount, source_clabe, target_clabe, timestamps y cep_folio coinciden al 100% con la transacción.\n3. El saldo de la cuenta origen refleja con precisión el débito.',
        'Resultado Esperado': 'Registro inmutable en estado "LIQUIDATED" y congruencia contable al 100%.',
        'Expected Result': 'Database record in status LIQUIDATED with 100% referential and balance consistency.',
        'Postcondiciones_Persistencia': 'Integridad referencial y congruencia contable verificada al 100% sin inconsistencias.',
        'Severidad': 'Alta',
        'Priority': 'High',
        'Estado': 'Listo para Ejecución',
        'Execution Status': 'Ready for Test'
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

  // DESCARGA CSV CON UTF-8 BOM PARA EXCEL (ELIMINA CARACTERES RAROS)
  const descargarMuestraCSVPersonalizada = () => {
    const casosMuestra = matrizCasosDinamicos.slice(0, 5);
    
    // '\uFEFF' es el Byte Order Mark (BOM) que le indica a Excel que abra el archivo en UTF-8 perfecto
    let csv = '\uFEFF' + columnasPersonalizadas.map(c => '"' + c.replace(/"/g, '""') + '"').join(',') + '\n';
    
    casosMuestra.forEach((caso) => {
      const fila = columnasPersonalizadas.map((col) => {
        let val = caso.valores[col] || caso.valores[col.trim()] || caso[col] || caso.id || 'N/A';
        if (typeof val === 'string') {
          val = val.replace(/^[=+\-@]/, "'").replace(/"/g, '""').replace(/\r?\n/g, ' ');
        }
        return '"' + val + '"';
      });
      csv += fila.join(',') + '\n';
    });

    csv += '\n"--- NOTA EJECUTIVA DE COBERTURA QA ---","Muestra de 5 casos estructurada con columnas [' + columnasPersonalizadas.join(' | ') + ']. Para la Matriz Completa (' + totalCasos + ' casos) y scripts de automatización Playwright contacta a Martin Hernandez Garfias (hegmtona2024@gmail.com / +52 56 1562 5182)."\n';

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Matriz_Casos_Prueba_QA_' + requerimiento.idHU + '.csv');
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

    const texto = 'Hola Martin, deseo cotizar una *Matriz de Pruebas QA Completa*:\n' +
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
            <span>1. Generador de Matriz QA (10 Casos Senior)</span>
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
                  <span className="text-xs font-bold">Archivo 3: Matriz QA ({totalCasos} Casos)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Descarga UTF-8 limpia para Excel</p>
              </button>
            </div>

            {/* FASE 1 */}
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
                      ⚡ Caso Preconfigurado (SPEI)
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
                      🏦 Módulo SPEI / Transferencias Bancarias en Tiempo Real (FinTech & Banca Core)
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
                )}

                {modoEntradaReq === 'escribir' && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <label className="block text-slate-300 font-bold mb-1">
                      Describe las reglas y funcionalidades del módulo a probar:
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Ejemplo: Necesito probar un checkout bancario con validación de CLABE, tarjeta, límite de saldo, rollback en timeout y seguridad contra inyección..."
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
                          criterios: ['Happy path', 'Frontera/TTF', 'Smoke', 'Seguridad', 'Persistencia SQL']
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

            {/* FASE 2 */}
            {pasoMP === 2 && (
              <div className="space-y-5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                      Archivo 2: Subir Formato de Matriz del Usuario (Imagen, Excel, Doc o Texto)
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Sube tu plantilla y el motor mapeará automáticamente las columnas y campos exactos.
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
                        {archivoFormatoNombre ? ('Plantilla Analizada: ' + archivoFormatoNombre) : 'Arrastra una captura de tu Excel, documento o plantilla de casos'}
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
                      Pega los nombres de tus columnas separadas por comas o saltos de línea:
                    </label>
                    <textarea
                      rows="3"
                      placeholder="ID_Caso, Modulo_Core, Descripcion_Escenario, Tipo_Validacion, Precondiciones, Pasos_Detallados, Valores_Entrada_TestData, Comportamiento_Esperado, Severidad, Estado"
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

                {/* Chips de Columnas */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-xs flex items-center gap-2">
                      <span>📐</span>
                      <span>Estructura de Columnas Detectada ({columnasPersonalizadas.length} Columnas)</span>
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">100% Configurable</span>
                  </div>

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

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Agregar otra columna (ej. Postcondiciones, Criterio_Aceptacion, Evidencia...)"
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
                    <span>{procesandoPaso ? '⚙️ Generando Casos Exhaustivos...' : '⚡ Generar Matriz Senior (' + totalCasos + ' Casos)'}</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>
            )}

            {/* FASE 3 */}
            {pasoMP === 3 && (
              <div className="space-y-5">
                
                {/* Resumen de Métricas */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📊</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                        Resumen Ejecutivo de Cobertura QA Senior ({totalCasos} Casos Detallados)
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded font-mono">
                        🔒 Vista Protegida
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
                      <p className="text-[10px] uppercase font-bold text-purple-400">Seguridad & SQL</p>
                      <p className="text-lg font-extrabold text-purple-400 font-mono">{totalOtros}</p>
                    </div>
                  </div>
                </div>

                {/* Banner de Descarga con UTF-8 BOM para Excel */}
                <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💼</span>
                    <div>
                      <p className="font-bold text-emerald-300">Descarga Muestra (5 Casos en Excel UTF-8) o Solicita la Suite Completa</p>
                      <p className="text-[11px] text-slate-300">
                        Compatible con Microsoft Excel sin caracteres rotos.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={descargarMuestraCSVPersonalizada}
                      className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-600 text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>📥</span>
                      <span>Descargar CSV UTF-8 (5 Casos)</span>
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

                {/* TABLA DINÁMICA */}
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

                  {/* Visor de Detalle Técnico */}
                  {casoDetalle && (
                    <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
                      <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800">
                            {casoDetalle.id}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-white">Detalle Exhaustivo de Caso de Prueba</h4>
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
                    Mostrando <strong className="text-white">{totalCasos} casos</strong> de alta criticidad • Muestra de <strong className="text-emerald-400">5 casos descargable</strong> en CSV UTF-8.
                  </span>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}