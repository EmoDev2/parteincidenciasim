/* ===== GUARDADO, MONEDAS, TIENDA Y SPLASH ===== */
const SAVE_KEY = "ftp_save";
const COPY = "© 2026 Mallionic Inc. Todos los derechos reservados.";
const SAVE_FIELDS = ["score", "stress", "combo", "maxCombo", "signed", "wrong", "time", "rigor", "rank", "exps", "voids", "day", "dayCount", "evals", "momCount", "difficulty", "coins", "items", "pendingEval", "cd", "newBest"];
function readSaveRaw() { try { const d = JSON.parse(localStorage.getItem(SAVE_KEY)); return d && d.v === 1 && Array.isArray(d.queue) ? d : null; } catch (e) { return null; } }
let saveCache = readSaveRaw(), confirmNew = 0;
function saveGame() {
  if (!G || G.over || G.tut) return;
  const d = { v: 1, queue: G.queue.filter(p => !["stamp", "exit", "void"].includes(p.st)) };
  SAVE_FIELDS.forEach(k => d[k] = G[k]);
  try { const s = JSON.stringify(d); localStorage.setItem(SAVE_KEY, s); saveCache = JSON.parse(s); } catch (e) { }
}
function clearSave() { saveCache = null; try { localStorage.removeItem(SAVE_KEY); } catch (e) { } }
function loadGame() {
  const d = saveCache; if (!d) { newGame(); return; }
  newGame(); G.tut = null; toasts.length = 0; G.feed = [];
  SAVE_FIELDS.forEach(k => { if (d[k] !== undefined) G[k] = d[k]; }); G.items = G.items || {};
  G.queue = JSON.parse(JSON.stringify(d.queue)); for (const p of G.queue) { delete p.st; delete p.result; p.at = 0; p.sigSnd = false; p.lines = null; parteSeq = Math.max(parteSeq, p.id); }
  if (!G.queue.length) G.queue.push(makeParte(G.difficulty));
  toast("Partida recuperada · Jornada " + G.day, "#8fe28f"); feed("Partida cargada. A seguir firmando.", "#9fe");
  if (G.pendingEval) { G.evals = Math.max(0, G.evals - 1); setTimeout(startEval, 500); }
}
addEventListener("pagehide", () => { if (typeof scene !== "undefined" && scene !== "menu" && !["splash", "press", "black", "loading", "over"].includes(scene)) saveGame(); });
document.addEventListener("visibilitychange", () => { if (document.hidden && typeof scene !== "undefined" && scene === "play") saveGame(); });

/* ---------- monedas ---------- */
const coinFx = [];
function earn(n, x = 380, y = 360) {
  if (G.items.tazaoro) n = Math.round(n * 1.25);
  G.coins += n; Snd.coin();
  for (let i = 0; i < Math.min(9, 3 + Math.floor(n / 12)); i++) coinFx.push({ x: x + rnd(-60, 60), y: y + rnd(-40, 40), t: -i * 0.05 });
  feed("+" + n + " monedas", "#ffd75e");
}
function drawCoin(x, y, r) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r); g.addColorStop(0, "#fff2a8"); g.addColorStop(0.6, "#eab52c"); g.addColorStop(1, "#a86e10");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.lineWidth = Math.max(1.5, r * 0.12); ctx.strokeStyle = "#6a4208"; ctx.stroke(); txt("€", x, y + r * 0.42, { size: r * 1.2, weight: "bold", align: "center", color: "#7a4c08" });
}
function drawCoinFx(dt) {
  for (let i = coinFx.length - 1; i >= 0; i--) {
    const c = coinFx[i]; c.t += dt; if (c.t < 0) continue; const k = Math.min(1, c.t / 0.75); if (k >= 1) { coinFx.splice(i, 1); continue; }
    const e = k * k * (3 - 2 * k), tx = 1074, ty = 94; drawCoin(c.x + (tx - c.x) * e, c.y + (ty - c.y) * e - Math.sin(k * Math.PI) * 110, 13);
  }
}

