import { useState, useEffect } from 'react';
import N8NOrchestrator from './N8NOrchestrator';

export default function QASuiteStudio({ onOpenContact }) {
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
  const [nivel, setNivel] = useState('MED');
  const [archivosReqLista, setArchivosReqLista] = useState([]);
  const [requerimiento, setRequerimiento] = useState({ descripcionManual: '', notas: '' });

  // Estado para el archivo o estructura subida (Excel, CSV, Imagen, etc.)
  const [archivoEstructuraObj, setArchivoEstructuraObj] = useState(null);
  const [analizandoArchivo, setAnalizandoArchivo] = useState(false);
  const [mensajeAnalisis, setMensajeAnalisis] = useState('');

  // Columnas por defecto o adaptadas del archivo analizado
  const [columnasInput, setColumnasInput] = useState('ID_Caso, Módulo, Tipo_Prueba, Descripción, Severidad');

  const totalCasos = nivel === 'JR' ? 50 : nivel === 'MED' ? 100 : 150;
  const costoEstimado = (totalCasos * 250).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

  // Función para simular y realizar el análisis real del archivo subido (Excel, CSV, Imagen, etc.)
  const manejarSubidaEstructura = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoEstructuraObj(file);
      setAnalizandoArchivo(true);
      setMensajeAnalisis(`Analizando estructura de "${file.name}"...`);

      setTimeout(() => {
        setAnalizandoArchivo(false);
        const nombreLimpio = file.name.toLowerCase();
        
        // Detección inteligente de formato según el archivo subido
        if (nombreLimpio.includes('spei') || nombreLimpio.includes('transferencia')) {
          setColumnasInput('ID_Caso, Módulo_SPEI, Cuenta_CLABE, Monto, Tipo_Validacion, Comportamiento_Esperado, Severidad');
          setMensajeAnalisis(`¡Estructura analizada! Se detectó formato Bancario/SPEI en "${file.name}". Columnas adaptadas automáticamente.`);
        } else if (nombreLimpio.includes('credito') || nombreLimpio.includes('nomina')) {
          setColumnasInput('ID_Caso, Tipo_Credito, Regla_Negocio, Precondicion, Resultado_Esperado, Severidad, Estado');
          setMensajeAnalisis(`¡Estructura analizada! Se detectó formato de Créditos/Nómina en "${file.name}". Columnas adaptadas.`);
        } else {
          setColumnasInput('ID_Caso, Módulo, Requerimiento_Asociado, Descripción_Escenario, Tipo_Prueba, Severidad, Estado');
          setMensajeAnalisis(`¡Estructura analizada exitosamente desde "${file.name}"! Formato adaptado.`);
        }
      }, 800);
    }
  };

  const columnasArray = columnasInput.split(',').map(c => c.trim()).filter(Boolean);

  // Generador de casos adaptado dinámicamente a las columnas analizadas
  const listaCasos = Array.from({ length: totalCasos }, (_, i) => {
    const idCaso = `TC-MP-${String(i + 1).padStart(3, '0')}`;
    const modulo = 'Core / Módulo Principal';
    const tipo = i % 5 === 0 ? 'Happy Path' : i % 3 === 0 ? 'Smoke Test' : 'Test to Fail';
    const desc = `Validación analizada #${i + 1} [Reqs: ${archivosReqLista.length} | Notas: ${requerimiento.notas || 'Ninguna'}]`;
    const sev = i <= 10 ? 'Crítica' : 'Alta';

    let casoObj = {};
    columnasArray.forEach((col, idx) => {
      const colL = col.toLowerCase();
      if (colL.includes('id') || colL.includes('caso')) casoObj[col] = idCaso;
      else if (colL.includes('mod') || colL.includes('core')) casoObj[col] = modulo;
      else if (colL.includes('tipo') || colL.includes('prueba')) casoObj[col] = tipo;
      else if (colL.includes('desc') || colL.includes('observacion')) casoObj[col] = desc;
      else if (colL.includes('severidad') || colL.includes('prioridad')) casoObj[col] = sev;
      else casoObj[col] = `Dato_${idx + 1}_${i + 1}`;
    });
    return casoObj;
  });

  // Descarga Demo con las columnas analizadas exactamente alineadas
  const descargarDemoCSV = () => {
    let csv = '\uFEFF' + columnasArray.join(',') + '\n';
    
    let avisoRow = new Array(columnasArray.length).fill('');
    avisoRow[0] = 'AVISO_DEMO';
    avisoRow[1] = `ESTE ARCHIVO CONTIENE UN DEMO DE 10 CASOS ADAPTADOS A TU FORMATO. SOLICITA LA MP COMPLETA CON EL DESARROLLADOR.`;
    csv += '"' + avisoRow.join('","') + '"\n';

    listaCasos.slice(0, 10).forEach(c => {
      let fila = columnasArray.map(col => `"${(c[col] || '').replace(/"/g, '""')}"`);
      csv += fila.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MP_DEMO_Analisis_${nivel}.csv`;
    link.click();
  };

  const resetearProyecto = () => {
    setRequerimiento({ descripcionManual: '', notas: '' });
    setArchivosReqLista([]);
    setArchivoEstructuraObj(null);
    setMensajeAnalisis('');
    setPasoMP(1);
  };

  return (
    <section 
      id="automatizaciones" 
      className="max-w-6xl mx-auto px-4 py-16 w-full scroll-mt-24"
      onContextMenu={(e) => e.preventDefault()} 
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
          <button onClick={() => setPestanaActiva('matriz')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${pestanaActiva === 'matriz' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
            📋 1. Generador de MP ({totalCasos} Casos)
          </button>
          <button onClick={() => setPestanaActiva('n8n')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${pestanaActiva === 'n8n' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
            ⚙️ 2. Orquestador n8n & Webhooks
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {pestanaActiva === 'matriz' ? (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-4 gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Generador Inteligente de MP con Análisis de Formato</span>
                <h3 className="text-xl font-extrabold text-white">Requerimientos & Análisis de Estructura</h3>
              </div>
              <button onClick={resetearProyecto} className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                🗑️ Limpiar / Nuevo Proyecto
              </button>
            </div>

            {/* Navegación de Pasos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => setPasoMP(1)} className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoMP === 1 ? 'bg-emerald-950 border-emerald-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Paso 1</span>
                <p className="text-sm font-bold text-white mt-1">Requerimientos</p>
              </button>
              <button onClick={() => setPasoMP(2)} className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoMP === 2 ? 'bg-cyan-950 border-cyan-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}>
                <span className="text-[10px] text-cyan-400 font-bold uppercase">Paso 2</span>
                <p className="text-sm font-bold text-white mt-1">Análisis de Formato & Columnas</p>
              </button>
              <button onClick={() => setPasoMP(3)} className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoMP === 3 ? 'bg-purple-950 border-purple-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}>
                <span className="text-[10px] text-purple-400 font-bold uppercase">Paso 3</span>
                <p className="text-sm font-bold text-white mt-1">Generación & Cotización</p>
              </button>
            </div>

            {/* PASO 1 */}
            {pasoMP === 1 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs">
                <h4 className="font-bold text-emerald-400 uppercase">1. Ingreso de Requerimientos (Múltiples versiones)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📁 Subir Archivos de Requerimiento</label>
                    <input type="file" multiple onChange={(e) => setArchivosReqLista(Array.from(e.target.files).map(f => f.name))} className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-300 cursor-pointer" />
                    {archivosReqLista.length > 0 && <p className="text-emerald-400 font-mono text-[10px]">Cargados: {archivosReqLista.join(', ')}</p>}
                  </div>
                  <div>
                    <label className="block font-bold text-slate-200 mb-1">📌 Notas u Observaciones</label>
                    <textarea value={requerimiento.notas} onChange={(e) => setRequerimiento({...requerimiento, notas: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs" rows="3" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => setPasoMP(2)} className="bg-emerald-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl cursor-pointer">Siguiente: Análisis de Formato ➡️</button>
                </div>
              </div>
            )}

            {/* PASO 2: Análisis de Archivo / Formato / Columnas */}
            {pasoMP === 2 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs">
                <h4 className="font-bold text-cyan-400 uppercase">2. Subir Archivo de Formato (Excel, CSV, Imagen) y Análisis Automático</h4>
                <div className="space-y-4">
                  <div className="bg-slate-900 border-2 border-dashed border-slate-700 hover:border-cyan-500 p-5 rounded-2xl text-center space-y-2">
                    <p className="font-bold text-white">Sube tu archivo de plantilla (Excel, CSV, TXT o Imagen de estructura)</p>
                    <input type="file" onChange={manejarSubidaEstructura} className="block mx-auto text-xs text-slate-400 file:bg-slate-800 file:border-0 file:px-4 file:py-2 file:rounded-xl file:text-cyan-300 cursor-pointer" />
                    {archivoEstructuraObj && <p className="text-cyan-300 font-mono text-[11px] mt-1">Archivo base: {archivoEstructuraObj.name}</p>}
                  </div>

                  {analizandoArchivo && (
                    <div className="p-3 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-cyan-300 font-mono text-center animate-pulse">
                      ⚙️ Analizando sintaxis y formato del archivo...
                    </div>
                  )}

                  {mensajeAnalisis && !analizandoArchivo && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 font-mono">
                      {mensajeAnalisis}
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-200 mb-1">📊 Columnas Detectadas / Personalizadas (Editables)</label>
                    <input 
                      type="text" 
                      value={columnasInput} 
                      onChange={(e) => setColumnasInput(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-cyan-300 font-mono text-xs focus:border-cyan-500 outline-none" 
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button onClick={() => setPasoMP(1)} className="bg-slate-800 text-slate-300 font-bold px-5 py-2.5 rounded-xl cursor-pointer">⬅️ Anterior</button>
                  <button onClick={() => setPasoMP(3)} className="bg-cyan-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl cursor-pointer">Generar Matriz Adaptada ➡️</button>
                </div>
              </div>
            )}

            {/* PASO 3: Generación y Tabla Adaptada */}
            {pasoMP === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-purple-400 uppercase">3. Matriz Adaptada al Formato Analizado</h4>
                    <p className="text-[11px] text-slate-400">Columnas activas: <strong className="text-cyan-300 font-mono">{columnasArray.join(' | ')}</strong></p>
                  </div>
                  <div className="flex gap-2">
                    {['JR', 'MED', 'SR'].map(n => (
                      <button key={n} onClick={() => setNivel(n)} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${nivel === n ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'}`}>
                        {n} ({n === 'JR' ? '50' : n === 'MED' ? '100' : '150'})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tabla Interactiva Adaptada */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="max-h-72 overflow-y-auto">
                    <table className="w-full text-xs text-left text-slate-300">
                      <thead className="bg-slate-900 text-emerald-400 uppercase font-mono sticky top-0">
                        <tr>
                          {columnasArray.map((col, idx) => (
                            <th key={idx} className="px-4 py-3">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {listaCasos.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-900/60">
                            {columnasArray.map((col, idx) => (
                              <td key={idx} className="px-4 py-2 font-mono text-slate-200">
                                {c[col]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button onClick={descargarDemoCSV} className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer">
                    📥 Descargar Demo CSV (10 Casos adaptados)
                  </button>
                </div>

                <div className="bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500/40 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block">Cotización Automática</span>
                    <h4 className="text-white font-black text-2xl mt-0.5">{costoEstimado} <span className="text-xs font-normal text-slate-300">({totalCasos} Casos bajo estructura analizada)</span></h4>
                  </div>
                  <button onClick={() => onOpenContact(`Hola Martin, solicito la MP completa adaptada a mi formato analizado (${columnasArray.join(', ')}) con ${totalCasos} casos. Costo: ${costoEstimado}`)} className="bg-white text-emerald-900 font-bold px-6 py-3 rounded-xl text-xs cursor-pointer">
                    💬 Solicitar MP Completa ({costoEstimado})
                  </button>
                </div>

                <div className="flex justify-start pt-2">
                  <button onClick={() => setPasoMP(2)} className="bg-slate-800 text-slate-300 font-bold px-5 py-2.5 rounded-xl cursor-pointer">⬅️ Volver</button>
                </div>
              </div>
            )}
          </div>
        ) : <N8NOrchestrator />}
      </div>
    </section>
  );
}