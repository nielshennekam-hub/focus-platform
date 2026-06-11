/* ============================================================
   Klank Timer — meditatietimer met klankschalen
   Geluid: live gesynthetiseerd met de Web Audio API (geen
   opnames). Opslag: localStorage. Offline: service worker.
   ============================================================ */

const MED_KEY = "klank-timer-v1";

const defaultMedState = () => ({
  settings: {
    bowl: "tibet",
    durationMin: 10,   // null = open einde
    intervalMin: 0,    // 0 = uit
    volume: 70,
    startBell: true,
  },
  /* sessions: [{ ts, date: "2026-06-11", secs, bowl }] */
  sessions: [],
});

let med = loadMed();

function loadMed() {
  try {
    const raw = localStorage.getItem(MED_KEY);
    if (!raw) return defaultMedState();
    const parsed = JSON.parse(raw);
    return { ...defaultMedState(), ...parsed, settings: { ...defaultMedState().settings, ...parsed.settings } };
  } catch {
    return defaultMedState();
  }
}
function saveMed() {
  localStorage.setItem(MED_KEY, JSON.stringify(med));
}

function dateKey(d = new Date()) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

/* ============================================================
   Klankschalen — synthese
   Een klankschaal heeft inharmonische boventonen; elke
   boventoon krijgt twee licht verstemde sinussen zodat er
   "zweving" (het typische wow-wow-wow) ontstaat.
   ============================================================ */

const BOWLS = [
  { id: "tibet-groot", name: "Grote Tibetaanse schaal", tone: "diep & aards", icon: "🟤", freq: 110,    profile: "metal"   },
  { id: "tibet",       name: "Tibetaanse schaal",       tone: "warm & rond",  icon: "🥣", freq: 196,    profile: "metal"   },
  { id: "kristal",     name: "Kristallen schaal",       tone: "zuiver & lang", icon: "💎", freq: 261.63, profile: "crystal" },
  { id: "gong",        name: "Gong",                    tone: "breed & golvend", icon: "🌑", freq: 98,   profile: "gong"    },
  { id: "zen",         name: "Zen bel",                 tone: "helder & licht", icon: "🔔", freq: 660,   profile: "bell"    },
];

/* boventoonprofielen: ratio t.o.v. grondtoon, relatieve sterkte,
   uitsterftijd (s), zwevingssnelheid (Hz), aanzwel-tijd (s) */
const PROFILES = {
  metal: [
    { ratio: 1,     amp: 0.55, decay: 13,  beat: 1.1, attack: 0.02 },
    { ratio: 2.74,  amp: 0.30, decay: 9,   beat: 2.0, attack: 0.01 },
    { ratio: 5.18,  amp: 0.15, decay: 6.5, beat: 2.8, attack: 0.01 },
    { ratio: 8.16,  amp: 0.08, decay: 4.5, beat: 3.4, attack: 0    },
    { ratio: 11.66, amp: 0.04, decay: 3,   beat: 4.0, attack: 0    },
  ],
  crystal: [
    { ratio: 1,    amp: 0.60, decay: 19, beat: 0.6, attack: 0.06 },
    { ratio: 2.0,  amp: 0.10, decay: 13, beat: 0.9, attack: 0.03 },
    { ratio: 3.98, amp: 0.05, decay: 8,  beat: 1.2, attack: 0.02 },
  ],
  gong: [
    { ratio: 1,    amp: 0.45, decay: 14, beat: 0.9, attack: 0.15 },
    { ratio: 1.55, amp: 0.30, decay: 11, beat: 1.6, attack: 0.20 },
    { ratio: 2.21, amp: 0.22, decay: 9,  beat: 2.2, attack: 0.25 },
    { ratio: 2.95, amp: 0.15, decay: 7,  beat: 2.7, attack: 0.20 },
    { ratio: 3.9,  amp: 0.10, decay: 5,  beat: 3.2, attack: 0.12 },
    { ratio: 5.1,  amp: 0.06, decay: 3.5, beat: 3.8, attack: 0.08 },
  ],
  bell: [
    { ratio: 0.5,  amp: 0.35, decay: 9,   beat: 0.8, attack: 0.01 }, /* hum */
    { ratio: 1,    amp: 0.50, decay: 7,   beat: 1.5, attack: 0.01 }, /* prime */
    { ratio: 1.19, amp: 0.25, decay: 5,   beat: 2.0, attack: 0    }, /* tierce */
    { ratio: 1.5,  amp: 0.18, decay: 4.5, beat: 2.3, attack: 0    },
    { ratio: 2.0,  amp: 0.15, decay: 4,   beat: 2.6, attack: 0    },
    { ratio: 2.74, amp: 0.08, decay: 2.5, beat: 3.0, attack: 0    },
  ],
};

