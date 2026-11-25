"use strict";
/* ===== FIRMA TU PARTE DE INCIDENCIAS ===== */
const W = 1280, H = 720, PX = 36, PY = 10, PW = 640, PH = 700;
const cv = document.getElementById("c"), ctx = cv.getContext("2d");
const F_TITLE = '"UnifrakturCook","Old English Text MT","Luminari",serif', F_HAND = '"Patrick Hand","Caveat","Segoe Script","Bradley Hand","Comic Sans MS",cursive';
const F_TYPE = '"Special Elite","Courier New",monospace', F_UI = '"Lora","Georgia","Times New Roman",serif';
const ICON = new Image(); ICON.src = "icon.png";
const IM = {}; [["mug", "png"], ["clock", "png"], ["plant", "png"], ["stamp", "png"], ["pen", "png"], ["papers", "png"], ["sheet", "png"], ["desk", "jpg"], ["paper", "jpg"]].forEach(([n, e]) => { const i = new Image(); i.onload = () => { IM[n] = i; }; i.src = "img/" + n + "." + e; }); // PNG/JPG reales en /img (sustituibles por tus fotos)
let K = 1;
function fit() {
  const s = Math.min(innerWidth / W, innerHeight / H), dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.style.width = W * s + "px"; cv.style.height = H * s + "px";
  cv.width = Math.round(W * s * dpr); cv.height = Math.round(H * s * dpr); K = cv.width / W;
}
addEventListener("resize", fit); addEventListener("orientationchange", () => setTimeout(fit, 250)); if (window.visualViewport) visualViewport.addEventListener("resize", fit); fit();

/* ---------- helpers de dibujo ---------- */
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function txt(s, x, y, o = {}) {
  ctx.save(); ctx.font = `${o.weight || ""} ${o.size || 20}px ${o.font || F_UI}`; ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "alphabetic";
  if (o.rot) { ctx.translate(x, y); ctx.rotate(o.rot); x = 0; y = 0; }
  if (o.shadow) { ctx.fillStyle = o.shadow; ctx.fillText(s, x + 2, y + 3); }
  if (o.stroke) { ctx.lineWidth = o.sw || 5; ctx.strokeStyle = o.stroke; ctx.lineJoin = "round"; ctx.strokeText(s, x, y); }
  ctx.fillStyle = o.color || "#fff"; if (o.alpha !== undefined) ctx.globalAlpha = o.alpha; ctx.fillText(s, x, y); ctx.restore();
}
function wrap(s, maxW, font) {
  ctx.save(); ctx.font = font; const out = []; let line = "";
  for (const w of s.split(" ")) { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line); ctx.restore(); return out;
}
const ease = t => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3), back = t => { t = Math.min(1, Math.max(0, t)); const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
function penLine(pts, w, color) {
  if (pts.length < 2) { if (pts.length) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(pts[0].x, pts[0].y, w / 2, 0, 7); ctx.fill(); } return; }
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length - 1; i++) ctx.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + pts[i + 1].x) / 2, (pts[i].y + pts[i + 1].y) / 2);
  ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y); ctx.stroke();
}
function drawMark(x, y, s, style, color, seed) { // X o tick irregular de humano
  const r = mulberry(seed), j = a => (r() - 0.5) * a * s;
  if (style === "x") {
    penLine([{ x: x - .36 * s + j(.25), y: y - .34 * s + j(.25) }, { x: x + j(.2), y: y + j(.2) }, { x: x + .44 * s + j(.25), y: y + .42 * s + j(.25) }], 2.4, color);
    penLine([{ x: x + .42 * s + j(.25), y: y - .4 * s + j(.25) }, { x: x + j(.2), y: y + j(.2) }, { x: x - .4 * s + j(.25), y: y + .38 * s + j(.25) }], 2.2, color);
  } else if (style === "tick") {
    penLine([{ x: x - .4 * s + j(.2), y: y + .02 * s + j(.2) }, { x: x - .1 * s + j(.15), y: y + .42 * s }, { x: x + .16 * s + j(.15), y: y + .08 * s }, { x: x + .6 * s + j(.3), y: y - .6 * s + j(.2) }], 2.6, color);
  } else {
    const pts = []; for (let i = 0; i < 8; i++) pts.push({ x: x + (i % 2 ? .4 : -.4) * s + j(.3), y: y - .4 * s + i * .12 * s + j(.15) });
    penLine(pts, 2.2, color);
  }
}

/* ---------- personajes 2D ---------- */
const SKINS = ["#f4d0a8", "#e7b88a", "#c98f62", "#9a6a47", "#6f4a31", "#f8dcc0"], HAIRC = ["#2a1c14", "#5a3a22", "#a8641f", "#d7b25a", "#151515", "#7a2a2a", "#3d3d52", "#b8b8b8"], SHIRTS = ["#d94f4f", "#4f86d9", "#4fb06a", "#d9a84f", "#9b59b6", "#e67e22", "#2c3e50", "#16a085", "#c0392b", "#f1c40f"];
function look(fem) { return { skin: pick(SKINS), hair: pick(HAIRC), shirt: pick(SHIRTS), pants: pick(["#2f3a55", "#3b3b3b", "#4a3a2a", "#2a4a45"]), hs: fem ? pick([1, 1, 2, 3]) : pick([0, 0, 4, 3]), glasses: chance(0.25) ? 1 : 0, fem: fem ? 1 : 0 }; }
function person(x, y, s, o) {
  o = Object.assign({ skin: "#f4d0a8", hair: "#2a1c14", shirt: "#4f86d9", pants: "#2f3a55", hs: 0, glasses: 0, mouth: 0, phase: 0, sit: 0, angry: 0, bob: 0, arm: 0, fem: 0, flip: 1, happy: 0, scale: 1 }, o);
  ctx.save(); ctx.translate(x, y); ctx.scale(s * o.flip, s); ctx.lineJoin = "round"; ctx.lineCap = "round";
  const OL = "#2a1a10", sw = Math.sin(o.phase) * 9 * (1 - o.sit), bob = o.bob;
  ctx.lineWidth = 3; ctx.strokeStyle = OL;
  // piernas
  if (o.sit) {
    ctx.fillStyle = o.pants; rr(-8, -34, 36, 14, 6); ctx.fill(); ctx.stroke(); rr(18, -34, 13, 34, 5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#222"; rr(16, -4, 22, 9, 4); ctx.fill(); ctx.stroke();
  } else {
    for (const k of [-1, 1]) { ctx.fillStyle = o.pants; rr(k * 9 - 6 + sw * k * 0.5, -36, 13, 36, 5); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#222"; rr(k * 9 - 8 + sw * k * 0.5, -5, 22, 9, 4); ctx.fill(); ctx.stroke(); }
  }
  // cuerpo
  ctx.fillStyle = o.shirt; rr(-19, -80 + bob + o.sit * 4, 38, 50, 12); ctx.fill(); ctx.stroke();
  if (o.fem && o.hs !== 4) { ctx.fillStyle = o.shirt; ctx.beginPath(); ctx.moveTo(-19, -42); ctx.lineTo(19, -42); ctx.lineTo(25, -22 + o.sit * 4); ctx.lineTo(-25, -22 + o.sit * 4); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  // brazos
  ctx.strokeStyle = OL; ctx.lineWidth = 11; for (const k of [-1, 1]) { const a = o.arm ? Math.sin(o.arm * 6 + k) * 12 : sw * -0.6 * k; ctx.beginPath(); ctx.moveTo(k * 19, -72 + bob); ctx.lineTo(k * 26 + a * 0.5, -48 + bob - (o.arm ? 16 : 0) + Math.abs(a) * 0.3); ctx.stroke(); }
  ctx.lineWidth = 6; ctx.strokeStyle = o.shirt; for (const k of [-1, 1]) { const a = o.arm ? Math.sin(o.arm * 6 + k) * 12 : sw * -0.6 * k; ctx.beginPath(); ctx.moveTo(k * 19, -72 + bob); ctx.lineTo(k * 26 + a * 0.5, -48 + bob - (o.arm ? 16 : 0) + Math.abs(a) * 0.3); ctx.stroke(); ctx.fillStyle = o.skin; ctx.beginPath(); ctx.arc(k * 26 + a * 0.5, -46 + bob - (o.arm ? 16 : 0) + Math.abs(a) * 0.3, 5, 0, 7); ctx.fill(); }
  ctx.lineWidth = 3; ctx.strokeStyle = OL;
  // pelo atrás
  const hy = -102 + bob + o.sit * 4;
  ctx.fillStyle = o.hair;
  if (o.hs === 1) { rr(-25, hy - 14, 50, 62, 18); ctx.fill(); ctx.stroke(); }
  if (o.hs === 3) { ctx.beginPath(); ctx.arc(0, hy - 24, 12, 0, 7); ctx.fill(); ctx.stroke(); }
  // cabeza
  ctx.fillStyle = o.skin; ctx.beginPath(); ctx.arc(0, hy, 24, 0, 7); ctx.fill(); ctx.stroke();
  // pelo delante
  ctx.fillStyle = o.hair;
  if (o.hs !== 4) { ctx.beginPath(); ctx.arc(0, hy - 2, 25, Math.PI * 1.02, Math.PI * 1.98); ctx.quadraticCurveTo(10, hy - 10, 0, hy - 8); ctx.quadraticCurveTo(-12, hy - 12, -25, hy - 2); ctx.fill(); ctx.stroke(); }
  if (o.hs === 2) { ctx.beginPath(); ctx.arc(0, hy - 30, 11, 0, 7); ctx.fill(); ctx.stroke(); }
  // ojos y boca
  ctx.fillStyle = "#1a1a1a"; ctx.strokeStyle = "#1a1a1a";
  const blink = (performance.now() % 3200) < 120;
  for (const k of [-1, 1]) { if (blink) { ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(k * 9 - 4, hy + 2); ctx.lineTo(k * 9 + 4, hy + 2); ctx.stroke(); } else { ctx.beginPath(); ctx.arc(k * 9, hy + 2, 3.2, 0, 7); ctx.fill(); } }
  if (o.angry) { ctx.lineWidth = 3.5; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 15, hy - 9 + 0); ctx.lineTo(k * 4, hy - 3 + 0); ctx.stroke(); } }
  if (o.glasses) { ctx.lineWidth = 2.2; ctx.strokeStyle = "#222"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 9, hy + 2, 7.5, 0, 7); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-2, hy + 2); ctx.lineTo(2, hy + 2); ctx.stroke(); }
  ctx.strokeStyle = "#7a2a1a"; ctx.fillStyle = "#7a2a1a"; ctx.lineWidth = 2.6;
  if (o.mouth > 0) { ctx.beginPath(); ctx.ellipse(0, hy + 13, 6, 2 + o.mouth * 5, 0, 0, 7); ctx.fillStyle = "#5a1010"; ctx.fill(); }
  else if (o.angry) { ctx.beginPath(); ctx.arc(0, hy + 17, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
  else if (o.happy) { ctx.beginPath(); ctx.arc(0, hy + 9, 7, 0.15, Math.PI - 0.15); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(-5, hy + 14); ctx.quadraticCurveTo(0, hy + 16, 5, hy + 14); ctx.stroke(); }
  if (o.angry) { ctx.strokeStyle = "#d02020"; ctx.lineWidth = 3; const q = Math.sin(performance.now() / 90) * 2; ctx.beginPath(); ctx.moveTo(14 + q, hy - 24); ctx.lineTo(20 + q, hy - 30); ctx.moveTo(20 + q, hy - 24); ctx.lineTo(14 + q, hy - 30); ctx.stroke(); }
  ctx.restore();
}

/* ---------- ESTADO GLOBAL ---------- */
const M = { x: 0, y: 0, down: false };
let scene = "menu", btns = [], fade = { a: 0, dir: 0, next: null, fn: null }, now = 0, shake = 0, parts = [], toasts = [];
let best = 0; try { best = +localStorage.getItem("ftp_best") || 0; } catch (e) { }
const RANKS = [[0, "Aprendiz de Dirección"], [3, "Becaria del Despacho"], [6, "Secretaria Temible"], [10, "Subdirectora"], [15, "Directora"], [21, "Directora Estricta"], [28, "Directora Severa"], [36, "Directora Implacable"], [45, "Directora de Hierro"], [55, "Directora de Acero"], [66, "Directora Inflexible"], [78, "Directora Temida"], [91, "Directora Legendaria"], [105, "Inspectora General"], [120, "Directora Suprema"], [136, "Directora Tirana"], [153, "Reina del Calabozo"], [171, "Emperatriz de los Partes"], [190, "Diosa de la Expulsión"], [210, "Directora del Calabozo Eterno"]];
const rankIdx = r => { let k = 0; RANKS.forEach((q, i) => { if (r >= q[0]) k = i; }); return k; };
function addRigor(n) {
  const before = rankIdx(G.rigor); G.rigor = Math.max(0, G.rigor + n); const after = rankIdx(G.rigor);
  if (after > before) { toast("¡Ascendida a " + RANKS[after][1] + "!", "#ff8a5a", true); Snd.fanfare(); feed("Rango nuevo: " + RANKS[after][1] + " (mano dura)", "#ffb84a"); }
  else if (after < before) feed("Bajas de rango: " + RANKS[after][1] + " (te ablandas)", "#9fe");
  G.rank = after;
}
let PAD = null, coarse = false;
let G = null, drag = null, S2 = null; // S2 = estado madre/despacho
const menu = { t: 0, tag: 0, tagT: 0, papers: [], kids: [], clouds: [], stars: [] };
for (let i = 0; i < 70; i++) menu.stars.push({ x: rnd(0, W), y: rnd(0, 380), r: rnd(0.6, 2), p: rnd(0, 6) });
for (let i = 0; i < 7; i++) menu.clouds.push({ x: rnd(0, W), y: rnd(40, 300), s: rnd(0.6, 1.5), v: rnd(6, 20) });
for (let i = 0; i < 9; i++) { const f = chance(0.5); menu.kids.push({ x: rnd(-100, W), dir: chance(0.5) ? 1 : -1, v: rnd(30, 70), ph: rnd(0, 6), look: look(f), y: rnd(640, 700), s: rnd(0.55, 0.8) }); }
for (let i = 0; i < 14; i++) menu.papers.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(0, 6), vr: rnd(-1, 1), v: rnd(15, 45), s: rnd(0.6, 1.3), p: rnd(0, 6) });

function go(next, fn) { if (fade.dir) return; fade = { a: 0, dir: 1, next, fn }; }
function newGame() {
  PAD = null;
  G = {
    score: 0, stress: 12, combo: 0, maxCombo: 0, signed: 0, wrong: 0, time: 0, queue: [], spawnT: 1.5, feed: [], cd: 0, feedT: 8, last: null, paused: false, over: false, bossCount: 0, momCount: 0,
    shakeBtn: 0, hint: 0, difficulty: 0, rigor: 0, rank: 0, exps: 0, voids: 0, day: 1, dayCount: 0, evals: 0
  };
  for (let i = 0; i < 2; i++) { const p = makeParte(0); G.queue.push(p); }
  toast("¡Comienza la jornada!", "#ffd75e");
  feed("Bear ha puesto un parte", "#ffd");
  feed("No te preocupes, desahógate y firma partes de incidencias.", "#9fe");
}
function feed(t, c) { G.feed.unshift({ t, c: c || "#fff", age: 0 }); if (G.feed.length > 7) G.feed.pop(); }
function toast(t, c, big) { toasts.push({ t, c: c || "#fff", age: 0, big }); }

