/* ===== AUDIO: sintetizado moderno (WebAudio) + MP3 opcionales en /audio ===== */
const SFX_NAMES = ["click", "hover", "paper", "paperOut", "stamp", "ding", "ok", "bad", "bell", "alarm", "knock", "door", "step", "scream", "chair", "boss", "angryVoice", "fanfare", "tick", "void"];
const MUSIC_NAMES = ["menu", "play", "tense", "office"];
// c = notas del acorde (semitonos sobre la tónica del acorde), r = desplazamiento de la tónica
const MODES = {
  menu: { bpm: 92, root: 57, swing: 0.2, prog: [{ r: 0, c: [0, 3, 7, 10] }, { r: -4, c: [0, 4, 7, 11] }, { r: 3, c: [0, 4, 7, 11] }, { r: -2, c: [0, 4, 7, 9] }], kick: [0, 7, 10], snare: [4, 12], seed: 11, style: "lofi" },
  play: { bpm: 100, root: 50, swing: 0.2, prog: [{ r: 0, c: [0, 3, 7, 10, 14] }, { r: -4, c: [0, 4, 7, 11] }, { r: 3, c: [0, 4, 7, 11] }, { r: -2, c: [0, 4, 7, 10] }], kick: [0, 7, 10, 14], snare: [4, 12], seed: 23, style: "lofi" },
  tense: { bpm: 120, root: 47, swing: 0, prog: [{ r: 0, c: [0, 3, 7, 10] }, { r: -4, c: [0, 4, 7, 11] }, { r: 5, c: [0, 3, 7, 10] }, { r: -5, c: [0, 4, 7, 10] }], kick: [0, 8], snare: [12], seed: 37, style: "cine" },
  office: { bpm: 70, root: 52, swing: 0, prog: [{ r: 0, c: [0, 3, 7, 10] }, { r: -2, c: [0, 4, 7, 9] }, { r: -4, c: [0, 4, 7, 11] }, { r: -5, c: [0, 3, 7, 10] }], kick: [], snare: [], seed: 5, style: "calm" }
};
const mtof = n => 440 * Math.pow(2, (n - 69) / 12);
const Snd = {
  ctx: null, master: null, sfx: null, mus: null, rev: null, nbuf: null, muted: false, musicMode: null, stp: 0, nextT: 0, timer: null, files: {}, probed: false, curFile: null, motifs: {}, pens: {},
  init() {
    if (this.ctx) { if (this.ctx.state === "suspended") this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const c = this.ctx = new AC();
    try { this.muted = localStorage.getItem("ftp_mute") === "1"; } catch (e) { }
    this.master = c.createGain(); this.master.gain.value = this.muted ? 0 : 1;
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3.5; comp.attack.value = 0.01; comp.release.value = 0.2; this.master.connect(comp); comp.connect(c.destination);
    this.sfx = c.createGain(); this.sfx.gain.value = 0.9; this.sfx.connect(this.master);
    this.mus = c.createGain(); this.mus.gain.value = 0.42; this.mus.connect(this.master);
    // reverb de sala
    const len = Math.floor(c.sampleRate * 2.1), ir = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); let lp = 0; for (let i = 0; i < len; i++) { lp += ((Math.random() * 2 - 1) - lp) * 0.35; d[i] = lp * Math.pow(1 - i / len, 2.8) * 2.2; } }
    this.rev = c.createConvolver(); this.rev.buffer = ir; const rg = c.createGain(); rg.gain.value = 0.55; this.rev.connect(rg); rg.connect(this.master);
    const sr = c.createGain(); sr.gain.value = 0.16; this.sfx.connect(sr); sr.connect(this.rev);
    const mr = c.createGain(); mr.gain.value = 0.42; this.mus.connect(mr); mr.connect(this.rev);
    // eco suave
    const dl = c.createDelay(1); dl.delayTime.value = 0.33; const fb = c.createGain(); fb.gain.value = 0.25; const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2200;
    const eg = c.createGain(); eg.gain.value = 0.5; this.mus.connect(dl); dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(eg); eg.connect(this.master);
    this.nbuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const d = this.nbuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    this.probe();
  },
  /* ---- MP3 opcionales: audio/<nombre>.mp3 ---- */
  probe() {
    if (this.probed) return; this.probed = true;
    const load = (key, file, music) => {
      try {
        const a = new Audio(); a.preload = "auto"; if (music) a.loop = true;
        a.addEventListener("canplaythrough", () => { if (this.files[key] && this.files[key].ready) return; this.files[key] = { el: a, ready: true, music }; if (music && this.musicMode === key.slice(6)) { const m = this.musicMode; this.musicMode = null; this.music(m); } }, { once: true });
        a.addEventListener("error", () => { }, { once: true }); a.src = "audio/" + file + ".mp3";
      } catch (e) { }
    };
    SFX_NAMES.forEach(n => load(n, n, false)); MUSIC_NAMES.forEach(n => load("music-" + n, "music-" + n, true));
  },
  playFile(name) {
    const f = this.files[name]; if (!f || !f.ready || f.music) return false;
    if (this.muted) return true; try { const a = f.el.cloneNode(); a.volume = 0.9; a.play().catch(() => { }); } catch (e) { return false; } return true;
  },
  syncFiles() { if (this.curFile) this.curFile.volume = this.muted ? 0 : 0.6; },
  toggle() {
    this.muted = !this.muted;
    try { localStorage.setItem("ftp_mute", this.muted ? "1" : "0"); } catch (e) { }
    if (this.master) this.master.gain.value = this.muted ? 0 : 1; this.syncFiles();
  },
  /* ---- bloques básicos ---- */
  tone(f, d, type = "sine", v = 0.2, slide = 0, delay = 0, dest) {
    const c = this.ctx; if (!c) return;
    const t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, f + slide), t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(dest || this.sfx); o.start(t); o.stop(t + d + 0.05);
  },
  noise(d, f = 1000, q = 1, v = 0.2, type = "bandpass", slide = 0, delay = 0, dest) {
    const c = this.ctx; if (!c) return;
    const t = c.currentTime + delay, s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
    s.buffer = this.nbuf; s.loop = true; fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
    if (slide) fl.frequency.exponentialRampToValueAtTime(Math.max(40, f + slide), t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + Math.min(0.01, d / 3)); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(fl); fl.connect(g); g.connect(dest || this.sfx); s.start(t, Math.random()); s.stop(t + d + 0.05);
  },
  // nota con varios parciales y filtro (instrumentos)
  note(f, d, t, v, o = {}) {
    const c = this.ctx; if (!c) return; const T = c.currentTime + t, g = c.createGain();
    g.gain.setValueAtTime(0.0001, T); g.gain.exponentialRampToValueAtTime(v, T + (o.atk || 0.008)); g.gain.exponentialRampToValueAtTime(0.0001, T + d);
    let out = g; if (o.lp) { const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = o.lp; g.connect(lp); out = lp; } out.connect(o.dest || this.mus);
    for (const [type, mult, amp] of (o.parts || [["sine", 1, 1]])) { const os = c.createOscillator(); os.type = type; os.frequency.value = f * mult; if (o.detune) os.detune.value = (Math.random() - 0.5) * o.detune; const pg = c.createGain(); pg.gain.value = amp; os.connect(pg); pg.connect(g); os.start(T); os.stop(T + d + 0.1); }
  },
  piano(f, d, t, v) { this.note(f, d, t, v, { parts: [["sine", 1, 1], ["sine", 2, 0.42], ["sine", 3, 0.2], ["triangle", 4, 0.1], ["sine", 6, 0.04]], lp: 3400, atk: 0.005, detune: 4 }); this.noise(0.03, 1800 + f, 0.8, v * 0.35, "bandpass", 0, t, this.mus); },
  rhodes(f, d, t, v) {
    const c = this.ctx; if (!c) return; const T = c.currentTime + t, car = c.createOscillator(), mod = c.createOscillator(), mg = c.createGain(), g = c.createGain(), tn = c.createOscillator(), tg = c.createGain();
    car.type = "sine"; car.frequency.value = f; mod.type = "sine"; mod.frequency.value = f; mg.gain.setValueAtTime(f * 1.5, T); mg.gain.exponentialRampToValueAtTime(f * 0.08, T + d * 0.7); mod.connect(mg); mg.connect(car.frequency);
    tn.type = "sine"; tn.frequency.value = f * 5.01; tg.gain.setValueAtTime(v * 0.25, T); tg.gain.exponentialRampToValueAtTime(0.0001, T + 0.12); tn.connect(tg); tg.connect(this.mus);
    g.gain.setValueAtTime(0.0001, T); g.gain.exponentialRampToValueAtTime(v, T + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, T + d); car.connect(g); g.connect(this.mus);
    for (const o of [car, mod, tn]) { o.start(T); o.stop(T + d + 0.1); }
  },
  vibes(f, d, t, v) { this.note(f, d, t, v, { parts: [["sine", 1, 1], ["sine", 4, 0.22], ["sine", 10, 0.05]], lp: 5200, atk: 0.004 }); },
  bass(f, d, t, v) { this.note(f, d, t, v, { parts: [["sine", 1, 1], ["triangle", 2, 0.22]], lp: 380, atk: 0.018 }); },
  strings(freqs, d, t, v = 0.05) {
    const c = this.ctx; if (!c) return; const T = c.currentTime + t, lp = c.createBiquadFilter(), g = c.createGain();
    lp.type = "lowpass"; lp.frequency.setValueAtTime(600, T); lp.frequency.linearRampToValueAtTime(1500, T + d * 0.55); lp.frequency.linearRampToValueAtTime(700, T + d);
    g.gain.setValueAtTime(0.0001, T); g.gain.linearRampToValueAtTime(v, T + d * 0.3); g.gain.linearRampToValueAtTime(0.0001, T + d); lp.connect(g); g.connect(this.mus);
    for (const f of freqs) for (const dt of [-9, 0, 9]) { const o = c.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.detune.value = dt + (Math.random() - 0.5) * 4; o.connect(lp); o.start(T); o.stop(T + d + 0.1); }
  },
  kick(t, v = 0.9) { const c = this.ctx; if (!c) return; const T = c.currentTime + t, o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(150, T); o.frequency.exponentialRampToValueAtTime(42, T + 0.13); g.gain.setValueAtTime(v, T); g.gain.exponentialRampToValueAtTime(0.0001, T + 0.34); o.connect(g); g.connect(this.mus); o.start(T); o.stop(T + 0.4); this.noise(0.02, 2400, 1, v * 0.18, "highpass", 0, t, this.mus); },
  snare(t, v = 0.3) { this.noise(0.17, 2100, 0.7, v, "bandpass", 0, t, this.mus); this.noise(0.1, 6000, 1, v * 0.5, "highpass", 0, t, this.mus); this.note(190, 0.1, t, v * 0.6, { parts: [["triangle", 1, 1]], atk: 0.002 }); },
  hat(t, v = 0.05, open) { this.noise(open ? 0.2 : 0.04, 8500, 1, v, "highpass", 0, t, this.mus); },
  /* ---- efectos de interfaz y juego ---- */
  click() { this.tone(300, 0.09, "sine", 0.18, -120); this.tone(880, 0.1, "sine", 0.07, 300, 0.01); this.tone(1320, 0.12, "sine", 0.04, 0, 0.04); this.noise(0.025, 4500, 1, 0.07, "highpass"); },
  hover() { // campanita suave que cambia de nota (pentatónica)
    const sc = [0, 2, 4, 7, 9, 12], i = (this.hv = ((this.hv || 0) + 1 + Math.floor(Math.random() * 2)) % sc.length), f = mtof(79 + sc[i]);
    this.note(f, 0.28, 0, 0.05, { parts: [["sine", 1, 1], ["sine", 2.01, 0.25], ["sine", 3.99, 0.06]], lp: 6000, atk: 0.004, dest: this.sfx }); this.noise(0.05, 7000, 1, 0.012, "highpass");
  },
  tick() { this.tone(880, 0.07, "sine", 0.07); this.tone(1320, 0.09, "sine", 0.05, 0, 0.04); },
  // papel real: llega volando, aletea y cae
  crumple(n, dur, vol, delay = 0, lo = 1800, hi = 7000) { for (let i = 0; i < n; i++) this.noise(0.012 + Math.random() * 0.035, lo + Math.random() * (hi - lo), 2 + Math.random() * 3, vol * (0.35 + Math.random() * 0.65), "bandpass", 0, delay + Math.random() * dur); },
  paper() {
    this.noise(0.5, 600, 0.6, 0.07, "bandpass", 2600); this.noise(0.32, 3200, 0.5, 0.06, "bandpass", -2200, 0.32); this.crumple(12, 0.45, 0.05, 0.04, 3000, 8500);
    this.noise(0.09, 2700, 1.2, 0.22, "bandpass", -1300, 0.5); this.tone(92, 0.12, "sine", 0.22, -30, 0.5); this.noise(0.16, 1100, 0.7, 0.09, "lowpass", 0, 0.52); this.crumple(7, 0.22, 0.06, 0.55, 2400, 6500);
  },
  paperOut() { this.noise(0.4, 3200, 0.6, 0.12, "bandpass", -2300); this.crumple(8, 0.3, 0.05, 0, 2500, 7500); this.tone(110, 0.2, "sine", 0.1, -40, 0.3); },
  void() { this.crumple(34, 0.6, 0.13, 0, 1400, 8000); this.noise(0.5, 900, 0.7, 0.1, "lowpass", -500); this.tone(130, 0.3, "sine", 0.12, -50, 0.5); },
  stamp() { this.tone(110, 0.24, "sine", 0.55, -70); this.noise(0.12, 520, 0.7, 0.35, "lowpass"); this.tone(70, 0.35, "sine", 0.3, -25, 0.02); this.noise(0.05, 2600, 1.5, 0.14, "bandpass", 0, 0.01); this.crumple(3, 0.1, 0.05, 0.06, 2500, 5000); },
  ding() { [1318, 1976, 2637].forEach((f, i) => this.tone(f, 0.6 - i * 0.14, "sine", 0.1 - i * 0.025, 0, i * 0.008)); this.tone(1760, 0.55, "sine", 0.07, 0, 0.1); },
  ok() { [523, 659, 784, 1046].forEach((f, i) => { this.note(f, 0.5, i * 0.075, 0.11, { parts: [["sine", 1, 1], ["sine", 2, 0.3]], dest: this.sfx }); }); this.tone(1568, 0.5, "sine", 0.06, 0, 0.3); },
  bad() { this.note(196, 0.5, 0, 0.16, { parts: [["triangle", 1, 1], ["sawtooth", 1.005, 0.4]], lp: 700, dest: this.sfx }); this.note(147, 0.6, 0.15, 0.15, { parts: [["triangle", 1, 1], ["sawtooth", 1.005, 0.4]], lp: 600, dest: this.sfx }); this.noise(0.3, 350, 1, 0.1, "lowpass", 0, 0.1); },
  bell() { for (let i = 0; i < 5; i++) { const t = i * 0.28; [1, 2.76, 5.4, 8.9].forEach((m, k) => this.tone(880 * m, 0.9 - k * 0.15, "sine", 0.1 / (k + 1), 0, t)); } },
  fanfare() { const n = [[392, 0], [392, 0.15], [392, 0.3], [523, 0.5], [659, 0.78], [523, 0.95], [659, 1.1], [784, 1.35]]; n.forEach(([f, d]) => { this.note(f, 0.5, d, 0.12, { parts: [["sawtooth", 1, 0.5], ["sawtooth", 1.006, 0.5], ["triangle", 0.5, 0.8]], lp: 2200, atk: 0.03, dest: this.sfx }); }); this.noise(0.8, 5000, 1, 0.07, "highpass", 0, 1.3); },
  alarm() { for (let i = 0; i < 8; i++) { this.note(i % 2 ? 640 : 880, 0.22, i * 0.2, 0.1, { parts: [["sawtooth", 1, 1]], lp: 1800, atk: 0.02, dest: this.sfx }); } },
  boss() { this.alarm(); this.tone(55, 1.7, "sine", 0.4, -12); this.note(55, 1.6, 0, 0.2, { parts: [["sawtooth", 1, 1]], lp: 220, dest: this.sfx }); this.noise(1.3, 180, 1, 0.3, "lowpass", 500); [0.2, 0.9].forEach(d => this.tone(80, 0.45, "sine", 0.5, -50, d)); },
  knock() { [0, 0.2, 0.38].forEach(d => { this.tone(165, 0.12, "sine", 0.5, -85, d); this.noise(0.07, 500, 1, 0.3, "lowpass", 0, d); this.noise(0.03, 1400, 2, 0.1, "bandpass", 0, d); }); },
  door() { this.note(120, 0.6, 0, 0.07, { parts: [["sawtooth", 1, 1]], lp: 500, dest: this.sfx }); this.tone(210, 0.5, "triangle", 0.04, -70, 0.1); this.noise(0.3, 280, 1, 0.14, "lowpass", 0, 0.5); this.tone(60, 0.3, "sine", 0.3, -20, 0.52); },
  step() { this.noise(0.07, 240 + Math.random() * 90, 1.2, 0.2, "lowpass"); this.tone(70 + Math.random() * 20, 0.08, "sine", 0.18, -20); },
  scream() { this.note(700, 1, 0, 0.1, { parts: [["sawtooth", 1, 1]], lp: 2600, dest: this.sfx }); this.tone(900, 1, "sine", 0.08, 400); this.noise(1, 1800, 0.6, 0.14, "bandpass", 1500); this.noise(0.4, 150, 1, 0.3, "lowpass", 0, 0.8); },
  chair() { this.noise(0.26, 420, 2, 0.15, "bandpass", -160); this.tone(95, 0.2, "sine", 0.22, -30, 0.2); this.noise(0.1, 800, 1, 0.1, "lowpass", 0, 0.2); },
  blip(p) { const f = p * (0.95 + Math.random() * 0.12); this.note(f, 0.07, 0, 0.06, { parts: [["sine", 1, 1], ["triangle", 2, 0.3]], lp: 2500, atk: 0.008, dest: this.sfx }); },
  angryVoice() { this.note(220, 0.6, 0, 0.07, { parts: [["sawtooth", 1, 1]], lp: 900, atk: 0.05, dest: this.sfx }); this.noise(0.5, 900, 3, 0.05, "bandpass", 300); },
  money(good) { if (good) this.ok(); else this.bad(); },
  /* ---- pluma real: ruido continuo que sigue la velocidad ---- */
  penStart(id = "me") {
    if (!this.ctx || this.pens[id]) return; const c = this.ctx, s = c.createBufferSource(), bp = c.createBiquadFilter(), hp = c.createBiquadFilter(), g = c.createGain();
    s.buffer = this.nbuf; s.loop = true; bp.type = "bandpass"; bp.frequency.value = 3200; bp.Q.value = 0.9; hp.type = "highpass"; hp.frequency.value = 1100; g.gain.value = 0;
    s.connect(bp); bp.connect(hp); hp.connect(g); g.connect(this.sfx); s.start(0, Math.random() * 1.5); this.pens[id] = { s, bp, g, t: performance.now() };
    this.noise(0.025, 450, 1, 0.09, "lowpass"); this.noise(0.015, 3000, 1.5, 0.05, "bandpass");
  },
  penMove(sp, id = "me") { const p = this.pens[id]; if (!p) return; p.t = performance.now(); const n = this.ctx.currentTime; p.g.gain.setTargetAtTime(Math.min(0.2, 0.02 + sp * 0.011), n, 0.025); p.bp.frequency.setTargetAtTime(2300 + Math.min(sp, 25) * 110 + Math.random() * 600, n, 0.03); },
  penEnd(id = "me") { const p = this.pens[id]; if (!p) return; p.g.gain.setTargetAtTime(0, this.ctx.currentTime, 0.03); try { p.s.stop(this.ctx.currentTime + 0.25); } catch (e) { } delete this.pens[id]; },
  penTick() { const n = performance.now(); for (const id in this.pens) { const p = this.pens[id]; if (n - p.t > 90) p.g.gain.setTargetAtTime(0, this.ctx.currentTime, 0.03); } },
  pen(sp) { this.penStart("x"); this.penMove(sp || 12, "x"); setTimeout(() => this.penEnd("x"), 120); },
  /* ---- música ---- */
  music(mode) {
    if (!this.ctx || this.musicMode === mode) return; this.musicMode = mode;
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (this.curFile) { this.curFile.pause(); this.curFile = null; }
    if (!mode) return;
    const f = this.files["music-" + mode];
    if (f && f.ready) { this.curFile = f.el; f.el.currentTime = 0; f.el.volume = this.muted ? 0 : 0.6; f.el.play().catch(() => { }); return; }
    this.stp = 0; this.nextT = this.ctx.currentTime + 0.1; this.timer = setInterval(() => this.sched(), 80);
  },
  motif(mode) {
    if (this.motifs[mode]) return this.motifs[mode]; const m = MODES[mode], r = mulberry(m.seed), out = [];
    for (let b = 0; b < 4; b++) { const bar = new Array(16).fill(null), n = m.style === "calm" ? 3 : 4 + Math.floor(r() * 3); for (let k = 0; k < n; k++) { const s = [2, 3, 6, 8, 10, 11, 13, 14][Math.floor(r() * 8)]; bar[s] = { i: Math.floor(r() * 4), o: r() < 0.4 ? 1 : 0 }; } bar[0] = bar[0] || { i: 2, o: 0 }; out.push(bar); }
    return (this.motifs[mode] = out);
  },
  sched() {
    const c = this.ctx; if (!c || !this.musicMode) return;
    const mode = this.musicMode, m = MODES[mode], sd = 60 / m.bpm / 4, mo = this.motif(mode);
    while (this.nextT < c.currentTime + 0.4) {
      const st = this.stp, s = st % 16, bar = Math.floor(st / 16) % 4, ch = m.prog[bar], t = this.nextT - c.currentTime, sw = (s % 2 ? sd * m.swing : 0);
      const R = m.root + ch.r, tones = ch.c, nt = i => mtof(R + tones[i % tones.length] + 12 * Math.floor(i / tones.length));
      if (m.style === "lofi") {
        if (s === 0) this.strings(tones.slice(0, 3).map(x => mtof(R + x)), sd * 16, t, 0.03);
        if (m.kick.includes(s)) this.kick(t, 0.8); if (m.snare.includes(s)) this.snare(t, 0.24);
        if (s % 2 === 0) this.hat(t + sw, s % 4 === 0 ? 0.06 : 0.035); else if (s % 4 === 3) this.hat(t + sw, 0.02);
        if (s === 14 && mode === "play") this.hat(t, 0.05, true);
        if (s === 0 || s === 6 || s === 10) tones.forEach((x, i) => this.rhodes(mtof(R + x + 12), sd * (s === 0 ? 7 : 4), t + sw + i * 0.014, 0.05));
        if ([0, 3, 8, 11].includes(s)) this.bass(mtof(R - 24 + (s === 11 ? 7 : 0)), sd * (s === 0 || s === 8 ? 4 : 2.5), t, 0.7);
        const L = mo[bar][s]; if (L) { const f = nt(L.i + (L.o ? 4 : 0)) ; const fq = mtof(R + 12 + tones[L.i % tones.length] + (L.o ? 12 : 0)); if (mode === "play") this.vibes(fq, sd * 5, t + sw, 0.1); else this.piano(fq, sd * 5, t + sw, 0.11); }
        if (Math.random() < 0.18) this.noise(0.01, 3500 + Math.random() * 3000, 1, 0.012, "highpass", 0, t + Math.random() * sd, this.mus);
      } else if (m.style === "cine") {
        if (s === 0) { this.strings(tones.slice(0, 3).map(x => mtof(R + x - 12)), sd * 16, t, 0.07); if (bar === 3) this.noise(sd * 16, 400, 0.8, 0.14, "bandpass", 5000, t, this.mus); }
        if (m.kick.includes(s)) { this.kick(t, 1.05); this.bass(mtof(R - 24), sd * 6, t, 0.7); }
        if (s === 12) this.snare(t, 0.3);
        if (s % 4 === 2) this.hat(t, 0.04);
        if (s % 2 === 0) this.note(mtof(R - 12), sd * 1.7, t, 0.1, { parts: [["sawtooth", 1, 0.7], ["sawtooth", 1.007, 0.7]], lp: 520, atk: 0.02 });
        if (s % 2 === 1) this.piano(nt(((s >> 1) % 4) + 4), sd * 2.2, t, 0.05);
        if (s === 0 && bar % 2 === 0) this.vibes(nt(6), sd * 8, t, 0.07);
      } else { // calm
        if (s === 0) { this.strings(tones.slice(0, 3).map(x => mtof(R + x)), sd * 16, t, 0.05); this.bass(mtof(R - 24), sd * 12, t, 0.5); }
        if (s % 4 === 0) this.piano(nt([0, 2, 3, 2][(s >> 2) % 4] + (s % 8 === 4 ? 4 : 0)), sd * 8, t, 0.09);
        const L = mo[bar][s]; if (L && s % 2 === 0) this.piano(mtof(R + 24 + tones[L.i % tones.length]), sd * 7, t, 0.06);
      }
      this.nextT += sd; this.stp++;
    }
  }
};
// los efectos usan un MP3 de /audio si existe; si no, el sintetizado
SFX_NAMES.forEach(n => { const orig = Snd[n]; if (typeof orig !== "function") return; Snd[n] = function (...a) { if (n !== "hover" && n !== "step" && this.playFile(n)) return; if (!this.ctx) return; return orig.apply(this, a); }; });
