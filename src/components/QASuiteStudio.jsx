import { useState } from 'react';

export default function QASuiteStudio({ onOpenContact }) {
  const [pestanaActiva, setPestanaActiva] = useState('matriz');

  // =========================================================================
  // GENERADOR MASIVO DE SUITE SENIOR (MÍNIMO 50 CASOS EXHAUSTIVOS)
  // =========================================================================
  const generarSuiteCompleta = (cantidad) => {
    const areas = ['HP', 'TTF', 'Smoke', 'Concurrencia', 'Seguridad', 'Resiliencia', 'Auditoria'];
    let suite = [];
    for (let i = 1; i <= Math.max(50, cantidad); i++) {
      const area = areas[(i - 1) % areas.length];
      suite.push({
        id: `TC-${area.toUpperCase()}-${i}`,
        tipo: `Validación ${area} #${i}`,
        categoriaMetrica: area,
        pasosArray: [
          { num: 1, accion: `Configurar el ambiente y datos iniciales para el escenario ${area} #${i}.`, data: `Param_${i}=Activo | Auth=JWT_Valid`, esperado: 'El sistema inicializa el contexto de prueba sin errores.' },
          { num: 2, accion: `Ejecutar la transacción principal o vector de prueba para ${area} #${i}.`, data: `Payload_ID: ${i} | Input_Val: OK`, esperado: 'Respuesta conforme a las reglas de negocio del requerimiento.' },
          { num: 3, accion: 'Verificar la persistencia y trazabilidad de los datos en base de datos.', data: `Query: SELECT * FROM audit WHERE id = ${i}`, esperado: 'Registros inmutables guardados correctamente y logs de auditoría generados.' }
        ],
        valores: {
          'ID_Caso': `TC-${area.toUpperCase()}-${i}`,
          'Modulo_Core': `SPEI / Módulo ${area}`,
          'Requerimiento_Asociado': 'HU-SPEI-104',
          'Descripcion_Escenario': `Prueba técnica avanzada #${i} enfocada en ${area} para garantizar la resiliencia y calidad del software.`,
          'Tipo_Validacion': `Validación Senior (${area})`,
          'Precondiciones': `Ambiente configurado, token de sesión activo y servicios core en línea para caso ${i}.`,
          'Pasos_Detallados': `1. Inicializar contexto ${i}.\n2. Enviar petición.\n3. Validar respuesta HTTP y BD.`,
          'Valores_Entrada_TestData': `Dataset_ID: ${i} | Input_Param: Test_${i}`,
          'Comportamiento_Esperado': `El sistema responde con código HTTP 200 y cumple estrictamente con el criterio de aceptación ${i}.`,
          'Postcondiciones_Persistencia': `Persistencia SQL validada en tablas relacionales para caso ${i}.`,
          'Severidad': i <= 10 ? 'Crítica' : 'Alta',
          'Estado': 'Listo para Ejecución'
        }
      });
    }
    return suite;
  };

  const [suiteCompleta] = useState(generarSuiteCompleta(50));
  const [pagina, setPagina] = useState(1);
  const casosPorPagina = 10;

  const inicio = (pagina - 1) * casosPorPagina;
  const casosVisibles = suiteCompleta.slice(inicio, inicio + casosPorPagina);

  // ESTADOS DEL TEST RUNNER PASO A PASO
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
    const columnas = ['ID_Caso', 'Modulo_Core', 'Requerimiento_Asociado', 'Descripcion_Escenario', 'Tipo_Validacion', 'Precondiciones', 'Pasos_Detallados', 'Valores_Entrada_TestData', 'Comportamiento_Esperado', 'Severidad', 'Estado'];
    let csv = '\uFEFF' + columnas.join(',') + '\n';
    
    suiteCompleta.forEach((c) => {
      const fila = columnas.map(col => {
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
    link.download = 'Suite_QA_Completa_50_Casos.csv';
    link.click();
  };

  return (
    <section id="automatizaciones" className="max-w-6xl mx-auto px-4 py-16 w-full scroll-mt-24">
      
      {/* MODAL: EJECUTOR PASO A PASO (TEST RUNNER) */}
      {ejecutorActivo && casoEnEjecucion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-5 max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setEjecutorActivo(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition cursor-pointer"
            >
              ✕
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
              <span className="font-bold text-cyan-300 block text-[11px]">🎯 Precondiciones:</span>
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
                    👉 Paso {casoEnEjecucion.pasosArray[pasoActualIdx].num} en Progreso
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">📋 Acción:</span>
                    <p className="text-white font-medium text-sm mt-0.5">{casoEnEjecucion.pasosArray[pasoActualIdx].accion}</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-cyan-300 font-semibold block text-[11px]">🧪 Datos de Prueba:</span>
                    <p className="text-cyan-100 font-mono text-xs">{casoEnEjecucion.pasosArray[pasoActualIdx].data}</p>
                  </div>
                  <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-900/60">
                    <span className="text-emerald-400 font-semibold block text-[11px]">✅ Resultado Esperado:</span>
                    <p className="text-emerald-200 text-xs">{casoEnEjecucion.pasosArray[pasoActualIdx].esperado}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => registrarResultadoPaso('fail')}
                    className="flex-1 py-2.5 px-4 bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    ❌ Registrar Falla (Fail)
                  </button>
                  <button
                    onClick={() => registrarResultadoPaso('pass')}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    ✓ Paso Exitoso (Pass) ➔
                  </button>
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-2xl border text-center space-y-4 ${
                veredictoFinal === 'PASSED' ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-100' : 'bg-rose-950/80 border-rose-500/60 text-rose-100'
              }`}>
                <div className="text-4xl">{veredictoFinal === 'PASSED' ? '🏆' : '🐛'}</div>
                <div>
                  <h4 className="text-lg font-extrabold">
                    {veredictoFinal === 'PASSED' ? '¡Caso Ejecutado con Éxito (PASS)!' : 'Defecto Detectado (FAIL)'}
                  </h4>
                </div>
                <div className="flex justify-center gap-3">
                  <button onClick={reiniciarEjecucion} className="bg-slate-800 text-white text-xs px-4 py-2 rounded-xl cursor-pointer">🔄 Re-ejecutar</button>
                  <button onClick={() => setEjecutorActivo(false)} className="bg-emerald-500 text-slate-950 text-xs font-bold px-5 py-2 rounded-xl cursor-pointer">Finalizar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECCIÓN PRINCIPAL */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 mb-2">
              <span>📋 Suite Corporativa Validada</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Suite QA Senior ({suiteCompleta.length} Casos Exhaustivos)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Visualiza la estructura completa de casos y ejecútalos paso a paso en tiempo real.
            </p>
          </div>

          <button
            onClick={exportarCSVLimpo}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <span>📥</span>
            <span>Exportar Suite Completa (CSV UTF-8)</span>
          </button>
        </div>

        {/* TABLA FORMAL CON ESTRUCTURA COMPLETA */}
        <div className="overflow-x-auto border border-slate-800 rounded-2xl">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">ID Caso</th>
                <th className="py-3 px-3">Escenario Técnico</th>
                <th className="py-3 px-3">Área / Métrica</th>
                <th className="py-3 px-3">Precondiciones</th>
                <th className="py-3 px-2 text-center">Severidad</th>
                <th className="py-3 px-2 text-center">Test Runner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {casosVisibles.map((caso) => (
                <tr key={caso.id} className="hover:bg-slate-950/60 transition">
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400 whitespace-nowrap">{caso.id}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-white">{caso.valores.Descripcion_Escenario}</p>
                    <span className="text-[10px] text-slate-400">{caso.valores.Modulo_Core}</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="bg-slate-950 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                      {caso.categoriaMetrica}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-400 max-w-xs truncate">{caso.valores.Precondiciones}</td>
                  <td className="py-3 px-2 text-center">
                    <span className={'px-2 py-0.5 rounded-full text-[10px] font-bold ' + (
                      caso.valores.Severidad === 'Crítica' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    )}>
                      {caso.valores.Severidad}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center whitespace-nowrap">
                    <button
                      onClick={() => iniciarEjecucionPasoAPaso(caso)}
                      className="text-[10px] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-bold px-3 py-1.5 rounded-xl shadow transition transform active:scale-95 cursor-pointer flex items-center gap-1 mx-auto"
                    >
                      <span>▶️</span>
                      <span>Ejecutar Paso a Paso</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación Formal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
          <span className="text-slate-400">
            Mostrando casos <strong className="text-white">{inicio + 1}</strong> a <strong className="text-white">{Math.min(inicio + casosPorPagina, suiteCompleta.length)}</strong> de <strong className="text-white">{suiteCompleta.length}</strong> totales en la suite.
          </span>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.ceil(suiteCompleta.length / casosPorPagina) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPagina(i + 1)}
                className={'w-8 h-8 rounded-xl font-bold text-xs transition cursor-pointer ' + (
                  pagina === i + 1 ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}