/* ---------- Botones ---------- */
function button(id, x, y, w, h, label, fn, o = {}) {
  const hov = !o.disabled && M.x >= x && M.x <= x + w && M.y >= y && M.y <= y + h;
  btns.push({ id, x, y, w, h, fn, disabled: o.disabled });
  if (hov && btnHover !== id) { btnHover = id; Snd.hover(); }
  const press = hov && M.down; ctx.save(); ctx.translate(0, press ? 3 : 0);
  ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5;
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  const base = o.color || ["#e0b25a", "#a8741f"]; g.addColorStop(0, o.disabled ? "#777" : hov ? "#ffe08a" : base[0]); g.addColorStop(1, o.disabled ? "#444" : hov ? "#d8a03a" : base[1]);
  ctx.fillStyle = g; rr(x, y, w, h, 12); ctx.fill(); ctx.shadowColor = "transparent"; ctx.lineWidth = 3; ctx.strokeStyle = "#3a200a"; ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 2; rr(x + 4, y + 4, w - 8, h - 8, 9); ctx.stroke();
  txt(label, x + w / 2, y + h / 2 + (o.size || 24) * 0.34, { align: "center", size: o.size || 24, weight: "bold", color: o.disabled ? "#bbb" : (o.tc || "#2a1505"), font: o.font || F_UI });
  if (o.sub) txt(o.sub, x + w / 2, y + h - 8, { align: "center", size: 12, color: "#3a2008", font: F_TYPE });
  ctx.restore();
}
let btnHover = null;

/* ---------- RECONOCEDOR DE DÍGITOS ---------- */
const CW = 50, CH = 56;
const rc = document.createElement("canvas"); rc.width = 112; rc.height = 128; const rx = rc.getContext("2d", { willReadFrequently: true });
const sc = document.createElement("canvas"); sc.width = 32; sc.height = 32; const sx = sc.getContext("2d", { willReadFrequently: true });
function recognize(strokes) {
  if (!strokes.length) return null;
  rx.fillStyle = "#000"; rx.fillRect(0, 0, 112, 128); rx.strokeStyle = "#fff"; rx.fillStyle = "#fff"; rx.lineWidth = 11; rx.lineCap = rx.lineJoin = "round";
  const kx = 112 / CW, ky = 128 / CH;
  for (const s of strokes) { rx.beginPath(); rx.moveTo(s[0].x * kx, s[0].y * ky); for (let i = 1; i < s.length; i++) rx.lineTo(s[i].x * kx, s[i].y * ky); if (s.length === 1) rx.lineTo(s[0].x * kx + 0.1, s[0].y * ky); rx.stroke(); }
  const id = rx.getImageData(0, 0, 112, 128).data; let x0 = 999, y0 = 999, x1 = -1, y1 = -1, ink = 0;
  for (let y = 0; y < 128; y++) for (let x = 0; x < 112; x++) if (id[(y * 112 + x) * 4] > 64) { ink++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < 0) return null; x1++; y1++;
  const w = x1 - x0, h = y1 - y0; if (w < 14 && h < 24) return null;
  const s = 28 / Math.max(w, h), nw = Math.max(1, Math.round(w * s)), nh = Math.max(1, Math.round(h * s));
  sx.fillStyle = "#000"; sx.fillRect(0, 0, 32, 32); sx.imageSmoothingEnabled = true; sx.imageSmoothingQuality = "high";
  sx.drawImage(rc, x0, y0, w, h, (32 - nw) >> 1, (32 - nh) >> 1, nw, nh);
  const d = sx.getImageData(0, 0, 32, 32).data, v = new Float32Array(64); let mx = 0.0001;
  for (let by = 0; by < 8; by++) for (let bx = 0; bx < 8; bx++) { let a = 0; for (let yy = 0; yy < 4; yy++) for (let xx = 0; xx < 4; xx++) a += d[((by * 4 + yy) * 32 + bx * 4 + xx) * 4] / 255; v[by * 8 + bx] = a / 16; if (v[by * 8 + bx] > mx) mx = v[by * 8 + bx]; }
  for (let i = 0; i < 64; i++) v[i] /= mx;
  const [W1, b1, W2, b2] = DIGIT_NET, h1 = new Float32Array(W1.length);
  for (let j = 0; j < W1.length; j++) { let a = b1[j]; const w1 = W1[j]; for (let i = 0; i < 64; i++) a += w1[i] * v[i]; h1[j] = a > 0 ? a : 0; }
  const o = []; let om = -1e9; for (let k = 0; k < 10; k++) { let a = b2[k]; const w2 = W2[k]; for (let j = 0; j < h1.length; j++) a += w2[j] * h1[j]; o.push(a); if (a > om) om = a; }
  let sum = 0; const e = o.map(a => { const q = Math.exp(a - om); sum += q; return q; }); let bi = 0; for (let k = 1; k < 10; k++) if (e[k] > e[bi]) bi = k;
  return { d: bi, conf: e[bi] / sum };
}
function flushCells(p) { for (const c of p.player.cells) if (c.dirty) { const r = recognize(c.strokes); c.digit = r ? r.d : null; c.conf = r ? r.conf : 0; c.dirty = false; } }

/* ---------- LAYOUT DEL PARTE ---------- */
const BOXES = [{ x: 38, y: 466, w: 26, label: "Amonestación", col: "#222" }, { x: 238, y: 466, w: 26, label: "Expulsión", col: "#222" }, { x: 410, y: 466, w: 26, label: "BOSS FINAL", col: "#a01818" }];
const cellRect = (i, j) => ({ x: 30 + i * 204 + j * 56, y: 542, w: CW, h: CH });
const SIGR = { x: 30, y: 628, w: 300, h: 60 };

function evaluate(p) {
  flushCells(p);
  if (p.expected.void) return { ok: false, msgs: ["Era un parte sin sentido: había que ANULARLO"], vals: [0, 0, 0] };
  const pl = p.player, e = p.expected, msgs = [], vals = [0, 1, 2].map(i => (pl.cells[i * 2].digit || 0) * 10 + (pl.cells[i * 2 + 1].digit || 0));
  const want = [e.box === 0, e.box === 1, e.box === 2], names = ["Amonestación", "Expulsión", "BOSS FINAL"];
  let ok = true;
  if (e.ask) { if (pl.approve === null) { ok = false; msgs.push("Falta decidir si APRUEBAS la expulsión (SÍ/NO)"); } else if (pl.approve !== e.approve) { ok = false; msgs.push(e.approve ? "Era una expulsión justificada: había que APROBARLA (SÍ)" : "Expulsión desproporcionada: había que DENEGARLA (NO) y poner solo amonestación"); } }
  if (pl.boxes.join() !== want.join()) { ok = false; const w = want.indexOf(true), g = pl.boxes.map((b, i) => b ? names[i] : null).filter(Boolean); msgs.push("Casilla: marcaste " + (g.join(" + ") || "ninguna") + ", era " + names[w]); }
  const exp = [e.d, e.w, e.m], nm = ["días", "semanas", "meses"];
  for (let i = 0; i < 3; i++) if (vals[i] !== exp[i]) { ok = false; msgs.push(cap(nm[i]) + ": pusiste " + vals[i] + ", era " + exp[i]); }
  return { ok, msgs, vals };
}

/* ---------- DIBUJO DEL PARTE ---------- */
function layoutText(p) {
  const fs0 = [26, 24, 22, 20, 19, 18];
  for (const fs of fs0) { const l = wrap(p.text, 580, `${fs}px ${F_HAND}`); if (l.length <= 6 || fs === 18) { p.lines = l; p.fs = fs; break; } }
}
function checkbox(x, y, s, mark, style, color, seed, label, o = {}) {
  ctx.strokeStyle = "#333"; ctx.lineWidth = 2; ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fillRect(x, y, s, s); ctx.strokeRect(x, y, s, s);
  if (mark) drawMark(x + s / 2, y + s / 2, s * 0.95, style, color, seed);
  if (label) txt(label, x + s + 8, y + s * 0.78, { size: o.size || 15, font: F_TYPE, color: o.col || "#2a2a2a", weight: o.weight });
}
function drawPaper(p, t) {
  const ink = p.ink;
  ctx.save();
  // hoja
  ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
  const g = ctx.createLinearGradient(0, 0, PW, PH); g.addColorStop(0, "#fffdf3"); g.addColorStop(1, "#f6eed6"); ctx.fillStyle = g; ctx.fillRect(0, 0, PW, PH); if (IM.paper) ctx.drawImage(IM.paper, 0, 0, PW, PH);
  ctx.shadowColor = "transparent"; ctx.strokeStyle = "rgba(120,90,40,.25)"; ctx.lineWidth = 1; ctx.strokeRect(0.5, 0.5, PW - 1, PH - 1);
  // agujeros y pliegue
  ctx.fillStyle = "rgba(70,50,30,.35)"; for (const yy of [200, 500]) { ctx.beginPath(); ctx.arc(10, yy, 4.5, 0, 7); ctx.fill(); }
  ctx.fillStyle = "rgba(0,0,0,.035)"; ctx.fillRect(0, 346, PW, 2);
  // cabecera
  ctx.globalAlpha = 0.95; if (ICON.complete) ctx.drawImage(ICON, 26, 8, 46, 53); ctx.globalAlpha = 1;
  ctx.save(); try { ctx.letterSpacing = "1px"; } catch (e) { } txt("IES CALAGMAN SKECHERINI", PW / 2 + 22, 44, { size: 28, weight: "bold", font: F_UI, align: "center", color: "#1a0a04" }); ctx.restore();
  txt("PARTE DE INCIDENCIAS  ·  Curso 2026/27  ·  Nº " + String(p.id).padStart(4, "0"), PW / 2 + 20, 62, { size: 12, font: F_TYPE, align: "center", color: "#6a5a40" });
  ctx.strokeStyle = "#201008"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(26, 70); ctx.lineTo(PW - 26, 70); ctx.stroke(); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(26, 74); ctx.lineTo(PW - 26, 74); ctx.stroke();
  // filas de datos
  const lab = (s, x, y) => txt(s, x, y, { size: 12, font: F_TYPE, color: "#6a5a40" });
  const line = (x0, x1, y) => { ctx.strokeStyle = "rgba(60,50,40,.5)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); };
  const val = (s, x, y, sz = 23, mw = 0) => { let f = sz; ctx.font = `${f}px ${F_HAND}`; while (mw && ctx.measureText(s).width > mw && f > 12) { f--; ctx.font = `${f}px ${F_HAND}`; } txt(s, x, y, { size: f, font: F_HAND, color: ink }); };
  lab("Alumno/a:", 28, 98); line(90, 372, 101); val(p.student.full, 94, 97, 24, 276);
  lab("Curso:", 386, 98); line(428, PW - 26, 101); val(p.course, 432, 97, 22, 180);
  lab("Profesor/a:", 28, 128); line(98, 320, 131); val(p.teacher.full, 102, 127, 22, 214);
  lab("Materia:", 332, 128); line(384, PW - 26, 131); val(p.mat, 388, 127, 23, 224);
  lab("Hora:", 28, 156); line(66, 170, 159); val(p.hour, 70, 155, 20, 98);
  lab("Fecha:", 410, 156); line(452, PW - 26, 159); val(p.date, 456, 155, 24, 160);
  txt("DESCRIPCIÓN DE LA INCIDENCIA", 188, 156, { size: 12, font: F_TYPE, color: "#201008", weight: "bold" });
  // texto con renglones
  ctx.strokeStyle = "rgba(90,130,190,.4)"; ctx.lineWidth = 1; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(28, 190 + i * 26); ctx.lineTo(PW - 28, 190 + i * 26); ctx.stroke(); }
  if (!p.lines) layoutText(p);
  const r = mulberry(p.seed + 5);
  p.lines.slice(0, 6).forEach((l, i) => { ctx.save(); ctx.translate(30, 187 + i * 26); ctx.rotate((r() - 0.5) * 0.006); txt(l, 0, 0, { size: p.fs, font: F_HAND, color: ink }); ctx.restore(); });
  // zona profesor (filas separadas: nada se pisa)
  ctx.strokeStyle = "rgba(0,0,0,.6)"; ctx.lineWidth = 1.5; ctx.strokeRect(26, 350, PW - 52, 102);
  txt("GRAVEDAD (profesor/a)", 34, 364, { size: 11, font: F_TYPE, color: "#6a5a40" });
  const gl = ["Leve", "Grave", "Muy grave"], gx = [34, 108, 184];
  gl.forEach((s, i) => checkbox(gx[i], 369, 22, p.gravity === i, p.marks.g[i], ink, p.seed + i * 7, s, { size: 14 }));
  checkbox(34, 396, 20, p.marks.fam, p.marks.famStyle, ink, p.seed + 31, "Familia informada", { size: 13 });
  checkbox(236, 396, 20, p.marks.reinc, p.marks.reincStyle, ink, p.seed + 41, "Reincidente", { size: 13 });
  // firma profesor: bezier random, escalada para que SIEMPRE quepa en su hueco
  txt("Fdo.: " + p.teacher.short.replace(/^\S+\s/, "").slice(0, 22), 336, 364, { size: 11, font: F_TYPE, color: "#6a5a40" });
  line(338, 604, 416);
  if (!p.sigBB) { let a = 1e9, b = -1e9, c = 1e9, d = -1e9; for (const s of p.sig) for (const q of s) { a = Math.min(a, q.x); b = Math.max(b, q.x); c = Math.min(c, q.y); d = Math.max(d, q.y); } p.sigBB = { a, b, c, d }; }
  const bb = p.sigBB, sw = Math.max(1, bb.b - bb.a), sh = Math.max(1, bb.d - bb.c), ss = Math.min(1, 250 / sw, 42 / sh);
  const total = p.sig.reduce((a, s) => a + s.length, 0), shown = Math.floor(Math.min(1, p.sigW) * total); let used = 0;
  ctx.save(); ctx.beginPath(); ctx.rect(336, 368, 272, 48); ctx.clip(); ctx.translate(342 + (250 - sw * ss) / 2 - bb.a * ss, 370 + (42 - sh * ss) / 2 - bb.c * ss); ctx.scale(ss, ss);
  for (const s of p.sig) { const n = Math.max(0, Math.min(s.length, shown - used)); used += s.length; if (n < 1) continue; penLine(s.slice(0, n), 2.1 / ss, p.sigInk); }
  ctx.restore();
  // sanción propuesta: fila propia, a todo el ancho, se encoge hasta caber
  ctx.strokeStyle = "rgba(0,0,0,.3)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(26, 423); ctx.lineTo(PW - 26, 423); ctx.stroke();
  txt("SANCIÓN PROPUESTA:", 34, 442, { size: 11, font: F_TYPE, color: "#6a5a40" });
  ctx.save(); ctx.translate(166, 443); ctx.rotate(-0.008); let pf = 24; ctx.font = `${pf}px ${F_HAND}`; while (ctx.measureText(p.expected.text).width > PW - 52 - 150 && pf > 12) { pf--; ctx.font = `${pf}px ${F_HAND}`; } txt(p.expected.text, 0, 0, { size: pf, font: F_HAND, color: p.boss ? "#a01818" : ink }); ctx.restore();
  if (p.boss) penLine([{ x: 166, y: 447 }, { x: 260, y: 448 }, { x: 400, y: 446 }, { x: PW - 60, y: 448 }], 2, "#a01818");
  // zona dirección
  ctx.fillStyle = "#201008"; ctx.fillRect(26, 456 - 2, 0, 0);
  ctx.save(); const dg = ctx.createLinearGradient(26, 0, PW - 26, 0); dg.addColorStop(0, "rgba(90,50,10,.0)"); dg.addColorStop(.5, "rgba(90,50,10,.14)"); dg.addColorStop(1, "rgba(90,50,10,0)"); ctx.fillStyle = dg; ctx.fillRect(26, 453, PW - 52, 6); ctx.restore();
  const pl = p.player;
  BOXES.forEach((b, i) => { checkbox(b.x, b.y + 6, b.w, false, "", "", 0, "", {}); if (pl.boxes[i]) drawMark(b.x + b.w / 2, b.y + 6 + b.w / 2, b.w * 1.0, "x", "#0b3fa8", 900 + i + (pl.mk || 0)); txt(b.label, b.x + b.w + 8, b.y + 6 + b.w * 0.78, { size: 17, font: F_TYPE, color: b.col, weight: "bold" }); });
  if (p.expected.ask) {
    txt("¿APROBAR LA EXPULSIÓN?", 354, 640, { size: 12, font: F_TYPE, color: "#7a1a1a", weight: "bold" });
    [[true, "SÍ", 360], [false, "NO", 470]].forEach(([v, l, x]) => { checkbox(x, 650, 30, false, "", "", 0, "", {}); if (pl.approve === v) drawMark(x + 15, 665, 30, "x", "#0b3fa8", 950 + (v ? 1 : 2) + (pl.mk || 0)); txt(l, x + 40, 673, { size: 24, font: F_TYPE, weight: "bold", color: v ? "#1c6a2a" : "#a01818" }); });
  }
  txt("En caso de expulsión, escribe el tiempo con el ratón (sin nada = 0):", 30, 520, { size: 12, font: F_TYPE, color: "#6a5a40" });
  ["DÍAS", "SEMANAS", "MESES"].forEach((nm, i) => {
    txt(nm, 30 + i * 204, 538, { size: 12, font: F_TYPE, color: "#201008", weight: "bold" });
    for (let j = 0; j < 2; j++) {
      const c = pl.cells[i * 2 + j], cr = cellRect(i, j), act = drag && drag.kind === "cell" && drag.idx === i * 2 + j;
      ctx.fillStyle = act ? "rgba(255,240,170,.9)" : "rgba(255,255,255,.7)"; ctx.fillRect(cr.x, cr.y, cr.w, cr.h);
      ctx.strokeStyle = "#555"; ctx.lineWidth = 1.5; ctx.strokeRect(cr.x, cr.y, cr.w, cr.h);
      ctx.strokeStyle = "rgba(0,0,0,.12)"; ctx.beginPath(); ctx.moveTo(cr.x, cr.y + cr.h * 0.7); ctx.lineTo(cr.x + cr.w, cr.y + cr.h * 0.7); ctx.stroke();
      ctx.save(); ctx.translate(cr.x, cr.y); for (const s of c.strokes) penLine(s, 3.2, "#0b3fa8"); ctx.restore();
      if (!c.strokes.length) txt("0", cr.x + cr.w / 2, cr.y + cr.h * 0.68, { size: 34, font: F_HAND, color: "rgba(0,0,0,.12)", align: "center" });
      if (c.strokes.length) {
        const dd = c.digit; const low = c.conf < 0.55;
        txt(dd === null ? "?" : "→ " + dd, cr.x + cr.w / 2, cr.y + cr.h + 14, { size: 14, font: F_TYPE, color: dd === null ? "#a01818" : low ? "#c07000" : "#0a7a2a", align: "center", weight: "bold" });
        txt("×", cr.x + cr.w - 4, cr.y - 3, { size: 15, font: F_TYPE, color: "#a01818", align: "right", weight: "bold" });
      }
    }
  });
  // firma de dirección
  txt("FIRMA DE DIRECCIÓN:", SIGR.x, SIGR.y - 4, { size: 12, font: F_TYPE, color: "#201008", weight: "bold" });
  ctx.fillStyle = (drag && drag.kind === "sig") ? "rgba(255,240,170,.85)" : "rgba(255,255,255,.65)"; ctx.fillRect(SIGR.x, SIGR.y, SIGR.w, SIGR.h); ctx.strokeStyle = "#555"; ctx.lineWidth = 1.5; ctx.strokeRect(SIGR.x, SIGR.y, SIGR.w, SIGR.h);
  ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.moveTo(SIGR.x + 12, SIGR.y + SIGR.h - 14); ctx.lineTo(SIGR.x + SIGR.w - 12, SIGR.y + SIGR.h - 14); ctx.stroke();
  txt("✕", SIGR.x + 14, SIGR.y + SIGR.h - 18, { size: 14, color: "rgba(0,0,0,.35)", font: F_TYPE });
  if (!pl.sig.length) txt("firma aquí con el ratón", SIGR.x + SIGR.w / 2, SIGR.y + 30, { size: 22, font: F_HAND, color: "rgba(0,0,0,.22)", align: "center" });
  for (const s of pl.sig) penLine(s, 2.6, "#0b2a8a");
  if (pl.sig.length) txt("borrar", SIGR.x + SIGR.w - 6, SIGR.y - 4, { size: 12, font: F_TYPE, color: "#a01818", align: "right", weight: "bold" });
  // sellos de resultado
  if (p.result && (p.st === "stamp" || p.st === "exit")) {
    const k = back(p.at / 0.35), ok = p.result.ok;
    ctx.save(); ctx.translate(470, 640); ctx.rotate(-0.22); ctx.scale(k * 1.0 + 0.0001, k * 1.0 + 0.0001);
    ctx.strokeStyle = ok ? "#1c8a3a" : "#c01818"; ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = 6; ctx.globalAlpha = 0.9;
    ctx.strokeRect(-130, -36, 260, 72); ctx.lineWidth = 2; ctx.strokeRect(-124, -30, 248, 60);
    txt(ok ? "FIRMADO ✔" : "ERROR ✘", 0, 12, { size: 38, font: F_TITLE, align: "center", color: ctx.strokeStyle }); ctx.restore();
  }
  if (p.st === "void") { const k = back(p.at / 0.2); ctx.save(); ctx.translate(PW / 2, 360); ctx.rotate(-0.3); ctx.scale(k + 0.0001, k + 0.0001); ctx.strokeStyle = "#555"; ctx.lineWidth = 8; ctx.globalAlpha = 0.9; ctx.strokeRect(-190, -50, 380, 100); txt("ANULADO", 0, 24, { size: 76, font: F_TITLE, align: "center", color: "#555" }); ctx.restore(); }
  ctx.restore();
}

