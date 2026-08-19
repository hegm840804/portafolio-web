import { useState } from 'react';

export default function QASuiteStudio({ onOpenContact }) {
  const [pestanaActiva, setPestanaActiva] = useState('matriz'); // 'matriz' | 'n8n'

  // =========================================================================
  // 1. GENERADOR DE MATRIZ CON SELECTOR INTERACTIVO (JR, MED, SR) Y MÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°TRICAS
  // =========================================================================
  const [pasoMP, setPasoMP] = useState(1);
  const [nivelSeleccionado, setNivelSeleccionado] = useState('semi'); // 'junior' | 'semi' | 'senior'

  // ARCHIVO 1: REQUERIMIENTOS
  const [archivoReqNombre, setArchivoReqNombre] = useState(null);
  const [vistaPreviaReqImg, setVistaPreviaReqImg] = useState(null);

  const [requerimiento, setRequerimiento] = useState({
    idHU: 'HU-SPEI-104',
    prefijoID: 'SPEI',
    titulo: 'MÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³dulo de Transferencias Interbancarias SPEI en Tiempo Real',
    descripcion: 'Como cuentahabiente, deseo transferir fondos a cuentas CLABE de otros bancos para realizar pagos inmediatos de forma segura.',
    origen: 'EspecificaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n Core Bancario / FinTech',
    criterios: [
      'La cuenta CLABE debe contener exactamente 18 dÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­gitos numÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©ricos vÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡lidos bajo algoritmo MÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³dulo 10 Banxico.',
      'El monto a transferir debe ser mayor a $0.00 y menor o igual al saldo lÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­quido disponible.',
      'Toda transacciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n aprobada debe generar un folio de rastreo CEP ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âºnico y persistir en base de datos.'
    ]
  });

  // ARCHIVO 2: PLANTILLA / ESTRUCTURA DE MATRIZ
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

  // MANEJO DE CARGA DE ARCHIVO 1
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

      const nombreLimpio = file.name.replace(/\.[^/.]+$/, "").toUpperCase();
      const prefijoDinamico = nombreLimpio.length > 5 ? nombreLimpio.slice(0, 4) : nombreLimpio;

      setRequerimiento({
        idHU: 'REQ-' + prefijoDinamico,
        prefijoID: prefijoDinamico,
        titulo: 'Requerimiento: ' + file.name,
        descripcion: `EspecificaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n cargada desde ${file.name} (${(file.size / 1024).toFixed(1)} KB). IDs generados con trazabilidad [${prefijoDinamico}].`,
        origen: 'Archivo local (' + file.name + ')',
        criterios: [
          'ValidaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n de reglas extraÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­das del documento.',
          'Pruebas de frontera, flujos alternos y excepciones.',
          'Consistencia y persistencia transaccional en base de datos.'
        ]
      });
    }
  };

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

  // GENERADOR DINÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂMICO SEGÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡N NIVEL (JR: ~30 | MED: ~75 | SR: ~120)
  const generarSuitePorNivel = (prefijo, nivel) => {
    let distribucion = [
      { code: 'HP', name: 'Happy Path', casos: 6 },
      { code: 'TTF', name: 'Test to Fail / Frontera', casos: 6 },
      { code: 'SMK', name: 'Smoke Test', casos: 5 },
      { code: 'CON', name: 'Concurrencia', casos: 5 },
      { code: 'SEC', name: 'Seguridad (XSS/SQLi)', casos: 3 },
      { code: 'RES', name: 'Resiliencia / Rollback', casos: 3 },
      { code: 'SQL', name: 'AuditorÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­a SQL', casos: 2 }
    ]; // Junior ~30 casos

    if (nivel === 'semi') {
      distribucion = [
        { code: 'HP', name: 'Happy Path', casos: 15 },
        { code: 'TTF', name: 'Test to Fail / Frontera', casos: 15 },
        { code: 'SMK', name: 'Smoke Test', casos: 10 },
        { code: 'CON', name: 'Concurrencia', casos: 10 },
        { code: 'SEC', name: 'Seguridad (XSS/SQLi)', casos: 10 },
        { code: 'RES', name: 'Resiliencia / Rollback', casos: 8 },
        { code: 'SQL', name: 'AuditorÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­a SQL', casos: 7 }
      ]; // Semi-Senior ~75 casos
    } else if (nivel === 'senior') {
      distribucion = [
        { code: 'HP', name: 'Happy Path', casos: 25 },
        { code: 'TTF', name: 'Test to Fail / Frontera', casos: 25 },
        { code: 'SMK', name: 'Smoke Test', casos: 15 },
        { code: 'CON', name: 'Concurrencia', casos: 15 },
        { code: 'SEC', name: 'Seguridad (XSS/SQLi)', casos: 15 },
        { code: 'RES', name: 'Resiliencia / Rollback', casos: 15 },
        { code: 'SQL', name: 'AuditorÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­a SQL', casos: 15 }
      ]; // Senior ~125 casos
    }

    let suite = [];
    distribucion.forEach(seccion => {
      for (let i = 1; i <= seccion.casos; i++) {
        const idCaso = `TC-${prefijo}-${seccion.code}-${String(i).padStart(2, '0')}`;
        suite.push({
          id: idCaso,
          tipo: `${seccion.name} #${i}`,
          categoriaMetrica: seccion.code,
          seccionNombre: seccion.name,
          pasosArray: [
            { num: 1, accion: `Configurar entorno para prueba ${seccion.name} #${i} bajo requerimiento ${requerimiento.idHU}.`, data: `Param_${i}=Activo | Auth=JWT_Valid`, esperado: 'Entorno listo para validaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n.' },
            { num: 2, accion: `Ejecutar validaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n de ${seccion.name.toLowerCase()} en el mÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³dulo de negocio.`, data: `Vector_Test=${seccion.code}_${i}`, esperado: 'Respuesta conforme a especificaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n tÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©cnica.' },
            { num: 3, accion: 'Verificar registros de auditorÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­a y persistencia en base de datos.', data: `Query: SELECT * FROM logs WHERE ref = '${idCaso}'`, esperado: 'Persistencia inmutable verificada.' }
          ],
          valores: {
            'ID_Caso': idCaso,
            'Modulo_Core': `${prefijo} / MÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³dulo ${seccion.name}`,
            'Requerimiento_Asociado': requerimiento.idHU,
            'Descripcion_Escenario': `ValidaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n (${seccion.name}) #${i} basada en la especificaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n del requerimiento ${requerimiento.idHU}.`,
            'Tipo_Validacion': `QA ${nivel.toUpperCase()} - ${seccion.name}`,
            'Precondiciones': `Servicios core activos y parÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡metros cargados para ${idCaso}.`,
            'Pasos_Detallados': `1. Configurar datos ${i}.\n2. Ejecutar transacciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n.\n3. Validar BD.`,
            'Valores_Entrada_TestData': `Dataset_${seccion.code}_${i}`,
            'Comportamiento_Esperado': `El sistema cumple con la regla de aceptaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n para ${seccion.name}.`,
            'Severidad': i <= 2 ? 'CrÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­tica' : 'Alta',
            'Estado': 'Listo para EjecuciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n'
          }
        });
      }
    });
    return { suite, distribucion };
  };

  const resultadoGeneracion = generarSuitePorNivel(requerimiento.prefijoID, nivelSeleccionado);
  const suiteCompleta = resultadoGeneracion.suite;
  const resumenSecciones = resultadoGeneracion.distribucion.map(sec => ({
    codigo: sec.code,
    nombre: sec.name,
    total: suiteCompleta.filter(c => c.categoriaMetrica === sec.code).length
  }));

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
    link.download = `Suite_QA_${requerimiento.prefijoID}_${nivelSeleccionado.toUpperCase()}_${suiteCompleta.length}_Casos.csv`;
    link.click();
  };

  // =========================================================================
  // 2. MÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œDULO N8N & WEBHOOKS
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
      empresa: "Servicios de AutomatizaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n & QA",
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
          empresa: "Servicios de AutomatizaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n & QA",
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
        severidad: "CrÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­tica",
        moduloAfectado: "SPEI / Core Transferencias",
        descripcion: "Fallo en algoritmo de dÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­gito verificador CLABE",
        ambiente: "Staging / Pre-ProducciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n",
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
        mensaje: "Evento '" + (parsed.evento || 'HTTP_EVENT') + "' procesado exitosamente por la canalizaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n.",
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
              ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢
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
              <span className="font-bold text-cyan-300 block text-[11px]">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¯ Precondiciones:</span>
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
                    ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¹Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â° Paso {casoEnEjecucion.pasosArray[pasoActualIdx].num} en Progreso
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ AcciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n:</span>
                    <p className="text-white font-medium text-sm mt-0.5">{casoEnEjecucion.pasosArray[pasoActualIdx].accion}</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-cyan-300 font-semibold block text-[11px]">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âª Datos de Prueba:</span>
                    <p className="text-cyan-100 font-mono text-xs">{casoEnEjecucion.pasosArray[pasoActualIdx].data}</p>
                  </div>
                  <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-900/60">
                    <span className="text-emerald-400 font-semibold block text-[11px]">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦ Resultado Esperado:</span>
                    <p className="text-emerald-200 text-xs">{casoEnEjecucion.pasosArray[pasoActualIdx].esperado}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => registrarResultadoPaso('fail')}
                    className="flex-1 py-2.5 px-4 bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Registrar Falla (Fail)
                  </button>
                  <button
                    onClick={() => registrarResultadoPaso('pass')}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ Paso Exitoso (Pass) ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â
                  </button>
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-2xl border text-center space-y-4 ${
                veredictoFinal === 'PASSED' ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-100' : 'bg-rose-950/80 border-rose-500/60 text-rose-100'
              }`}>
                <div className="text-4xl">{veredictoFinal === 'PASSED' ? 'ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ' : 'ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âº'}</div>
                <div>
                  <h4 className="text-lg font-extrabold">
                    {veredictoFinal === 'PASSED' ? 'ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡Caso Ejecutado con ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°xito (PASS)!' : 'Defecto Detectado (FAIL)'}
                  </h4>
                </div>
                <div className="flex justify-center gap-3">
                  <button onClick={reiniciarEjecucion} className="bg-slate-800 text-white text-xs px-4 py-2 rounded-xl cursor-pointer">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¾ Re-ejecutar</button>
                  <button onClick={() => setEjecutorActivo(false)} className="bg-emerald-500 text-slate-950 text-xs font-bold px-5 py-2 rounded-xl cursor-pointer">Finalizar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SELECTOR DE PESTAÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¹Ãƒâ€¦Ã¢â‚¬Å“AS PRINCIPALES */}
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
            <span>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹</span>
            <span>1. Generador de Matriz QA ({suiteCompleta.length} Casos)</span>
          </button>

          <button
            onClick={() => setPestanaActiva('n8n')}
            className={'px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ' + (
              pestanaActiva === 'n8n'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <span>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“</span>
            <span>2. Orquestador n8n & Webhooks</span>
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* PESTAÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¹Ãƒâ€¦Ã¢â‚¬Å“A 1: MATRIZ QA CON LOS 3 PASOS */}
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
                  <span className="text-xs font-bold">Archivo 3: Suite QA & MÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©tricas</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Selector Jr, Med, Sr & CSV UTF-8</p>
              </button>
            </div>

            {/* FASE 1: SUBIR REQUERIMIENTO */}
            {pasoMP === 1 && (
              <div className="space-y-5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      Archivo 1: Ingreso de Requerimiento (Doc / Imagen / Texto)
                    </span>
                    <p className="text-[11px] text-slate-400">Sube la especificaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n o historia de usuario que deseas probar.</p>
                  </div>
                </div>

                <div className="bg-slate-950 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center space-y-3 transition">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl mx-auto">
                    ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¾
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {archivoReqNombre ? ('Archivo Cargado: ' + archivoReqNombre) : 'Arrastra o selecciona el archivo del requerimiento'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Soporta: ImÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡genes (.png, .jpg), Documentos (.pdf, .docx), Excel (.xlsx) o Texto (.txt)
                    </p>
                  </div>

                  {vistaPreviaReqImg && (
                    <div className="max-w-xs mx-auto p-2 bg-slate-900 rounded-xl border border-slate-800">
                      <img src={vistaPreviaReqImg} alt="Preview Requerimiento" className="rounded-lg max-h-36 mx-auto object-cover" />
                      <span className="text-[10px] text-emerald-400 block mt-1">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ Imagen de requerimiento cargada</span>
                    </div>
                  )}

                  <label className="inline-block bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 font-semibold px-4 py-2 rounded-xl transition cursor-pointer">
                    

            {/* Opciones de Entrada de Requerimiento y Notas */}
            <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-200 mb-2">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â Redactar Requerimiento / Proyecto Manualmente</h3>
              <textarea
                value={requerimiento.descripcionManual || ''}
                onChange={(e) => setRequerimiento({ ...requerimiento, descripcionManual: e.target.value, idHU: e.target.value ? "REQ-MANUAL" : requerimiento.idHU })}
                placeholder="Escribe aquÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­ los detalles de tu flujo o historia de usuario si no cuentas con un archivo..."
                className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white text-sm mb-3 focus:outline-none focus:border-blue-500"
                rows="3"
              />
              
              <h3 className="text-sm font-semibold text-gray-200 mb-2">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ Notas u Observaciones (Opcional)</h3>
              <textarea
                value={requerimiento.notas || ''}
                onChange={(e) => setRequerimiento({ ...requerimiento, notas: e.target.value })}
                placeholder="Puntos a tomar en cuenta, restricciones de horario, tokens especiales..."
                className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white text-sm focus:outline-none focus:border-blue-500"
                rows="2"
              />
            </div>
          
            

          </div>
        )}

        {/* PESTAÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¹Ãƒâ€¦Ã¢â‚¬Å“A 2: ORQUESTADOR N8N */}
        {pestanaActiva === 'n8n' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-full text-xs font-semibold text-cyan-300 mb-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>MÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³dulo Funcional: AutomatizaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n con n8n</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  OrquestaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n de Flujos & Webhooks en Vivo
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Prueba la recepciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n de peticiones HTTP, validaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n de schemas JSON y despacho de alertas en tiempo real.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={tipoEvento}
                  onChange={cambiarEvento}
                  className="bg-slate-950 border border-slate-700 text-xs text-cyan-300 font-semibold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="lead">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ Captura de Lead / CotizaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n</option>
                  <option value="bug">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âº Reporte de Defecto (Jira QA)</option>
                  <option value="api-health">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âº Health-Check API SPEI</option>
                </select>

                <button
                  onClick={descargarBlueprintN8N}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¥</span>
                  <span>Descargar Workflow (.JSON)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">MÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©todo & Endpoint HTTP POST:</label>
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
                      <p className="text-rose-400 text-[11px] font-semibold mt-1">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â {errorJson}</p>
                    )}
                  </div>

                  <button
                    onClick={ejecutarFlujoN8n}
                    disabled={ejecutandoN8n}
                    className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition transform active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>{ejecutandoN8n ? 'ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â' : 'ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡'}</span>
                    <span>{ejecutandoN8n ? 'Ejecutando Nodos n8n...' : 'Disparar Webhook & Flujo en Vivo'}</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â</span>
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
                      ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ HTTP {logSalida.status} OK ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Latencia: {logSalida.tiempoTotal}
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