/* ---------- tienda ---------- */
const SHOP = [
  { id: "cafe", name: "Café doble", desc: "−30 de estrés al momento.", price: 40, use: () => { G.stress = Math.max(0, G.stress - 30); } },
  { id: "tila", name: "Infusión de tila", desc: "−15 de estrés.", price: 22, use: () => { G.stress = Math.max(0, G.stress - 15); } },
  { id: "planta", name: "Planta zen", desc: "El estrés por cola sube menos y baja antes.", price: 140, perm: true },
  { id: "secre", name: "Secretaría eficiente", desc: "Aguantas 2 partes más en cola sin estrés.", price: 220, perm: true },
  { id: "sello", name: "Sello de oro", desc: "+20 % de puntos en partes correctos.", price: 260, perm: true },
  { id: "tazaoro", name: "Taza «Jefa del mes»", desc: "+25 % de monedas.", price: 320, perm: true },
  { id: "cartel", name: "Cartel «No molestar»", desc: "Las madres vienen la mitad de veces.", price: 280, perm: true }
];
function buyItem(it) {
  if (it.perm && G.items[it.id]) return;
  if (G.coins < it.price) { Snd.denied(); toast("No te llegan las monedas", "#ff8a6a"); return; }
  G.coins -= it.price; Snd.spend(); if (it.perm) { G.items[it.id] = 1; toast("¡" + it.name + " comprado!", "#ffd75e"); } else { it.use(); toast(it.name + " · " + it.desc, "#9fe"); }
  saveGame();
}
function drawShop() {
  ctx.fillStyle = "rgba(10,5,20,.82)"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#f6ebc4"; rr(170, 40, 940, 640, 22); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = "#3a200a"; ctx.stroke();
  txt("Tienda de Dirección", 210, 100, { size: 46, font: F_TITLE, color: "#2a1005" });
  drawCoin(930, 84, 20); txt(String(G.coins), 960, 97, { size: 36, weight: "bold", color: "#6a4208" });
  SHOP.forEach((it, i) => {
    const y = 122 + i * 69, own = it.perm && G.items[it.id];
    ctx.fillStyle = own ? "rgba(60,160,70,.16)" : "rgba(255,255,255,.55)"; rr(200, y, 880, 62, 12); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(60,32,10,.45)"; ctx.stroke();
    txt(it.name, 222, y + 28, { size: 22, weight: "bold", color: "#2a1005" }); txt(it.desc + (it.perm ? "" : "  (de un solo uso)"), 222, y + 50, { size: 16, color: "#5a3a18" });
    drawCoin(830, y + 31, 13); txt(String(it.price), 850, y + 39, { size: 22, weight: "bold", color: "#6a4208" });
    button("buy" + it.id, 920, y + 9, 144, 44, own ? "✔ Tuyo" : "Comprar", () => buyItem(it), { size: 18, disabled: !!own, color: G.coins >= it.price ? ["#7ad46a", "#2f8a2a"] : ["#c9b78a", "#8a7440"] });
  });
  button("shopclose", W / 2 - 150, 618, 300, 52, "Volver al despacho", () => { Snd.click(); G.shop = false; saveGame(); }, { size: 22 });
}