/* ---------- ESCENAS: MENÚ ---------- */
function drawSchool(cx, by, s, t) {
  ctx.save(); ctx.translate(cx, by); ctx.scale(s, s); ctx.lineJoin = "round"; ctx.lineWidth = 4; ctx.strokeStyle = "#1a0f0a";
  const wall = "#b99a6b", dark = "#7a5c3a";
  const tower = (x) => { ctx.fillStyle = wall; ctx.fillRect(x - 40, -260, 80, 260); ctx.strokeRect(x - 40, -260, 80, 260); for (let i = -40; i < 40; i += 27) { ctx.fillRect(x + i, -282, 18, 22); ctx.strokeRect(x + i, -282, 18, 22); } ctx.fillStyle = "#8a2a2a"; ctx.beginPath(); ctx.moveTo(x - 48, -282); ctx.lineTo(x, -350); ctx.lineTo(x + 48, -282); ctx.closePath(); ctx.fill(); ctx.stroke(); };
  tower(-200); tower(200);
  ctx.fillStyle = wall; ctx.fillRect(-170, -190, 340, 190); ctx.strokeRect(-170, -190, 340, 190);
  ctx.fillStyle = "#8a2a2a"; ctx.beginPath(); ctx.moveTo(-185, -190); ctx.lineTo(0, -250); ctx.lineTo(185, -190); ctx.closePath(); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 3; i++) for (const x of [-220, -180, 180, 220]) { }
  const win = (x, y) => { const on = Math.sin(t * 2 + x * 0.1 + y) > -0.3; ctx.fillStyle = on ? "#ffd86a" : "#3a2a1a"; ctx.beginPath(); ctx.arc(x, y, 14, Math.PI, 0); ctx.lineTo(x + 14, y + 26); ctx.lineTo(x - 14, y + 26); ctx.closePath(); ctx.fill(); ctx.stroke(); };
  [-200, 200].forEach(x => { win(x, -200); win(x, -140); win(x, -80); }); [-120, -60, 60, 120].forEach(x => win(x, -140));
  ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(-34, -70); ctx.arc(0, -70, 34, Math.PI, 0); ctx.lineTo(34, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#e8d6a0"; rr(-120, -178, 240, 30, 6); ctx.fill(); ctx.stroke(); txt("IES CALAGMAN SKECHERINI", 0, -158, { size: 18, weight: "bold", font: F_UI, align: "center", color: "#1a0f0a" });
  // bandera
  ctx.strokeStyle = "#1a0f0a"; ctx.beginPath(); ctx.moveTo(200, -350); ctx.lineTo(200, -420); ctx.stroke();
  ctx.fillStyle = "#d9a82f"; ctx.beginPath(); ctx.moveTo(200, -420); for (let i = 0; i <= 10; i++) ctx.lineTo(200 + i * 6, -420 + Math.sin(t * 5 + i * 0.7) * 5); for (let i = 10; i >= 0; i--) ctx.lineTo(200 + i * 6, -395 + Math.sin(t * 5 + i * 0.7) * 5); ctx.closePath(); ctx.fill(); ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
}
function drawPaperSprite(x, y, s, r, red) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.scale(s, s); if (IM.sheet) { ctx.drawImage(IM.sheet, -30, -39, 60, 78); ctx.restore(); return; } ctx.fillStyle = "#fffdf0"; ctx.strokeStyle = "#5a4020"; ctx.lineWidth = 2; ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 8;
  ctx.fillRect(-22, -30, 44, 60); ctx.shadowColor = "transparent"; ctx.strokeRect(-22, -30, 44, 60); ctx.strokeStyle = "#8aa0c8"; ctx.lineWidth = 1.2; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-15, -14 + i * 9); ctx.lineTo(15, -14 + i * 9); ctx.stroke(); }
  ctx.strokeStyle = "#c01818"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(8, 16, 9, 0, 7); ctx.stroke(); ctx.fillStyle = "#c01818"; ctx.fillRect(-16, -26, 18, 4);
  ctx.restore();
}
function drawMenu(dt) {
  menu.t += dt; const t = menu.t;
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#150c3a"); g.addColorStop(0.45, "#6a2060"); g.addColorStop(0.75, "#e8704a"); g.addColorStop(1, "#ffc062"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (const s of menu.stars) { ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + s.p)); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill(); } ctx.globalAlpha = 1;
  const rg = ctx.createRadialGradient(1120, 120, 10, 1120, 120, 160); rg.addColorStop(0, "rgba(255,240,200,.9)"); rg.addColorStop(0.3, "rgba(255,230,170,.25)"); rg.addColorStop(1, "rgba(255,230,170,0)"); ctx.fillStyle = rg; ctx.fillRect(900, 0, 380, 320);
  ctx.fillStyle = "#fff4d0"; ctx.beginPath(); ctx.arc(1120, 120, 46, 0, 7); ctx.fill(); ctx.fillStyle = "rgba(200,170,120,.4)"; for (const [a, b, c] of [[1105, 108, 9], [1135, 132, 7], [1120, 100, 5]]) { ctx.beginPath(); ctx.arc(a, b, c, 0, 7); ctx.fill(); }
  for (const c of menu.clouds) { c.x += c.v * dt; if (c.x > W + 150) c.x = -150; ctx.fillStyle = "rgba(255,200,210,.35)"; for (const [dx, dy, r] of [[0, 0, 34], [36, -8, 40], [76, 2, 32], [38, 12, 34]]) { ctx.beginPath(); ctx.arc(c.x + dx * c.s, c.y + dy * c.s, r * c.s, 0, 7); ctx.fill(); } }
  ctx.fillStyle = "#3a1a50"; ctx.beginPath(); ctx.moveTo(0, 560); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 520 + Math.sin(x * 0.012) * 40 + Math.sin(x * 0.03) * 12); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  drawSchool(910, 640, 0.72, t);
  ctx.fillStyle = "#4a7a3a"; ctx.fillRect(0, 628, W, H - 628); ctx.fillStyle = "#3a6a2c"; for (let x = 0; x < W; x += 24) ctx.fillRect(x + (t * 10 % 24), 628, 10, 4);
  ctx.fillStyle = "#c7a76a"; ctx.fillRect(0, 668, W, 52);
  for (const k of menu.kids) { k.x += k.dir * k.v * dt; k.ph += dt * k.v * 0.12; if (k.x > W + 60) k.x = -60; if (k.x < -60) k.x = W + 60; person(k.x, k.y, k.s, Object.assign({}, k.look, { phase: k.ph, flip: k.dir })); }
  for (const p of menu.papers) { p.y -= p.v * dt; p.x += Math.sin(t + p.p) * 20 * dt; p.r += p.vr * dt; if (p.y < -50) { p.y = H + 40; p.x = rnd(0, W); } drawPaperSprite(p.x, p.y, p.s, p.r, 1); }
  // icono
  if (ICON.complete) { const hh = 560, ww = hh * ICON.width / ICON.height; ctx.save(); ctx.translate(250, 380 + Math.sin(t * 1.6) * 8); ctx.rotate(Math.sin(t * 1.1) * 0.035); ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; ctx.drawImage(ICON, -ww / 2, -hh / 2, ww, hh); ctx.restore(); }
  // título
  const tx = 880, ty = 120 + Math.sin(t * 2) * 5;
  const tg = ctx.createLinearGradient(0, ty - 70, 0, ty + 90); tg.addColorStop(0, "#fff2b0"); tg.addColorStop(1, "#e8a62a");
  ctx.save(); ctx.font = `76px ${F_TITLE}`; ctx.textAlign = "center"; ctx.lineWidth = 12; ctx.lineJoin = "round"; ctx.strokeStyle = "#2a0f06";
  ctx.shadowColor = "rgba(255,160,40,.7)"; ctx.shadowBlur = 30 + Math.sin(t * 3) * 10; ctx.strokeText("Firma Tu Parte", tx, ty); ctx.shadowColor = "transparent"; ctx.fillStyle = tg; ctx.fillText("Firma Tu Parte", tx, ty);
  ctx.font = `58px ${F_TITLE}`; ctx.strokeText("de Incidencias", tx, ty + 64); ctx.fillText("de Incidencias", tx, ty + 64); ctx.restore();
  // tagline
  menu.tagT += dt; if (menu.tagT > 4.2) { menu.tagT = 0; menu.tag = (menu.tag + 1) % MENU_TAGS.length; }
  const ta = Math.min(1, menu.tagT * 3, (4.2 - menu.tagT) * 3), bw = 560, bx = tx - bw / 2, by = ty + 100;
  ctx.save(); ctx.globalAlpha = ta; ctx.fillStyle = "rgba(255,250,230,.95)"; rr(bx, by, bw, 62, 14); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = "#3a200a"; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bx + 60, by + 62); ctx.lineTo(bx + 40, by + 84); ctx.lineTo(bx + 90, by + 62); ctx.fillStyle = "rgba(255,250,230,.95)"; ctx.fill(); ctx.stroke();
  const tl = wrap(MENU_TAGS[menu.tag], bw - 36, `19px ${F_HAND}`); tl.forEach((l, i) => txt(l, tx, by + 26 + i * 22 - (tl.length - 1) * 8, { size: 21, font: F_HAND, color: "#3a200a", align: "center" })); ctx.restore();
  // botones
  const pulse = 1 + Math.sin(t * 4) * 0.02; ctx.save(); ctx.translate(tx, 330); ctx.scale(pulse, pulse); ctx.translate(-tx, -330);
  button("play", tx - 190, 300, 380, 72, "▶  INICIAR JORNADA", () => { Snd.click(); go("play", () => { newGame(); Snd.music("play"); }); }, { size: 30, color: ["#7ad46a", "#2f8a2a"] }); ctx.restore();
  button("how", tx - 190, 392, 380, 54, "¿Cómo se juega?", () => { Snd.click(); scene = "howto"; });
  button("snd", tx - 190, 460, 380, 54, Snd.muted ? "🔇  Sonido: NO" : "🔊  Sonido: SÍ", () => { Snd.toggle(); Snd.click(); }, { color: ["#9ab8e8", "#4a68a8"] });
  txt("🏆 Récord: " + best + " pts", tx, 548, { size: 24, align: "center", color: "#fff2b0", stroke: "#2a0f06", sw: 6, weight: "bold" });
  button("full", W - 76, 14, 60, 48, "⛶", () => { Snd.click(); try { const d = document.documentElement; if (document.fullscreenElement) document.exitFullscreen(); else if (d.requestFullscreen) d.requestFullscreen().then(() => { try { screen.orientation.lock("landscape").catch(() => { }); } catch (e) { } }).catch(() => { }); } catch (e) { } }, { size: 26, color: ["#9ab8e8", "#4a68a8"] });
  txt("Obra de ficción y parodia · nombres, personas y hechos inventados", W / 2, 706, { size: 13, font: F_TYPE, align: "center", color: "rgba(255,255,255,.55)" });
  txt("Ratón / táctil · M = sonido · Enter = entregar · P = pausa", W / 2, 24, { size: 14, font: F_TYPE, align: "center", color: "rgba(255,255,255,.65)" });
}
function drawHowto() {
  ctx.fillStyle = "rgba(10,5,20,.82)"; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, H / 2); const g = ctx.createLinearGradient(0, -300, 0, 300); g.addColorStop(0, "#f4e4b4"); g.addColorStop(1, "#d8bc78"); ctx.fillStyle = g; rr(-460, -320, 920, 640, 22); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = "#3a200a"; ctx.stroke();
  txt("Cómo se firma un parte", 0, -262, { size: 52, font: F_TITLE, align: "center", color: "#2a1005" });
  const L = [
    ["1.", "Lee el parte. Arriba el profesor marca la gravedad (con X o tick, como un humano) y escribe la SANCIÓN PROPUESTA."],
    ["2.", "En la parte de abajo del parte marca la casilla correcta: Amonestación, Expulsión o BOSS FINAL."],
    ["3.", "Si es expulsión, ESCRIBE A MANO con el ratón los números en DÍAS / SEMANAS / MESES. Detecto lo que dibujas. Vacío = 0."],
    ["4.", "Si el profesor pide EXPULSIÓN, marca SÍ o NO: si es desproporcionada, NO y pon solo Amonestación. Si el parte no tiene sentido, pulsa ANULAR. Después firma y ENTREGA."],
    ["5.", "Cada parte puesto por Bear u otra persona se acumula. ¡No dejes que se amontonen!"],
    ["6.", "Un 10% de las veces una madre vendrá a protestar. Escúchala, y si dudas, llama al alumno al calabozo."],
    ["7.", "Cada 10 partes llega un BOSS FINAL. ¡Pulsa DESAHÓGATE si te estresas! ANULAR tira el parte (cuesta puntos)."],
    ["8.", "Cada 6 partes es una jornada. Cada 5 jornadas hay SESIÓN DE EVALUACIÓN: notas, informes y votos del claustro para decidir si pasa, repite o va a DIVER. Errores y expulsiones suben tu rango de mano dura."]
  ];
  let y = -214; for (const [n, s] of L) { txt(n, -420, y + 4, { size: 26, font: F_TITLE, color: "#8a2a1a" }); const ls = wrap(s, 800, `22px ${F_UI}`); ls.forEach((l, i) => txt(l, -385, y + i * 24, { size: 19, color: "#2a1a0a" })); y += 24 * ls.length + 10; }
  ctx.restore();
  button("back", W / 2 - 110, 604, 220, 54, "Entendido", () => { Snd.click(); scene = "menu"; }, { size: 24 });
}

