/* ===== DATOS Y GENERADORES ===== */
const rnd = (a, b) => a + Math.random() * (b - a);
const rint = (a, b) => Math.floor(rnd(a, b + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const chance = p => Math.random() < p;
function mulberry(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

const FN_M = "Alejandro,Pablo,Hugo,Mateo,Diego,Álvaro,Adrián,Iker,Marc,Unai,Dani,Sergio,Nacho,Raúl,Javi,Rubén,Aitor,Biel,Yeray,Kevin,Brayan,Jonathan,Samuel,Izan,Gael,Lucas,Thiago,Bruno,Óscar,Cristian,Ismael,Fran,Manu,Tomás,Abdel,Youssef,Mohamed,Rafa,Joaquín,Lorenzo,Enzo,Dylan,Ander,Pelayo,Gonzalo,Borja".split(",");
const FN_F = "Lucía,Sofía,Paula,Martina,Valeria,Carla,Noa,Irene,Claudia,Alba,Nerea,Naia,Aroa,Triana,Rocío,Marta,Laia,Jimena,Daniela,Candela,Yaiza,Vera,Eva,Inés,Aitana,Mireia,Lola,Chloe,Samira,Fátima,Nayara,Abril,Olaya,Zoe,Ainhoa,Mía,África,Saray,Vanesa,Kiara,Leire,Amaia,Gemma,Soraya".split(",");
const APE = "García,Martínez,López,Sánchez,Pérez,Gómez,Fernández,Ruiz,Díaz,Moreno,Muñoz,Álvarez,Romero,Alonso,Gutiérrez,Navarro,Torres,Domínguez,Vázquez,Ramos,Gil,Serrano,Blanco,Molina,Morales,Suárez,Ortega,Delgado,Castro,Ortiz,Rubio,Marín,Sanz,Iglesias,Medina,Garrido,Cortés,Castillo,Santos,Lozano,Guerrero,Cano,Prieto,Méndez,Cruz,Calvo,Gallego,Vidal,León,Márquez,Herrera,Peña,Flores,Cabrera,Campos,Vega,Fuentes,Carrasco,Caballero,Nieto,Reyes,Pascual,Santana,Herrero,Montero,Hidalgo,Giménez,Lorenzo,Ibáñez,Ferrer,Durán,Benítez,Mora,Vicente,Vargas,Arias,Carmona,Crespo,Román,Pastor,Soto,Sáez,Velasco,Moya,Soler,Parra,Esteban,Bravo,Gallardo,Rojas,Pardo,Merino,Franco,Espinosa,Izquierdo,Skecherini,Calagman,Pinzón,Quintanilla,Bermúdez,Tejada,Zapatero,Borrego,Cuesta".split(",");
const MATERIAS = ["Matemáticas", "Lengua", "Inglés", "Educación Física", "Historia", "Geografía", "Física y Química", "Biología", "Tecnología", "Música", "Plástica", "Filosofía", "Latín", "Economía", "Informática", "Francés", "Religión", "Valores Éticos", "Dibujo Técnico"];
const MATERIAS_FP = ["Programación", "Bases de Datos", "Redes", "Cocina", "Mecanizado", "Electricidad", "Peluquería", "Gestión Administrativa", "FOL", "Sistemas", "Marketing", "Taller", "Laboratorio", "Primeros auxilios"];

const FP = ["1º FPB Informática", "2º FPB Mecánica", "1º FPB Peluquería", "2º FPB Electricidad", "1º GM Cocina", "2º GM Electromecánica", "1º GM Gestión Admin.", "2º GM Emergencias", "1º GM Instalaciones", "1º GS DAW", "2º GS DAW", "1º GS DAM", "2º GS ASIR", "1º GS Marketing", "2º GS Integración Social", "1º GS Lab. Clínico", "2º GS Animaciones 3D"];
function randCourse() {
  const r = Math.random();
  if (r < 0.55) return { name: rint(1, 4) + "º ESO " + pick(["A", "B", "C"]), fp: false };
  if (r < 0.78) return { name: rint(1, 2) + "º Bach " + pick(["A", "B", "C"]), fp: false };
  return { name: pick(FP), fp: true };
}
function randStudent() {
  const f = chance(0.5);
  return { gender: f ? "f" : "m", first: pick(f ? FN_F : FN_M), full: "" };
}
function genPerson(gender, forceBear) {
  if (forceBear) return { first: "Bear", full: "Bear " + pick(APE) + " " + pick(APE), gender: "m", bear: true, short: "Bear", title: "Prof." };
  const f = gender === "f";
  const first = pick(f ? FN_F : FN_M);
  const full = first + " " + pick(APE) + " " + pick(APE);
  return { first, full, gender, bear: false, title: f ? pick(["Profa.", "Dña.", "Prof."]) : pick(["Prof.", "D."]), short: (f ? pick(["Profa.", "Dña."]) : pick(["Prof.", "D."])) + " " + first };
}
const CALABOZO_NAMES = ["Remedios Calabozo", "Concepción Cerrojo", "Pilar Mazmorra", "Encarnación Grillete", "Amparo Candado", "Visitación Barrotes"];

/* tokens de género */
function gen(str, g, name) {
  const m = g === "m";
  return str.replace(/\{el\}/g, m ? "el" : "la").replace(/\{El\}/g, m ? "El" : "La").replace(/\{al\}/g, m ? "al" : "a la")
    .replace(/\{o\}/g, m ? "o" : "a").replace(/\{él\}/g, m ? "él" : "ella").replace(/\{lo\}/g, m ? "lo" : "la")
    .replace(/\{hijo\}/g, m ? "hijo" : "hija").replace(/\{niño\}/g, m ? "niño" : "niña").replace(/\{n\}/g, name || "");
}

/* ===== INCIDENCIAS ===== */
const OPEN = [
  "Durante la clase de {mat},", "En el recreo,", "A primera hora,", "En el pasillo,", "Al cambiar de clase,", "En el comedor,", "A la salida,",
  "En la excursión,", "En el laboratorio,", "En el gimnasio,", "Esta mañana,", "A última hora,", "Mientras explicaba {mat},", "En la biblioteca,",
  "En el patio,", "En el examen de {mat},", "Durante la guardia,", "En la fila de la cantina,", "Tras el toque de timbre,", "En el aula de informática,",
  "Ayer a 5ª hora,", "Antes de empezar la clase,", "En la reunión de tutoría,", "En el autobús escolar,", ""
];
const ACT = [
  // 1 leve
  ["llega tarde por tercera vez esta semana", "habla constantemente sin pedir turno", "usa el móvil debajo de la mesa", "mastica chicle de forma ruidosa",
    "no trae el material, otra vez", "se levanta sin permiso y pasea por el aula", "interrumpe la explicación con chistes malos", "se queda dormid{o} sobre el pupitre",
    "se maquilla en plena clase", "escucha música con los auriculares puestos", "lanza bolitas de papel a la pizarra", "silba la canción del verano mientras se explica",
    "no ha hecho los deberes y lo celebra", "juega con un spinner que ya nadie recuerda", "come pipas y deja la mesa como un parque", "borra la pizarra sin permiso",
    "responde con monosílabos y suspiros teatrales", "se cambia de sitio sin avisar", "tamborilea con los bolígrafos al ritmo de un reguetón", "llega con el pijama debajo del abrigo"],
  // 2 grave
  ["se niega a trabajar y contesta con total falta de respeto", "escribe obscenidades en la mesa con rotulador permanente", "sale del aula sin permiso y se esconde en el baño",
    "hace novillos y lo anuncia en redes", "copia en el examen con un chuletón del tamaño de un mantel", "graba al profesorado con el móvil sin consentimiento",
    "empuja a un compañero contra las taquillas", "insulta a varios compañeros en voz alta", "tira la mochila de otro por la ventana", "esconde el material de un compañero",
    "pega chicle en la silla del profesorado", "enciende y apaga las luces del aula durante toda la clase", "desconecta los enchufes del proyector a propósito",
    "contesta al profesor con un «y tú más»", "hace una guerra de agua en los aseos", "finge un desmayo para librarse del examen"],
  // 3 muy grave
  ["se pelea con un compañero y hay que separarlos entre tres", "rompe una silla y dos ordenadores del aula de informática", "activa la alarma de incendios sin motivo",
    "falsifica la firma de sus padres en la agenda", "lanza un petardo en el patio a la hora del recreo", "vapea en los baños y deja el pasillo oliendo a sandía",
    "difunde una foto del profesorado sin permiso", "amenaza a un compañero con «lo que viene después de clase»", "pinta un mural no autorizado en la fachada",
    "suelta los hurones del laboratorio por el edificio", "se hace pasar por padre al llamar al centro para justificar faltas", "ocupa el despacho de Jefatura y se sienta en el sillón",
    "vacía tres extintores en el pasillo por «ver qué pasaba»", "hackea el panel de notas y se pone un diez en todo", "revienta la máquina de snacks con una patada voladora"],
  // 4 extrema
  ["inunda el baño tapando todos los lavabos y abriendo los grifos", "descuelga el proyector del techo y lo saca por la ventana", "lanza un dron por el patio y estrella el aparato contra el cartel del centro",
    "suelta un gallinero entero en el aula de Música", "prende fuego a un cubo en el laboratorio «para ambientar»", "monta una barricada con las mesas y no deja entrar al profesorado",
    "se cuela en la sala de profesores y se bebe todo el café de la semana", "bloquea el sistema informático de todo el centro durante una mañana", "sube un coche de pedales al tejado del gimnasio",
    "rellena el patio de espuma con la manguera de incendios"]
];
const SPECIAL_ACT = [
  "se fuga del centro saltando la valla y se va a la churrería", "se escapa del instituto por la ventana del baño en pleno examen", "pega un puñetazo a un compañero en mitad del patio",
  "da una bofetada a otro alumno delante de todo el mundo", "dibuja un pene gigante en la pizarra justo antes de que entre el profesor", "pinta un pene enorme en la pared del gimnasio con spray",
  "cuenta chistes verdes a gritos en medio de la clase y el aula entera se parte de risa", "cuenta chistes obscenos por megafonía del patio", "dibuja un pene en el examen de {mat} y firma la obra",
  "se baja los pantalones en el pasillo y hace el helicóptero", "escupe en la bebida de un compañero y lo graba", "da una patada a la puerta del aula y la saca de sus bisagras",
  "insulta gravemente a un profesor y lo manda a freír espárragos", "lanza una silla contra la pizarra gritando «¡libertad!»", "se pelea a golpes con dos compañeros en los baños",
  "dibuja un pene en la mesa del profesor con el típico rotulador permanente", "cuenta chistes de adultos en la clase de Religión", "se escapa en mitad de la excursión y aparece en un parque de atracciones"
];
const BOSS_ACT = [
  "convierte el gimnasio en una piscina con las mangueras de incendios mientras suena la alarma y toca un piano que subió al tejado",
  "encierra a todo el claustro en la sala de profesores con una cadena de bici y exige «más recreo y menos deberes»",
  "organiza una fiesta con DJ, humo y luces en el aula magna durante el examen final de evaluación",
  "libera a todos los animales del laboratorio, enciende la sirena y retransmite el caos en directo por altavoces",
  "instala un trono en la dirección, se proclama «Rey del Instituto» y emite decretos por megafonía",
  "convierte el comedor en un campo de batalla de tartas y reparte uniformes a ambos bandos"
];
const CONNS = [
  "Además, {S} ", "Y, no contento con ello, {S} ", "Posteriormente {S} ", "Tras llamarle la atención, {S} ", "Cuando se le pidió que parase, {S} ",
  "Como si fuera poco, {S} ", "Minutos después, {S} ", "Por si no bastara, {S} ", "Más tarde {S} ", "Acto seguido {S} ", "Ya de paso, {S} ", "Al ser advertid{o}, {S} ",
  "Sin ningún pudor, {S} ", "Y para rematar, {S} "
];
const CLOSE = [
  ["Se le avisó verbalmente.", "Es la tercera vez este mes.", "Se le retiró el objeto.", "Sin más.", "Se espera mejora.", "Lo apunto por si acaso.", "Pido atención en casa.", ""],
  ["Se advierte reincidencia.", "Varios compañeros lo presenciaron.", "Pido sanción ejemplar.", "No es la primera vez.", "Ya hablé con su tutor.", "Se negó a firmar el apercibimiento."],
  ["Hay testigos y vídeo.", "Se ha avisado a Jefatura.", "La familia no contesta al teléfono.", "¡Esto no puede quedar así!", "Se solicita expediente.", "Se adjuntan pruebas fotográficas."],
  ["Se solicita medida urgente.", "El conserje está traumatizado.", "Se adjunta informe y fotos.", "¡¡Inadmisible!!", "La policía local ha tomado nota.", "Hay un charco que llega a Secretaría."],
  ["¡¡HAY QUE ACTUAR YA!!", "El claustro está en shock.", "Dirección, por favor, firme esto."]
];
function genIncident(sev, st, mat, boss, special) {
  const g = st.gender, name = st.first;
  const S = () => pick([gen("{el} alumn{o}", g), gen("{él}", g), name, gen("{él}", g)]);
  let txt;
  const lv = Math.min(sev, 4) - 1;
  const open = pick(OPEN).replace("{mat}", mat);
  const first = boss ? pick(BOSS_ACT) : special ? pick(SPECIAL_ACT).replace("{mat}", mat) : pick(ACT[lv]);
  let body = (open ? open + " " : "") + (open ? "" : "") + st.first + " " + st.last + " " + first + ".";
  const nExtra = boss ? 2 : sev === 1 ? (chance(0.3) ? 1 : 0) : sev === 2 ? rint(0, 2) : sev === 3 ? rint(1, 3) : rint(2, 3);
  for (let i = 0; i < nExtra; i++) {
    const low = Math.max(0, Math.min(3, lv - (chance(0.5) ? 1 : 0)));
    const a = pick(ACT[low]);
    body += " " + cap(pick(CONNS).replace("{S}", S())) + a + ".";
  }
  if (boss) body += " " + pick(CLOSE[4]);
  else if (chance(0.35 + sev * 0.15)) body += " " + pick(CLOSE[sev - 1]);
  txt = gen(body, g, name);
  if (txt.length > 320) txt = txt.slice(0, txt.lastIndexOf(".", 320) + 1) || txt.slice(0, 320);
  return txt.replace(/\s+/g, " ").replace(/,\s*,/g, ",");
}

/* ===== SANCIONES ===== */
function fmtExp(e) {
  if (e.box === 0) return "Amonestación escrita";
  if (e.box === 2) return "Expulsión definitiva (BOSS FINAL)";
  const out = [];
  if (e.m) out.push(e.m + (e.m === 1 ? " mes" : " meses"));
  if (e.w) out.push(e.w + (e.w === 1 ? " semana" : " semanas"));
  if (e.d) out.push(e.d + (e.d === 1 ? " día" : " días"));
  return "Expulsión " + out.join(" y ");
}
function genSanction(sev, boss) {
  if (boss) return { box: 2, d: 0, w: 0, m: 0, text: pick(["¡¡EXPULSIÓN DEFINITIVA!! BOSS FINAL", "¡¡BOSS FINAL!! Que no vuelva jamás", "Esto es un BOSS FINAL, sin duda"]) };
  let e;
  if (sev === 1) e = { box: 0, d: 0, w: 0, m: 0 };
  else if (sev === 2) e = { box: 1, d: rint(1, 9), w: 0, m: 0 };
  else if (sev === 3) { const k = rint(0, 2); e = k === 0 ? { box: 1, d: rint(10, 15), w: 0, m: 0 } : k === 1 ? { box: 1, d: 0, w: rint(1, 4), m: 0 } : { box: 1, d: 0, w: 0, m: 1 }; }
  else { e = { box: 1, d: chance(0.5) ? rint(1, 20) : 0, w: 0, m: rint(1, 3) }; }
  const t = e.box === 0 ? pick(["Propongo amonestación escrita", "Sanción: amonestación", "Con una amonestación vale", "Amonestación y a casa", "Apercibimiento (amonestación)"])
    : pick(["Propongo " + fmtExp(e).toLowerCase(), fmtExp(e) + " por favor", "Sanción: " + fmtExp(e).toLowerCase(), "Pido " + fmtExp(e).toLowerCase(), fmtExp(e) + " y que lo piense"]);
  e.text = t;
  return e;
}

/* ===== PARTE ===== */
let parteSeq = 40 + rint(0, 200);
function genDate() {
  const m = pick([9, 10, 11, 12, 1, 2, 3, 4, 5, 6]);
  const y = m >= 9 ? 2026 : 2027;
  const d = rint(1, m === 2 ? 28 : 30);
  return String(d).padStart(2, "0") + "/" + String(m).padStart(2, "0") + "/" + y;
}
function genSignature(rng) {
  const L = 150 + rng() * 90, k = 4 + rng() * 6, strokes = [];
  const Ax = 7 + rng() * 11, Ay = 6 + rng() * 14, ph = rng() * 6.28, ph2 = rng() * 6.28, f2 = 1 + rng() * 2.4, tilt = (rng() - 0.5) * 18;
  const N = 150, pts = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, env = 0.35 + 0.65 * Math.sin(Math.PI * Math.pow(t, 0.55));
    const x = L * t + Ax * env * Math.sin(2 * Math.PI * k * t + ph);
    const y = 28 - tilt * t + Ay * env * Math.cos(2 * Math.PI * k * t + ph2) + 5 * Math.sin(2 * Math.PI * f2 * t) + (rng() - 0.5) * 0.8;
    pts.push({ x, y });
  }
  const cut = rng() < 0.45 ? Math.floor(N * (0.3 + rng() * 0.4)) : -1;
  if (cut > 0) { strokes.push(pts.slice(0, cut)); strokes.push(pts.slice(cut + 3)); } else strokes.push(pts);
  if (rng() < 0.75) { // subrayado bezier
    const x0 = L * (0.75 + rng() * 0.35), y0 = 36 + rng() * 10, x1 = L * rng() * 0.3, y1 = 40 + rng() * 14;
    const c1x = x0 + 30 * (rng() - 0.3), c1y = y0 + (rng() - 0.5) * 30, c2x = x1 + 40 * (rng() - 0.5), c2y = y1 + (rng() - 0.5) * 24;
    const u = [];
    for (let i = 0; i <= 40; i++) { const t = i / 40, a = 1 - t; u.push({ x: a * a * a * x0 + 3 * a * a * t * c1x + 3 * a * t * t * c2x + t * t * t * x1, y: a * a * a * y0 + 3 * a * a * t * c1y + 3 * a * t * t * c2y + t * t * t * y1 }); }
    strokes.push(u);
  }
  if (rng() < 0.4) strokes.push([{ x: L * (0.4 + rng() * 0.5), y: 6 + rng() * 6 }, { x: L * (0.4 + rng() * 0.5) + 3, y: 7 + rng() * 6 }]);
  return strokes;
}
function makeParte(difficulty, boss) {
  const st = randStudent(); st.last = pick(APE) + " " + pick(APE); st.full = st.first + " " + st.last;
  const course = randCourse();
  const bear = chance(0.16);
  const tg = chance(0.5) ? "f" : "m";
  const teacher = genPerson(tg, bear);
  const mat = pick(course.fp ? MATERIAS_FP : MATERIAS);
  const w = [Math.max(10, 60 - difficulty * 4), 30, 12 + difficulty * 2, Math.min(30, difficulty * 2)];
  let sev = 1, r = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < 4; i++) { if (r < w[i]) { sev = i + 1; break; } r -= w[i]; }
  const special = !boss && chance(1 / 7);
  if (boss) sev = 4; else if (special) sev = Math.max(sev, 3);
  const expected = genSanction(sev, boss);
  let kind = "fair"; { const roll = Math.random(); if (!boss && !special) { if (roll < 0.08) kind = "nonsense"; else if (roll < 0.2 && sev <= 2) kind = "harsh"; } }
  if (kind === "nonsense") sev = 1;
  expected.ask = expected.box !== 0; expected.approve = expected.ask ? true : null;
  if (kind === "harsh") { // el profesor pide una expulsión desproporcionada: hay que DENEGARLA
    const fake = sev === 1 ? { box: 1, d: rint(2, 8), w: 0, m: 0 } : chance(0.5) ? { box: 1, d: 0, w: rint(2, 4), m: 0 } : { box: 1, d: 0, w: 0, m: 1 }, t = fmtExp(fake).toLowerCase();
    expected.text = pick(["Propongo " + t, "Pido " + t + " por esto", "Sanción: " + t, cap(t) + " y que aprenda"]); expected.box = 0; expected.d = 0; expected.w = 0; expected.m = 0; expected.ask = true; expected.approve = false;
  }
  if (kind === "nonsense") { // parte sin sentido: hay que ANULARLO
    const ask = chance(0.55), fake = { box: 1, d: rint(1, 6), w: 0, m: 0 };
    expected.text = ask ? pick(["Propongo " + fmtExp(fake).toLowerCase(), "Pido " + fmtExp(fake).toLowerCase() + " por si acaso"]) : pick(["Propongo amonestación escrita", "Amonestación, por si acaso"]); expected.void = true; expected.ask = ask; expected.approve = null; expected.box = ask ? 1 : 0;
  }
  const seed = rint(1, 1e9), rng = mulberry(seed);
  const ink = pick(["#0c1c5a", "#0a2f78", "#141414", "#1c2a40", "#4a1230", "#0a3d20"]);
  const gravity = boss ? 2 : sev === 1 ? 0 : sev === 2 ? 1 : sev === 3 ? (chance(0.55) ? 2 : 1) : 2;
  const mstyle = () => pick(["x", "tick", "x", "tick", "scrib"]);
  return {
    id: ++parteSeq, boss: !!boss, sev, student: st, course: course.name, fp: course.fp, teacher, mat,
    date: genDate(), hour: pick(["1ª", "2ª", "3ª", "4ª", "5ª", "6ª", "Recreo"]) + (chance(0.5) ? " hora" : ""),
    text: genIncident(sev, st, mat, boss, special, kind), kind, special, expected, ink, seed,
    gravity: kind === "nonsense" ? rint(0, 2) : gravity, marks: { g: [mstyle(), mstyle(), mstyle()], fam: chance(0.55 + sev * 0.1), reinc: chance(0.2 + sev * 0.18), famStyle: mstyle(), reincStyle: mstyle() },
    sig: genSignature(rng, teacher.full), sigInk: pick(["#10206a", "#161616", "#0a3a8f", "#3b0a5c", "#0a0a0a"]),
    sigW: 0, born: 0, lines: null, fs: 20,
    player: { approve: null, boxes: [false, false, false], cells: Array.from({ length: 6 }, () => ({ strokes: [], digit: null, conf: 0, dirty: false, t: 0 })), sig: [] }
  };
}

/* ===== MADRES ===== */
const MOM_NAMES = ["Mari Carmen", "Josefa", "Pilar", "Rosario", "Montserrat", "Dolores", "Encarna", "Yolanda", "Susana", "Beatriz", "Mercedes", "Aurora", "Conchi", "Lourdes"];
const MOM_REASONS = [
  { valid: false, t: "¡Mi {niño} {n} es un ángel, un santo! ¡Eso que dicen es mentira!", stu: "Vale… fui yo. Pero fue sin querer, queriendo un poquito. No se lo digas a mi madre." },
  { valid: true, t: "¡Ese día {n} estaba en el médico con fiebre! ¡Tengo el justificante aquí mismo!", stu: "Es verdad, ese día ni pisé el instituto. Alguien se equivocó de persona, lo juro." },
  { valid: false, t: "Mi {hijo} jamás haría algo así. ¡Lo habrá provocado el profesor, seguro!", stu: "Eh… puede que me pasara un poquito. El profe no hizo nada, tengo que ser sincer{o}." },
  { valid: true, t: "¡El parte tiene un error! ¡Pone otro curso y otra clase y {n} nunca ha ido ahí!", stu: "Sí, no era yo, era mi tocay{o}. Otra {n} de otra clase. Me han confundido." },
  { valid: false, t: "¡Es que {n} se aburre en clase y claro, hace estas cosas! ¡Es un genio incomprendido!", stu: "Me aburría, sí. Y lo hice. Pero con muy buen estilo, eso hay que reconocerlo." },
  { valid: false, t: "¡Mi {hijo} no puede tener un parte, la semana que viene hace la comunión del primo!", stu: "Lo hice, vale. Pero eso de la comunión no tiene nada que ver, mi madre lo inventa todo." },
  { valid: true, t: "¡Estaba con la profesora de Orientación a esa hora! ¡Pregúntele, tiene testigos!", stu: "Verdad. Estaba en Orientación hablando de mis emociones. Me acusan sin pruebas." },
  { valid: false, t: "¡Todo es culpa de las redes sociales y de ese móvil! ¡Mi {niño} es una víctima!", stu: "Qué víctima ni qué nada, lo hice yo y encima lo grabé. Perdón." },
  { valid: false, t: "¡Yo también era así de joven y he llegado a ser alguien! ¡Dejen en paz a {n}!", stu: "Vale… sí que lo hice. Mi madre tampoco estudió mucho, para qué mentir." },
  { valid: true, t: "¡Ese día el centro estaba cerrado por obras! ¡Salió en el periódico!", stu: "Cierto. Ese día no había clase. ¿Cómo voy a haber hecho eso si no había nadie?" },
  { valid: false, t: "¡Ustedes no entienden a los jóvenes de hoy! ¡{n} solo expresaba su arte!", stu: "Sí, fue mi obra maestra. Pero vale, me pasé un pelín." },
  { valid: true, t: "¡{n} se rompió la pierna ayer, no pudo hacer eso, ni siquiera puede correr!", stu: "Mire mi escayola… no pude hacerlo. Es imposible, fue otra persona." },
  { valid: false, t: "¡Es la envidia, que mi {hijo} es muy popular! ¡Y sus compañeros lo exageran todo!", stu: "Exageran poco, la verdad. Hice lo que dicen. Con mucho carisma, eso sí." },
  { valid: false, t: "¡Voy a llamar a mi abogado, a mi cuñado, y a mi grupo de WhatsApp!", stu: "Mamá, por favor, no… sí que lo hice. No llames a la tía Mari." },
  { valid: true, t: "¡{n} estaba en la enfermería a esa hora! ¡La enfermera lo puede confirmar!", stu: "Estaba tumbad{o} con dolor de barriga. Hay un registro y todo. Fue un error." }
];
const MOM_ARRIVE = ["¡¿DÓNDE ESTÁ EL DIRECTOR?! ¡QUIERO HABLAR CON USTED YA!", "¡Buenos días! ¡Y no son tan buenos, por cierto!", "¡Abra, abra, que vengo por lo del parte!", "Perdone la hora, pero esto no puede esperar…"];

const FEED_RELAX = [
  "No te preocupes, desahógate y firma partes de incidencias.", "Respira hondo… y firma.", "Café, firma, repite.", "¿Otro parte? Siempre hay otro parte.",
  "Bear o cualquier otra persona ha puesto un parte. No pasa nada.", "Tu firma vale más que tu paciencia.", "Alguien huele a calabozo desde aquí.",
  "La jefa de estudios te mira desde el pasillo…", "Un consejo: nunca leas el parte con hambre.", "Cuenta hasta diez. Luego firma. Luego grita.",
  "Hoy el claustro viene con ganas de partes.", "El conserje dice que hay un charco sospechoso.", "Pulsa DESAHÓGATE si ves que te da algo."
];
const MENU_TAGS = [
  "Bear ha puesto un parte… no te preocupes, desahógate y firma.", "Otra persona ha puesto un parte. Siempre hay otra persona.", "Respira. Firma. Repite.",
  "Los partes no se firman solos (todavía).", "¿Madre enfadada a las 8:00? Es martes.", "Desahógate y firma partes de incidencias.", "Cuidado con el BOSS FINAL…"
];
