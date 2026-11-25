/* ===== SESIÓN DE EVALUACIÓN (cada 5 jornadas) ===== */
const DAY_LEN = 6, EVAL_EVERY = 5;
const SUBJ = {
  MAT: { n: "Matemáticas", e: "📐", c: "#d9534f" }, LCL: { n: "Lengua Castellana y Literatura", e: "📖", c: "#e08e0b" }, ING: { n: "Inglés", e: "🗣️", c: "#2f7fd1" },
  FYQ: { n: "Física y Química", e: "🧪", c: "#7e57c2" }, BYG: { n: "Biología y Geología", e: "🧬", c: "#2e9e5b" }, GEH: { n: "Geografía e Historia", e: "🌍", c: "#8d6e63" },
  EFI: { n: "Educación Física", e: "⚽", c: "#f4511e" }, MUS: { n: "Música", e: "🎵", c: "#ec407a" }, EPV: { n: "Educación Plástica", e: "🎨", c: "#26a69a" },
  TEC: { n: "Tecnología", e: "⚙️", c: "#607d8b" }, FRA: { n: "Francés", e: "🥖", c: "#5c6bc0" }, VAL: { n: "Valores Éticos", e: "⚖️", c: "#78909c" },
  REL: { n: "Religión", e: "🕊️", c: "#9575cd" }, FIL: { n: "Filosofía", e: "🤔", c: "#8e6e53" }, HES: { n: "Historia de España", e: "🏛️", c: "#a1887f" },
  LAT: { n: "Latín", e: "🏺", c: "#bf8040" }, ECO: { n: "Economía", e: "💶", c: "#43a047" }, BIO: { n: "Biología", e: "🔬", c: "#2e9e5b" }, DT: { n: "Dibujo Técnico", e: "📏", c: "#039be5" },
  INF: { n: "Informática", e: "💻", c: "#3949ab" }, PRO: { n: "Programación", e: "💻", c: "#3949ab" }, BD: { n: "Bases de Datos", e: "🗄️", c: "#00897b" }, ENT: { n: "Entornos de Desarrollo", e: "🖥️", c: "#5e35b1" },
  LM: { n: "Lenguajes de Marcas", e: "🏷️", c: "#ef6c00" }, SIS: { n: "Sistemas Informáticos", e: "💽", c: "#546e7a" }, FOL: { n: "Formación y Orientación Laboral", e: "📋", c: "#6d4c41" },
  RED: { n: "Redes", e: "🌐", c: "#1e88e5" }, SEG: { n: "Seguridad", e: "🔒", c: "#c62828" }, EIE: { n: "Empresa e Iniciativa", e: "💼", c: "#455a64" },
  TCO: { n: "Técnicas de Cocina", e: "🍳", c: "#ef6c00" }, POS: { n: "Repostería", e: "🧁", c: "#ec407a" }, TPE: { n: "Técnicas de Peluquería", e: "💇", c: "#ab47bc" },
  EST: { n: "Estética", e: "💄", c: "#d81b60" }, TAL: { n: "Taller", e: "🔧", c: "#6d4c41" }, MEC: { n: "Mecanizado", e: "🛠️", c: "#546e7a" },
  MKT: { n: "Marketing", e: "📣", c: "#e53935" }, COM: { n: "Comunicación", e: "💬", c: "#1e88e5" }, PRA: { n: "Prácticas", e: "🧰", c: "#6d4c41" }
};
const OPT = {
  pass: { label: "PASAR DE CURSO", short: "PASA", col: ["#7ad46a", "#2f8a2a"] }, rep: { label: "REPETIR CURSO", short: "REPITE", col: ["#ff9a8a", "#b0402a"] },
  div: { label: "DIVERSIFICACIÓN (DIVER)", short: "DIVER", col: ["#ffd75e", "#c08a1a"] }, tit: { label: "TITULAR / GRADUAR", short: "TITULA", col: ["#7ad4e8", "#2a7a9a"] }
};
function levelInfo(name) {
  if (/^1º ESO/.test(name)) return { k: "e1", opts: ["pass", "rep"], diver: false };
  if (/^2º ESO/.test(name)) return { k: "e2", opts: ["pass", "rep", "div"], diver: true };
  if (/^3º ESO/.test(name)) return { k: "e3", opts: ["pass", "rep", "div"], diver: true };
  if (/^4º ESO/.test(name)) return { k: "e4", opts: ["tit", "rep"], diver: false };
  if (/^1º Bach/.test(name)) return { k: "b1", opts: ["pass", "rep"], diver: false };
  if (/^2º Bach/.test(name)) return { k: "b2", opts: ["tit", "rep"], diver: false };
  return /^2º/.test(name) ? { k: "f2", opts: ["tit", "rep"], diver: false } : { k: "f1", opts: ["pass", "rep"], diver: false };
}
function subjectsFor(c) {
  const n = c.name, lv = levelInfo(n).k;
  if (lv === "e1") return ["MAT", "LCL", "ING", "BYG", "GEH", "EFI", "MUS", "EPV", "FRA", "VAL"];
  if (lv === "e2") return ["MAT", "LCL", "ING", "FYQ", "GEH", "EFI", "MUS", "TEC", "FRA", "REL"];
  if (lv === "e3") return ["MAT", "LCL", "ING", "FYQ", "BYG", "GEH", "EFI", "EPV", "TEC", "VAL"];
  if (lv === "e4") return ["MAT", "LCL", "ING", "FYQ", "BYG", "GEH", "EFI", "INF", "MUS"];
  const modal = chance(0.5) ? ["FYQ", "BIO", "DT"] : ["ECO", "LAT", "HES"];
  if (lv === "b1") return ["MAT", "LCL", "ING", "FIL", "EFI"].concat(modal);
  if (lv === "b2") return ["MAT", "LCL", "ING", "HES", "FIL"].concat(modal.filter(x => x !== "HES"));
  if (/DAW|DAM/.test(n)) return ["PRO", "BD", "ENT", "LM", "SIS", "FOL"];
  if (/ASIR|Informática/.test(n)) return ["RED", "SIS", "SEG", "PRO", "FOL", "EIE"];
  if (/Cocina/.test(n)) return ["TCO", "POS", "FOL", "ING", "EIE"];
  if (/Peluquería/.test(n)) return ["TPE", "EST", "FOL", "ING", "EIE"];
  if (/Marketing/.test(n)) return ["MKT", "COM", "FOL", "ING", "EIE", "INF"];
  if (/Mec|Electr|Instal/.test(n)) return ["TAL", "MEC", "FOL", "ING", "PRA"];
  return ["TAL", "PRA", "COM", "FOL", "ING", "INF"];
}
/* ---- perfiles de alumno y generación de notas ---- */
const PROFILES = [["brillante", 0.12, 8.6, "high"], ["aplicado", 0.22, 6.9, "high"], ["normal", 0.26, 5.6, "mid"], ["esfuerzo", 0.15, 3.9, "high"], ["vago", 0.15, 3.4, "low"], ["irregular", 0.10, 5.0, "mid"]];
const TUTOR_NOTE = {
  brillante: ["Alumnado de matrícula. Sin problemas de conducta.", "Un orgullo para el grupo, siempre colabora."], aplicado: ["Trabajador y constante, buen ambiente en clase.", "Cumple siempre y ayuda a los demás."],
  normal: ["Alumno corriente: ni destaca ni da problemas.", "Rendimiento medio y sin incidencias graves."], esfuerzo: ["Se esfuerza muchísimo pero le cuesta seguir el ritmo del grupo.", "Muy buena actitud, con dificultades de aprendizaje."],
  vago: ["No trabaja y distrae a los compañeros.", "Pasa de las tareas y acumula faltas sin justificar."], irregular: ["Muy irregular: brilla en unas materias y se hunde en otras.", "Rinde según el día y el profesor."]
};
function randn() { return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random()); }
function pickProfile() { let r = Math.random(), a = 0; for (const p of PROFILES) { a += p[1]; if (r < a) return p; } return PROFILES[2]; }
const REND = {
  mi: ["Rendimiento muy bajo: no llega a los mínimos de la materia.", "No ha entregado ni un solo trabajo y los exámenes están casi en blanco.", "Presenta lagunas graves desde principio de curso.", "Los resultados son muy deficientes en todos los bloques."],
  in: ["No alcanza los objetivos, aunque está cerca en algunos bloques.", "Suspende los exámenes por poco margen.", "Tiene dificultades importantes con los contenidos del trimestre.", "Va flojo: aprueba trabajos pero suspende pruebas."],
  su: ["Aprueba por los pelos, con un examen que salva la nota.", "Alcanza los mínimos sin demasiado margen.", "Rendimiento justo, con altibajos entre exámenes.", "Progresa adecuadamente, aunque se queda en el mínimo."],
  bi: ["Va bien: nivel sólido y regular.", "Aprueba con comodidad y mejora cada trimestre.", "Buen nivel general, con algún fallo puntual.", "Resultados correctos y estables."],
  nt: ["Notable trabajo: domina casi todos los contenidos.", "Resultados muy buenos y constantes.", "Se desenvuelve con soltura en los exámenes.", "Nivel alto, con un cuaderno ejemplar."],
  sb: ["Rendimiento excelente: de lo mejor del grupo.", "Sobresaliente en todos los bloques.", "Domina la materia y ayuda a sus compañeros.", "Nota brillante, sin fallos a lo largo del curso."]
};
const ACTI = {
  high: ["Trabaja a diario y pregunta cuando duda.", "Se esfuerza muchísimo, aunque no siempre se refleja en la nota.", "Entrega todas las tareas con puntualidad.", "Muestra una actitud ejemplar en el aula.", "Participa y trae siempre el material."],
  mid: ["Trabaja a ratos, con altibajos de motivación.", "Cumple lo justo con las tareas.", "Participa poco, pero no molesta.", "Depende del día: unas veces trabaja y otras no."],
  low: ["No trae el material y se distrae constantemente.", "Pasa de las tareas y de las advertencias.", "Falta a clase con frecuencia y sin justificar.", "Su actitud en el aula ha provocado varios partes.", "No hace ni el amago de trabajar."]
};
const FLAVOR = {
  MAT: { lo: ["Se bloquea con los problemas de enunciado.", "Falla en el cálculo mental y en las fracciones."], hi: ["Resuelve problemas con mucho ingenio.", "Razona con rapidez y limpieza."] },
  LCL: { lo: ["Comete muchas faltas de ortografía.", "No lee los libros obligatorios."], hi: ["Sus redacciones están muy cuidadas.", "Lee con fluidez y comenta con criterio."] },
  ING: { lo: ["Su expresión oral es muy floja.", "No estudia el vocabulario."], hi: ["Pronunciación y fluidez muy buenas.", "Entiende y habla con soltura."] },
  EFI: { lo: ["Se niega a hacer la parte práctica.", "Siempre «se ha dejado la ropa»."], hi: ["Destaca en las pruebas físicas.", "Colabora con el equipo y muestra deportividad."] },
  FYQ: { lo: ["Confunde las fórmulas y las unidades.", "No sabe despejar."], hi: ["Entiende los experimentos y razona los resultados.", "Domina la formulación."] },
  GEH: { lo: ["No estudia los temas.", "Confunde fechas y mapas."], hi: ["Relaciona hechos con mucha madurez.", "Maneja bien mapas y fuentes."] },
  MUS: { lo: ["Se niega a tocar la flauta.", "No sigue el compás."], hi: ["Muy buen oído y sentido del ritmo.", "Toca con soltura."] },
  EPV: { lo: ["Entrega láminas sin terminar.", "Poca limpieza en los trabajos."], hi: ["Láminas creativas y bien terminadas.", "Tiene un gran sentido estético."] },
  PRO: { lo: ["No compila ni a la de tres.", "Copia el código sin entenderlo."], hi: ["Código limpio y bien comentado.", "Resuelve las prácticas antes que nadie."] },
  TCO: { lo: ["Cocina con prisa y sin higiene.", "Quema todo lo que toca."], hi: ["Platos muy cuidados y buena organización.", "Higiene y técnica impecables."] }
};
const TEMAS = {
  MAT: ["ecuaciones y sistemas", "funciones y gráficas", "geometría y áreas", "estadística y probabilidad", "fracciones y porcentajes", "proporcionalidad", "polinomios", "trigonometría"], LCL: ["la comprensión lectora", "el análisis sintáctico", "los textos argumentativos", "la literatura medieval", "el teatro del Siglo de Oro", "la ortografía y la tilde", "los géneros periodísticos", "el comentario de texto"],
  ING: ["los tiempos verbales", "el vocabulario del trimestre", "las redacciones", "el listening", "las exposiciones orales", "los phrasal verbs", "las lecturas graduadas", "el speaking en parejas"], FYQ: ["el movimiento y las fuerzas", "la formulación química", "las reacciones químicas", "la electricidad", "el sistema periódico", "las prácticas de laboratorio", "la energía", "las disoluciones"],
  BYG: ["la célula", "los ecosistemas", "el cuerpo humano", "la geología y las rocas", "la reproducción", "la clasificación de los seres vivos", "la nutrición", "las prácticas de microscopio"], GEH: ["la Edad Media", "las civilizaciones antiguas", "el relieve y los climas", "la Revolución Industrial", "la demografía", "los mapas y la cartografía", "el Antiguo Régimen", "la economía mundial"],
  EFI: ["la condición física", "los deportes de equipo", "la gimnasia", "las pruebas de resistencia", "el atletismo", "los juegos cooperativos", "la expresión corporal", "el voleibol"], MUS: ["la flauta", "el lenguaje musical", "la historia de la música", "el ritmo y el compás", "los instrumentos de la orquesta", "la audición activa", "el canto coral", "las composiciones en grupo"],
  EPV: ["la perspectiva", "el color y la composición", "los volúmenes en 3D", "el dibujo técnico", "la fotografía", "los proyectos con cartulina", "el diseño gráfico", "las láminas de grupo"], TEC: ["los circuitos eléctricos", "el taller de maderas", "la programación con bloques", "las estructuras", "la robótica", "el dibujo en CAD", "los materiales", "el proyecto de aula"],
  FRA: ["el vocabulario básico", "las presentaciones orales", "los verbos regulares", "las canciones francesas", "la comprensión escrita", "los diálogos cotidianos"], VAL: ["los derechos humanos", "el respeto y la convivencia", "los debates en clase", "la igualdad", "el consumo responsable", "las normas y la sociedad"], REL: ["los valores y la ética", "las tradiciones culturales", "los trabajos de investigación", "la historia de las religiones"],
  FIL: ["la lógica y la argumentación", "la ética", "los presocráticos", "el pensamiento moderno", "los comentarios de texto", "la filosofía política"], HES: ["el siglo XIX", "la Guerra Civil", "la Transición", "el reinado de los Austrias", "la economía del siglo XX", "los comentarios de fuentes"], LAT: ["las declinaciones", "la traducción de textos", "la etimología", "la civilización romana", "los verbos latinos"],
  ECO: ["la oferta y la demanda", "el mercado laboral", "la inflación", "las empresas", "el comercio internacional", "el sistema financiero"], BIO: ["la genética", "el metabolismo", "la evolución", "la microbiología", "las prácticas de laboratorio", "la ecología"], DT: ["las proyecciones", "las perspectivas", "las secciones y cortes", "la normalización", "la geometría plana"],
  INF: ["las hojas de cálculo", "la ofimática", "la seguridad en la red", "la programación", "las presentaciones", "las bases del sistema operativo"], PRO: ["las estructuras de control", "la programación orientada a objetos", "las excepciones", "los ficheros", "las colecciones", "las pruebas unitarias"], BD: ["el modelo entidad-relación", "las consultas SQL", "las vistas y funciones", "la normalización", "los procedimientos almacenados"],
  ENT: ["el control de versiones", "la documentación", "los diagramas UML", "el diseño de pruebas", "el entorno de desarrollo"], LM: ["HTML y CSS", "XML y esquemas", "JSON", "la maquetación responsive", "las hojas de estilo"], SIS: ["la virtualización", "los sistemas operativos", "la administración de usuarios", "el hardware", "las redes locales"],
  FOL: ["los contratos laborales", "la nómina", "la prevención de riesgos", "el currículum", "la búsqueda de empleo", "los derechos laborales"], RED: ["el direccionamiento IP", "la configuración de routers", "el cableado", "los servicios de red", "los protocolos"], SEG: ["el cifrado", "las copias de seguridad", "los cortafuegos", "el análisis de vulnerabilidades", "la normativa de protección de datos"],
  EIE: ["el plan de empresa", "el estudio de mercado", "las formas jurídicas", "la financiación", "el emprendimiento"], TCO: ["los cortes y las elaboraciones básicas", "las salsas madre", "las cocciones", "la higiene alimentaria", "el servicio de platos", "la organización de la cocina"], POS: ["las masas básicas", "las cremas y rellenos", "el montaje de postres", "el decorado", "el control del horneado"],
  TPE: ["el corte y el peinado", "las coloraciones", "el cuidado capilar", "las permanentes", "la atención al cliente"], EST: ["la limpieza facial", "el maquillaje", "la depilación", "el cuidado de manos y pies", "los tratamientos corporales"], TAL: ["la soldadura", "el montaje de piezas", "la lectura de planos", "el mantenimiento", "la seguridad en el taller"],
  MEC: ["el torno y la fresadora", "las tolerancias", "las mediciones", "el limado y ajuste", "los programas de control numérico"], MKT: ["el estudio de mercado", "las campañas en redes", "el plan de marketing", "el posicionamiento", "la atención al cliente"], COM: ["las presentaciones", "la comunicación escrita", "la atención telefónica", "el trabajo en equipo"], PRA: ["las prácticas en empresa", "los informes de seguimiento", "la puntualidad y la actitud", "el trabajo en equipo"]
};
const EXAM = { hi: ["Los exámenes salen casi perfectos.", "En las pruebas escritas rara vez falla.", "Sus controles son de los mejores del grupo."], mid: ["En los exámenes se queda en el aprobado.", "Los exámenes le salen según el día.", "Aprueba los controles aunque con fallos."], lo: ["Suspende casi todos los exámenes.", "En los controles deja preguntas en blanco.", "Los exámenes le salen muy por debajo de lo esperable."] };
const TRAB = { hi: ["El cuaderno está completo y ordenado.", "Entrega los trabajos a tiempo y bien presentados.", "Sus proyectos en grupo destacan."], mid: ["El cuaderno tiene huecos pero se entiende.", "Entrega los trabajos casi siempre, con retraso a veces.", "Los trabajos cumplen los mínimos."], lo: ["El cuaderno está vacío.", "No entrega trabajos ni da explicaciones.", "Ha entregado menos de la mitad de las tareas."] };
const EVOL = { brillante: ["Mantiene un nivel altísimo desde septiembre.", "Ha ido a más cada trimestre."], aplicado: ["Mejora poco a poco con constancia.", "Ha subido la nota respecto al trimestre anterior."], normal: ["Se mantiene estable sin grandes cambios.", "Sube y baja sin una tendencia clara."], esfuerzo: ["Ha mejorado respecto al trimestre pasado, pero parte de muy atrás.", "Avanza despacio aunque se esfuerza."], vago: ["Ha empeorado respecto al primer trimestre.", "No ha mejorado pese a los avisos."], irregular: ["Tiene un trimestre muy bueno y el siguiente fatal.", "Su rendimiento cambia mucho de una evaluación a otra."] };
const REC = { hi: ["Se recomienda proponer actividades de ampliación.", "Podría presentarse a las olimpiadas de la materia.", "Seguir así."], mid: ["Debe repasar más en casa.", "Convendría que organizara mejor el estudio.", "Si se esfuerza un poco más, puede notar mucho la mejora."], lo: ["Necesita un plan de refuerzo y mucho trabajo en casa.", "Se aconseja apoyo con clases de recuperación.", "Es imprescindible un cambio de actitud para aprobar."] };
function genInforme(code, g, prof, name, gender, diverAvail) {
  const tier = g >= 9 ? "sb" : g >= 7 ? "nt" : g === 6 ? "bi" : g === 5 ? "su" : g >= 3 ? "in" : "mi", lvl = g >= 7 ? "hi" : g >= 5 ? "mid" : "lo", f = FLAVOR[code], T = TEMAS[code] || ["los contenidos básicos", "las actividades del libro", "los trabajos prácticos"];
  const t3 = uniq(T, 3), parts = [pick(REND[tier])];
  if (chance(0.75)) parts.push(`Este trimestre se ha trabajado ${t3.slice(0, -1).join(", ")} y ${t3[t3.length - 1]}.`);
  parts.push(g >= 6 ? `Destaca en ${t3[0]}.` : g === 5 ? `Aprueba gracias a ${t3[0]}.` : pick([`Tiene muchas dificultades con ${t3[1] || t3[0]}.`, `Flojea bastante en ${t3[1] || t3[0]}.`, `Se pierde con ${t3[1] || t3[0]}.`]));
  parts.push(pick(EXAM[lvl]), pick(TRAB[lvl]));
  if (f && chance(0.7)) parts.push(pick(g >= 6 ? f.hi : f.lo));
  parts.push(pick(ACTI[prof[3]]));
  if (chance(0.55)) parts.push(pick(EVOL[prof[0]]));
  if (chance(0.7)) parts.push(pick(REC[lvl]));
  if (diverAvail && prof[0] === "esfuerzo" && g < 5 && chance(0.6)) parts.push(pick(["Necesita adaptar el ritmo: se valora derivar a DIVER.", "Podría beneficiarse de un programa de diversificación (DIVER).", "Con DIVER avanzaría mucho más: lo aconsejo."]));
  if (prof[0] === "vago" && g < 5 && chance(0.45)) parts.push(pick(["Dudo que DIVER sirva: el problema es la actitud.", "Ha tenido oportunidades de sobra.", "Pido que repita curso."]));
  let out = []; for (const p of parts) { if ((out.join(" ") + " " + p).length > 355 && out.length >= 3) break; out.push(p); }
  return gen(out.join(" "), gender, name);
}
function idealOf(lv, fails, prof) {
  const k = lv.k;
  if (k === "e1" || k === "e2" || k === "e3") return fails <= 2 ? "pass" : (lv.diver && prof[0] === "esfuerzo") ? "div" : "rep";
  if (k === "e4") return fails <= 2 ? "tit" : "rep";
  if (k === "b1") return fails <= 2 ? "pass" : "rep";
  if (k === "b2") return fails === 0 ? "tit" : "rep";
  if (k === "f2") return fails === 0 ? "tit" : "rep";
  return fails <= 1 ? "pass" : "rep";
}
function makeEvalStudent() {
  const s = randStudent(); s.last = pick(APE) + " " + pick(APE); s.full = s.first + " " + s.last;
  const course = randCourse(), lv = levelInfo(course.name), prof = pickProfile(), codes = subjectsFor(course);
  const strong = new Set([pick(codes), pick(codes)]), weak = new Set([pick(codes), pick(codes)]);
  const tutor = genPerson(chance(0.5) ? "f" : "m", false);
  const subs = codes.map(code => {
    let g = prof[2] + randn() * (prof[0] === "irregular" ? 2.4 : 1.3) + (strong.has(code) ? 1.4 : 0) - (weak.has(code) ? 1.4 : 0);
    if ((code === "EFI" || code === "MUS" || code === "EPV") && prof[0] !== "vago") g += 1.2;
    g = Math.max(0, Math.min(10, Math.round(g)));
    const teacher = genPerson(chance(0.5) ? "f" : "m", false);
    return { code, g, teacher, informe: genInforme(code, g, prof, s.first, s.gender, lv.diver), vote: null };
  });
  const fails = subs.filter(x => x.g < 5).length, avg = subs.reduce((a, b) => a + b.g, 0) / subs.length, ideal = idealOf(lv, fails, prof);
  for (const x of subs) x.vote = chance(0.72) ? ideal : pick(lv.opts.filter(o => o !== ideal));
  const tv = chance(0.78) ? ideal : pick(lv.opts.filter(o => o !== ideal)), votes = {}; lv.opts.forEach(o => votes[o] = 0); subs.forEach(x => votes[x.vote]++); votes[tv] += 2;
  return { s, course: course.name, lv, prof, subs, fails, avg, ideal, tutor, tutorVote: tv, votes, att: Math.round(prof[3] === "low" ? rnd(62, 85) : prof[3] === "mid" ? rnd(86, 95) : rnd(94, 100)), partes: prof[3] === "low" ? rint(3, 12) : prof[3] === "mid" ? rint(0, 3) : rint(0, 1), look: look(s.gender === "f"), note: pick(TUTOR_NOTE[prof[0]]) };
}
function explain(st) {
  const f = st.fails, k = st.lv.k;
  if (st.ideal === "pass") return `Con ${f} suspensa${f === 1 ? "" : "s"} (máximo 2) lo correcto era PASAR de curso.`;
  if (st.ideal === "tit") return `Con ${f} suspensa${f === 1 ? "" : "s"} cumple los requisitos para TITULAR.`;
  if (st.ideal === "div") return `${f} suspensas, pero con mucho esfuerzo y dificultades de aprendizaje: lo adecuado era DIVER.`;
  if (k === "b2" || k === "f2") return `Con ${f} suspensa${f === 1 ? "" : "s"} no puede titular: debe REPETIR.`;
  return `${f} suspensas${st.lv.diver ? " y sin perfil de DIVER (falta de actitud)" : ""}: lo correcto era REPETIR.`;
}
/* ===== ESTADO Y FLUJO ===== */
let EV = null;
function startEval() {
  const n = Math.min(4, 2 + Math.floor(((G.evals || 0)) / 2));
  EV = { n: (G.evals = (G.evals || 0) + 1), students: Array.from({ length: n }, makeEvalStudent), si: 0, page: 0, phase: "intro", t: 0, total: 0, res: [], avatars: Array.from({ length: 8 }, () => look(chance(0.5))), fb: null };
  go("eval", () => { Snd.music("office"); Snd.bell(); });
}
const evalPages = st => 1 + Math.ceil(st.subs.length / 3) + 1;
function evalDecide(opt) {
  const E = EV, st = E.students[E.si], ok = opt === st.ideal; E.res.push({ st, opt, ok });
  const pts = ok ? 300 : -150; E.total += pts; G.score = Math.max(0, G.score + pts); G.stress = Math.max(0, Math.min(100, G.stress + (ok ? -6 : 10)));
  if (opt === "rep") addRigor(2); else if (opt === "div") addRigor(1);
  E.fb = { ok, pts, text: explain(st), opt }; E.phase = "feedback"; E.t = 0; if (ok) Snd.ok(); else Snd.bad(); Snd.stamp();
  G.last = { p: { student: st.s, expected: { text: "" } }, r: { ok, msgs: [] }, ok, pts, voided: false, evalNote: true };
}
function evalNext() {
  const E = EV; if (E.si + 1 < E.students.length) { E.si++; E.page = 0; E.phase = "review"; E.t = 0; E.fb = null; Snd.paper(); } else { E.phase = "end"; E.t = 0; Snd.fanfare(); }
}
function evalExit() { EV = null; go("play", () => { Snd.music("play"); setupCur(); }); }
/* ===== DIBUJO ===== */
const gradeCol = g => g >= 6 ? "#2e9e4a" : g === 5 ? "#e6b800" : "#d03a2a";
const gradeLab = g => g >= 9 ? "SB" : g >= 7 ? "NT" : g === 6 ? "BI" : g === 5 ? "SU" : "IN";
function drawBadge(x, y, r, code) {
  const s = SUBJ[code] || { e: "📘", c: "#666" }; ctx.save(); ctx.fillStyle = s.c; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = "#fff8dc"; ctx.stroke();
  ctx.lineWidth = 2; ctx.strokeStyle = "#2a1005"; ctx.beginPath(); ctx.arc(x, y, r + 2, 0, 7); ctx.stroke(); txt(s.e, x, y + r * 0.36, { size: r * 1.0, align: "center", font: "sans-serif" }); ctx.restore();
}
function chip(x, y, w, h, g) {
  const dk = g === 5 ? "#2a1a00" : "#fff"; ctx.fillStyle = gradeCol(g); rr(x, y, w, h, 10); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = "#2a1005"; ctx.stroke();
  txt(String(g), x + w / 2, y + h * 0.64, { size: h * 0.56, weight: "bold", align: "center", color: dk }); txt(gradeLab(g), x + w / 2, y + h - 6, { size: Math.max(10, h * 0.2), font: F_TYPE, align: "center", color: dk });
}
function voteChip(x, y, opt, small) { const o = OPT[opt]; ctx.fillStyle = o.col[0]; rr(x, y, small ? 74 : 96, small ? 22 : 28, 8); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "#2a1005"; ctx.stroke(); txt(o.short, x + (small ? 37 : 48), y + (small ? 16 : 20), { size: small ? 12 : 15, weight: "bold", align: "center", color: "#2a1005" }); }
function evalBg() {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#2a1a30"); g.addColorStop(1, "#150c1a"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(255,255,255,.04)"; for (let x = 0; x < W; x += 140) ctx.fillRect(x, 0, 4, H);
  const E = EV; E.avatars.forEach((lk, i) => { const x = 110 + i * 150, wave = E.phase === "review" && E.page === evalPages(E.students[E.si]) - 1; person(x, 712, 0.62, Object.assign({}, lk, { sit: 1, arm: wave ? now + i : 0, mouth: 0 })); });
  ctx.fillStyle = "#4a2a12"; ctx.fillRect(0, 676, W, 44); ctx.fillStyle = "#6a3c1a"; ctx.fillRect(0, 676, W, 8);
}
function card() { ctx.save(); ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 30; const g = ctx.createLinearGradient(0, 70, 0, 640); g.addColorStop(0, "#f6ebc4"); g.addColorStop(1, "#e2cb8a"); ctx.fillStyle = g; rr(50, 66, 1180, 578, 20); ctx.fill(); ctx.shadowColor = "transparent"; ctx.lineWidth = 6; ctx.strokeStyle = "#3a200a"; ctx.stroke(); if (IM.paper) { ctx.globalAlpha = 0.35; ctx.drawImage(IM.paper, 54, 70, 1172, 570); ctx.globalAlpha = 1; } ctx.restore(); }
function drawEval(dt) {
  const E = EV; if (!E) return; E.t += dt; evalBg();
  if (E.phase === "intro") {
    card(); txt("SESIÓN DE EVALUACIÓN", W / 2, 230, { size: 74, font: F_TITLE, align: "center", color: "#2a1005" });
    txt("Evaluación n.º " + E.n + " · " + E.students.length + " alumnos a valorar", W / 2, 292, { size: 28, align: "center", color: "#5a3a18" });
    ["Revisa las notas (verde ≥ Bien · amarillo = Suficiente · rojo = Insuficiente).", "Lee los informes de cada profesor con las flechas ◀ ▶ y mira la votación del claustro.", "Decide: pasar de curso, repetir o diversificación (DIVER) si procede.", "Orientación: hasta 2 suspensas se pasa. Con más, repetir… salvo perfil DIVER (mucho esfuerzo y dificultades)."].forEach((l, i) => txt(l, W / 2, 366 + i * 38, { size: 21, align: "center", color: "#3a2410" }));
    button("evstart", W / 2 - 170, 540, 340, 70, "Empezar", () => { Snd.click(); E.phase = "review"; E.t = 0; Snd.paper(); }, { size: 30, color: ["#7ad46a", "#2f8a2a"] }); return;
  }
  if (E.phase === "end") {
    card(); txt("EVALUACIÓN TERMINADA", W / 2, 150, { size: 60, font: F_TITLE, align: "center", color: "#2a1005" });
    E.res.forEach((r, i) => { const y = 200 + i * 78; txt(r.st.s.full + " · " + r.st.course, 100, y + 28, { size: 24, weight: "bold", color: "#2a1005" }); txt("Decidiste: " + OPT[r.opt].short + (r.ok ? "" : "  (era " + OPT[r.st.ideal].short + ")"), 100, y + 56, { size: 19, color: "#5a3a18" }); txt(r.ok ? "✔ +300" : "✘ −150", 1150, y + 42, { size: 34, weight: "bold", align: "right", color: r.ok ? "#1c8a3a" : "#c01818" }); });
    txt("Total: " + (E.total > 0 ? "+" : "") + E.total + " puntos", W / 2, 570, { size: 38, font: F_TITLE, align: "center", color: E.total >= 0 ? "#1c8a3a" : "#c01818" });
    button("evexit", W / 2 - 200, 586, 400, 52, "Volver a la jornada", () => { Snd.click(); evalExit(); }, { size: 24, color: ["#7ad46a", "#2f8a2a"] }); return;
  }
  const st = E.students[E.si], np = evalPages(st), pg = E.page; card();
  txt("SESIÓN DE EVALUACIÓN " + E.n + " · Alumno " + (E.si + 1) + "/" + E.students.length, 84, 108, { size: 24, font: F_TITLE, color: "#2a1005" });
  txt("Página " + (pg + 1) + "/" + np, 1196, 108, { size: 16, font: F_TYPE, align: "right", color: "#6a4a28" });
  ctx.strokeStyle = "#3a200a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(80, 120); ctx.lineTo(1200, 120); ctx.stroke();
  const nInfo = np - 2;
  if (pg === 0) { // RESUMEN
    person(215, 400, 1.7, Object.assign({}, st.look, { mouth: 0, bob: Math.sin(now * 2) }));
    txt(st.s.full, 90, 470, { size: 26, weight: "bold", color: "#2a1005" }); txt(st.course + " · tutor/a: " + st.tutor.short, 90, 496, { size: 16, font: F_TYPE, color: "#5a3a18" });
    const stats = [["Nota media", st.avg.toFixed(1).replace(".", ","), gradeCol(Math.round(st.avg))], ["Suspensas", String(st.fails), st.fails > 2 ? "#d03a2a" : st.fails ? "#c08a00" : "#2e9e4a"], ["Asistencia", st.att + "%", st.att < 85 ? "#d03a2a" : "#2e9e4a"], ["Partes", String(st.partes), st.partes > 4 ? "#d03a2a" : "#2e9e4a"]];
    stats.forEach(([a, b, c], i) => { const x = 90 + (i % 2) * 150, y = 520 + Math.floor(i / 2) * 58; ctx.fillStyle = "rgba(255,255,255,.55)"; rr(x, y, 140, 50, 10); ctx.fill(); txt(b, x + 12, y + 34, { size: 28, weight: "bold", color: c }); txt(a, x + 130, y + 20, { size: 12, font: F_TYPE, align: "right", color: "#5a3a18" }); });
    txt("«" + st.note + "»", 90, 640, { size: 17, font: F_HAND, color: "#3a2410" });
    const per = 5, tw = 150, th = 160;
    st.subs.forEach((x, i) => {
      const cx = 400 + (i % per) * 163, cy = 150 + Math.floor(i / per) * 205; ctx.fillStyle = "rgba(255,255,255,.5)"; rr(cx, cy, tw, 190, 14); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(60,32,10,.5)"; ctx.stroke();
      drawBadge(cx + 40, cy + 40, 26, x.code); txt(x.code, cx + 80, cy + 46, { size: 24, weight: "bold", color: "#2a1005" });
      wrap(SUBJ[x.code].n, tw - 16, `13px ${F_UI}`).slice(0, 2).forEach((l, j) => txt(l, cx + 10, cy + 88 + j * 15, { size: 13, color: "#4a2a10" }));
      chip(cx + 30, cy + 118, 90, 60, x.g);
    });
    ctx.fillStyle = "#2e9e4a"; ctx.fillRect(420, 590, 20, 14); txt("Bien o más (≥6)", 446, 602, { size: 14, color: "#3a2410" }); ctx.fillStyle = "#e6b800"; ctx.fillRect(610, 590, 20, 14); txt("Suficiente (5)", 636, 602, { size: 14, color: "#3a2410" }); ctx.fillStyle = "#d03a2a"; ctx.fillRect(780, 590, 20, 14); txt("Insuficiente (<5)", 806, 602, { size: 14, color: "#3a2410" });
  } else if (pg <= nInfo) { // INFORMES
    const base = (pg - 1) * 3;
    for (let r = 0; r < 3; r++) {
      const x = st.subs[base + r]; if (!x) continue; const y = 140 + r * 164;
      ctx.fillStyle = "rgba(255,255,255,.5)"; rr(76, y, 1128, 150, 14); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(60,32,10,.45)"; ctx.stroke();
      drawBadge(130, y + 55, 38, x.code); txt(x.code, 130, y + 124, { size: 20, weight: "bold", align: "center", color: "#2a1005" });
      txt(SUBJ[x.code].n, 190, y + 40, { size: 22, weight: "bold", color: "#2a1005" }); txt("Prof.: " + x.teacher.full, 190, y + 66, { size: 15, font: F_TYPE, color: "#5a3a18" });
      txt("Su voto:", 190, y + 104, { size: 14, font: F_TYPE, color: "#5a3a18" }); voteChip(262, y + 84, x.vote, false);
      wrap(x.informe, 560, `17px ${F_UI}`).slice(0, 6).forEach((l, j) => txt(l, 470, y + 30 + j * 21, { size: 17, color: "#2a1a0a" }));
      chip(1090, y + 40, 92, 70, x.g);
    }
  } else { // VOTACIÓN Y DECISIÓN
    txt("Votación del equipo docente", 84, 160, { size: 34, font: F_TITLE, color: "#2a1005" }); const tot = st.subs.length + 2, bw = 520;
    st.lv.opts.forEach((o, i) => { const y = 200 + i * 62, n = st.votes[o]; txt(OPT[o].short, 84, y + 30, { size: 22, weight: "bold", color: "#2a1005" }); ctx.fillStyle = "rgba(0,0,0,.15)"; rr(200, y + 6, bw, 34, 10); ctx.fill(); const g = ctx.createLinearGradient(200, 0, 200 + bw, 0); g.addColorStop(0, OPT[o].col[0]); g.addColorStop(1, OPT[o].col[1]); ctx.fillStyle = g; rr(200, y + 6, Math.max(8, bw * n / tot * (1 - 0.0) * Math.min(1, E.t * 2)), 34, 10); ctx.fill(); txt(n + " voto" + (n === 1 ? "" : "s"), 200 + bw + 14, y + 32, { size: 20, weight: "bold", color: "#2a1005" }); });
    const lead = st.lv.opts.slice().sort((a, b) => st.votes[b] - st.votes[a]); const tie = st.votes[lead[0]] === st.votes[lead[1]];
    txt(tie ? "EMPATE: decide Dirección (tú)." : "Mayoría: " + OPT[lead[0]].short + " (el voto del tutor/a vale doble)", 84, 200 + st.lv.opts.length * 62 + 30, { size: 18, color: "#6a2a1a", weight: "bold" });
    txt("Votos de cada profesor", 790, 160, { size: 22, font: F_TYPE, color: "#5a3a18", weight: "bold" });
    st.subs.forEach((x, i) => { const cx = 790 + (i % 3) * 140, cy = 180 + Math.floor(i / 3) * 62; drawBadge(cx + 20, cy + 22, 18, x.code); voteChip(cx + 42, cy + 8, x.vote, true); txt(x.code, cx + 42 + 37, cy + 44, { size: 11, font: F_TYPE, align: "center", color: "#5a3a18" }); });
    txt("Tutor/a", 790, 180 + Math.ceil(st.subs.length / 3) * 62 + 14, { size: 14, font: F_TYPE, color: "#5a3a18" }); voteChip(850, 180 + Math.ceil(st.subs.length / 3) * 62, st.tutorVote, true);
    txt(st.s.first + ": " + st.fails + " suspensa" + (st.fails === 1 ? "" : "s") + " · media " + st.avg.toFixed(1).replace(".", ",") + " · " + st.partes + " partes", 84, 470, { size: 20, color: "#3a2410", weight: "bold" });
    txt("Regla orientativa: ≤2 suspensas pasa; más, repite (salvo perfil DIVER: mucho esfuerzo y dificultades, solo 2º–3º ESO).", 84, 498, { size: 15, font: F_TYPE, color: "#5a3a18" });
    const nb = st.lv.opts.length, bw2 = 330, gap = 24, x0 = W / 2 - (nb * bw2 + (nb - 1) * gap) / 2;
    st.lv.opts.forEach((o, i) => button("dec" + o, x0 + i * (bw2 + gap), 530, bw2, 84, OPT[o].label, () => { Snd.click(); evalDecide(o); }, { size: 22, color: OPT[o].col }));
  }
  if (E.phase === "review") {
    button("evprev", 70, 584, 170, 52, "◀  Anterior", () => { Snd.tick(); if (E.page > 0) { E.page--; E.t = 0; Snd.paper(); } }, { size: 20, disabled: pg === 0, color: ["#c9b78a", "#8a7440"] });
    button("evnext", 1040, 584, 170, 52, "Siguiente  ▶", () => { Snd.tick(); if (E.page < np - 1) { E.page++; E.t = 0; Snd.paper(); } }, { size: 20, disabled: pg === np - 1, color: ["#c9b78a", "#8a7440"] });
    for (let i = 0; i < np; i++) { ctx.fillStyle = i === pg ? "#8a2a1a" : "rgba(60,32,10,.3)"; ctx.beginPath(); ctx.arc(W / 2 - (np - 1) * 14 + i * 28, 612, i === pg ? 7 : 5, 0, 7); ctx.fill(); }
  }
  if (E.phase === "feedback") {
    ctx.fillStyle = "rgba(10,5,20,.7)"; ctx.fillRect(0, 0, W, H); const f = E.fb, k = back(E.t / 0.4);
    ctx.save(); ctx.translate(W / 2, 330); ctx.scale(k + 0.0001, k + 0.0001); ctx.fillStyle = "#f6ebc4"; rr(-380, -190, 760, 380, 22); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = f.ok ? "#1c8a3a" : "#c01818"; ctx.stroke();
    txt(f.ok ? "✔ ¡DECISIÓN CORRECTA!" : "✘ DECISIÓN ERRÓNEA", 0, -110, { size: 50, font: F_TITLE, align: "center", color: f.ok ? "#1c8a3a" : "#c01818" });
    txt("Elegiste: " + OPT[f.opt].label, 0, -60, { size: 22, align: "center", color: "#3a2410", weight: "bold" });
    wrap(f.text, 680, `22px ${F_UI}`).forEach((l, i) => txt(l, 0, -10 + i * 30, { size: 22, align: "center", color: "#2a1a0a" }));
    txt((f.pts > 0 ? "+" : "") + f.pts + " puntos", 0, 120, { size: 44, font: F_TITLE, align: "center", color: f.ok ? "#1c8a3a" : "#c01818" }); ctx.restore();
    button("evnextst", W / 2 - 170, 560, 340, 64, E.si + 1 < E.students.length ? "Siguiente alumno ▶" : "Terminar", () => { Snd.click(); evalNext(); }, { size: 26, color: ["#7ad46a", "#2f8a2a"] });
  }
}
addEventListener("keydown", e => { if (typeof scene === "undefined" || scene !== "eval" || !EV) return; const E = EV; if (E.phase === "review") { const np = evalPages(E.students[E.si]); if (e.key === "ArrowRight" && E.page < np - 1) { E.page++; E.t = 0; Snd.paper(); } if (e.key === "ArrowLeft" && E.page > 0) { E.page--; E.t = 0; Snd.paper(); } } if (e.key === "Enter") { if (E.phase === "intro") { E.phase = "review"; Snd.paper(); } else if (E.phase === "feedback") evalNext(); else if (E.phase === "end") evalExit(); } });
