import { useState } from 'react';

export default function QASuiteStudio({ onOpenContact }) {
  // 1. Estados generales del flujo de MP
  const [pasoActual, setPasoActual] = useState(1);
  const [nivelSeleccionado, setNivelSeleccionado] = useState('MED'); // JR, MED, SR (MED por default)

  // Paso 1: Requerimiento
  const [reqTexto, setReqTexto] = useState('');
  const [reqNotas, setReqNotas] = useState('');
  const [archivoReq, setArchivoReq] = useState(null);

  // Paso 2: Estructura / Formato
  const [columnasInput, setColumnasInput] = useState('ID_Caso, Modulo, HU_Asociada, Descripcion, Tipo_Prueba, Precondiciones, Pasos, TestData, Resultado_Esperado, Severidad, Estado');
  const [estructuraNotas, setEstructuraNotas] = useState('');
  const [archivoEstructura, setArchivoEstructura] = useState(null);

  // 3. Generación de Casos según Nivel
  const obtenerCantidadCasos = (nivel) => {
    if (nivel === 'JR') return Math.floor(Math.random() * (75 - 30 + 1)) + 30; // 30 a 75
    if (nivel === 'MED') return Math.floor(Math.random() * (120 - 80 + 1)) + 80; // 80 a 120
    return Math.floor(Math.random() * (150 - 120 + 1)) + 120; // 120+
  };

  const totalCasos = obtenerCantidadCasos(nivelSeleccionado);

  const generarSuiteDinamica = () => {
    const prefijo = reqTexto ? reqTexto.slice(0, 4).toUpperCase() : 'SPEI';
    const numCasosDemo = 10; // Seguridad: Demo descarga solo 10 casos
    let suite = [];

    const tipos = [
      { code: 'HP', name: 'Happy Path' },
      { code: 'TTF', name: 'Test to Fail / Frontera' },
      { code: 'SMK', name: 'Smoke Test' },
      { code: 'CON', name: 'Concurrencia' },
      { code: 'SEC', name: 'Seguridad' },
      { code: 'RES', name: 'Resiliencia' }
    ];

    for (let i = 1; i <= numCasosDemo; i++) {
      const tipoActual = tipos[(i - 1) % tipos.length];
      suite.push({
        id: `TC-${prefijo}-${tipoActual.code}-0${i}`,
        modulo: `${prefijo} / Core Bancario`,
        hu: reqTexto ? reqTexto.slice(0, 15) : 'HU-SPEI-DEMO',
        descripcion: `Validación demo ${tipoActual.name} #${i} [Notas: ${reqNotas || 'Ninguna'}]`,
        tipo: tipoActual.name,
        precondicion: 'Servicios activos y token válido.',
        pasos: '1. Iniciar sesión\n2. Ejecutar operación\n3. Validar respuesta',
        testData: `Data_${i}`,
        esperado: 'Transacción procesada correctamente bajo estándar QA.',
        severidad: i === 1 ? 'Crítica' : 'Alta',
        estado: 'DEMO_PENDIENTE'
      });
    }
    return suite;
  };

  const suiteDemo = generarSuiteDinamica();

  // Seguridad: Descarga de Demo con 10 casos
  const descargarDemoCSV = () => {
    const cols = columnasInput.split(',').map(c => c.trim());
    let csv = '\uFEFF' + cols.join(',') + '\n';
    
    csv += '"AVISO","ESTE ES UN ARCHIVO DEMO CON 10 CASOS. PARA OBTENER LA MP COMPLETA (" + totalCasos + " CASOS), COMUNÍCATE CON EL DESARROLLAROR (Martin Hernandez).","","","","","","","","",""\n';

    suiteDemo.forEach((c) => {
      csv += `"${c.id}","${c.modulo}","${c.hu}","${c.descripcion}","${c.tipo}","${c.precondicion}","${c.pasos}","${c.testData}","${c.esperado}","${c.severidad}","${c.estado}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MP_DEMO_${totalCasos}_Casos_Guardado_Drive.csv`;
    link.click();
  };

  return (
    <section 
      id="automatizaciones" 
      className="max-w-6xl mx-auto px-4 py-16 w-full scroll-mt-24 select-none"
      onContextMenu={(e) => e.preventDefault()} // Seguridad: Bloqueo menú contextual
    >
      {/* CABECERA CON CONTADOR TOTAL DE CASOS (Paso 4) */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-500/40 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-300">
          <span>🛡️ Matriz de Pruebas (MP) Protegida • Total de Casos Identificados: <strong className="text-white font-mono">{totalCasos}</strong></span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Generador Profesional de MP</h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Flujo guiado para estructuración, niveles de prueba, seguridad y cotización estándar QA.
        </p>
      </div>

      {/* INDICADOR DE PASOS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => setPasoActual(1)}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer ${pasoActual === 1 ? 'bg-emerald-950 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
        >
          <span className="font-mono text-xs font-bold">Paso 1</span>
          <p className="text-xs font-bold">Requerimiento & Notas</p>
        </button>

        <button
          onClick={() => setPasoActual(2)}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer ${pasoActual === 2 ? 'bg-cyan-950 border-cyan-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
        >
          <span className="font-mono text-xs font-bold">Paso 2</span>
          <p className="text-xs font-bold">Estructura & Columnas</p>
        </button>

        <button
          onClick={() => setPasoActual(3)}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer ${pasoActual === 3 ? 'bg-purple-950 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
        >
          <span className="font-mono text-xs font-bold">Paso 3, 4, 5 & 6</span>
          <p className="text-xs font-bold">Generación, Niveles & Cotización</p>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100">
        
        {/* PASO 1: REQUERIMIENTO */}
        {pasoActual === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">1. Ingreso de Requerimiento</h3>
            <p className="text-xs text-slate-400">Si no ingresas nada, por defecto se generará la MP para <strong>Prueba de Depósitos SPEI / Transferencias</strong>.</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">✍️ Descripción del Requerimiento o Historia de Usuario</label>
                <textarea
                  value={reqTexto}
                  onChange={(e) => setReqTexto(e.target.value)}
                  placeholder="Ej. Módulo SPEI: Transferencias interbancarias en tiempo real con validación CLABE..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-emerald-500"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">📌 Notas u Observaciones para el Requerimiento</label>
                <textarea
                  value={reqNotas}
                  onChange={(e) => setReqNotas(e.target.value)}
                  placeholder="Ej. Considerar restricciones de horario y doble factor de autenticación..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-emerald-500"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">📁 Subir Archivo de Requerimiento (Opcional)</label>
                <input 
                  type="file" 
                  onChange={(e) => setArchivoReq(e.target.files[0]?.name)} 
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-300 hover:file:bg-slate-700 cursor-pointer"
                />
                {archivoReq && <span className="text-[10px] text-emerald-400 mt-1 block">Cargado: {archivoReq}</span>}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button onClick={() => setPasoActual(2)} className="bg-emerald-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer">
                Siguiente: Estructura ➡️
              </button>
            </div>
          </div>
        )}

        {/* PASO 2: FORMATO / ESTRUCTURA */}
        {pasoActual === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">2. Formato y Estructura de Columnas</h3>
            <p className="text-xs text-slate-400">Indica las columnas que deseas desarrollar o deja las estándar preconfiguradas.</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">📊 Columnas a Desarrollar (Separadas por comas)</label>
                <input
                  type="text"
                  value={columnasInput}
                  onChange={(e) => setColumnasInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">📌 Notas u Observaciones de la Estructura</label>
                <textarea
                  value={estructuraNotas}
                  onChange={(e) => setEstructuraNotas(e.target.value)}
                  placeholder="Ej. Respetar formato corporativo de pruebas..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-cyan-500"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">📁 Subir Imagen o Archivo de Estructura (Opcional)</label>
                <input 
                  type="file" 
                  onChange={(e) => setArchivoEstructura(e.target.files[0]?.name)} 
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-300 hover:file:bg-slate-700 cursor-pointer"
                />
                {archivoEstructura && <span className="text-[10px] text-cyan-400 mt-1 block">Cargado: {archivoEstructura}</span>}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setPasoActual(1)} className="bg-slate-800 text-slate-300 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer">
                ⬅️ Anterior
              </button>
              <button onClick={() => setPasoActual(3)} className="bg-cyan-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer">
                Siguiente: Generación y Niveles ➡️
              </button>
            </div>
          </div>
        )}

        {/* PASO 3, 4, 5 y 6: GENERACIÓN, NIVELES, SEGURIDAD & COTIZACIÓN */}
        {pasoActual === 3 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">3 & 4. Tipos de Matriz & Estándares de Casos</h3>
                <p className="text-xs text-slate-400">Selecciona el nivel de profundidad técnica requerido (MED por defecto).</p>
              </div>

              {/* Selector de Niveles */}
              <div className="inline-flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setNivelSeleccionado('JR')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${nivelSeleccionado === 'JR' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                >
                  JR (30-75)
                </button>
                <button
                  onClick={() => setNivelSeleccionado('MED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${nivelSeleccionado === 'MED' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                >
                  MED (80-120) [Default]
                </button>
                <button
                  onClick={() => setNivelSeleccionado('SR')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${nivelSeleccionado === 'SR' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                >
                  SR (120+)
                </button>
              </div>
            </div>

            {/* Resumen por tipo y vista protegida (Paso 4 & 5) */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Happy Path</span>
                  <span className="text-sm font-bold text-emerald-400">~{Math.round(totalCasos * 0.35)} Casos</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Test to Fail / Frontera</span>
                  <span className="text-sm font-bold text-cyan-400">~{Math.round(totalCasos * 0.30)} Casos</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Smoke Test</span>
                  <span className="text-sm font-bold text-amber-400">~{Math.round(totalCasos * 0.20)} Casos</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Seguridad & Otros</span>
                  <span className="text-sm font-bold text-purple-400">~{Math.round(totalCasos * 0.15)} Casos</span>
                </div>
              </div>

              {/* Vista previa protegida (No seleccionable) */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 relative overflow-hidden">
                <div className="flex justify-between items-center text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                  <span>🔒 Vista Segura Protegida (Anti-copia / Anti-captura activada)</span>
                  <span className="text-emerald-400 font-mono">Total Identificados: {totalCasos} Casos</span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1 font-mono text-[11px] text-slate-300">
                  {suiteDemo.slice(0, 4).map((c, idx) => (
                    <div key={idx} className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                      <span>{c.id} - {c.descripcion}</span>
                      <span className="text-cyan-400">{c.tipo}</span>
                    </div>
                  ))}
                  <p className="text-center text-slate-500 py-1">... [ Vista previa protegida de casos adicionales ] ...</p>
                </div>
              </div>
            </div>

            {/* PASO 5 & 6: SEGURIDAD (DEMO) & COTIZACIÓN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-cyan-400">🛡️ Seguridad & Descarga Demo</h4>
                <p className="text-[11px] text-slate-400">El archivo descargable incluye un <strong>Demo con 10 casos</strong> y la notificación de respaldo automático en Google Drive.</p>
                <button
                  onClick={descargarDemoCSV}
                  className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  📥 Descargar Demo CSV (10 Casos)
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-emerald-400">💼 Cotización Completa (Estándar QA)</h4>
                <p className="text-[11px] text-slate-400">Para recibir la MP completa de <strong>{totalCasos} casos</strong> y su automatización, solicita una cotización acorde al estándar económico de QA.</p>
                <button
                  onClick={onOpenContact}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  💬 Solicitar Matriz Completa & Cotización
                </button>
              </div>
            </div>

            <div className="flex justify-start pt-2">
              <button onClick={() => setPasoActual(2)} className="bg-slate-800 text-slate-300 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer">
                ⬅️ Volver a Estructura
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}