/* ---------- splash de empresa ---------- */
const LOGO = new Image(); LOGO.src = "mallionic-logo.png";
const SPLASH = { t: 0, WHITE: 0.6, IN: 1.3, HOLD: 3, OUT: 1.3, END: 0.6 };
const smooth = k => { k = Math.max(0, Math.min(1, k)); return k * k * (3 - 2 * k); };
/* pantalla negra inicial: espera cualquier tecla, clic o toque (así el navegador permite el sonido) */
function drawPress() {
  ctx.fillStyle = "#000"; ctx.fillRect(-20, -20, W + 40, H + 40);
  ctx.save(); ctx.globalAlpha = 0.45 + 0.55 * Math.abs(Math.sin(now * 2.2)); txt("Presiona cualquier botón para continuar", W / 2, H / 2 + 10, { size: 34, align: "center", color: "#fff" }); ctx.restore();
  txt(COPY, W / 2, 690, { size: 15, align: "center", color: "#777" });
}
function startSplash() {
  if (scene !== "press") return; scene = "splash"; SPLASH.t = 0;
  // acorde suave de presentación
  [[261.6, 0.5], [392, 0.7], [523.3, 0.9], [784, 1.15]].forEach(([f, d]) => Snd.note(f, 3.2, d, 0.07, { parts: [["sine", 1, 1], ["sine", 2, 0.25], ["triangle", 3, 0.06]], atk: 0.25, dest: Snd.sfx }));
}
addEventListener("keydown", () => { if (typeof scene !== "undefined" && scene === "press") { Snd.init(); startSplash(); } });
function drawSplash(dt) {
  SPLASH.t += dt; const S = SPLASH, t = S.t, tIn = S.WHITE, tHold = tIn + S.IN, tOut = tHold + S.HOLD, tEnd = tOut + S.OUT, total = tEnd + S.END;
  ctx.fillStyle = "#000"; ctx.fillRect(-20, -20, W + 40, H + 40);
  const white = t < tEnd ? smooth(t / S.WHITE) : 1 - smooth((t - tEnd) / S.END);
  ctx.save(); ctx.globalAlpha = white; ctx.fillStyle = "#ffffff"; ctx.fillRect(-20, -20, W + 40, H + 40); ctx.restore();
  const a = t < tHold ? smooth((t - tIn) / S.IN) : t < tOut ? 1 : 1 - smooth((t - tOut) / S.OUT); // aparece y desaparece poco a poco
  if (a > 0) {
    const s = 560 * (0.92 + 0.08 * smooth(t / tEnd)); ctx.save(); ctx.globalAlpha = a;
    if (LOGO.complete && LOGO.naturalWidth !== 0) ctx.drawImage(LOGO, W / 2 - s / 2, H / 2 - s / 2 - 16, s, s); else txt("MALLIONIC", W / 2, H / 2, { size: 80, weight: "bold", align: "center", color: "#3f3f3f" });
    txt(COPY, W / 2, 690, { size: 15, align: "center", color: "#6a6a6a" }); ctx.restore();
  }
  if (t >= total) { scene = "black"; BLACK.t = 0; }
}