/* ---------- ESCENA: JUEGO ---------- */
let deskCv = null;
function buildDesk() {
  deskCv = document.createElement("canvas"); deskCv.width = W; deskCv.height = H; const c = deskCv.getContext("2d");
  const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#6a3f1f"); g.addColorStop(1, "#4a2a12"); c.fillStyle = g; c.fillRect(0, 0, W, H);
  for (let i = 0; i < 260; i++) { c.strokeStyle = `rgba(${30 + Math.random() * 40},${15 + Math.random() * 20},5,${0.08 + Math.random() * 0.12})`; c.lineWidth = Math.random() * 2 + 0.5; const y = Math.random() * H; c.beginPath(); c.moveTo(0, y); for (let x = 0; x <= W; x += 80) c.lineTo(x, y + Math.sin(x * 0.01 + i) * 6); c.stroke(); }
  c.fillStyle = "rgba(0,0,0,.25)"; for (let x = 0; x < W; x += 320) c.fillRect(x, 0, 3, H);
}
function curParte() { return G && G.queue[0]; }
function setupCur() {
  const p = curParte(); if (!p || p.st) return;
  p.st = "enter"; p.at = 0; p.born = now; p.sigW = 0; Snd.paper();
  if (p.boss) { Snd.boss(); toast("¡¡¡ BOSS FINAL !!!", "#ff4a3a", true); shake = 1.2; feed("⚠ ¡HA LLEGADO UN BOSS FINAL!", "#ff7a6a"); }
}
function spawn(boss) {
  const p = makeParte(G.difficulty, boss); if (boss) G.queue.unshift(p); else G.queue.push(p);
  Snd.ding(); feed(p.teacher.bear ? "Bear ha puesto un parte" : p.teacher.short + " ha puesto un parte", p.teacher.bear ? "#ffd75e" : "#fff");
  if (p.teacher.bear && chance(0.5)) toast("¡Bear ha puesto un parte!", "#ffd75e");
}
function deliver() {
  const p = curParte(); if (!p || p.st !== "work" || G.paused) return;
  const pl = p.player, sigLen = pl.sig.reduce((a, s) => a + s.reduce((q, pt, i) => q + (i ? Math.hypot(pt.x - s[i - 1].x, pt.y - s[i - 1].y) : 0), 0), 0);
  if (sigLen < 90) { shake = 0.4; Snd.bad(); toast("¡Falta tu firma!", "#ff8a6a"); return; }
  p.result = evaluate(p); p.st = "stamp"; p.at = 0; Snd.stamp(); setTimeout(() => p.result.ok ? Snd.ok() : Snd.bad(), 150);
  const pb = pl.boxes; let rg = 0; if (pb[2]) rg += 4; else if (pb[1]) { rg += 2; G.exps++; if ((pl.cells[4].digit || 0) + (pl.cells[5].digit || 0) > 0) rg += 1; } else if (pb[0]) rg += 1;
  if (!p.result.ok) rg += 2; addRigor(rg);
  const work = now - p.born; G.last = { p, r: p.result, ok: p.result.ok };
  if (p.result.ok) {
    G.combo++; G.maxCombo = Math.max(G.maxCombo, G.combo);
    const pts = 100 + Math.min(G.combo, 12) * 12 + Math.max(0, Math.round(60 - work * 2.5)) + (p.boss ? 500 : 0) + p.sev * 15;
    G.score += pts; G.stress = Math.max(0, G.stress - (p.boss ? 20 : 5)); G.last.pts = pts; feed("+" + pts + " pts · combo x" + G.combo, "#8fe28f");
  } else {
    G.combo = 0; G.wrong++; G.stress = Math.min(100, G.stress + (p.boss ? 20 : 11)); G.score = Math.max(0, G.score - 40); G.last.pts = -40; shake = 0.6; feed("Parte mal rellenado: −40 pts, ¡estrés!", "#ff8a8a");
  }
}
function voidParte() {
  const p = curParte(); if (!p || p.st !== "work" || G.paused) return;
  p.st = "void"; p.at = 0; Snd.void();
  if (p.expected.void) { // parte sin sentido: anularlo es lo correcto
    p.voidGood = true; G.combo++; G.maxCombo = Math.max(G.maxCombo, G.combo); G.score += 150; G.stress = Math.max(0, G.stress - 4); addRigor(-1); G.voids++;
    G.last = { p, ok: true, good: true, voided: true, r: { ok: true, msgs: [] }, pts: 150 }; feed("Parte sin sentido anulado: +150 pts. ¡Buen ojo!", "#8fe28f"); Snd.ok();
  } else {
    const pen = p.boss ? 150 : 25; G.combo = 0; G.score = Math.max(0, G.score - pen); G.voids++; if (p.boss) G.stress = Math.min(100, G.stress + 10);
    addRigor(-1); G.last = { p, ok: false, voided: true, r: { ok: false, msgs: ["Parte anulado"] }, pts: -pen };
    feed("Parte anulado: −" + pen + " pts (Dirección se ablanda)", "#c9d4ff");
  }
}
function finishParte() {
  const p = G.queue.shift(), voided = p.st === "void"; let evalNow = false;
  if (!voided) { G.signed++; G.difficulty = Math.floor(G.signed / 2.2); if (G.signed % 10 === 0) spawn(true); }
  if (!voided || p.voidGood) {
    G.dayCount++;
    if (G.dayCount >= DAY_LEN) {
      G.dayCount = 0; const done = G.day; G.day++; G.stress = Math.max(0, G.stress - 8); Snd.bell(); toast("Fin de la jornada " + done, "#ffd75e", true); feed("Jornada " + done + " terminada: −8 estrés", "#ffd75e");
      if (done % EVAL_EVERY === 0) evalNow = true; else if (done % EVAL_EVERY === EVAL_EVERY - 1) feed("¡Mañana hay sesión de evaluación!", "#ff9a6a");
    }
  }
  if (!G.queue.length) G.spawnT = Math.min(G.spawnT, 2);
  if (evalNow) { startEval(); return; }
  if (!voided && chance(0.10)) startMother(p); else setupCur();
}
function updatePlay(dt) {
  if (G.paused || G.over) return;
  if (PAD && (!curParte() || curParte().st !== "work")) PAD = null;
  G.time += dt; Snd.music(G.stress > 70 ? "tense" : "play");
  const interval = Math.max(6.5, 15 - G.signed * 0.4); G.spawnT -= dt;
  if (G.spawnT <= 0) { spawn(false); G.spawnT = interval * rnd(0.7, 1.3); if (curParte() && !curParte().st) setupCur(); }
  { const cp = curParte(); if (cp && !cp.st) setupCur(); }
  G.feedT -= dt; if (G.feedT <= 0) { G.feedT = rnd(14, 24); feed(pick(FEED_RELAX), "#9fe"); }
  const ql = G.queue.length; G.stress += (ql > 3 ? (ql - 3) * 0.45 : -0.5) * dt; G.stress = Math.max(0, Math.min(100, G.stress));
  if (G.cd > 0) G.cd -= dt;
  const p = curParte();
  if (p) {
    p.at += dt;
    if (p.st === "enter" || p.st === "work") { const act = p.sigW > 0 && p.sigW < 1; if (act && !p.sigSnd) { Snd.penStart("t"); p.sigSnd = true; } if (act) Snd.penMove(6 + Math.random() * 8, "t"); if (!act && p.sigSnd) { Snd.penEnd("t"); p.sigSnd = false; } }
    if (p.st === "enter") { p.sigW = Math.max(0, (p.at - 0.4) / 1.4); if (p.at > 0.55) { p.st = "work"; p.at = 0; } }
    else if (p.st === "work") p.sigW = Math.min(1, p.sigW + dt / 1.4);
    else if (p.st === "stamp") { if (p.at > 0.85) { p.st = "exit"; p.at = 0; Snd.paperOut(); } }
    else if (p.st === "exit" || p.st === "void") { if (p.at > 0.5) finishParte(); }
    for (const c of p.player.cells) if (c.dirty && now > c.t && !(drag && drag.kind === "cell")) { const r = recognize(c.strokes); c.digit = r ? r.d : null; c.conf = r ? r.conf : 0; c.dirty = false; if (r) Snd.tick(); }
  }
  if (G.stress >= 100 && !G.over) { G.over = true; Snd.bell(); setTimeout(() => go("over", () => { Snd.music("office"); if (G.score > best) { best = G.score; try { localStorage.setItem("ftp_best", best); } catch (e) { } G.newBest = true; } }), 700); }
}
function paperXform(p) {
  let ox = 0, oy = 0, rot = 0;
  if (p.st === "enter") { const k = ease(p.at / 0.55); oy = -(1 - k) * 760; ox = (1 - k) * 160; rot = (1 - k) * 0.35; }
  else if (p.st === "exit") { const k = Math.pow(p.at / 0.5, 2); ox = k * 900; oy = k * 200; rot = k * 0.6; }
  else if (p.st === "void") { const k = Math.pow(p.at / 0.5, 2); ox = -k * 900; oy = k * 500; rot = -k * 1.2; }
  return { ox, oy, rot };
}
function drawHUD() {
  const x0 = 700;
  ctx.fillStyle = "rgba(25,12,5,.78)"; rr(x0, 14, 560, 692, 18); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = "#c79a4a"; ctx.stroke();
  txt("Jornada", x0 + 22, 52, { size: 30, font: F_TITLE, color: "#ffd98a" });
  const mm = String(Math.floor(G.time / 60)).padStart(2, "0"), ss = String(Math.floor(G.time % 60)).padStart(2, "0");
  if (IM.clock) ctx.drawImage(IM.clock, x0 + 150, 24, 36, 36); txt((IM.clock ? "" : "⏱ ") + mm + ":" + ss, x0 + 194, 50, { size: 22, font: F_TYPE, color: "#ffe9b0" });
  txt(String(G.score), x0 + 22, 108, { size: 56, weight: "bold", color: "#fff", shadow: "rgba(0,0,0,.6)" }); txt("PUNTOS", x0 + 24, 128, { size: 12, font: F_TYPE, color: "#c9a870" });
  txt("Récord " + Math.max(best, G.score), x0 + 200, 108, { size: 18, font: F_TYPE, color: "#c9a870" });
  txt("Jornada " + G.day + " · parte " + Math.min(G.dayCount + 1, DAY_LEN) + "/" + DAY_LEN + " · evaluación en " + (EVAL_EVERY - ((G.day - 1) % EVAL_EVERY)) + " j", x0 + 200, 128, { size: 12, font: F_TYPE, color: "#ffb84a" });
  const rk = RANKS[G.rank], nx = RANKS[G.rank + 1], pr = nx ? (G.rigor - rk[0]) / (nx[0] - rk[0]) : 1;
  txt("🎓 " + rk[1], x0 + 22, 152, { size: 16, weight: "bold", color: "#ffb84a" });
  ctx.fillStyle = "#1a0d06"; rr(x0 + 330, 140, 130, 10, 5); ctx.fill(); ctx.fillStyle = "#ff8a3a"; rr(x0 + 330, 140, Math.max(6, 130 * pr), 10, 5); ctx.fill(); txt("mano dura", x0 + 468, 150, { size: 11, font: F_TYPE, color: "#c9a870" });
  // taza
  const mx = 1196, my = 78; if (IM.mug) ctx.drawImage(IM.mug, mx - 54, my - 50, 108, 108); else { ctx.fillStyle = "#e8e0d0"; rr(mx - 26, my - 20, 46, 44, 8); ctx.fill(); ctx.strokeStyle = "#1a0f0a"; ctx.lineWidth = 3; ctx.stroke(); ctx.beginPath(); ctx.arc(mx + 22, my, 12, -1.5, 1.5); ctx.stroke(); ctx.fillStyle = "#4a2a14"; ctx.fillRect(mx - 22, my - 16, 38, 8); }
  for (let i = 0; i < 3; i++) { ctx.strokeStyle = `rgba(255,255,255,${0.5 - i * 0.12})`; ctx.lineWidth = 3; ctx.beginPath(); const o = (now * 20 + i * 30) % 60; ctx.moveTo(mx - 10 + i * 10, my - 24); ctx.bezierCurveTo(mx - 20 + i * 10 + Math.sin(now * 3 + i) * 6, my - 40 - o * 0.2, mx + i * 10, my - 50, mx - 6 + i * 10 + Math.sin(now * 2 + i) * 8, my - 60 - o * 0.3); ctx.stroke(); }
  // estrés
  txt("ESTRÉS", x0 + 22, 170, { size: 14, font: F_TYPE, color: "#c9a870" });
  ctx.fillStyle = "#1a0d06"; rr(x0 + 22, 176, 440, 26, 13); ctx.fill(); const sg = ctx.createLinearGradient(x0 + 22, 0, x0 + 462, 0); sg.addColorStop(0, "#58d058"); sg.addColorStop(.6, "#e8c030"); sg.addColorStop(1, "#e03030");
  ctx.save(); rr(x0 + 22, 176, 440, 26, 13); ctx.clip(); ctx.fillStyle = sg; ctx.fillRect(x0 + 22, 176, 440 * G.stress / 100, 26); if (G.stress > 75) { ctx.fillStyle = `rgba(255,255,255,${0.15 + 0.15 * Math.sin(now * 12)})`; ctx.fillRect(x0 + 22, 176, 440 * G.stress / 100, 26); } ctx.restore();
  ctx.strokeStyle = "#c79a4a"; ctx.lineWidth = 2; rr(x0 + 22, 176, 440, 26, 13); ctx.stroke();
  txt(G.stress < 25 ? "😌" : G.stress < 50 ? "🙂" : G.stress < 75 ? "😤" : "🤯", x0 + 476, 200, { size: 34 + (G.stress > 75 ? Math.sin(now * 14) * 3 : 0), font: "sans-serif" });
  // stats
  const st = [["FIRMADOS", G.signed], ["COMBO", "x" + G.combo], ["EN COLA", G.queue.length]];
  st.forEach(([a, b], i) => { const bx = x0 + 22 + i * 180; ctx.fillStyle = "rgba(255,255,255,.07)"; rr(bx, 218, 166, 58, 10); ctx.fill(); txt(String(b), bx + 83, 254, { size: 32, weight: "bold", align: "center", color: i === 2 && G.queue.length > 5 ? "#ff7a6a" : "#fff" }); txt(a, bx + 83, 270, { size: 11, font: F_TYPE, align: "center", color: "#c9a870" }); });
  // pila de partes
  const n = Math.min(G.queue.length - 1, 6); if (IM.papers && n >= 1) { const sz = Math.min(135, 90 + n * 9); ctx.drawImage(IM.papers, x0 + 6, 424 - sz, sz, sz); } else for (let i = n; i >= 1; i--) drawPaperSprite(x0 + 66 + i * 7, 368 - i * 3, 0.95, (i % 2 ? 0.05 : -0.04) * i, 1);
  if (n >= 1) { txt("Pendientes", x0 + 40, 424, { size: 13, font: F_TYPE, color: "#c9a870" }); txt(n + (G.queue.length - 1 > 6 ? "+" : ""), x0 + 100, 330, { size: 14, color: "#fff", weight: "bold" }); }
  else txt("Sin más partes… de momento", x0 + 22, 372, { size: 15, font: F_TYPE, color: "#9a8a60" });
  // último resultado
  ctx.fillStyle = "rgba(255,250,230,.08)"; rr(x0 + 190, 296, 340, 130, 10); ctx.fill(); txt("ÚLTIMO PARTE", x0 + 202, 314, { size: 11, font: F_TYPE, color: "#c9a870" });
  if (G.last) {
    const L = G.last; if (L.voided) { txt(L.good ? "✔ Anulado (sin sentido)  +" + L.pts : "↩ Anulado  " + L.pts, x0 + 202, 342, { size: 19, weight: "bold", color: L.good ? "#8fe28f" : "#c9d4ff" }); txt(L.good ? "Buen ojo: ese parte no tenía sentido" : L.p.student.first + " se libra… de momento", x0 + 202, 366, { size: 13, color: "#e8d8b0" }); } else txt(L.ok ? "✔ Correcto  +" + L.pts : "✘ Error  " + L.pts, x0 + 202, 342, { size: 20, weight: "bold", color: L.ok ? "#8fe28f" : "#ff8a8a" });
    if (L.voided) { } else if (L.ok) txt(L.p.student.first + " · " + fmtExp(L.p.expected), x0 + 202, 366, { size: 13, color: "#e8d8b0" });
    else L.r.msgs.slice(0, 3).forEach((m, i) => txt(m, x0 + 202, 366 + i * 17, { size: 13, color: "#ffc8b0" }));
  } else txt("Aún no has firmado ninguno.", x0 + 202, 346, { size: 14, color: "#9a8a60" });
  // feed
  txt("AVISOS", x0 + 22, 452, { size: 11, font: F_TYPE, color: "#c9a870" });
  G.feed.slice(0, 6).forEach((f, i) => { const a = Math.max(0.25, 1 - i * 0.16); ctx.save(); ctx.globalAlpha = Math.min(1, f.age * 4) * a; const ls = wrap("• " + f.t, 500, `14px ${F_UI}`); txt(ls[0], x0 + 22, 472 + i * 20, { size: 14, color: f.c }); ctx.restore(); });
  // ayuda
  txt("¿Piden expulsión? Decide SÍ/NO · ¿Absurdo? ANULAR", x0 + 22, 612, { size: 12, font: F_TYPE, color: "#c9a870" });
  const cur = curParte(), can = cur && cur.st === "work";
  button("deliver", x0 + 14, 624, 190, 72, "ENTREGAR", deliver, { size: 26, color: ["#7ad46a", "#2f8a2a"], disabled: !can, sub: "(Enter)" });
  const cdOn = G.cd > 0;
  button("void", x0 + 210, 624, 140, 72, "ANULAR", voidParte, { size: 22, disabled: !can, color: ["#c9c9d8", "#6a6a8a"], sub: "tirar el parte", tc: "#1a1a2a" });
  button("vent", x0 + 356, 624, 140, 72, cdOn ? Math.ceil(G.cd) + " s" : "DESAHÓGATE", () => { if (G.cd > 0) return; G.cd = 25; G.stress = Math.max(0, G.stress - 25); shake = 1; Snd.scream(); toast("¡AAAAARGH! ¡Qué a gusto!", "#ffb84a", true); feed("Te has desahogado: −25 estrés", "#9fe"); for (let i = 0; i < 45; i++) parts.push({ x: 380, y: 300, vx: rnd(-500, 500), vy: rnd(-700, -100), r: rnd(0, 6), vr: rnd(-8, 8), life: rnd(1, 2), c: pick(["#fff", "#ffe08a", "#ff8a6a", "#9fe"]) }); }, { size: cdOn ? 26 : 16, disabled: cdOn, color: ["#ff9a5a", "#c0401a"], sub: cdOn ? "enfriando" : "−25 estrés" });
  button("pause", x0 + 502, 624, 46, 34, "⏸", () => { G.paused = true; Snd.click(); }, { size: 18, color: ["#9ab8e8", "#4a68a8"] });
  button("mute", x0 + 502, 662, 46, 34, Snd.muted ? "🔇" : "🔊", () => { Snd.toggle(); Snd.click(); }, { size: 16, color: ["#9ab8e8", "#4a68a8"] });
}
function drawPlay(dt) {
  if (IM.desk) ctx.drawImage(IM.desk, 0, 0, W, H); else { if (!deskCv) buildDesk(); ctx.drawImage(deskCv, 0, 0); }
  const lg = ctx.createRadialGradient(360, 300, 80, 360, 300, 620); lg.addColorStop(0, "rgba(255,230,170,.28)"); lg.addColorStop(1, "rgba(0,0,0,.35)"); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  if (G.feed) for (const f of G.feed) f.age += dt;
  const p = curParte();
  // papeles detrás
  const back = Math.min(G.queue.length - 1, 3);
  for (let i = back; i >= 1; i--) { ctx.save(); ctx.translate(PX + PW / 2, PY + PH / 2); ctx.rotate((i % 2 ? 1 : -1) * 0.012 * i); ctx.fillStyle = i % 2 ? "#efe6c8" : "#f4ecd2"; ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 10; ctx.fillRect(-PW / 2 + i * 4, -PH / 2 + i * 3, PW, PH); ctx.restore(); }
  if (p && p.st) {
    const xf = paperXform(p); ctx.save(); ctx.translate(PX + PW / 2 + xf.ox, PY + PH / 2 + xf.oy); ctx.rotate(xf.rot); ctx.translate(-PW / 2, -PH / 2); drawPaper(p, now); ctx.restore();
  } else if (!p) txt("Sin partes pendientes", PX + PW / 2, 360, { size: 34, font: F_TITLE, align: "center", color: "#ffd98a" });
  if (p && p.st === "stamp" && IM.stamp) { const t = p.at, dy = t < 0.16 ? -(1 - t / 0.16) * 280 : t < 0.42 ? 0 : -((t - 0.42) / 0.4) * 280; ctx.save(); ctx.globalAlpha = Math.min(1, (0.85 - t) * 6); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 16; ctx.drawImage(IM.stamp, PX + 470 - 55, PY + 650 - 138 + dy, 110, 154); ctx.restore(); }
  drawHUD();
  if (p && p.st === "work" && p.boss) { ctx.fillStyle = `rgba(255,0,0,${0.06 + 0.05 * Math.sin(now * 8)})`; ctx.fillRect(0, 0, W, H); }
  if (drag && IM.pen && !coarse) { ctx.save(); ctx.translate(M.x, M.y); ctx.rotate(-0.62); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 6; ctx.drawImage(IM.pen, -4, -27, 230, 56); ctx.restore(); }
  if (PAD) drawPad();
  if (G.paused) {
    ctx.fillStyle = "rgba(10,5,20,.75)"; ctx.fillRect(0, 0, W, H); txt("PAUSA", W / 2, 280, { size: 96, font: F_TITLE, align: "center", color: "#ffd98a", stroke: "#2a0f06" });
    button("resume", W / 2 - 150, 330, 300, 62, "Continuar", () => { G.paused = false; Snd.click(); }, { size: 26 });
    button("tomenu", W / 2 - 150, 410, 300, 54, "Abandonar jornada", () => { Snd.click(); go("menu", () => { Snd.music("menu"); }); }, { size: 20, color: ["#ff9a8a", "#b0402a"] });
  }
}