let audioCtx = null, masterGain = null;

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const comp = audioCtx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 6;
    masterGain = audioCtx.createGain();
    masterGain.connect(comp).connect(audioCtx.destination);
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  masterGain.gain.value = med.settings.volume / 100;
  return audioCtx;
}

function currentBowl() {
  return BOWLS.find(b => b.id === med.settings.bowl) || BOWLS[1];
}

/* Eén slag op de schaal, op (absolute) audiotijd `when`. */
function strikeBowl(bowl, when = null, velocity = 1) {
  const ctx = ensureAudio();
  const t = when ?? ctx.currentTime + 0.02;
  const out = ctx.createGain();
  out.gain.value = velocity;
  out.connect(masterGain);

  for (const p of PROFILES[bowl.profile]) {
    const freq = bowl.freq * p.ratio;
    if (freq < 25 || freq > 9000) continue;
    for (const det of [-p.beat / 2, p.beat / 2]) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq + det;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(p.amp / 2, t + 0.015 + p.attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + p.decay);
      osc.connect(g).connect(out);
      osc.start(t);
      osc.stop(t + p.decay + 0.1);
    }
  }

  /* tikje van de aanslag (zachte ruisburst), niet bij zachte aanzwellers */
  if (bowl.profile === "metal" || bowl.profile === "bell") {
    const dur = 0.06;
    const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = Math.min(bowl.freq * 6, 6000);
    bp.Q.value = 1;
    const g = ctx.createGain();
    g.gain.value = 0.07 * velocity;
    src.connect(bp).connect(g).connect(out);
    src.start(t);
  }
}

/* ============================================================
   Timer
   Op timestamps gebaseerd, zodat de tijd ook klopt als het
   scherm even op de achtergrond was.
   ============================================================ */

const DURATIONS = [3, 5, 10, 15, 20, 30, 45, 60, null]; // null = open einde
const INTERVALS = [0, 1, 2, 5, 10];                     // 0 = uit

let run = null;   // { startedAt, elapsedBefore, running, nextIntervalAt }
let tickHandle = null;
let wakeLock = null;

const elTime = document.getElementById("timer-time");
const elSub = document.getElementById("timer-sub");
const elRing = document.getElementById("t-ring-fill");
const elStage = document.getElementById("timer-stage");
const RING_C = 691.15;

function fmtTime(secs) {
  secs = Math.max(0, Math.round(secs));
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

function elapsedSecs() {
  if (!run) return 0;
  return run.elapsedBefore + (run.running ? (Date.now() - run.startedAt) / 1000 : 0);
}

function startSession() {
  ensureAudio(); // binnen het tik-gebaar, vereist op iOS
  run = { startedAt: Date.now(), elapsedBefore: 0, running: true, nextIntervalAt: med.settings.intervalMin * 60 };
  if (med.settings.startBell) strikeBowl(currentBowl());
  requestWakeLock();
  elStage.classList.add("running");
  elStage.classList.toggle("open-ended", med.settings.durationMin === null);
  document.getElementById("timer-setup").classList.add("locked");
  setButtons("running");
  tickHandle = setInterval(tick, 250);
  tick();
}

function pauseSession() {
  if (!run || !run.running) return;
  run.elapsedBefore += (Date.now() - run.startedAt) / 1000;
  run.running = false;
  elStage.classList.remove("running");
  setButtons("paused");
  elSub.textContent = "gepauzeerd";
}

function resumeSession() {
  if (!run || run.running) return;
  run.startedAt = Date.now();
  run.running = true;
  ensureAudio();
  elStage.classList.add("running");
  setButtons("running");
}

function stopSession(completed) {
  if (!run) return;
  const secs = Math.round(elapsedSecs());
  clearInterval(tickHandle);
  tickHandle = null;
  run = null;
  releaseWakeLock();

  /* eindbel: 3 rustige slagen bij een voltooide sessie, 1 bij handmatig stoppen */
  const ctx = ensureAudio();
  const strikes = completed ? 3 : 1;
  const t0 = ctx.currentTime + 0.05;
  for (let i = 0; i < strikes; i++) strikeBowl(currentBowl(), t0 + i * 3.2, completed ? 1 : 0.7);

  if (secs >= 10) {
    med.sessions.push({ ts: Date.now(), date: dateKey(), secs, bowl: med.settings.bowl });
    if (med.sessions.length > 500) med.sessions = med.sessions.slice(-500);
    saveMed();
    const mins = Math.max(1, Math.round(secs / 60));
    showToast(completed ? `🧘 Sessie voltooid — ${mins} min opgeslagen` : `Sessie van ${mins} min opgeslagen`);
  }

  elStage.classList.remove("running", "open-ended");
  document.getElementById("timer-setup").classList.remove("locked");
  setButtons("idle");
  renderTimerIdle();
  renderInzicht();
  renderTodayChip();
}

function tick() {
  if (!run) return;
  const elapsed = elapsedSecs();
  const durSecs = med.settings.durationMin === null ? null : med.settings.durationMin * 60;

  /* intervalbel — niet vlak voor het einde, dan komt de eindbel al */
  if (med.settings.intervalMin > 0 && run.nextIntervalAt > 0 && elapsed >= run.nextIntervalAt) {
    const nearEnd = durSecs !== null && durSecs - run.nextIntervalAt < 15;
    if (!nearEnd) strikeBowl(currentBowl(), null, 0.55);
    run.nextIntervalAt += med.settings.intervalMin * 60;
  }

  if (durSecs !== null && elapsed >= durSecs) {
    elTime.textContent = "0:00";
    elRing.style.strokeDashoffset = 0;
    stopSession(true);
    return;
  }

  if (durSecs === null) {
    elTime.textContent = fmtTime(elapsed);
    elSub.textContent = "open einde · stop wanneer jij dat wilt";
  } else {
    elTime.textContent = fmtTime(durSecs - elapsed);
    elRing.style.strokeDashoffset = RING_C * (1 - elapsed / durSecs);
    elSub.textContent = med.settings.intervalMin > 0
      ? `bel elke ${med.settings.intervalMin} min`
      : "volg je adem";
  }
}

function setButtons(mode) {
  const show = {
    idle:    ["btn-start"],
    running: ["btn-pause", "btn-stop"],
    paused:  ["btn-resume", "btn-stop"],
  }[mode];
  for (const id of ["btn-start", "btn-pause", "btn-resume", "btn-stop"]) {
    document.getElementById(id).classList.toggle("hidden", !show.includes(id));
  }
}

function renderTimerIdle() {
  const d = med.settings.durationMin;
  elTime.textContent = d === null ? "∞" : fmtTime(d * 60);
  elSub.textContent = d === null ? "open einde" : "klaar om te beginnen";
  elRing.style.strokeDashoffset = RING_C;
  elStage.classList.toggle("open-ended", d === null);
}

/* scherm aanhouden tijdens de sessie */
async function requestWakeLock() {
  try {
    if ("wakeLock" in navigator) wakeLock = await navigator.wakeLock.request("screen");
  } catch { /* niet beschikbaar — geen probleem */ }
}
function releaseWakeLock() {
  if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; }
}
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && run && run.running) requestWakeLock();
});

