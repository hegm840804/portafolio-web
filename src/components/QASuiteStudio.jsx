import { useState } from 'react';
import N8NOrchestrator from './N8NOrchestrator';

export default function QASuiteStudio({ onOpenContact }) {
  const [pestanaActiva, setPestanaActiva] = useState('matriz'); // 'matriz' | 'n8n'

  const [pasoMP, setPasoMP] = useState(1);
  const [nivelSeleccionado, setNivelSeleccionado] = useState('semi');
  const [archivoReqNombre, setArchivoReqNombre] = useState(null);
  const [vistaPreviaReqImg, setVistaPreviaReqImg] = useState(null);

  const [requerimiento, setRequerimiento] = useState({
    idHU: 'HU-SPEI-104',
    prefijoID: 'SPEI',
    titulo: 'Módulo de Transferencias Interbancarias SPEI en Tiempo Real',
    descripcion: 'Como cuentahabiente, deseo transferir fondos a cuentas CLABE.',
    descripcionManual: '',
    notas: '',
    origen: 'Especificación Core Bancario / FinTech'
  });

  const resetearProyecto = () => {
    setRequerimiento({ idHU: '', prefijoID: '', descripcionManual: '', notas: '' });
    setArchivoReqNombre(null);
    setVistaPreviaReqImg(null);
  };

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

      setRequerimiento(prev => ({
        ...prev,
        idHU: 'REQ-' + prefijoDinamico,
        prefijoID: prefijoDinamico,
        titulo: 'Requerimiento: ' + file.name,
        origen: 'Archivo local (' + file.name + ')'
      }));
    }
  };

  const columnasPersonalizadas = [
    'ID_Caso', 'Modulo_Core', 'Requerimiento_Asociado', 'Descripcion_Escenario',
    'Tipo_Validacion', 'Precondiciones', 'Pasos_Detallados', 'Valores_Entrada_TestData',
    'Comportamiento_Esperado', 'Severidad', 'Estado'
  ];

  const generarSuitePorNivel = (prefijo, nivel) => {
    let distribucion = [
      { code: 'HP', name: 'Happy Path', casos: 15 },
      { code: 'TTF', name: 'Test to Fail / Frontera', casos: 15 },
      { code: 'SMK', name: 'Smoke Test', casos: 10 },
      { code: 'CON', name: 'Concurrencia', casos: 10 },
      { code: 'SEC', name: 'Seguridad (XSS/SQLi)', casos: 10 },
      { code: 'RES', name: 'Resiliencia / Rollback', casos: 8 },
      { code: 'SQL', name: 'Auditoría SQL', casos: 7 }
    ];

    let suite = [];
    distribucion.forEach(seccion => {
      for (let i = 1; i <= seccion.casos; i++) {
        const idCaso = `TC-${prefijo || 'GEN'}-${seccion.code}-${String(i).padStart(2, '0')}`;
        suite.push({
          id: idCaso,
          tipo: `${seccion.name} #${i}`,
          categoriaMetrica: seccion.code,
          valores: {
            'ID_Caso': idCaso,
            'Modulo_Core': `${prefijo || 'CORE'} / Módulo ${seccion.name}`,
            'Requerimiento_Asociado': requerimiento.idHU || 'REQ-GENERAL',
            'Descripcion_Escenario': `Validación (${seccion.name}) #${i} [Notas: ${requerimiento.notas || 'Sin observaciones'}]`,
            'Tipo_Validacion': `QA ${nivel.toUpperCase()} - ${seccion.name}`,
            'Precondiciones': `Servicios activos para ${idCaso}.`,
            'Pasos_Detallados': `1. Configurar datos.\n2. Ejecutar prueba.\n3. Validar BD.`,
            'Valores_Entrada_TestData': `Dataset_${seccion.code}_${i}`,
            'Comportamiento_Esperado': `El sistema cumple con la regla para ${seccion.name}.`,
            'Severidad': i <= 2 ? 'Crítica' : 'Alta',
            'Estado': 'Listo para Ejecución'
          }
        });
      }
    });
    return { suite, distribucion };
  };

  const resultadoGeneracion = generarSuitePorNivel(requerimiento.prefijoID, nivelSeleccionado);
  const suiteCompleta = resultadoGeneracion.suite;

  const exportarCSVLimpo = () => {
    let csv = '\uFEFF' + columnasPersonalizadas.join(',') + '\n';
    suiteCompleta.forEach((c) => {
      const fila = columnasPersonalizadas.map(col => {
        let val = c.valores[col] || 'N/A';
        return '"' + val.replace(/"/g, '""') + '"';
      });
      csv += fila.join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Suite_QA_${requerimiento.prefijoID || 'General'}_${nivelSeleccionado.toUpperCase()}.csv`;
    link.click();
  };

  return (
    <section id="automatizaciones" className="max-w-6xl mx-auto px-4 py-16 w-full scroll-mt-24">
      {/* SELECTOR DE PESTAÑAS PRINCIPALES */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 rounded-2xl shadow-xl">
          <button
            onClick={() => setPestanaActiva('matriz')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              pestanaActiva === 'matriz'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📋</span>
            <span>1. Generador de Matriz QA ({suiteCompleta.length} Casos)</span>
          </button>

          <button
            onClick={() => setPestanaActiva('n8n')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              pestanaActiva === 'n8n'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⚙️</span>
            <span>2. Orquestador n8n & Webhooks</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        {pestanaActiva === 'matriz' ? (
          <div className="space-y-6 text-slate-100">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                  Archivo 1: Ingreso de Requerimiento, Redacción Manual y Notas
                </h3>
                <p className="text-xs text-slate-400 mt-1">Sube un archivo o escribe los detalles y notas del requerimiento actual.</p>
              </div>
              <button 
                onClick={resetearProyecto} 
                className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition"
              >
                🗑️ Limpiar Proyecto
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Carga de archivo */}
              <div className="bg-slate-950 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-5 text-center space-y-2">
                <p className="text-xs font-bold text-white">{archivoReqNombre ? ('Cargado: ' + archivoReqNombre) : 'Examinar Archivo'}</p>
                <label className="inline-block bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 font-semibold px-4 py-2 rounded-xl transition cursor-pointer text-xs">
                  <input type="file" onChange={manejarSubidaReq} className="hidden" />
                  Seleccionar Archivo
                </label>
              </div>

              {/* Redacción manual y Notas */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">✍️ Requerimiento Manual</label>
                  <textarea
                    value={requerimiento.descripcionManual}
                    onChange={(e) => setRequerimiento({ ...requerimiento, descripcionManual: e.target.value })}
                    placeholder="Escribe tu flujo o HU aquí..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">📌 Notas u Observaciones (Opcional)</label>
                  <textarea
                    value={requerimiento.notas}
                    onChange={(e) => setRequerimiento({ ...requerimiento, notas: e.target.value })}
                    placeholder="Puntos a tomar en cuenta, restricciones..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                    rows="2"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-mono">Suite generada: {suiteCompleta.length} casos listos</span>
              <button
                onClick={exportarCSVLimpo}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition cursor-pointer"
              >
                📥 Descargar Matriz CSV (UTF-8)
              </button>
            </div>
          </div>
        ) : (
          <N8NOrchestrator />
        )}
      </div>
    </section>
  );
}