function drawPad() {
  const P = PAD, p = curParte(); if (!p) { PAD = null; return; } const pl = p.player;
  ctx.fillStyle = "rgba(10,5,20,.82)"; ctx.fillRect(0, 0, W, H);
  const cell = P.kind === "cell" ? pl.cells[P.idx] : null, nm = ["DÍAS", "SEMANAS", "MESES"][P.idx >> 1], ps = P.idx % 2 ? "unidades" : "decenas";
  txt(P.kind === "cell" ? "Escribe el número · " + nm + " (" + ps + ")" : "Firma de Dirección", W / 2, P.y - 28, { size: 30, font: F_TITLE, align: "center", color: "#ffd98a" });
  ctx.fillStyle = "#fffdf0"; rr(P.x, P.y, P.w, P.h, 14); ctx.fill(); ctx.strokeStyle = "#c79a4a"; ctx.lineWidth = 5; ctx.stroke();
  ctx.strokeStyle = "rgba(0,0,0,.12)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(P.x + 12, P.y + P.h * 0.72); ctx.lineTo(P.x + P.w - 12, P.y + P.h * 0.72); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.rect(P.x, P.y, P.w, P.h); ctx.clip();
  if (cell) { ctx.translate(P.x, P.y); ctx.scale(P.k, P.k); for (const s of cell.strokes) penLine(s, 3.2, "#0b3fa8"); }
  else { ctx.translate(P.x - SIGR.x * P.k, P.y - SIGR.y * P.k); ctx.scale(P.k, P.k); for (const s of pl.sig) penLine(s, 2.6, "#0b2a8a"); }
  ctx.restore();
  if (cell) { const has = cell.strokes.length; txt(has ? (cell.digit === null ? "?" : "Detecto: " + cell.digit) : "dibuja un dígito", P.x + P.w + 30, P.y + 120, { size: has ? 46 : 22, weight: "bold", color: cell.digit === null || !has ? "#ffe9b0" : cell.conf < 0.55 ? "#ffc060" : "#8fe28f" }); }
  const by = P.y + P.h + 24;
  button("padclear", W / 2 - 330, by, 200, 64, "Borrar", () => { Snd.click(); if (cell) { cell.strokes = []; cell.digit = null; cell.dirty = false; } else pl.sig = []; }, { size: 24, color: ["#ff9a8a", "#b0402a"] });
  button("paddone", W / 2 - 100, by, 430, 64, "Listo ✓", () => { Snd.click(); if (cell) { flushCells(p); } PAD = null; }, { size: 28, color: ["#7ad46a", "#2f8a2a"] });
}

/* ---------- DIÁLOGOS (madre / despacho) ---------- */
const DLG = { q: [], cur: null, shown: 0, done: true, blipT: 0 };
function dlgPush(who, text, pitch, col) { DLG.q.push({ who, text, pitch, col }); if (DLG.done) dlgNext(); }
function dlgNext() { if (!DLG.q.length) { DLG.cur = null; DLG.done = true; return false; } DLG.cur = DLG.q.shift(); DLG.shown = 0; DLG.done = false; return true; }
function dlgUpdate(dt) {
  if (!DLG.cur || DLG.done) return; const before = Math.floor(DLG.shown); DLG.shown += dt * 38; const a = Math.floor(DLG.shown);
  if (a > before) { const ch = DLG.cur.text[a - 1]; if (ch && ch !== " " && a % 2 === 0) Snd.blip(DLG.cur.pitch); }
  if (DLG.shown >= DLG.cur.text.length) { DLG.shown = DLG.cur.text.length; DLG.done = true; }
}
const dlgTalking = () => DLG.cur && !DLG.done;
function dlgClick() { if (!DLG.cur) return false; if (!DLG.done) { DLG.shown = DLG.cur.text.length; DLG.done = true; return true; } return false; }
function drawDlg() {
  if (!DLG.cur) return; const d = DLG.cur, x = 90, y = 520, w = 1100, h = 170;
  ctx.save(); ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 20; ctx.fillStyle = "#f6ecc8"; rr(x, y, w, h, 18); ctx.fill(); ctx.shadowColor = "transparent"; ctx.lineWidth = 5; ctx.strokeStyle = "#3a200a"; ctx.stroke();
  ctx.fillStyle = d.col || "#8a2a1a"; rr(x + 24, y - 20, 300, 40, 12); ctx.fill(); ctx.stroke(); txt(d.who, x + 40, y + 8, { size: 22, font: F_TITLE, color: "#fff2cc" });
  const shown = d.text.slice(0, Math.floor(DLG.shown)), ls = wrap(d.text, w - 70, `30px ${F_HAND}`); let used = 0;
  ls.forEach((l, i) => { const part = shown.slice(used, used + l.length + 1); used += l.length + 1; txt(part.trimEnd(), x + 34, y + 62 + i * 34, { size: 30, font: F_HAND, color: "#2a1a0a" }); });
  if (DLG.done) txt("▼ clic para continuar", x + w - 24, y + h - 16, { size: 14, font: F_TYPE, color: "#8a6a3a", align: "right", alpha: 0.5 + 0.5 * Math.sin(now * 6) });
  ctx.restore();
}

