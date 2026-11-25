/* ===== «LLAMADITA A CASA»: hablar con la familia mientras firmas ===== */
const TONES = {
  seria: { label: "🧐 Seria", col: ["#9ab8e8", "#4a68a8"] },
  amable: { label: "🤝 Comprensiva", col: ["#7ad46a", "#2f8a2a"] },
  borde: { label: "😤 Borde", col: ["#ffb85a", "#c0701a"] },
  fuera: { label: "🤬 A tomar por culo", col: ["#ff7a6a", "#9a1a12"] }
};
// lo que dices tú (primera frase y réplica)
const SAY = {
  seria: [["Buenos días. Le llamo de Dirección: {n} tiene un parte de incidencias y debe estar informada.", "Le llamo del instituto. {n} ha cometido una falta que queda registrada y conlleva sanción.", "Buenos días, soy de Dirección. Necesito que conozca lo que ha pasado hoy con {n}."],
    ["Le pido que hablen en casa. Habrá seguimiento y, si se repite, la sanción será mayor.", "Los hechos están documentados. Puede solicitar una reunión cuando quiera.", "La normativa es clara. Le enviaremos la notificación por escrito para que la firme."]],
  amable: [["Hola, no se asuste: {n} está bien. Solo quería contarle algo que ha pasado y buscar una solución.", "Buenos días. {n} suele ser buen{o} estudiante, por eso quería hablarlo con usted antes de nada.", "Hola, ¿tiene un minuto? Creo que {n} lo está pasando regular y quería comentárselo."],
    ["¿Ha notado algo raro en casa últimamente? Podemos ayudar desde Orientación.", "Entre las dos partes seguro que lo reconducimos. Estoy a su disposición.", "No se trata de castigar por castigar. Queremos que {n} esté a gusto aquí."]],
  borde: [["¿Es usted quien educa a {n}? Porque se nota poco.", "Mire, voy rápido: {n} la ha vuelto a liar y ya me tiene harto el temita.", "Llamo por {n}. Otra vez. A ver si en casa se ponen las pilas."],
    ["Pues si no le gusta, haberle puesto normas antes.", "No me cuente su vida, que tengo cuarenta partes más.", "Mi paciencia tiene un límite, y su {hijo} lo ha pasado hace rato."]],
  fuera: [["¿Sabe qué? Váyase usted a tomar por culo, que de aquí no pasa ni un parte más.", "Mire, con todo el cariño: váyase a tomar por culo.", "Se lo resumo: usted y sus excusas, a tomar por culo."]]
};
// respuestas de la familia según su carácter y tu tono
const FAM_REPLY = {
  colabora: {
    seria: ["Gracias por avisar. En casa lo hablaremos muy seriamente.", "Entendido. ¿Puedo pasar el jueves a firmar y hablarlo?", "Vaya disgusto… Cuente con nosotros, se quedará sin móvil una semana.", "De acuerdo. Mándeme la notificación y la firmo hoy mismo."],
    amable: ["Qué bien que lo cuente así. La verdad es que {n} anda rar{o} últimamente.", "Muchas gracias, de verdad. No siempre llaman con tanta calma.", "Nos vendría muy bien esa ayuda de Orientación, gracias.", "Le agradezco el trato. Esta tarde hablamos con {n} tranquilamente."],
    borde: ["Perdone, pero no hace falta hablarme así. Estoy intentando colaborar.", "Vale… entiendo que esté cansado, pero esas formas no.", "Yo venía a ayudar y me está usted echando la bronca a mí."],
    fuera: ["¿¡Cómo dice!? Yo, que siempre he apoyado al centro… Esto lo sabrá Inspección.", "No me lo puedo creer. Mañana a primera hora estoy en su despacho."]
  },
  defensora: {
    seria: ["¿Seguro que fue mi {niño}? {n} me ha contado otra cosa.", "Quiero ver las pruebas. En casa nunca hace nada de eso.", "Siempre le toca a {n}. ¿Y los demás qué?", "Hablaré con {n}, pero ya le digo que algo habrá provocado."],
    amable: ["Bueno… si me lo dice así, le escucho. Pero es muy buen{o} niñ{o}.", "A lo mejor es que se aburre, porque es muy list{o}.", "Se lo agradezco, aunque sigo pensando que le tienen manía.", "Puede ser que esté nervios{o}. En casa han cambiado cosas."],
    borde: ["¿Perdone? ¡A mi {hijo} no lo juzga usted por teléfono!", "¡Qué maleducado! Se lo voy a contar a todo el grupo de padres.", "¡Así normal que {n} se porte mal en ese instituto!"],
    fuera: ["¡¿QUÉ ME HA DICHO?! ¡No se mueva, que voy para allá AHORA MISMO!", "¡Esto es el colmo! ¡Abogado, Inspección y prensa, por ese orden!"]
  },
  pasota: {
    seria: ["Ya… vale… ¿algo más? Es que estoy en el trabajo.", "Mmm. Pues póngale lo que tenga que ponerle.", "¿Otra vez? Bueno, ya se le pasará.", "Sí, sí. Apuntado. (Se oye la tele de fondo.)"],
    amable: ["Qué majo. Oiga, ¿esto me va a llevar mucho?", "Ah, muy bien, muy bien. Yo es que no puedo con {n}.", "Si quiere ayudarle, todo suyo, de verdad.", "Perdone, ¿quién era usted? Ah, sí, el instituto."],
    borde: ["Mire, a mí no me grite que bastante tengo.", "Pues cuelgo, ¿eh? Que no estoy para broncas.", "Dígaselo a su padre, que yo paso."],
    fuera: ["Ala, pues muy bien. Igualmente. Y ya le llegará la queja.", "¿Eh? ¿Me ha mandado…? Mire, ahora sí que voy a ir."]
  },
  agresiva: {
    seria: ["¡Otra vez ustedes! ¡No tienen otra cosa que hacer que llamar!", "¡Más le vale tener pruebas, porque si no, la vamos a tener!", "Vale. Pero como me entere de que es mentira, me van a oír.", "¡{n}! ¡Ven aquí ahora mismo! …Perdone, siga."],
    amable: ["…Vale. No me esperaba que me hablaran bien. Dígame.", "Mire, es que estoy muy estresad@. Gracias por no empezar gritando.", "Bueno… por esta vez le escucho. {n} y yo vamos a hablar.", "No se piense que con buenas palabras me convence… pero siga."],
    borde: ["¡¿Pero tú quién te crees que eres?! ¡Que voy para allá!", "¡A mí no me chulea nadie! ¡Nos vemos en la puerta!", "¡Eso me lo repites a la cara!"],
    fuera: ["¡¡¡COMO QUE A TOMAR POR DÓNDE!!! ¡¡¡ABRE LA PUERTA, QUE LLEGO EN CINCO MINUTOS!!!", "(Se oyen unas llaves y un coche arrancando.)"]
  }
};
const HELLO = {
  colabora: ["¿Sí? Dígame.", "Hola, buenos días, ¿ha pasado algo?", "Sí, soy yo. ¿{n} está bien?"], defensora: ["¿Quién es? ¿No será otra vez del instituto?", "Sí… ¿qué le han hecho ahora a {n}?", "Dígame. Pero rapidito, que ya me conozco estas llamadas."],
  pasota: ["¿Qué? ¿Quién?", "Sí, dígame… (bostezo)", "Estoy conduciendo, bueno, diga."], agresiva: ["¡¿QUÉ?!", "¡¿Quién llama a estas horas?!", "¡Más vale que sea importante!"]
};
const PERS_NAME = { colabora: "colaboradora", defensora: "protectora", pasota: "pasota", agresiva: "de armas tomar" };
let CALL = null;
function startCall(p) {
  const dad = chance(0.3), st = p.student, pers = pick(["colabora", "colabora", "defensora", "defensora", "pasota", "agresiva"]);
  p.called = true;
  CALL = { p, dad, parent: dad ? "Padre" : "Madre", name: dad ? pick(["Paco", "Julián", "Andrés", "Ramón", "Toni", "Manolo", "Javier", "Rubén"]) : pick(MOM_NAMES), pers, phase: "ring", round: 0, t: 0, who: "", text: "", shown: 0, opts: [], tones: [], look: look(!dad), ringT: 0, used: {} };
  G.call = true; Snd.ring();
}
function callSay(who, text, pitch) { const C = CALL, st = C.p.student; C.who = who; C.text = gen(text, st.gender, st.first).replace(/@/g, C.dad ? "o" : "a"); C.shown = 0; C.pitch = pitch; C.t = 0; }
const callDone = () => CALL && CALL.shown >= CALL.text.length;
function callSkip() { if (CALL && CALL.phase !== "ring" && !callDone()) CALL.shown = CALL.text.length; }
function callOptions() {
  const C = CALL, r = C.round;
  const list = r === 0 ? ["seria", "amable", "borde", "fuera"] : ["seria", "amable", "borde", "fuera"];
  C.opts = list.map(k => ({ k, line: pick(SAY[k][Math.min(r, SAY[k].length - 1)]) })); C.phase = "choose";
}
function callChoose(o) {
  const C = CALL; C.tone = o.k; C.tones.push(o.k); C.phase = "you"; callSay("Tú (Dirección)", o.line, 200); Snd.click();
}
function callReply() {
  const C = CALL, pool = FAM_REPLY[C.pers][C.tone], fresh = pool.filter(x => !C.used[x]), line = pick(fresh.length ? fresh : pool); C.used[line] = 1;
  C.phase = "them"; callSay(C.parent + " de " + C.p.student.first, line, C.dad ? 150 : 330); if (C.tone === "fuera" || C.pers === "agresiva") Snd.angryVoice();
}
function callEnd() { // consecuencias de lo que has dicho
  const C = CALL, p = C.p, T = C.tones, lines = []; let ds = 0, pts = 0, coins = 0, mom = null;
  if (T.includes("fuera")) { ds = -22; pts = -150; mom = 1; p.insulted = true; addRigor(3); lines.push("Desahogo máximo… pero hay QUEJA a Inspección.", "La familia viene al instituto en cuanto firmes este parte."); }
  else if (T.includes("borde")) { ds = -9; pts = -30; mom = 0.55; lines.push("Te has quedado a gusto, pero la familia está molesta.", "Es bastante probable que venga a protestar."); }
  else if (T.length) {
    const nice = T.filter(x => x === "amable").length; ds = -(4 + nice * 2); coins = 8 + (T.length - nice) * 4; mom = C.pers === "agresiva" || C.pers === "defensora" ? 0.08 : 0.02; p.informed = true;
    lines.push("Familia informada correctamente.", "Si firmas bien este parte: +50 puntos extra.");
  } else lines.push("Has colgado sin decir nada.");
  if (mom !== null) p.momChance = mom;
  G.stress = Math.max(0, Math.min(100, G.stress + ds)); G.score = Math.max(0, G.score + pts);
  if (ds) lines.push("Estrés " + (ds > 0 ? "+" : "−") + Math.abs(ds) + (pts ? " · " + pts + " puntos" : "") + (coins ? " · +" + coins + " monedas" : ""));
  C.summary = lines; C.phase = "end"; C.t = 0; Snd.hang(); if (coins) earn(coins, 640, 360);
  feed("Llamada a casa de " + p.student.first + (T.includes("fuera") ? ": se ha liado muy gorda." : T.includes("borde") ? ": han colgado enfadados." : ": hecha."), T.includes("fuera") || T.includes("borde") ? "#ff9a8a" : "#9fe");
}
function closeCall() { G.call = false; CALL = null; saveGame(); }
function updateCall(dt) {
  const C = CALL; C.t += dt;
  if (C.phase === "ring") { C.ringT += dt; if (C.ringT > 1.1 && C.t < 1.8) { C.ringT = 0; Snd.ring(); } if (C.t > 2) { C.phase = "hello"; callSay(C.parent + " de " + C.p.student.first, pick(HELLO[C.pers]), C.dad ? 150 : 330); } return; }
  if (C.phase !== "end" && C.shown < C.text.length) { const a = Math.floor(C.shown); C.shown += dt * 42; const b = Math.floor(C.shown); if (b > a && b % 2 === 0 && C.text[b - 1] !== " ") Snd.blip(C.pitch); if (C.shown >= C.text.length) { C.shown = C.text.length; C.t = 0; } return; }
  if (C.phase === "hello" && C.t > 0.5) callOptions();
  else if (C.phase === "you" && C.t > 0.8) callReply();
  else if (C.phase === "them" && C.t > 1.7) { C.round++; if (C.tone === "fuera" || (C.tone === "borde" && (C.pers === "agresiva" || C.round > 1 || chance(0.35))) || C.round >= 2) callEnd(); else callOptions(); }
}
function drawCall(dt) {
  updateCall(dt); const C = CALL; if (!C) return; const st = C.p.student;
  ctx.fillStyle = "rgba(8,5,18,.9)"; ctx.fillRect(0, 0, W, H);
  txt("Llamadita a casa", W / 2, 62, { size: 50, font: F_TITLE, align: "center", color: "#ffd98a" });
  txt(C.parent + " de " + st.first + " " + st.last.split(" ")[0] + " · " + C.p.course + (C.phase !== "ring" ? " · persona " + PERS_NAME[C.pers] : ""), W / 2, 94, { size: 18, font: F_TYPE, align: "center", color: "#e8d8b0" });
  // retrato en un círculo, con ondas de llamada
  const cx = 220, cy = 270;
  for (let i = 0; i < 3; i++) { const k = (now * 0.8 + i / 3) % 1; ctx.strokeStyle = `rgba(122,212,106,${(1 - k) * (C.phase === "end" ? 0 : 0.6)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, 112 + k * 60, 0, 7); ctx.stroke(); }
  const talking = (C.phase === "them" || C.phase === "hello") && !callDone(), angry = C.tones.includes("fuera") || C.tones.includes("borde") || C.pers === "agresiva";
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, 108, 0, 7); ctx.fillStyle = angry && C.phase !== "ring" ? "#6a2a2a" : "#2a4a6a"; ctx.fill(); ctx.clip();
  person(cx + (talking && angry ? Math.sin(now * 40) * 2 : 0), cy + 222, 2.1, Object.assign({}, C.look, { fem: C.dad ? 0 : 1, mouth: talking ? 0.5 + 0.5 * Math.sin(now * 24) : 0, angry: angry && C.phase !== "ring" ? 1 : 0 })); ctx.restore();
  ctx.strokeStyle = "#c79a4a"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, 108, 0, 7); ctx.stroke();
  txt(C.name, cx, cy + 150, { size: 24, align: "center", color: "#fff", weight: "bold" });
  txt("📞", cx + 96, cy - 74 + (C.phase === "ring" ? Math.sin(now * 40) * 5 : 0), { size: 44, align: "center", font: "sans-serif" });
  // conversación
  const bx = 400, by = 130, bw = 830, bh = 280, you = C.who.startsWith("Tú");
  if (C.phase === "ring") txt("Llamando" + ".".repeat(1 + Math.floor(now * 3) % 3), bx + bw / 2, 280, { size: 44, align: "center", color: "#9fe0a0" });
  else if (C.phase === "end") {
    ctx.fillStyle = "#f6ecc8"; rr(bx, by, bw, bh, 18); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = "#3a200a"; ctx.stroke(); txt("Llamada terminada", bx + 30, by + 52, { size: 34, font: F_TITLE, color: "#7a1a1a" });
    C.summary.forEach((l, i) => txt(l, bx + 30, by + 100 + i * 38, { size: 22, color: "#2a1a0a" }));
  } else {
    ctx.fillStyle = you ? "#dff0d0" : "#f6ecc8"; rr(bx, by, bw, bh, 18); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = you ? "#2f6a2a" : "#3a200a"; ctx.stroke();
    txt(C.who, bx + 30, by + 46, { size: 26, font: F_TITLE, color: you ? "#1c5a1a" : "#8a2a1a" });
    const ls = wrap(C.text, bw - 60, `34px ${F_HAND}`); let used = 0; ls.forEach((l, i) => { const part = C.text.slice(0, Math.floor(C.shown)).slice(used, used + l.length + 1); used += l.length + 1; txt(part.trimEnd(), bx + 30, by + 100 + i * 40, { size: 34, font: F_HAND, color: "#20140a" }); });
  }
  // opciones abajo
  if (C.phase === "choose") {
    txt("¿Qué quieres decirle?", W / 2, 446, { size: 24, align: "center", color: "#fff2cc", weight: "bold" });
    C.opts.forEach((o, i) => {
      const x = 40 + i * 303, y = 462, w = 290, h = 170;
      button("say" + o.k, x, y, w, h, "", () => callChoose(o), { color: TONES[o.k].col });
      txt(TONES[o.k].label, x + w / 2, y + 34, { size: 22, weight: "bold", align: "center", color: "#1a0a02" });
      wrap("«" + gen(o.line, st.gender, st.first) + "»", w - 30, `16px ${F_UI}`).slice(0, 5).forEach((l, j) => txt(l, x + w / 2, y + 66 + j * 21, { size: 16, align: "center", color: "#1a0a02" }));
    });
  }
  if (C.phase === "end") button("callclose", W / 2 - 170, 520, 340, 68, "Volver al parte", () => { Snd.click(); closeCall(); }, { size: 26, color: ["#7ad46a", "#2f8a2a"] });
  else button("hangup", W / 2 - 100, 654, 200, 46, "Colgar", () => { callEnd(); }, { size: 20, color: ["#ff9a8a", "#b0402a"] });
}