/* ---------- negro (2 s) y pantalla de carga animada ---------- */
const BLACK = { t: 0, dur: 2 };
function drawBlack(dt) {
  BLACK.t += dt; ctx.fillStyle = "#000"; ctx.fillRect(-20, -20, W + 40, H + 40);
  if (BLACK.t >= BLACK.dur) startLoading();
}
const LOAD_MSGS = [
  "Lloviendo partes como skecherinis…", "Cuidado con los Calagman: ¡los ordenadores no se tocan!", "Afilando el bolígrafo de Dirección…", "Bear está redactando otro parte…",
  "Calentando el café de la sala de profesores…", "Oliendo el pasillo en busca de sandía…", "Ordenando partes por nivel de drama…", "Avisando a las madres… con cuidado.",
  "Barnizando la sillita del calabozo…", "Contando vapeadores requisados…", "Practicando la firma de tutor en curvas Bézier…", "Despertando a la Jefa de Estudios…",
  "Un skecherini no corre por el pasillo. Vuela.", "Revisando las notas de la evaluación…", "Prohibido jugar con el proyector.", "Respira hondo, desahógate y firma."
];
const LOAD = { t: 0, dur: 8, msgs: [], drops: [], done: false };
function startLoading() {
  scene = "loading"; fade = { a: 1, dir: -1, next: null, fn: null };
  const rest = LOAD_MSGS.slice(2).sort(() => Math.random() - 0.5);
  LOAD.t = 0; LOAD.done = false; LOAD.msgs = [LOAD_MSGS[0], LOAD_MSGS[1]].concat(rest.slice(0, 3));
  LOAD.drops = Array.from({ length: 34 }, (_, i) => ({ x: rnd(0, W), y: rnd(-H, H), v: rnd(90, 240), r: rnd(0, 6), vr: rnd(-1.6, 1.6), s: rnd(0.45, 1.1), shoe: i % 5 === 0, p: rnd(0, 6) }));
  if (Snd.ctx) Snd.music("menu"); Snd.paper();
}
function drawShoe(x, y, s, r) { // zapatilla genérica que cae del cielo
  ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.scale(s, s); ctx.lineJoin = "round"; ctx.lineWidth = 3; ctx.strokeStyle = "#1a0f0a";
  ctx.fillStyle = "#e84a5a"; ctx.beginPath(); ctx.moveTo(-30, 6); ctx.lineTo(-30, -14); ctx.quadraticCurveTo(-16, -18, -8, -8); ctx.lineTo(8, -4); ctx.quadraticCurveTo(32, 0, 34, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#fff"; rr(-32, 6, 68, 11, 5); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.5; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-10 + i * 8, -7 + i * 1.5); ctx.lineTo(-14 + i * 8, 1 + i); ctx.stroke(); }
  ctx.restore();
}
function drawLoading(dt) {
  LOAD.t += dt; const t = LOAD.t, raw = Math.min(1, t / (LOAD.dur - 0.8)), pr = Math.min(1, raw * 0.9 + smooth(raw) * 0.1);
  // arte con zoom lento
  const z = 1.02 + 0.05 * smooth(t / LOAD.dur), ox = Math.sin(t * 0.35) * 8;
  ctx.save(); ctx.translate(W / 2 + ox, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  if (IM.loading) ctx.drawImage(IM.loading, 0, 0, W, H); else { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#150c3a"); g.addColorStop(1, "#e8704a"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  // luna que late y ventanas que parpadean
  const mg = ctx.createRadialGradient(1100, 190, 20, 1100, 190, 150 + Math.sin(t * 2) * 14); mg.addColorStop(0, "rgba(255,240,200,.35)"); mg.addColorStop(1, "rgba(255,240,200,0)"); ctx.fillStyle = mg; ctx.fillRect(900, 0, 380, 400);
  [[482, 430], [540, 430], [740, 430], [798, 430], [482, 505], [798, 505], [394, 312], [874, 392]].forEach(([x, y], i) => { const a = Math.max(0, Math.sin(t * 3 + i * 1.9)) * 0.35; const g = ctx.createRadialGradient(x, y + 24, 3, x, y + 24, 40); g.addColorStop(0, `rgba(255,220,120,${a})`); g.addColorStop(1, "rgba(255,220,120,0)"); ctx.fillStyle = g; ctx.fillRect(x - 40, y - 16, 80, 80); });
  ctx.restore();
  // lluvia de partes y zapatillas
  for (const d of LOAD.drops) { d.y += d.v * dt; d.r += d.vr * dt; if (d.y > H + 50) { d.y = -60; d.x = rnd(0, W); } const x = d.x + Math.sin(t * 1.4 + d.p) * 22; if (d.shoe) drawShoe(x, d.y, d.s * 0.9, Math.sin(d.r) * 0.7); else drawPaperSprite(x, d.y, d.s, Math.sin(d.r) * 0.9); }
  // título
  const k = back(Math.min(1, t / 0.8)), ty = 68 + Math.sin(t * 2) * 3;
  ctx.save(); ctx.translate(W / 2, ty); ctx.scale(0.6 + 0.4 * k, 0.6 + 0.4 * k); txt("Firma Tu Parte de Incidencias", 0, 0, { size: 58, font: F_TITLE, align: "center", color: "#ffe9a0", stroke: "#2a0f06", sw: 10 }); ctx.restore();
  // panel: mensaje, barra y porcentaje
  const px = 300, py = 506, pw = 640, ph = 118;
  ctx.fillStyle = "rgba(18,8,22,.86)"; rr(px, py, pw, ph, 18); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = "#c79a4a"; ctx.stroke();
  const each = (LOAD.dur - 0.8) / LOAD.msgs.length, idx = Math.min(LOAD.msgs.length - 1, Math.floor(t / each)), mt = t - idx * each;
  const msg = raw >= 1 ? "¡Listo! Abriendo el despacho…" : LOAD.msgs[idx], ma = raw >= 1 ? 1 : Math.min(1, mt * 4, (each - mt) * 4);
  ctx.save(); ctx.globalAlpha = Math.max(0, ma); const ls = wrap(msg, pw - 50, `23px ${F_UI}`); ls.forEach((l, i) => txt(l, px + pw / 2, py + (ls.length > 1 ? 32 : 46) + i * 27 + (1 - Math.min(1, mt * 4)) * 8, { size: 23, align: "center", color: "#fff2cc" })); ctx.restore();
  const bx = px + 30, by = py + 84, bw = pw - 140; ctx.fillStyle = "#2a1a10"; rr(bx, by, bw, 18, 9); ctx.fill();
  ctx.save(); rr(bx, by, bw, 18, 9); ctx.clip(); const g = ctx.createLinearGradient(bx, 0, bx + bw, 0); g.addColorStop(0, "#e8a62a"); g.addColorStop(1, "#76e316"); ctx.fillStyle = g; ctx.fillRect(bx, by, bw * pr, 18);
  ctx.fillStyle = "rgba(255,255,255,.28)"; for (let x = -40; x < bw; x += 34) { ctx.beginPath(); const sx = bx + x + (t * 60) % 34; ctx.moveTo(sx, by + 18); ctx.lineTo(sx + 12, by); ctx.lineTo(sx + 22, by); ctx.lineTo(sx + 10, by + 18); ctx.fill(); } ctx.restore();
  ctx.strokeStyle = "#c79a4a"; ctx.lineWidth = 2; rr(bx, by, bw, 18, 9); ctx.stroke();
  txt(Math.floor(pr * 100) + " %", px + pw - 30, by + 17, { size: 22, weight: "bold", align: "right", color: "#ffd75e" });
  // sello que va estampando
  if (IM.stamp) { const c = (t * 1.5) % 1, dy = c < 0.6 ? -28 * Math.sin(c / 0.6 * Math.PI) : 0; ctx.drawImage(IM.stamp, bx + bw * pr - 20, by - 50 + dy, 40, 56); }
  txt(COPY, W / 2, 708, { size: 13, font: F_TYPE, align: "center", color: "#fff2b0", stroke: "rgba(0,0,0,.8)", sw: 4 });
  if (t >= LOAD.dur && !LOAD.done && !fade.dir) { LOAD.done = true; go("menu"); }
}

/* ---------- botones del menú principal ---------- */
function menuButtons(t, tx) {
  const pulse = 1 + Math.sin(t * 4) * 0.02, sv = saveCache;
  const start = () => { clearSave(); go("play", () => { newGame(); Snd.music("play"); }); };
  ctx.save(); ctx.translate(tx, 336); ctx.scale(pulse, pulse); ctx.translate(-tx, -336);
  if (sv) button("cont", tx - 190, 306, 380, 62, "▶  CONTINUAR", () => { Snd.click(); go("play", () => { loadGame(); Snd.music("play"); }); }, { size: 28, color: ["#7ad46a", "#2f8a2a"], sub: "Jornada " + sv.day + " · " + sv.score + " pts · " + (sv.coins || 0) + " monedas" });
  else button("play", tx - 190, 300, 380, 72, "▶  INICIAR JORNADA", () => { Snd.click(); start(); }, { size: 30, color: ["#7ad46a", "#2f8a2a"] });
  ctx.restore();
  if (sv) button("newg", tx - 190, 378, 380, 48, now < confirmNew ? "¿Seguro? Se borra la guardada" : "Nueva partida", () => { Snd.click(); if (now < confirmNew) { confirmNew = 0; start(); } else confirmNew = now + 3.5; }, { size: now < confirmNew ? 18 : 22, color: now < confirmNew ? ["#ff9a8a", "#b0402a"] : undefined });
  button("how", tx - 190, sv ? 434 : 392, 380, sv ? 48 : 54, "¿Cómo se juega?", () => { Snd.click(); scene = "howto"; }, { size: 22 });
  button("snd", tx - 190, sv ? 490 : 460, 380, sv ? 48 : 54, Snd.muted ? "🔇  Sonido: NO" : "🔊  Sonido: SÍ", () => { Snd.toggle(); Snd.click(); }, { size: 22, color: ["#9ab8e8", "#4a68a8"] });
  txt("🏆 Récord: " + best + " pts", tx, sv ? 574 : 548, { size: 24, align: "center", color: "#fff2b0", stroke: "#2a0f06", sw: 6, weight: "bold" });
  txt(COPY, W / 2, 688, { size: 14, font: F_TYPE, align: "center", color: "#fff2b0", stroke: "rgba(20,10,5,.8)", sw: 4 });
}