/* ---------- MADRE ---------- */
function startMother(p) {
  const reason = pick(MOM_REASONS), mom = pick(MOM_NAMES);
  S2 = { p, reason, mom, stage: "arrive", t: 0, x: 1400, called: false, res: null, look: look(true), stuLook: look(p.student.gender === "f"), momAngry: 1, happy: 0, ph: 0 };
  S2.look.hs = pick([1, 2, 3]); S2.look.glasses = chance(0.5) ? 1 : 0; G.momCount++;
  DLG.q = []; DLG.cur = null; DLG.done = true;
  go("mother", () => { Snd.music("tense"); Snd.knock(); setTimeout(() => Snd.door(), 700); });
  feed("¡Una madre protesta por el parte de " + p.student.first + "!", "#ff9a8a");
}
function momReason() { return gen(S2.reason.t, S2.p.student.gender, S2.p.student.first); }
function momDecide(keep) {
  const r = S2.reason, correct = keep ? !r.valid : r.valid; let pts, ds;
  if (correct) { pts = S2.called ? 120 : 200; ds = -8; } else { pts = -120; ds = 14; }
  G.score = Math.max(0, G.score + pts); G.stress = Math.max(0, Math.min(100, G.stress + ds));
  S2.res = { correct, pts, keep }; S2.stage = "result"; S2.t = 0; S2.happy = correct && !keep ? 1 : 0;
  if (correct) { Snd.ok(); S2.momAngry = keep ? 1 : 0; } else { Snd.bad(); S2.momAngry = keep ? 1 : 0; }
  G.last = { p: S2.p, r: { ok: correct, msgs: [] }, ok: correct, pts };
  feed(correct ? "Decisión acertada con la madre: +" + pts : "Decisión errónea con la madre: " + pts, correct ? "#8fe28f" : "#ff8a8a");
  const l = [];
  if (correct && keep) l.push("«Pues vaya… está bien, me callo.»", "«Mmm. Tiene usted razón. Ay, este niño…»");
  else if (correct && !keep) l.push("«¡Gracias, gracias! ¡Es usted un santo!»", "«Sabía que se haría justicia. Gracias.»");
  else if (!correct && keep) l.push("«¡Esto va a la inspección educativa! ¡Me voy a quejar al presidente!»", "«¡Qué injusticia! ¡Me lo voy a pensar mucho!»");
  else l.push("«Muy amable… (y ahora a por la tarta que le prometí a mi hijo…)»", "«Gracias. (Me ha creído, ¡qué ingenua gente!)»");
  dlgPush("Madre de " + S2.p.student.first, pick(l), 330, "#8a2a1a");
}
function drawMotherRoom() {
  const g = ctx.createLinearGradient(0, 0, 0, 520); g.addColorStop(0, "#d7c8a0"); g.addColorStop(1, "#bda676"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#6a4a2a"; ctx.fillRect(0, 440, W, 280); for (let x = 0; x < W; x += 90) { ctx.fillStyle = "rgba(0,0,0,.12)"; ctx.fillRect(x, 440, 3, 280); }
  ctx.fillStyle = "#8a6a3a"; ctx.fillRect(0, 430, W, 14);
  // ventana
  ctx.fillStyle = "#8ec4ee"; ctx.fillRect(110, 90, 200, 220); ctx.strokeStyle = "#4a2a10"; ctx.lineWidth = 8; ctx.strokeRect(110, 90, 200, 220); ctx.beginPath(); ctx.moveTo(210, 90); ctx.lineTo(210, 310); ctx.moveTo(110, 200); ctx.lineTo(310, 200); ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,.6)"; for (const [a, b] of [[140, 130], [250, 150]]) { ctx.beginPath(); ctx.arc(a + Math.sin(now * 0.3) * 6, b, 20, 0, 7); ctx.arc(a + 22, b + 4, 16, 0, 7); ctx.fill(); }
  if (IM.clock) ctx.drawImage(IM.clock, 820, 80, 112, 112); if (IM.plant) ctx.drawImage(IM.plant, 880, 300, 112, 140);
  // cuadro y puerta
  ctx.fillStyle = "#5a3a1a"; ctx.fillRect(1000, 60, 200, 372); ctx.strokeStyle = "#2a1a0a"; ctx.lineWidth = 6; ctx.strokeRect(1000, 60, 200, 372); ctx.fillStyle = "#8a5a2a"; ctx.fillRect(1020, 80, 160, 160); ctx.fillRect(1020, 260, 160, 150); ctx.fillStyle = "#e8c04a"; ctx.beginPath(); ctx.arc(1170, 270, 9, 0, 7); ctx.fill();
  ctx.fillStyle = "#e8e0c0"; rr(400, 70, 360, 90, 8); ctx.fill(); ctx.strokeStyle = "#3a200a"; ctx.lineWidth = 5; ctx.stroke(); if (ICON.complete) ctx.drawImage(ICON, 418, 74, 66, 76); txt("DESPACHO DE", 590, 108, { size: 20, font: F_TYPE, align: "center", color: "#3a200a" }); txt("DIRECCIÓN", 600, 140, { size: 34, font: F_TITLE, align: "center", color: "#3a200a" });
  // mesa del director
  ctx.fillStyle = "#4a2a12"; rr(430, 396, 400, 50, 8); ctx.fill(); ctx.strokeStyle = "#1a0f0a"; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = "#6a3a1a"; ctx.fillRect(445, 446, 370, 74); ctx.strokeRect(445, 446, 370, 74); ctx.fillStyle = "#e8c04a"; rr(570, 404, 120, 24, 4); ctx.fill(); txt("DIRECTOR/A", 630, 421, { size: 14, font: F_TYPE, align: "center", color: "#3a200a", weight: "bold" });
  if (IM.mug) ctx.drawImage(IM.mug, 690, 356, 50, 50);
  ctx.fillStyle = "#fffdf0"; ctx.save(); ctx.translate(500, 392); ctx.rotate(-0.08); ctx.fillRect(-26, -10, 52, 14); ctx.restore();
}
function updateMother(dt) {
  S2.t += dt; dlgUpdate(dt); S2.ph += dt * 9;
  if (S2.stage === "arrive") { S2.x = Math.max(300, 1400 - ease(S2.t / 2.1) * 1100); if (Math.floor(S2.t * 4) !== Math.floor((S2.t - dt) * 4) && S2.t < 2) Snd.step(); if (S2.t > 2.2) { S2.stage = "rant"; S2.t = 0; dlgPush("Madre de " + S2.p.student.first + " (" + S2.mom + ")", gen(pick(MOM_ARRIVE), S2.p.student.gender, S2.p.student.first), 300, "#8a2a1a"); dlgPush("Madre de " + S2.p.student.first + " (" + S2.mom + ")", momReason(), 300, "#8a2a1a"); Snd.angryVoice(); } }
  if (S2.stage === "rant" && DLG.done && !DLG.cur && S2.t > 0.3) S2.stage = "choice";
  if (S2.stage === "info" && DLG.done && !DLG.cur && S2.t > 0.3) S2.stage = "choice";
  if (S2.stage === "result" && DLG.done && S2.t > 3.2) { S2.stage = "leave"; S2.t = 0; }
  if (S2.stage === "leave") { S2.x += dt * 340; if (S2.x > 1400) { endMother(); } }
}
function endMother() { const p = S2; S2 = null; go("play", () => { Snd.music("play"); setupCur(); }); }
function drawOrigPaper(s) {
  ctx.fillStyle = "rgba(8,4,14,.9)"; ctx.fillRect(0, 0, W, H); const p = s.p, k = 0.99;
  ctx.save(); ctx.translate((W - PW * k) / 2, 8); ctx.scale(k, k); drawPaper(p, now); ctx.restore();
  txt("Parte original", 40, 60, { size: 32, font: F_TITLE, color: "#ffd98a" }); txt(p.student.first + " " + p.student.last.split(" ")[0] + " · " + p.course, 40, 92, { size: 18, font: F_TYPE, color: "#e8d8b0" });
  button("closeP", 980, 40, 240, 56, "✕ Cerrar parte", () => { Snd.click(); s.showP = false; }, { size: 22, color: ["#ff9a8a", "#b0402a"] });
}
function drawMother(dt) {
  drawMotherRoom(); const s = S2, walking = s.stage === "arrive" || s.stage === "leave";
  const jit = s.momAngry && !walking && s.stage !== "result" ? Math.sin(now * 40) * 1.5 : 0;
  person(s.x + jit, 520, 2.2, Object.assign({}, s.look, { skin: "#f0c8a0", shirt: "#d05a8a", phase: walking ? s.ph : 0, mouth: dlgTalking() ? 0.5 + 0.5 * Math.sin(now * 25) : 0, angry: s.momAngry && s.stage !== "leave" ? 1 : 0, happy: s.happy, arm: dlgTalking() ? now : 0, flip: s.stage === "leave" ? -1 : 1, fem: 1 }));
  if (s.stage !== "arrive" && s.stage !== "leave") txt("¡" + ["¡!", "#$%", "¿¡?!", "¡!!"][Math.floor(now * 3) % 4], s.x + 70, 300 + Math.sin(now * 8) * 5, { size: 40, weight: "bold", color: "#d02020", stroke: "#fff", sw: 6, align: "center", alpha: s.momAngry && DLG.cur ? 1 : 0 });
  // tarjeta del parte
  ctx.save(); ctx.translate(1095, 290); ctx.rotate(0.05); ctx.fillStyle = "#fffdf0"; ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 12; ctx.fillRect(-120, -70, 240, 130); ctx.shadowColor = "transparent"; ctx.strokeStyle = "#5a4020"; ctx.lineWidth = 2; ctx.strokeRect(-120, -70, 240, 130);
  txt("PARTE Nº " + s.p.id, 0, -48, { size: 12, font: F_TYPE, align: "center", color: "#6a5a40" }); txt(s.p.student.first + " " + s.p.student.last.split(" ")[0], 0, -26, { size: 20, font: F_HAND, align: "center", color: s.p.ink }); txt(s.p.course, 0, -6, { size: 18, font: F_HAND, align: "center", color: s.p.ink });
  const sl = wrap(s.p.text, 220, `15px ${F_HAND}`).slice(0, 3); sl.forEach((l, i) => txt(l + (i === 2 ? "…" : ""), -108, 18 + i * 16, { size: 15, font: F_HAND, color: s.p.ink })); ctx.restore();
  if (!s.showP && s.stage !== "arrive" && s.stage !== "leave") button("seeP", 985, 366, 220, 46, "📄 Ver parte original", () => { Snd.paper(); s.showP = true; }, { size: 17, color: ["#e8dcb0", "#a89860"] });
  if (s.stage === "arrive") txt("¡MADRE ENFADADA!", W / 2, 60, { size: 52, font: F_TITLE, align: "center", color: "#ff5a4a", stroke: "#2a0f06", sw: 8, rot: Math.sin(now * 20) * 0.02 });
  drawDlg();
  if (s.stage === "choice" && !s.showP) {
    txt("¿Qué decides, Dirección?" + (s.called ? "  (el alumno ya ha hablado)" : ""), W / 2, 420, { size: 24, font: F_TYPE, align: "center", color: "#2a1005", weight: "bold" });
    const bx = [[110, "MANTENER el parte", "(la madre exagera)", () => momDecide(true), ["#e85a4a", "#9a2218"]], [420, "ANULAR el parte", "(la madre tiene razón)", () => momDecide(false), ["#7ad46a", "#2f8a2a"]]];
    bx.forEach(([x, l, sub, fn, col]) => button("m" + x, x, 560, 290, 80, l, () => { Snd.click(); fn(); }, { size: 22, color: col, sub, tc: "#fff" }));
    button("callstu", 730, 560, 290, 80, s.called ? "Alumno ya interrogado" : "LLAMAR AL ALUMNO", () => { Snd.click(); startOffice(); }, { size: 20, disabled: s.called, sub: "(al calabozo, perdón, a Jefatura)", color: ["#9ab8e8", "#4a68a8"] });
  }
  if (s.stage === "result" && DLG.done) {
    const r = s.res; txt((r.correct ? "✔ Buena decisión " : "✘ Mala decisión ") + (r.pts > 0 ? "+" : "") + r.pts, W / 2, 470, { size: 40, font: F_TITLE, align: "center", color: r.correct ? "#1c8a3a" : "#c01818", stroke: "#fff", sw: 7 });
  }
  if (s.showP) drawOrigPaper(s);
}

