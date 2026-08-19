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
  const [archivoEstructuraObj, setArchivoEstructuraObj] = useState(null);
  const [requerimiento, setRequerimiento] = useState({ notas: '' });
  const [columnasInput, setColumnasInput] = useState('ID, Proceso de prueba, Sub-Proceso de prueba, Descripción de prueba, Tipo de prueba');

  const totalCasos = nivel === 'JR' ? 30 : nivel === 'MED' ? 60 : 100;
  const costoEstimado = (totalCasos * 250).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

  const manejarSubidaEstructura = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoEstructuraObj(file);
      setColumnasInput('ID, Proceso de prueba, Sub-Proceso de prueba, Descripción de prueba, Tipo de prueba');
    }
  };

  const columnasArray = columnasInput.split(',').map(c => c.trim()).filter(Boolean);

  const bancoProcesos = [
    { proc: "Creacion de Credito", sub: "Nomina", desc: "Realizar un credito de nomina hasta desembolsarlo (Apk Fcil)." },
    { proc: "Credito de Nomina", sub: "Registro (\"Pantalla 1\")", desc: "Validar al iniciar la App Fcil y dar clic en \"Registrarse\" se dispare la solicitud de la API HubSpot y se registre." },
    { proc: "Pantalla 1", sub: "Metodo POST", desc: "Validar Método:\nEndpoint: https://api.hubapi.com/crm/v3/objects/deals\npipeline -> D: Numérico, Valor Fijo: 728738158\ndealstage -> D: Numérico, Valor Fijo: 1062390043" },
    { proc: "Modificación de Crédito", sub: "Capital de Trabajo", desc: "Validar rechazo de crédito cuando la capacidad de pago excede el límite normativo de la UIF." }
  ];

  const listaCasos = Array.from({ length: totalCasos }, (_, i) => {
    const itemBanco = bancoProcesos[i % bancoProcesos.length];
    const tipoPrueba = i % 2 === 0 ? 'Happy Path' : 'Test to Fail';

    let casoObj = {};
    columnasArray.forEach((col) => {
      const colL = col.toLowerCase();
      if (colL.includes('id')) casoObj[col] = `${i + 1}`;
      else if (colL.includes('proceso')) casoObj[col] = itemBanco.proc;
      else if (colL.includes('sub')) casoObj[col] = itemBanco.sub;
      else if (colL.includes('desc')) casoObj[col] = itemBanco.desc;
      else if (colL.includes('tipo')) casoObj[col] = tipoPrueba;
      else casoObj[col] = `${itemBanco.proc} - Verificación ${i + 1}`;
    });
    return casoObj;
  });

  const descargarDemoCSV = () => {
    let csv = '\uFEFF' + columnasArray.join(',') + '\n';
    let avisoRow = new Array(columnasArray.length).fill('');
    avisoRow[0] = 'AVISO_DEMO';
    avisoRow[1] = 'ESTE ARCHIVO CONTIENE UN DEMO DE 10 CASOS. SOLICITA LA MP COMPLETA CON EL DESARROLLADOR.';
    csv += '"' + avisoRow.join('","') + '"\n';

    listaCasos.slice(0, 10).forEach(c => {
      let fila = columnasArray.map(col => `"${(c[col] || '').replace(/"/g, '""')}"`);
      csv += fila.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MP_DEMO_${nivel}.csv`;
    link.click();
  };

  const resetearProyecto = () => {
    setRequerimiento({ notas: '' });
    setArchivosReqLista([]);
    setArchivoEstructuraObj(null);
    setPasoMP(1);
  };

  return (
    <section id="automatizaciones" className="max-w-6xl mx-auto px-4 py-16 w-full scroll-mt-24" onContextMenu={(e) => e.preventDefault()} style={{ WebkitUserSelect: 'none', userSelect: 'none' }}>
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
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Generador Profesional de MP</span>
                <h3 className="text-xl font-extrabold text-white">Estructura & Casos Reales de QA</h3>
              </div>
              <button onClick={resetearProyecto} className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                🗑️ Limpiar / Nuevo Proyecto
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => setPasoMP(1)} className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoMP === 1 ? 'bg-emerald-950 border-emerald-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Paso 1</span>
                <p className="text-sm font-bold text-white mt-1">Requerimientos</p>
              </button>
              <button onClick={() => setPasoMP(2)} className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoMP === 2 ? 'bg-cyan-950 border-cyan-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}>
                <span className="text-[10px] text-cyan-400 font-bold uppercase">Paso 2</span>
                <p className="text-sm font-bold text-white mt-1">Estructura & Columnas</p>
              </button>
              <button onClick={() => setPasoMP(3)} className={`p-4 rounded-2xl border text-left transition cursor-pointer ${pasoMP === 3 ? 'bg-purple-950 border-purple-500 shadow-lg' : 'bg-slate-950 border-slate-800'}`}>
                <span className="text-[10px] text-purple-400 font-bold uppercase">Paso 3</span>
                <p className="text-sm font-bold text-white mt-1">Generación & Cotización</p>
              </button>
            </div>

            {pasoMP === 1 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs">
                <h4 className="font-bold text-emerald-400 uppercase">1. Requerimientos</h4>
                <input type="file" multiple onChange={(e) => setArchivosReqLista(Array.from(e.target.files).map(f => f.name))} className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-300 cursor-pointer" />
                {archivosReqLista.length > 0 && <p className="text-emerald-400 font-mono text-[10px]">Cargados: {archivosReqLista.join(', ')}</p>}
                <div className="flex justify-end pt-2">
                  <button onClick={() => setPasoMP(2)} className="bg-emerald-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl cursor-pointer">Siguiente: Estructura ➡️</button>
                </div>
              </div>
            )}

            {pasoMP === 2 && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs">
                <h4 className="font-bold text-cyan-400 uppercase">2. Estructura y Columnas Personalizadas</h4>
                <input type="text" value={columnasInput} onChange={(e) => setColumnasInput(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-cyan-300 font-mono text-xs focus:border-cyan-500 outline-none" />
                <input type="file" onChange={manejarSubidaEstructura} className="w-full text-slate-400 text-xs file:bg-slate-800 file:border-0 file:px-4 file:py-2 file:rounded-xl file:text-cyan-300 cursor-pointer" />
                <div className="flex justify-between pt-2">
                  <button onClick={() => setPasoMP(1)} className="bg-slate-800 text-slate-300 font-bold px-5 py-2.5 rounded-xl cursor-pointer">⬅️ Anterior</button>
                  <button onClick={() => setPasoMP(3)} className="bg-cyan-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl cursor-pointer">Generar Casos ➡️</button>
                </div>
              </div>
            )}

            {pasoMP === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex gap-2">
                  {['JR', 'MED', 'SR'].map(n => (
                    <button key={n} onClick={() => setNivel(n)} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${nivel === n ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'}`}>
                      {n} ({n === 'JR' ? '30' : n === 'MED' ? '60' : '100'})
                    </button>
                  ))}
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="max-h-80 overflow-y-auto">
                    <table className="w-full text-xs text-left text-slate-300">
                      <thead className="bg-slate-900 text-emerald-400 uppercase font-mono sticky top-0">
                        <tr>{columnasArray.map((col, idx) => <th key={idx} className="px-4 py-3">{col}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {listaCasos.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-900/60 align-top">
                            {columnasArray.map((col, idx) => <td key={idx} className="px-4 py-3 font-mono text-slate-200 whitespace-pre-line">{c[col]}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button onClick={descargarDemoCSV} className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer">
                    📥 Descargar Demo CSV (10 Casos)
                  </button>
                </div>

                <div className="bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500/40 p-5 rounded-2xl flex justify-between items-center">
                  <span className="text-white font-black text-2xl">{costoEstimado}</span>
                  <button onClick={() => onOpenContact(`Solicito MP completa de ${totalCasos} casos. Costo: ${costoEstimado}`)} className="bg-white text-emerald-900 font-bold px-6 py-3 rounded-xl text-xs cursor-pointer">
                    Solicitar MP Completa
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : <N8NOrchestrator />}
      </div>
    </section>
  );
}