document.getElementById("btn-start").addEventListener("click", startSession);
document.getElementById("btn-pause").addEventListener("click", pauseSession);
document.getElementById("btn-resume").addEventListener("click", resumeSession);
document.getElementById("btn-stop").addEventListener("click", () => stopSession(false));

/* ============================================================
   Instellingen-UI (schalen, duur, interval, volume)
   ============================================================ */

function renderSetup() {
  const bowlList = document.getElementById("bowl-list");
  bowlList.innerHTML = BOWLS.map(b => `
    <button class="bowl-card ${b.id === med.settings.bowl ? "selected" : ""}" data-bowl="${b.id}">
      <span class="bowl-icon">${b.icon}</span>
      <span class="bowl-name">${b.name}<span class="bowl-tone">${b.tone}</span></span>
    </button>`).join("");

  document.getElementById("duration-chips").innerHTML = DURATIONS.map(d => `
    <button class="chip ${d === med.settings.durationMin ? "selected" : ""}" data-duration="${d === null ? "open" : d}">
      ${d === null ? "∞ open" : d + " min"}
    </button>`).join("");

  document.getElementById("interval-chips").innerHTML = INTERVALS.map(i => `
    <button class="chip ${i === med.settings.intervalMin ? "selected" : ""}" data-interval="${i}">
      ${i === 0 ? "uit" : "elke " + i + " min"}
    </button>`).join("");

  document.getElementById("setting-volume").value = med.settings.volume;
  document.getElementById("setting-startbell").checked = med.settings.startBell;
}

document.getElementById("bowl-list").addEventListener("click", (e) => {
  const card = e.target.closest("[data-bowl]");
  if (!card) return;
  med.settings.bowl = card.dataset.bowl;
  saveMed();
  renderSetup();
  /* meteen laten horen welke schaal dit is */
  strikeBowl(currentBowl(), null, 0.6);
  const sel = document.querySelector(`[data-bowl="${med.settings.bowl}"]`);
  sel.classList.add("ringing");
  setTimeout(() => sel.classList.remove("ringing"), 650);
});

document.getElementById("duration-chips").addEventListener("click", (e) => {
  const chip = e.target.closest("[data-duration]");
  if (!chip) return;
  med.settings.durationMin = chip.dataset.duration === "open" ? null : Number(chip.dataset.duration);
  saveMed();
  renderSetup();
  renderTimerIdle();
});

