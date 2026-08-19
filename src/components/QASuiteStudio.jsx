import { useState, useEffect } from 'react';
import N8NOrchestrator from './N8NOrchestrator';

export default function QASuiteStudio({ onOpenContact }) {
  // 5. SEGURIDAD INVISIBLE: Bloquea herramientas de dev, atajos y selección sin alertas visuales
  useEffect(() => {
    const handler = (e) => {
      if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67))) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const [pestanaActiva, setPestanaActiva] = useState('matriz');
  const [pasoMP, setPasoMP] = useState(1);
  
  // 3. NIVEL POR DEFAULT: MED (80 a 120 casos)
  const [nivel, setNivel] = useState('MED');
  
  // 1. PASO 1: Requerimientos, múltiples archivos, historia de usuario y notas
  const [archivosReqLista, setArchivosReqLista] = useState([]);
  const [historiaUsuario, setHistoriaUsuario] = useState('');
  const [notasReq, setNotasReq] = useState('');

  // 2. PASO 2: Estructura, imagen/archivo subido o columnas manuales
  const [archivoEstructura, setArchivoEstructura] = useState(null);
  const [columnasManuales, setColumnasManuales] = useState('');
  const [notasEstructura, setNotasEstructura] = useState('');

  // 3. CÁLCULO DE LÍMITES SEGÚN NIVEL
  const totalCasos = nivel === 'JR' ? 50 : nivel === 'MED' ? 100 : 135;
  
  // 6. COTIZACIÓN AUTOMÁTICA (Rango de $750 a $2,500 MXN)
  const costoMin = nivel === 'JR' ? 750 : nivel === 'MED' ? 1400 : 2500;
  const costoEstimado = costoMin.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

  // 2. DETECCIÓN DE COLUMNAS (Prioridad: Archivo subido > Columnas manuales > Estándar SPEI)
  const obtenerColumnasActivas = () => {
    if (columnasManuales.trim()) {
      return columnasManuales.split(',').map(c => c.trim()).filter(Boolean);
    }
    if (archivoEstructura) {
      const nombre = archivoEstructura.name.toLowerCase();
      if (nombre.includes('credito') || nombre.includes('nomina')) {
        return ['ID', 'Proceso', 'Sub-Proceso', 'Descripción de Prueba', 'Tipo de Prueba', 'Severidad', 'Estado'];
      }
    }
    // Columnas estándar por defecto
    return ['ID_Caso', 'Módulo', 'Tipo_Prueba', 'Descripción_Escenario', 'Severidad', 'Estado'];
  };

  const columnasArray = obtenerColumnasActivas();

  // 1 & 4. ANÁLISIS DE CASOS REALES Y RESUMEN POR TIPOLOGÍA
  const generarCasosAnalizados = () => {
    let casos = [];
    const contextoReq = historiaUsuario.trim() || (archivosReqLista.length > 0 ? `Archivos: ${archivosReqLista.join(', ')}` : 'Depósitos SPEI / Transferencias');
    const notasContexto = notasReq.trim() || 'Sin notas adicionales';

    const tipos = ['Happy Path', 'Test to Fail', 'Smoke Test', 'Boundary Value', 'Validación de Seguridad'];

    for (let i = 1; i <= totalCasos; i++) {
      const tipoActual = tipos[(i - 1) % tipos.length];
      const idCaso = `TC-PROD-${String(i).padStart(3, '0')}`;
      
      let moduloProc = "Core SPEI / Transferencias";
      let descEscenario = `Validación formal para requerimiento: "${contextoReq}". Escenario bajo tipo ${tipoActual}. [Notas: ${notasContexto}]`;

      if (contextoReq.toLowerCase().includes('credito') || contextoReq.toLowerCase().includes('nomina')) {
        moduloProc = "Módulo de Créditos & Nómina";
        descEscenario = `Verificación de reglas de negocio en originación (${tipoActual}). Base: ${contextoReq}`;
      }

      let casoObj = {};
      columnasArray.forEach((col) => {
        const colL = col.toLowerCase();
        if (colL.includes('id') || colL.includes('caso')) casoObj[col] = idCaso;
        else if (colL.includes('mod') || colL.includes('proceso')) casoObj[col] = moduloProc;
        else if (colL.includes('sub')) casoObj[col] = `Subflujo Operativo #${i}`;
        else if (colL.includes('tipo')) casoObj[col] = tipoActual;
        else if (colL.includes('desc') || colL.includes('escenario')) casoObj[col] = descEscenario;
        else if (colL.includes('severidad') || colL.includes('prioridad')) casoObj[col] = i <= 5 ? 'Crítica' : 'Alta';
        else if (colL.includes('estado')) casoObj[col] = 'Pendiente';
        else casoObj[col] = `Valor_${col}_${i}`;
      });

      casos.push(casoObj);
    }
    return casos;
  };

  const listaCasos = generarCasosAnalizados();

  // Conteo para resumen por tipología
  const totalHP = listaCasos.filter(c => Object.values(c).includes('Happy Path')).length;
  const totalTTF = listaCasos.filter(c => Object.values(c).includes('Test to Fail')).length;
  const totalSmoke = listaCasos.filter(c => Object.values(c).includes('Smoke Test')).length;
  const totalOtros = totalCasos - (totalHP + totalTTF + totalSmoke);

  // 5. DESCARGAR DEMO (Restringido estrictamente a 10 casos + Leyenda oficial)
  const descargarDemoCSV = () => {
    let csv = '\uFEFF' + columnasArray.join(',') + '\n';
    
    let avisoRow = new Array(columnasArray.length).fill('');
    avisoRow[0] = 'AVISO_DEMO';
    avisoRow[1] = `ESTE ARCHIVO CONTIENE UN DEMO DE 10 CASOS. SI NECESITAS LA MP COMPLETA, COMUNÍCATE CON EL DESARROLLADOR.`;
    csv += '"' + avisoRow.join('","') + '"\n';

    listaCasos.slice(0, 10).forEach(c => {
      let fila = columnasArray.map(col => `"${(c[col] || '').replace(/"/g, '""')}"`);
      csv += fila.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MP_DEMO_10_Casos_${nivel}.csv`;
    link.click();
  };

  const resetearProyecto = () => {
    setArchivosReqLista([]);
    setHistoriaUsuario('');
    setNotasReq('');
    setArchivoEstructura(null);
    setColumnasManuales('');
    setNotasEstructura('');
    setNivel('MED');
    setPasoMP(1);
  };

  return (
    <section 
      id="automatizaciones" 
      className="max-w-6xl mx-auto px-4 py-16 w-full scroll-mt-24"
      onContextMenu={(e) => e.preventDefault()} 
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      {/* Selector de Pestañas */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
          <button 
            onClick={() => setPestanaActiva('matriz')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${pestanaActiva === 'matriz' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            📋 1. Generador de MP ({totalCasos} Casos Totales)
          </button>
          <button 
            onClick={() => setPestanaActiva('n8n')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${pestanaActiva === 'n8n' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            ⚙️ 2. Orquestador n8n & Webhooks
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {pestanaActiva === 'matriz' ? (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-4 gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Generador Profesional de Matriz de Pruebas (MP)</span>
                <h3 className="text-xl font-extrabold text-white">Flujo Configurable de 3 Pasos</h3>
              </div>
              <button onClick={resetearProyecto} className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                🗑️ Limpiar / Nuevo Proyecto
              </button>
            </div>

            {/* Tarjetas de Navegación de Pasos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => setPasoMP(1)} className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoMP === 1 ? 'bg-emerald-950 border-emerald-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Paso 1</span>
                <p className="text-sm font-bold text-white mt-1">Requerimiento & Versiones</p>
              </button>
              <button onClick={() => setPasoMP(2)} className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoMP === 2 ? 'bg-cyan-950 border-cyan-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}>
                <span className="text-[10px] text-cyan-400 font-bold uppercase">Paso 2</span>
                <p className="text-sm font-bold text-white mt-1">Formato o Estructura</p>
              </button>
              <button onClick={() => setPasoMP(3)} className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoMP === 3 ? 'bg-purple-950 border-purple-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}>
                <span className="text-[10px] text-purple-400 font-bold uppercase">Paso 3</span>
                <p className="text-sm font-bold text-white mt-1">Generación de Matriz ({totalCasos} Casos)</p>
              </button>
            </div>

            {/* PASO 1: Requerimiento */}
            {pasoMP === 1 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs animate-fadeIn">
                <h4 className="font-bold text-emerald-400 uppercase">1. Requerimiento (Múltiples versiones, Historia de Usuario o Notas)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📁 Subir Archivo(s) de Requerimiento (Varias versiones)</label>
                    <input 
                      type="file" 
                      multiple 
                      onChange={(e) => setArchivosReqLista(Array.from(e.target.files).map(f => f.name))} 
                      className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-300 cursor-pointer" 
                    />
                    {archivosReqLista.length > 0 && (
                      <p className="text-emerald-400 font-mono text-[11px]">Versiones cargadas: {archivosReqLista.join(', ')}</p>
                    )}

                    <label className="block font-bold text-slate-200 pt-2">✍️ Historia de Usuario / Descripción Breve (Si no tienes archivo)</label>
                    <textarea 
                      placeholder="Describe brevemente tu requerimiento..." 
                      value={historiaUsuario} 
                      onChange={(e) => setHistoriaUsuario(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs outline-none focus:border-emerald-500" 
                      rows="3" 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📌 Notas u Observaciones para el Requerimiento</label>
                    <textarea 
                      placeholder="Agrega notas especiales (Ej. Pruebas de Depósitos SPEI / Transferencias)..." 
                      value={notasReq} 
                      onChange={(e) => setNotasReq(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs outline-none focus:border-emerald-500" 
                      rows="6" 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button onClick={() => setPasoMP(2)} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl cursor-pointer transition">
                    Siguiente: Formato o Estructura ➡️
                  </button>
                </div>
              </div>
            )}

            {/* PASO 2: Formato o Estructura */}
            {pasoMP === 2 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs animate-fadeIn">
                <h4 className="font-bold text-cyan-400 uppercase">2. Formato o Estructura (Imagen, Archivo o Columnas Manuales)</h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="block font-bold text-slate-200">📁 Subir Imagen o Archivo de Estructura (Opcional)</label>
                      <input 
                        type="file" 
                        onChange={(e) => setArchivoEstructura(e.target.files[0])} 
                        className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-300 cursor-pointer" 
                      />
                      {archivoEstructura && (
                        <p className="text-cyan-300 font-mono text-[11px]">Estructura base: {archivoEstructura.name}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="block font-bold text-slate-200">📊 Indicar Columnas (Separadas por comas)</label>
                      <input 
                        type="text" 
                        placeholder="Ej: ID, Módulo, Tipo, Descripción, Severidad..." 
                        value={columnasManuales} 
                        onChange={(e) => setColumnasManuales(e.target.value)} 
                        className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-cyan-300 font-mono text-xs focus:border-cyan-500 outline-none" 
                      />
                      <p className="text-[10px] text-slate-400">Si lo dejas en blanco, se aplicarán las columnas estándar automáticamente.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-200 mb-1">📌 Observaciones o Notas de la Estructura</label>
                    <textarea 
                      placeholder="Indica notas sobre cómo estructurar la matriz..." 
                      value={notasEstructura} 
                      onChange={(e) => setNotasEstructura(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs outline-none focus:border-cyan-500" 
                      rows="3" 
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button onClick={() => setPasoMP(1)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-5 py-2.5 rounded-xl cursor-pointer">
                    ⬅️ Anterior
                  </button>
                  <button onClick={() => setPasoMP(3)} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl cursor-pointer transition">
                    Generar Matriz de Pruebas ➡️
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3: Generación de Matriz, Niveles, Resumen y Cotización */}
            {pasoMP === 3 && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Selector de Niveles (JR: 30-75, MED: 80-120 [Default], SR: 120+) */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-purple-400 uppercase">3. Generación de Matriz & Niveles</h4>
                    <p className="text-[11px] text-slate-400">Total de casos identificados: <strong className="text-white font-mono">{totalCasos} Casos</strong></p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => setNivel('JR')} 
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${nivel === 'JR' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
                    >
                      JR (30 - 75 Casos)
                    </button>
                    <button 
                      onClick={() => setNivel('MED')} 
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${nivel === 'MED' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
                    >
                      MED (80 - 120 Casos) ⭐
                    </button>
                    <button 
                      onClick={() => setNivel('SR')} 
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${nivel === 'SR' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
                    >
                      SR (120+ Casos)
                    </button>
                  </div>
                </div>

                {/* Resumen de Tipología de Casos */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Happy Path</span>
                    <span className="text-lg font-black text-emerald-400">{totalHP}</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Test to Fail</span>
                    <span className="text-lg font-black text-amber-400">{totalTTF}</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Smoke Test</span>
                    <span className="text-lg font-black text-cyan-400">{totalSmoke}</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Otros / Seguridad</span>
                    <span className="text-lg font-black text-purple-400">{totalOtros}</span>
                  </div>
                </div>

                {/* Tabla Interactiva */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="max-h-72 overflow-y-auto">
                    <table className="w-full text-xs text-left text-slate-300">
                      <thead className="bg-slate-900 text-emerald-400 uppercase font-mono sticky top-0 shadow-sm">
                        <tr>
                          {columnasArray.map((col, idx) => (
                            <th key={idx} className="px-4 py-3">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {listaCasos.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-900/60 align-top">
                            {columnasArray.map((col, idx) => (
                              <td key={idx} className="px-4 py-3 font-mono text-slate-200 whitespace-pre-line">
                                {c[col]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Botón de Descarga Demo (Restringido a 10 casos + Leyenda) */}
                <div className="flex justify-end">
                  <button 
                    onClick={descargarDemoCSV}
                    className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-md"
                  >
                    <span>📥 Descargar Archivo Demo (10 Casos)</span>
                  </button>
                </div>

                {/* Cotización Comercial (Rango $750 a $2,500 MXN) */}
                <div className="bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border border-emerald-500/40 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block">Cotización Automática (Rango $750 - $2,500 MXN)</span>
                    <h4 className="text-white font-black text-2xl mt-0.5">{costoEstimado} <span className="text-xs font-normal text-slate-300">({totalCasos} Escenarios de Prueba Nivel {nivel})</span></h4>
                    <p className="text-[10px] text-slate-300 mt-1">* Nota comercial: Contiene escenarios de prueba optimizados (No es la matriz final de ejecución corporativa).</p>
                  </div>
                  <button 
                    onClick={() => onOpenContact(`Hola Martin, solicito la MP completa para el nivel ${nivel} (${totalCasos} casos). La cotización estimada es de ${costoEstimado}. ¿Podemos coordinar la entrega y respaldo en Google Drive?`)}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition cursor-pointer"
                  >
                    💬 Solicitar MP Completa & Cotización ({costoEstimado})
                  </button>
                </div>

                <div className="flex justify-start pt-2">
                  <button onClick={() => setPasoMP(2)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer">
                    ⬅️ Volver a Estructura
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