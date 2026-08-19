import { useState, useEffect } from 'react';
import N8NOrchestrator from './N8NOrchestrator';

export default function QASuiteStudio({ onOpenContact }) {
  // SEGURIDAD INVISIBLE: Bloquea herramientas de desarrollador y selección de texto
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
  
  // Soporte para múltiples archivos de requerimientos
  const [archivosReqLista, setArchivosReqLista] = useState([]);
  const [archivoEstructura, setArchivoEstructura] = useState(null);
  const [requerimiento, setRequerimiento] = useState({ descripcionManual: '', notas: '' });

  const totalCasos = nivel === 'JR' ? 50 : nivel === 'MED' ? 100 : 150;
  const costoEstimado = (totalCasos * 250).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

  const listaCasos = Array.from({ length: totalCasos }, (_, i) => ({
    id: `TC-SPEI-${String(i + 1).padStart(3, '0')}`,
    modulo: 'Core SPEI / Transferencias',
    tipo: i % 5 === 0 ? 'Happy Path' : i % 3 === 0 ? 'Smoke Test' : 'Test to Fail',
    descripcion: `Validación de flujo #${i + 1} [Versiones: ${archivosReqLista.length} archivos | Notas: ${requerimiento.notas || 'Ninguna'}]`,
    severidad: i <= 10 ? 'Crítica' : 'Alta'
  }));

  const manejarMultiplesArchivosReq = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const nombres = files.map(f => f.name);
      setArchivosReqLista(nombres);
    }
  };

  const descargarDemoCSV = () => {
    let csv = '\uFEFFID_Caso,Módulo,Tipo_Prueba,Descripción,Severidad\n';
    csv += `"AVISO","ESTE ARCHIVO CONTIENE UN DEMO DE 10 CASOS (${archivosReqLista.length} versiones de req procesadas). SI DESEAS LA MP COMPLETA, CONTACTA AL DESARROLLADOR.","","",""\n`;

    listaCasos.slice(0, 10).forEach(c => {
      csv += `"${c.id}","${c.modulo}","${c.tipo}","${c.descripcion.replace(/"/g, '""')}","${c.severidad}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MP_DEMO_MultiVersiones_${nivel}.csv`;
    link.click();
  };

  const resetearProyecto = () => {
    setRequerimiento({ descripcionManual: '', notas: '' });
    setArchivosReqLista([]);
    setArchivoEstructura(null);
    setPasoMP(1);
  };

  return (
    <section 
      id="automatizaciones" 
      className="max-w-6xl mx-auto px-4 py-16 w-full scroll-mt-24"
      onContextMenu={(e) => e.preventDefault()} 
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      {/* Selector de Pestañas Principal */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
          <button 
            onClick={() => setPestanaActiva('matriz')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${pestanaActiva === 'matriz' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            📋 1. Generador de MP ({totalCasos} Casos)
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
            
            {/* Cabecera y Limpieza */}
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-4 gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Generador Profesional de MP</span>
                <h3 className="text-xl font-extrabold text-white">Configuración del Requerimiento & Múltiples Versiones</h3>
              </div>
              <button onClick={resetearProyecto} className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                🗑️ Limpiar / Nuevo Proyecto
              </button>
            </div>

            {/* Tarjetas de Navegación de Pasos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => setPasoMP(1)} 
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoMP === 1 ? 'bg-emerald-950 border-emerald-500 shadow-lg' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Paso 1</span>
                </div>
                <p className="text-sm font-bold text-white mt-1">Requerimientos (Múltiples)</p>
              </button>

              <button 
                onClick={() => setPasoMP(2)} 
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoMP === 2 ? 'bg-cyan-950 border-cyan-500 shadow-lg' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Paso 2</span>
                </div>
                <p className="text-sm font-bold text-white mt-1">Estructura & Columnas</p>
              </button>

              <button 
                onClick={() => setPasoMP(3)} 
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoMP === 3 ? 'bg-purple-950 border-purple-500 shadow-lg' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-400"></span>
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Paso 3</span>
                </div>
                <p className="text-sm font-bold text-white mt-1">Generación & Cotización</p>
              </button>
            </div>

            {/* PASO 1: Requerimientos (Soporte Múltiple) */}
            {pasoMP === 1 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 animate-fadeIn text-xs">
                <h4 className="font-bold text-emerald-400 uppercase tracking-wider">1. Ingreso de Requerimientos (Varias Versiones)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block font-bold text-slate-200">📁 Subir Archivos de Requerimiento (Puedes seleccionar varios a la vez)</label>
                    
                    {/* Input con atributo 'multiple' */}
                    <input 
                      type="file" 
                      multiple 
                      onChange={manejarMultiplesArchivosReq} 
                      className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-300 hover:file:bg-slate-700 cursor-pointer" 
                    />
                    
                    {archivosReqLista.length > 0 && (
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
                        <p className="text-[11px] font-bold text-emerald-400">Archivos / Versiones cargadas ({archivosReqLista.length}):</p>
                        <ul className="list-disc list-inside text-slate-300 text-[10px] font-mono">
                          {archivosReqLista.map((nombre, idx) => (
                            <li key={idx} className="truncate">{nombre}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <label className="block font-bold text-slate-200 pt-2">✍️ Redacción Manual o Historial de Versiones</label>
                    <textarea placeholder="Describe detalles de las versiones..." value={requerimiento.descripcionManual} onChange={(e) => setRequerimiento({...requerimiento, descripcionManual: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs focus:border-emerald-500 outline-none" rows="2" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-200 mb-1">📌 Notas u Observaciones para las Versiones</label>
                    <textarea placeholder="Ej. Cambios aplicados en la versión 2 sobre los tipos de crédito..." value={requerimiento.notas} onChange={(e) => setRequerimiento({...requerimiento, notas: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-xs focus:border-emerald-500 outline-none" rows="6" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => setPasoMP(2)} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl cursor-pointer transition">Siguiente: Estructura ➡️</button>
                </div>
              </div>
            )}

            {/* PASO 2: Estructura */}
            {pasoMP === 2 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 animate-fadeIn text-xs">
                <h4 className="font-bold text-cyan-400 uppercase tracking-wider">2. Estructura y Columnas</h4>
                <div className="space-y-3">
                  <label className="block font-bold text-slate-200">📊 Columnas (Separadas por comas)</label>
                  <input type="text" defaultValue="ID_Caso, Módulo, Tipo_Prueba, Versión_Req, Descripción, Severidad" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-cyan-300 font-mono focus:border-cyan-500 outline-none" />
                  
                  <label className="block font-bold text-slate-200 pt-2">📁 Subir Formato / Plantilla de Estructura</label>
                  <input type="file" onChange={(e) => setArchivoEstructura(e.target.files[0]?.name)} className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-300 hover:file:bg-slate-700 cursor-pointer" />
                  {archivoEstructura && <p className="text-cyan-400 font-mono text-[11px]">Estructura cargada: {archivoEstructura}</p>}
                </div>
                <div className="flex justify-between pt-2">
                  <button onClick={() => setPasoMP(1)} className="bg-slate-800 text-slate-300 font-bold px-5 py-2.5 rounded-xl cursor-pointer">⬅️ Anterior</button>
                  <button onClick={() => setPasoMP(3)} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl cursor-pointer transition">Siguiente: Generación ➡️</button>
                </div>
              </div>
            )}

            {/* PASO 3: Generación, Tabla, Descarga Demo y Cotización */}
            {pasoMP === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">3. Selección de Nivel & Generación</h4>
                    <p className="text-[11px] text-slate-400">
                      Procesando <strong className="text-emerald-400 font-mono">{archivosReqLista.length} archivo(s) de requerimiento</strong> • Total casos: <strong className="text-white font-mono">{totalCasos}</strong>
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {['JR', 'MED', 'SR'].map(n => (
                      <button key={n} onClick={() => setNivel(n)} className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${nivel === n ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}>
                        {n} ({n === 'JR' ? '50' : n === 'MED' ? '100' : '150'})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tabla Interactiva */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="max-h-72 overflow-y-auto">
                    <table className="w-full text-xs text-left text-slate-300">
                      <thead className="bg-slate-900 text-emerald-400 uppercase font-mono sticky top-0 shadow-sm">
                        <tr>
                          <th className="px-4 py-3">ID Caso</th>
                          <th className="px-4 py-3">Módulo</th>
                          <th className="px-4 py-3">Tipo</th>
                          <th className="px-4 py-3">Descripción & Versiones</th>
                          <th className="px-4 py-3">Severidad</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {listaCasos.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-900/60">
                            <td className="px-4 py-2 font-mono text-cyan-300 font-bold">{c.id}</td>
                            <td className="px-4 py-2">{c.modulo}</td>
                            <td className="px-4 py-2 text-emerald-300">{c.tipo}</td>
                            <td className="px-4 py-2">{c.descripcion}</td>
                            <td className="px-4 py-2">
                              <span className="bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                                {c.severidad}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Botón de Descarga Demo (10 Casos + Leyenda) */}
                <div className="flex justify-end">
                  <button 
                    onClick={descargarDemoCSV}
                    className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-md"
                  >
                    <span>📥 Descargar Archivo Demo (10 Casos)</span>
                  </button>
                </div>

                {/* Cotización Automática */}
                <div className="bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border border-emerald-500/40 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block">Cotización Automática (Estándar QA)</span>
                    <h4 className="text-white font-black text-2xl mt-0.5">{costoEstimado} <span className="text-xs font-normal text-slate-300">({totalCasos} Casos con {archivosReqLista.length} versiones analizadas)</span></h4>
                  </div>
                  <button 
                    onClick={() => onOpenContact(`Hola Martin, solicito la MP completa con los ${totalCasos} casos generados a partir de ${archivosReqLista.length} versiones de requerimiento. El costo automático es de ${costoEstimado}. ¿Podemos coordinar la entrega y respaldo en Google Drive?`)}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition cursor-pointer"
                  >
                    💬 Solicitar MP Completa & Cotización ({costoEstimado})
                  </button>
                </div>

                <div className="flex justify-start pt-2">
                  <button onClick={() => setPasoMP(2)} className="bg-slate-800 text-slate-300 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer">⬅️ Volver a Estructura</button>
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