document.getElementById("interval-chips").addEventListener("click", (e) => {
  const chip = e.target.closest("[data-interval]");
  if (!chip) return;
  med.settings.intervalMin = Number(chip.dataset.interval);
  saveMed();
  renderSetup();
  renderTimerIdle();
});

document.getElementById("setting-volume").addEventListener("input", (e) => {
  med.settings.volume = Number(e.target.value);
  saveMed();
  if (masterGain) masterGain.gain.value = med.settings.volume / 100;
});
document.getElementById("setting-volume").addEventListener("change", () => {
  strikeBowl(currentBowl(), null, 0.5); // proefslag op het nieuwe volume
});

document.getElementById("setting-startbell").addEventListener("change", (e) => {
  med.settings.startBell = e.target.checked;
  saveMed();
});

/* ============================================================
   Inzicht — de tracker
   ============================================================ */

function minutesPerDay() {
  const map = {};
  for (const s of med.sessions) map[s.date] = (map[s.date] || 0) + s.secs;
  return map; // secs per dag
}

function medStreak() {
  const perDay = minutesPerDay();
  let streak = 0;
  if (perDay[dateKey()]) streak++; // vandaag telt mee, maar breekt de streak nog niet
  for (let i = 1; i < 3650; i++) {
    if (perDay[dateKey(daysAgo(i))]) streak++;
    else break;
  }
  return streak;
}

function renderTodayChip() {
  const secs = minutesPerDay()[dateKey()] || 0;
  document.getElementById("today-minutes").textContent = Math.round(secs / 60) + " min";
}

function renderInzicht() {
  const totalSecs = med.sessions.reduce((a, s) => a + s.secs, 0);
  document.getElementById("med-streak").textContent = medStreak();
  document.getElementById("med-total").textContent = Math.round(totalSecs / 60);
  document.getElementById("med-count").textContent = med.sessions.length;

  /* 14-daagse grafiek in minuten */
  const perDay = minutesPerDay();
  const dayNames = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const chart = document.getElementById("med-chart");
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = daysAgo(i);
    days.push({ d, mins: Math.round((perDay[dateKey(d)] || 0) / 60) });
  }
  const maxMins = Math.max(20, ...days.map(x => x.mins));
  chart.innerHTML = days.map(({ d, mins }, idx) => `
    <div class="history-bar-wrap" title="${mins} min">
      <div class="history-bar-track">
        <div class="history-bar ${mins === 0 ? "empty" : ""}" style="height:${Math.max((mins / maxMins) * 100, 4)}%"></div>
      </div>
      <span class="history-day">${idx === 13 ? "nu" : dayNames[d.getDay()]}</span>
    </div>`).join("");

  /* recente sessies */
  const list = document.getElementById("session-list");
  const recent = med.sessions.slice(-8).reverse();
  if (!recent.length) {
    list.innerHTML = `<p class="empty-note">Nog geen sessies — start je eerste meditatie op het Timer-tabblad. 🧘</p>`;
    return;
  }
  list.innerHTML = recent.map(s => {
    const bowl = BOWLS.find(b => b.id === s.bowl) || BOWLS[1];
    const when = sessionLabel(s);
    return `
      <div class="session-item">
        <span class="s-icon">${bowl.icon}</span>
        <span class="s-main">
          <span class="s-title">${bowl.name}</span>
          <span class="s-meta">${when}</span>
        </span>
        <span class="s-mins">${Math.max(1, Math.round(s.secs / 60))} min</span>
      </div>`;
  }).join("");
}

function sessionLabel(s) {
  const d = new Date(s.ts);
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  if (s.date === dateKey()) return `vandaag · ${time}`;
  if (s.date === dateKey(daysAgo(1))) return `gisteren · ${time}`;
  const months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  return `${d.getDate()} ${months[d.getMonth()]} · ${time}`;
}

document.getElementById("med-reset").addEventListener("click", () => {
  if (confirm("Weet je het zeker? Al je meditatiesessies en instellingen worden gewist.")) {
    localStorage.removeItem(MED_KEY);
    med = defaultMedState();
    renderSetup();
    renderTimerIdle();
    renderInzicht();
    renderTodayChip();
    showToast("Alles gewist — frisse start!");
  }
});

/* ============================================================
   Navigatie, toast, init
   ============================================================ */

document.querySelectorAll(".tab[data-view]").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t === tab));
    document.querySelectorAll(".view").forEach(v =>
      v.classList.toggle("active", v.id === "view-" + tab.dataset.view));
    if (tab.dataset.view === "inzicht") renderInzicht();
    window.scrollTo({ top: 0 });
  });
});

let toastTimer;
function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
}

/* waarschuw vóór wegklikken tijdens een lopende sessie */
window.addEventListener("beforeunload", (e) => {
  if (run) { e.preventDefault(); e.returnValue = ""; }
});

renderSetup();
renderTimerIdle();
renderInzicht();
renderTodayChip();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js"));
}