/* ---------- DESPACHO 3D (EL CALABOZO) · mini motor de perspectiva real ---------- */
const CAM = { x: -120, y: 150, z: -440, yaw: 0.28, f: 760, hy: 300 }, R3 = [];
const ZB = 560, XL = 320, RH = 300; // fondo, medio ancho, alto de la sala
function proj(x, y, z) {
  const dx = x - CAM.x, dz = z - CAM.z, c = Math.cos(CAM.yaw), s = Math.sin(CAM.yaw), rx = dx * c - dz * s, rz = dx * s + dz * c, k = CAM.f / Math.max(rz, 25);
  return { x: W / 2 + rx * k, y: CAM.hy - (y - CAM.y) * k, z: rz, k };
}
function shade(hex, k) { const n = parseInt(hex.slice(1), 16), r = Math.min(255, (n >> 16) * k), g = Math.min(255, ((n >> 8) & 255) * k), b = Math.min(255, (n & 255) * k); return `rgb(${r | 0},${g | 0},${b | 0})`; }
function polyDraw(P, col, edge) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(P[0].x, P[0].y); for (let i = 1; i < P.length; i++) ctx.lineTo(P[i].x, P[i].y); ctx.closePath(); ctx.fill(); if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = 1.5; ctx.stroke(); } }
function quadNow(c3, col, edge) { const P = c3.map(p => proj(p[0], p[1], p[2])); if (P.some(p => p.z < 30)) return; polyDraw(P, col, edge); }
function faceQ(c3, col, edge, zBias = 0) { const P = c3.map(p => proj(p[0], p[1], p[2])); if (P.some(p => p.z < 30)) return; R3.push({ z: (P[0].z + P[1].z + P[2].z + P[3].z) / 4 + zBias, fn: () => polyDraw(P, col, edge) }); }
function box3(x0, y0, z0, x1, y1, z1, col, edge = "rgba(0,0,0,.5)") {
  if (CAM.y > y1) faceQ([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], shade(col, 1.2), edge);
  if (CAM.z < z0) faceQ([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], shade(col, 1), edge);
  if (CAM.z > z1) faceQ([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], shade(col, .6), edge);
  if (CAM.x < x0) faceQ([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], shade(col, .8), edge);
  if (CAM.x > x1) faceQ([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], shade(col, .7), edge);
}
const BOOKS = []; { const r = mulberry(77); for (let row = 0; row < 4; row++) { let x = -268; while (x < -146) { const w = 6 + r() * 7; BOOKS.push({ row, x, w, h: 24 + r() * 14, c: ["#a02a2a", "#2a5aa0", "#2aa05a", "#c0a02a", "#7a2aa0", "#d0d0c0"][Math.floor(r() * 6)] }); x += w + 1; } } }
const DUST = []; for (let i = 0; i < 46; i++) DUST.push({ x: rnd(-300, 300), y: rnd(10, 280), z: rnd(40, 540), vx: rnd(-6, 6), vy: rnd(-3, 5), s: rnd(0.7, 1.8) });
const OPATH = [[-296, 128], [-70, 140], [0, 232]]; let OPLEN = 0; for (let i = 0; i < OPATH.length - 1; i++) OPLEN += Math.hypot(OPATH[i + 1][0] - OPATH[i][0], OPATH[i + 1][1] - OPATH[i][1]);
function pathPos(d) { let r = d; for (let i = 0; i < OPATH.length - 1; i++) { const a = OPATH[i], b = OPATH[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (r <= L) { const k = r / L; return { x: a[0] + (b[0] - a[0]) * k, z: a[1] + (b[1] - a[1]) * k }; } r -= L; } const e = OPATH[OPATH.length - 1]; return { x: e[0], z: e[1] }; }

function startOffice() {
  const p = S2.p, jefa = pick(CALABOZO_NAMES);
  S2.office = { t: 0, stage: "enter", prog: 0, sit: 0, jefa, jl: look(true), ph: 0 }; S2.office.jl.hs = 2; S2.office.jl.glasses = 1; S2.office.jl.shirt = "#6a2a5a"; S2.office.jl.skin = "#f0c8a0";
  Object.assign(CAM, { x: -150, y: 160, z: -470, yaw: 0.3 });
  DLG.q = []; DLG.cur = null; DLG.done = true; S2.called = true; G.stress = Math.min(100, G.stress + 3);
  go("office", () => { Snd.music("office"); Snd.door(); });
}
function updateOffice(dt) {
  const o = S2.office; o.t += dt; dlgUpdate(dt); o.ph += dt * 10; const st = S2.p.student;
  if (o.stage === "enter") { o.prog += dt * 150; if (Math.floor(o.t * 3.2) !== Math.floor((o.t - dt) * 3.2)) Snd.step(); if (o.prog >= OPLEN) { o.prog = OPLEN; o.stage = "sit"; o.t = 0; Snd.chair(); } }
  else if (o.stage === "sit") { o.sit = Math.min(1, o.t / 0.6); if (o.t > 0.9) { o.stage = "talk"; o.t = 0; const j = "Jefa de Estudios, " + o.jefa; dlgPush(j, gen("Pase, siéntese en la sillita. Dirección quiere saber si fue {el} alumn{o} {n} quien hizo lo que dice el parte.", st.gender, st.first), 220, "#6a2a5a"); dlgPush(st.first + " " + st.last.split(" ")[0], gen(S2.reason.stu, st.gender, st.first), 520 + (st.gender === "f" ? 80 : 0), "#2a5aa0"); dlgPush(j, "Gracias. Ya puede volver a su clase. Dirección, usted decide.", 220, "#6a2a5a"); } }
  else if (o.stage === "talk" && DLG.done && !DLG.cur && o.t > 0.3) { o.stage = "leave"; o.t = 0; o.sit = 0; Snd.chair(); Snd.door(); }
  else if (o.stage === "leave") { o.prog -= dt * 170; o.sit = 0; if (Math.floor(o.t * 3.4) !== Math.floor((o.t - dt) * 3.4)) Snd.step(); if (o.prog <= 0) { S2.stage = "info"; S2.t = 0; go("mother", () => { Snd.music("tense"); const r = S2.reason.valid; DLG.q = []; DLG.cur = null; DLG.done = true; dlgPush("Información de Jefatura", r ? "El alumno parece decir la verdad: su historia encaja con la de la madre." : "El alumno ha confesado, aunque con matices. La madre exagera.", 250, "#6a2a5a"); S2.stage = "info"; S2.t = 0; }); } }
  // cámara cinematográfica: travelling de entrada, empuje durante el interrogatorio, retirada al salir
  const T = o.stage === "enter" ? { x: -40, y: 150, z: -360, yaw: 0.06 } : o.stage === "leave" ? { x: -90, y: 150, z: -400, yaw: 0.2 } : { x: 10, y: 135, z: -300 + Math.min(40, o.t * 6), yaw: Math.sin(now * 0.35) * 0.07 };
  const k = Math.min(1, dt * (o.stage === "enter" ? 0.9 : 1.4)); CAM.x += (T.x - CAM.x) * k; CAM.y += (T.y - CAM.y) * k; CAM.z += (T.z - CAM.z) * k; CAM.yaw += (T.yaw - CAM.yaw) * k;
  for (const d of DUST) { d.x += d.vx * dt; d.y += d.vy * dt; if (d.y > 290 || d.y < 5) d.vy *= -1; if (Math.abs(d.x) > 310) d.vx *= -1; }
}
function room3() {
  // suelo con baldosas
  for (let ix = 0; ix < 8; ix++) for (let iz = 0; iz < 7; iz++) { const x = -XL + ix * 80, z = iz * 80; quadNow([[x, 0, z], [x + 80, 0, z], [x + 80, 0, z + 80], [x, 0, z + 80]], (ix + iz) % 2 ? "#5a4234" : "#4a3428", "rgba(0,0,0,.25)"); }
  quadNow([[-140, 0.2, 160], [140, 0.2, 160], [140, 0.2, 430], [-140, 0.2, 430]], "#6a1f2a", "#d8b060"); quadNow([[-120, 0.3, 180], [120, 0.3, 180], [120, 0.3, 410], [-120, 0.3, 410]], "#7a2a36", "rgba(216,176,96,.5)");
  // paredes y techo
  quadNow([[-XL, 0, ZB], [XL, 0, ZB], [XL, RH, ZB], [-XL, RH, ZB]], "#5a4a68");
  quadNow([[-XL, 0, 0], [-XL, 0, ZB], [-XL, RH, ZB], [-XL, RH, 0]], "#4a3d58"); quadNow([[XL, 0, 0], [XL, 0, ZB], [XL, RH, ZB], [XL, RH, 0]], "#3e3350");
  quadNow([[-XL, RH, 0], [XL, RH, 0], [XL, RH, ZB], [-XL, RH, ZB]], "#2a2030");
  quadNow([[-XL, 0, ZB - 0.2], [XL, 0, ZB - 0.2], [XL, 85, ZB - 0.2], [-XL, 85, ZB - 0.2]], "#3a2a22", "rgba(0,0,0,.3)");
  quadNow([[-XL + 0.2, 0, 0], [-XL + 0.2, 0, ZB], [-XL + 0.2, 85, ZB], [-XL + 0.2, 85, 0]], "#33261f"); quadNow([[XL - 0.2, 0, 0], [XL - 0.2, 0, ZB], [XL - 0.2, 85, ZB], [XL - 0.2, 85, 0]], "#2d211b");
  for (let z = 0; z <= ZB; z += 140) { const a = proj(-XL, RH, z), b = proj(XL, RH, z); ctx.strokeStyle = "#1a1220"; ctx.lineWidth = Math.max(2, 14 * a.k * 0.25); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
  // ventana con barrotes (pared del fondo)
  quadNow([[70, 100, ZB - 0.5], [230, 100, ZB - 0.5], [230, 250, ZB - 0.5], [70, 250, ZB - 0.5]], "#10183a", "#111");
  for (let i = 0; i < 12; i++) { const s = proj(80 + (i * 37) % 140, 110 + (i * 53) % 130, ZB - 0.6); ctx.globalAlpha = 0.5 + 0.5 * Math.sin(now * 1.5 + i); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(s.x, s.y, Math.max(0.8, s.k * 1.2), 0, 7); ctx.fill(); } ctx.globalAlpha = 1;
  for (let i = 0; i < 5; i++) { const x = 70 + i * 40; quadNow([[x - 2.5, 100, ZB - 0.7], [x + 2.5, 100, ZB - 0.7], [x + 2.5, 250, ZB - 0.7], [x - 2.5, 250, ZB - 0.7]], "#111"); }
  // diplomas y cartel
  [[-100, 170], [-30, 170], [40, 170]].forEach(([x, y], i) => { quadNow([[x, y, ZB - 0.5], [x + 56, y, ZB - 0.5], [x + 56, y + 42, ZB - 0.5], [x, y + 42, ZB - 0.5]], "#e8d8a0", "#4a2a10"); quadNow([[x + 8, y + 26, ZB - 0.6], [x + 46, y + 26, ZB - 0.6], [x + 46, y + 30, ZB - 0.6], [x + 8, y + 30, ZB - 0.6]], "#8a2a1a"); });
  const sg = proj(-30, 232, ZB - 1); txt("JEFATURA DE ESTUDIOS", sg.x, sg.y, { size: 24 * sg.k, font: F_TITLE, align: "center", color: "#ffd98a" });
  // puerta (pared izquierda), se abre al entrar/salir
  const o = S2.office, open = (o.stage === "enter" || o.stage === "leave") ? (o.prog < 150 ? 1 : Math.max(0, 1 - (o.prog - 150) / 90)) : 0, ang = open * 1.25;
  quadNow([[-XL + 0.4, 0, 90], [-XL + 0.4, 0, 172], [-XL + 0.4, 208, 172], [-XL + 0.4, 208, 90]], open > 0.02 ? "#d8b878" : "#3a2210", "#1a0f0a");
  const fz = 90 + Math.cos(ang) * 82, fx = -XL + 0.4 + Math.sin(ang) * 82; quadNow([[-XL + 0.4, 0, 90], [fx, 0, fz], [fx, 208, fz], [-XL + 0.4, 208, 90]], "#6a4020", "#1a0f0a");
  // antorchas en la pared derecha
  for (const z of [180, 400]) { const a = proj(XL - 1, 175, z), fl = 1 + Math.sin(now * 14 + z) * 0.15; const gl = ctx.createRadialGradient(a.x, a.y, 2, a.x, a.y, 120 * a.k * fl); gl.addColorStop(0, "rgba(255,170,60,.55)"); gl.addColorStop(1, "rgba(255,120,30,0)"); ctx.fillStyle = gl; ctx.fillRect(a.x - 140 * a.k, a.y - 140 * a.k, 280 * a.k, 280 * a.k); ctx.fillStyle = "#3a2a1a"; ctx.fillRect(a.x - 3 * a.k, a.y, 6 * a.k, 30 * a.k); ctx.fillStyle = "#ffb030"; ctx.beginPath(); ctx.ellipse(a.x, a.y - 4 * a.k, 7 * a.k * fl, 16 * a.k * fl, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#fff0a0"; ctx.beginPath(); ctx.ellipse(a.x, a.y - 1 * a.k, 3.5 * a.k, 8 * a.k * fl, 0, 0, 7); ctx.fill(); }
}
function img3(im, x, y, z, wW, hW) { if (!im) return; const a = proj(x - wW / 2, y + hW, z), b = proj(x + wW / 2, y, z); if (a.z < 30) return; R3.push({ z: a.z - 2, fn: () => ctx.drawImage(im, a.x, a.y, b.x - a.x, b.y - a.y) }); }
function objects3() {
  img3(IM.clock, 268, 175, ZB - 2, 62, 62); img3(IM.plant, 262, 0, 505, 96, 120); img3(IM.mug, -96, 82, 440, 26, 26); img3(IM.papers, 70, 82, 440, 44, 44);
  // estantería con libros
  box3(-285, 0, 520, -135, 235, 556, "#4a2c14");
  for (let r = 0; r < 4; r++) { const y = 18 + r * 54; faceQ([[-282, y + 24, 519.5], [-138, y + 24, 519.5], [-138, y + 28, 519.5], [-282, y + 28, 519.5]], "#2a1808", null, -1); }
  for (const b of BOOKS) { const y = 22 + b.row * 54 + 4; faceQ([[b.x, y, 519], [b.x + b.w, y, 519], [b.x + b.w, y + b.h, 519], [b.x, y + b.h, 519]], b.c, "rgba(0,0,0,.4)", -2); }
  // mesa de la jefa + sillón
  box3(-135, 0, 400, 135, 76, 490, "#5a3318"); box3(-142, 76, 396, 142, 82, 494, "#7a4a22");
  faceQ([[-120, 20, 399], [-30, 20, 399], [-30, 66, 399], [-120, 66, 399]], "#6a3c1a", "rgba(0,0,0,.5)", -2); faceQ([[30, 20, 399], [120, 20, 399], [120, 66, 399], [30, 66, 399]], "#6a3c1a", "rgba(0,0,0,.5)", -2);
  faceQ([[-22, 84, 396], [22, 84, 396], [22, 92, 396], [-22, 92, 396]], "#e8c04a", "#3a200a", -3);
  faceQ([[60, 82.5, 430], [95, 82.5, 430], [95, 82.5, 462], [60, 82.5, 462]], "#fffdf0", "rgba(0,0,0,.4)", -3);
  box3(-38, 0, 524, 38, 150, 540, "#3a1a30"); box3(-38, 0, 500, 38, 34, 524, "#4a2440");
  // sillita y mesita del alumno
  box3(-24, 0, 214, 24, 30, 262, "#8a5a30"); box3(-24, 30, 258, 24, 84, 266, "#7a4c26");
  [[-22, 216], [20, 216], [-22, 258], [20, 258]].forEach(([x, z]) => box3(x - 2, 0, z - 2, x + 2, 30, z + 2, "#5a3a1c", null));
  box3(46, 0, 212, 118, 56, 262, "#7a5230"); box3(42, 56, 208, 122, 61, 266, "#9a6a38");
  faceQ([[62, 61.5, 225], [98, 61.5, 225], [98, 61.5, 250], [62, 61.5, 250]], "#fffdf0", "rgba(0,0,0,.4)", -3);
  // lámpara colgante
  const sw = Math.sin(now * 1.3) * 14, a = proj(0, RH, 330), b = proj(sw, 214, 330);
  R3.push({ z: 330, fn: () => { ctx.strokeStyle = "#111"; ctx.lineWidth = 3 * a.k; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.fillStyle = "#e8c04a"; ctx.beginPath(); ctx.moveTo(b.x - 44 * b.k, b.y + 28 * b.k); ctx.lineTo(b.x + 44 * b.k, b.y + 28 * b.k); ctx.lineTo(b.x + 16 * b.k, b.y - 6 * b.k); ctx.lineTo(b.x - 16 * b.k, b.y - 6 * b.k); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#1a0f0a"; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#fff6c0"; ctx.beginPath(); ctx.ellipse(b.x, b.y + 28 * b.k, 24 * b.k, 5 * b.k, 0, 0, 7); ctx.fill(); } });
}
function char3(x, z, scale, opts, label) {
  const f = proj(x, 0, z), sh = proj(x, 0, z);
  R3.push({ z: f.z, fn: () => { ctx.fillStyle = "rgba(0,0,0,.32)"; ctx.beginPath(); ctx.ellipse(f.x, f.y + 2, 44 * f.k * scale, 11 * f.k * scale, 0, 0, 7); ctx.fill(); person(f.x, f.y, f.k * 1.18 * scale, opts); if (label) { const t = proj(x, 172, z); txt(label, t.x, t.y, { size: Math.max(12, 15 * t.k), font: F_TYPE, align: "center", color: "#ffd98a", stroke: "rgba(0,0,0,.7)", sw: 4 }); } } });
}
function drawOffice() {
  const o = S2.office, st = S2.p.student; ctx.fillStyle = "#0e0a14"; ctx.fillRect(0, 0, W, H); R3.length = 0;
  room3(); objects3();
  const talker = DLG.cur && DLG.cur.who.startsWith("Jefa"), stuTalk = DLG.cur && !talker, mv = o.stage === "enter" || o.stage === "leave", pp = pathPos(o.prog);
  char3(0, 505, 1, Object.assign({}, o.jl, { sit: 1, mouth: talker && dlgTalking() ? 0.5 + 0.5 * Math.sin(now * 25) : 0, arm: talker && dlgTalking() ? now : 0 }), "Jefa de Estudios");
  char3(pp.x, pp.z, 1, Object.assign({}, S2.stuLook, { phase: mv ? o.ph : 0, sit: o.sit, flip: o.stage === "leave" ? -1 : 1, mouth: stuTalk && dlgTalking() ? 0.5 + 0.5 * Math.sin(now * 25) : 0, fem: st.gender === "f" ? 1 : 0, bob: o.sit > 0.5 ? Math.sin(now * 2) * 1 : 0 }), st.first);
  R3.sort((a, b) => b.z - a.z); for (const r of R3) r.fn();
  // luz de la lámpara sobre el suelo y polvo en suspensión
  const lf = proj(0, 0, 330), lg = ctx.createRadialGradient(lf.x, lf.y, 10, lf.x, lf.y, 330 * lf.k); lg.addColorStop(0, "rgba(255,226,150,.30)"); lg.addColorStop(1, "rgba(255,226,150,0)"); ctx.fillStyle = lg; ctx.fillRect(0, 150, W, 570);
  for (const d of DUST) { const q = proj(d.x, d.y, d.z); if (q.z < 40) continue; const near = Math.max(0, 1 - Math.hypot(d.x, d.z - 330) / 260); ctx.globalAlpha = 0.12 + near * 0.5; ctx.fillStyle = "#fff4c8"; ctx.beginPath(); ctx.arc(q.x, q.y, Math.max(0.8, q.k * d.s), 0, 7); ctx.fill(); } ctx.globalAlpha = 1;
  const vg = ctx.createRadialGradient(W / 2, 360, 260, W / 2, 360, 820); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.65)"); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  if (!S2.showP) button("seeP2", 1030, 18, 230, 46, "📄 Ver parte original", () => { Snd.paper(); S2.showP = true; }, { size: 17, color: ["#e8dcb0", "#a89860"] });
  txt("«EL CALABOZO»", W / 2, 62, { size: 54, font: F_TITLE, align: "center", color: "#ffd98a", stroke: "#1a0f0a", sw: 8 });
  drawDlg();
  if (S2.showP) drawOrigPaper(S2);
}

/* ---------- FIN DE PARTIDA ---------- */
function drawOver() {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#2a0f10"); g.addColorStop(1, "#0a0505"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 18; i++) drawPaperSprite((i * 137 + now * 20 * (i % 3 + 1)) % W, (i * 71 + now * 30) % H, 0.8 + (i % 3) * 0.2, i + now * 0.3, 1);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(Math.sin(now) * 0.01); const pg = ctx.createLinearGradient(0, -280, 0, 280); pg.addColorStop(0, "#f4e4b4"); pg.addColorStop(1, "#d6b974"); ctx.shadowColor = "rgba(0,0,0,.7)"; ctx.shadowBlur = 40; ctx.fillStyle = pg; rr(-330, -290, 660, 580, 20); ctx.fill(); ctx.shadowColor = "transparent"; ctx.lineWidth = 6; ctx.strokeStyle = "#3a200a"; ctx.stroke();
  txt("¡TE HAS QUEMADO!", 0, -210, { size: 60, font: F_TITLE, align: "center", color: "#a01818" });
  txt("El claustro te ha enterrado en partes de incidencias.", 0, -170, { size: 18, align: "center", color: "#3a200a" });
  const rows = [["Puntos", G.score], ["Partes firmados", G.signed], ["Errores", G.wrong], ["Expulsiones firmadas", G.exps], ["Mejor combo", "x" + G.maxCombo], ["Rango final", RANKS[G.rank][1]], ["Madres atendidas", G.momCount], ["Tiempo", Math.floor(G.time / 60) + " min " + Math.floor(G.time % 60) + " s"]];
  rows.forEach(([a, b], i) => { txt(a, -250, -115 + i * 36, { size: 24, color: "#3a200a" }); txt(String(b), 250, -115 + i * 36, { size: 28, weight: "bold", align: "right", color: "#1a0f0a" }); ctx.strokeStyle = "rgba(60,30,10,.25)"; ctx.beginPath(); ctx.moveTo(-250, -105 + i * 36); ctx.lineTo(250, -105 + i * 36); ctx.stroke(); });
  if (G.newBest) txt("🏆 ¡NUEVO RÉCORD!", 0, 175, { size: 38, font: F_TITLE, align: "center", color: "#c07000", rot: Math.sin(now * 6) * 0.03 }); else txt("Récord: " + best, 0, 175, { size: 24, align: "center", color: "#6a4a20" });
  ctx.restore();
  button("again", W / 2 - 320, 570, 300, 70, "Otra jornada", () => { Snd.click(); go("play", () => { newGame(); Snd.music("play"); }); }, { size: 28, color: ["#7ad46a", "#2f8a2a"] });
  button("tomenu2", W / 2 + 20, 570, 300, 70, "Menú principal", () => { Snd.click(); go("menu", () => Snd.music("menu")); }, { size: 26 });
}

/* ---------- PARTÍCULAS Y AVISOS ---------- */
function drawFx(dt) {
  for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.life -= dt; p.vy += 1400 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt; if (p.life <= 0) { parts.splice(i, 1); continue; } ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = Math.min(1, p.life); ctx.fillStyle = p.c; ctx.fillRect(-9, -12, 18, 24); ctx.restore(); }
  for (let i = toasts.length - 1; i >= 0; i--) {
    const t = toasts[i]; t.age += dt; const dur = t.big ? 2.4 : 2.6; if (t.age > dur) { toasts.splice(i, 1); continue; }
    const k = Math.min(1, t.age * 5, (dur - t.age) * 4), y = t.big ? 330 : 40 + (toasts.length - 1 - i) * 52;
    ctx.save(); ctx.globalAlpha = k; if (t.big) { txt(t.t, W / 2, y, { size: 70 * (0.8 + 0.2 * back(t.age * 3)), font: F_TITLE, align: "center", color: t.c, stroke: "#1a0805", sw: 10, rot: Math.sin(t.age * 20) * 0.02 }); }
    else { ctx.font = `bold 20px ${F_UI}`; const w = ctx.measureText(t.t).width + 40; ctx.fillStyle = "rgba(20,10,5,.88)"; rr(W / 2 - w / 2, y - 26 + (1 - k) * -20, w, 40, 20); ctx.fill(); ctx.strokeStyle = t.c; ctx.lineWidth = 2; ctx.stroke(); txt(t.t, W / 2, y + (1 - k) * -20, { size: 20, weight: "bold", align: "center", color: t.c }); }
    ctx.restore();
  }
}

/* ---------- ENTRADA ---------- */
function pt(e) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; }
function paperLocal() { const p = curParte(); if (!p || p.st !== "work" || G.paused || PAD) return null; return { x: M.x - PX, y: M.y - PY, p }; }
cv.addEventListener("pointerdown", e => {
  e.preventDefault(); Snd.init(); if (!Snd.musicMode) Snd.music(scene === "menu" ? "menu" : "play");
  const q = pt(e); M.x = q.x; M.y = q.y; M.down = true; if (fade.dir) return; try { cv.setPointerCapture(e.pointerId); } catch (er) { }
  for (let i = btns.length - 1; i >= 0; i--) { const b = btns[i]; if (!b.disabled && M.x >= b.x && M.x <= b.x + b.w && M.y >= b.y && M.y <= b.y + b.h) { b.fn(); return; } }
  if ((scene === "mother" || scene === "office") && S2 && S2.showP) return;
  if (scene === "mother" || scene === "office") { if (dlgClick()) return; if (DLG.cur && DLG.done) { dlgNext(); return; } }
  if (scene === "play" && PAD) { if (M.x >= PAD.x && M.x <= PAD.x + PAD.w && M.y >= PAD.y && M.y <= PAD.y + PAD.h) { const s = []; padPoint(s); const p = curParte(), pl = p.player; if (PAD.kind === "cell") pl.cells[PAD.idx].strokes.push(s); else pl.sig.push(s); PAD.s = s; Snd.penStart(); } return; }
  if (scene === "play") {
    const L = paperLocal(); if (!L) return; const p = L.p, pl = p.player; coarse = e.pointerType === "touch" || e.pointerType === "pen";
    if (e.button === 2) return;
    for (let i = 0; i < 3; i++) { const b = BOXES[i]; if (L.x >= b.x - 6 && L.x <= b.x + 160 && L.y >= b.y - 8 && L.y <= b.y + 50) { pl.boxes[i] = !pl.boxes[i]; pl.mk = (pl.mk || 0) + 1; Snd.pen(30); Snd.tone(300, 0.05, "square", 0.06); return; } }
    if (p.expected.ask) for (const [v, x] of [[true, 352], [false, 462]]) if (L.x >= x && L.x <= x + 104 && L.y >= 642 && L.y <= 690) { pl.approve = pl.approve === v ? null : v; pl.mk = (pl.mk || 0) + 1; Snd.pen(30); Snd.tone(320, 0.06, "square", 0.05); return; }
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const c = cellRect(i, j), cell = pl.cells[i * 2 + j];
      if (cell.strokes.length && L.x >= c.x + c.w - 14 && L.x <= c.x + c.w + 4 && L.y >= c.y - 16 && L.y <= c.y) { cell.strokes = []; cell.digit = null; cell.dirty = false; Snd.tone(200, 0.06, "triangle", 0.1); return; }
      if (L.x >= c.x && L.x <= c.x + c.w && L.y >= c.y && L.y <= c.y + c.h) { if (coarse) { PAD = { kind: "cell", idx: i * 2 + j, k: 5, x: (W - 250) / 2, y: 130, w: 250, h: 280, s: null }; Snd.tick(); return; } const s = [{ x: L.x - c.x, y: L.y - c.y }]; cell.strokes.push(s); cell.dirty = false; drag = { kind: "cell", idx: i * 2 + j, s, ox: c.x, oy: c.y }; Snd.penStart(); return; } }
    if (pl.sig.length && L.x >= SIGR.x + SIGR.w - 60 && L.x <= SIGR.x + SIGR.w && L.y >= SIGR.y - 16 && L.y <= SIGR.y) { pl.sig = []; Snd.tone(200, 0.06, "triangle", 0.1); return; }
    if (L.x >= SIGR.x && L.x <= SIGR.x + SIGR.w && L.y >= SIGR.y - 6 && L.y <= SIGR.y + SIGR.h + 6) { if (coarse) { PAD = { kind: "sig", k: 3, x: (W - 900) / 2, y: 190, w: 900, h: 180, s: null }; Snd.tick(); return; } const s = [{ x: L.x, y: L.y }]; pl.sig.push(s); drag = { kind: "sig", s, ox: 0, oy: 0 }; Snd.penStart(); }
  }
});
function padPoint(s) {
  const P = PAD; let x = (M.x - P.x) / P.k, y = (M.y - P.y) / P.k;
  if (P.kind === "cell") { x = Math.max(-2, Math.min(CW + 2, x)); y = Math.max(-2, Math.min(CH + 2, y)); } else { x += SIGR.x; y += SIGR.y; }
  s.push({ x, y });
}
cv.addEventListener("pointermove", e => {
  const q = pt(e), dx = q.x - M.x, dy = q.y - M.y; M.x = q.x; M.y = q.y;
  if (PAD && PAD.s) { const last = PAD.s[PAD.s.length - 1], n0 = PAD.s.length; padPoint(PAD.s); const nw = PAD.s[PAD.s.length - 1]; if (Math.hypot(nw.x - last.x, nw.y - last.y) * PAD.k < 3) PAD.s.pop(); else Snd.penMove(Math.hypot(dx, dy) * 0.5); return; }
  if (drag && scene === "play") {
    const L = paperLocal(); if (!L) { drag = null; return; }
    let x = L.x - drag.ox, y = L.y - drag.oy; const last = drag.s[drag.s.length - 1];
    if (drag.kind === "cell") { x = Math.max(-3, Math.min(CW + 3, x)); y = Math.max(-3, Math.min(CH + 3, y)); }
    else { x = Math.max(SIGR.x, Math.min(SIGR.x + SIGR.w, x)); y = Math.max(SIGR.y, Math.min(SIGR.y + SIGR.h, y)); }
    if (Math.hypot(x - last.x, y - last.y) > 2) { drag.s.push({ x, y }); Snd.penMove(Math.hypot(dx, dy)); }
  }
});
function endDrag() { Snd.penEnd(); if (PAD && PAD.s) { if (PAD.kind === "cell") { const c = curParte().player.cells[PAD.idx]; c.dirty = true; c.t = now + 0.35; } PAD.s = null; M.down = false; return; } if (drag && drag.kind === "cell") { const c = curParte().player.cells[drag.idx]; c.dirty = true; c.t = now + 0.5; } drag = null; M.down = false; }
cv.addEventListener("pointerup", endDrag); cv.addEventListener("pointercancel", endDrag);
cv.addEventListener("contextmenu", e => e.preventDefault());
addEventListener("keydown", e => {
  Snd.init();
  if (e.key === "m" || e.key === "M") Snd.toggle();
  if (scene === "play" && G) { if (e.key === "Enter") deliver(); if (e.key === "Escape" && PAD) PAD = null; else if (e.key === "p" || e.key === "P" || e.key === "Escape") G.paused = !G.paused; }
  if ((scene === "mother" || scene === "office") && !(S2 && S2.showP) && (e.key === " " || e.key === "Enter")) { if (!dlgClick() && DLG.cur && DLG.done) dlgNext(); }
  if (scene === "howto" && e.key === "Escape") scene = "menu";
});
document.addEventListener("visibilitychange", () => { if (document.hidden && scene === "play" && G && !G.over) G.paused = true; });

/* ---------- BUCLE ---------- */
let lastT = performance.now();
function frame(t) {
  const dt = Math.min(0.05, (t - lastT) / 1000); lastT = t; now += dt; btns = [];
  ctx.setTransform(K, 0, 0, K, 0, 0); ctx.clearRect(0, 0, W, H);
  ctx.save(); if (shake > 0) { ctx.translate(rnd(-1, 1) * shake * 10, rnd(-1, 1) * shake * 10); shake = Math.max(0, shake - dt * 2.2); }
  if (scene === "menu" || scene === "howto") { drawMenu(dt); if (scene === "howto") drawHowto(); }
  else if (scene === "play") { updatePlay(dt); drawPlay(dt); }
  else if (scene === "mother") { if (S2) { updateMother(dt); drawMother(dt); } }
  else if (scene === "office") { if (S2) { updateOffice(dt); drawOffice(); } }
  else if (scene === "eval") drawEval(dt);
  else if (scene === "over") drawOver();
  Snd.penTick(); drawFx(dt); ctx.restore();
  if (fade.dir) { fade.a += dt * 4.5 * fade.dir; if (fade.dir > 0 && fade.a >= 1) { fade.a = 1; scene = fade.next; if (fade.fn) fade.fn(); fade.dir = -1; } else if (fade.dir < 0 && fade.a <= 0) { fade.a = 0; fade.dir = 0; } ctx.fillStyle = `rgba(10,5,15,${fade.a})`; ctx.fillRect(0, 0, W, H); }
  requestAnimationFrame(frame);
}
(async function boot() {
  try { await Promise.race([Promise.all([document.fonts.load("40px UnifrakturCook"), document.fonts.load("22px 'Patrick Hand'"), document.fonts.load("14px 'Special Elite'"), document.fonts.load("16px Lora")]), new Promise(r => setTimeout(r, 2500))]); } catch (e) { }
  document.getElementById("loading").style.display = "none"; requestAnimationFrame(frame);
})();
window.__dbg = { DLG, startEval: () => startEval(), get EV() { return EV; }, evalDecide: o => evalDecide(o), setPad: (k) => { PAD = k; }, get G() { return G; }, get S2() { return S2; }, go, newGame, recognize, get scene() { return scene; }, startMother, deliver, evaluate };
