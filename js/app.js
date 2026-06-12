/* ============================================================
   Blueprint Coach — app-logica
   Opslag: localStorage. Offline: service worker. Geen backend.
   ============================================================ */

const STORE_KEY = "blueprint-coach-v1";

const defaultState = () => ({
  settings: {
    name: "",
    bedtime: "22:00",
    eatEnd: "18:00",
    notify: false,
    disabledHabits: [],
  },
  /* days: { "2026-06-11": { habits: ["bedtijd", ...] } } */
  days: {},
});

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed, settings: { ...defaultState().settings, ...parsed.settings } };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

/* ---------- datum-helpers ---------- */
function dateKey(d = new Date()) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function activeHabits() {
  return HABITS.filter(h => !state.settings.disabledHabits.includes(h.id));
}
function todayChecked() {
  return (state.days[dateKey()] || { habits: [] }).habits;
}
function dayScore(key) {
  const enabled = activeHabits();
  if (!enabled.length) return 0;
  const checked = (state.days[key] || { habits: [] }).habits.filter(id => enabled.some(h => h.id === id));
  return Math.round((checked.length / enabled.length) * 100);
}

/* ---------- streak ---------- */
const STREAK_THRESHOLD = 60; // dag telt mee vanaf 60% score

function currentStreak() {
  let streak = 0;
  // vandaag telt mee als hij al boven de drempel zit, maar breekt de streak nog niet
  if (dayScore(dateKey()) >= STREAK_THRESHOLD) streak++;
  for (let i = 1; i < 3650; i++) {
    if (dayScore(dateKey(daysAgo(i))) >= STREAK_THRESHOLD) streak++;
    else break;
  }
  return streak;
}
function bestStreak() {
  const keys = Object.keys(state.days).sort();
  if (!keys.length) return currentStreak();
  let best = 0, run = 0, prev = null;
  for (const key of keys) {
    if (dayScore(key) >= STREAK_THRESHOLD) {
      run = (prev && nextDay(prev) === key) ? run + 1 : 1;
      best = Math.max(best, run);
      prev = key;
    } else {
      run = 0; prev = null;
    }
  }
  return Math.max(best, currentStreak());
}
function nextDay(key) {
  const d = new Date(key + "T12:00:00");
  d.setDate(d.getDate() + 1);
  return dateKey(d);
}

/* ---------- gewoontes renderen ---------- */
const groupsEl = document.getElementById("habit-groups");

function renderHabits() {
  const checked = todayChecked();
  groupsEl.innerHTML = "";
  for (const [catId, cat] of Object.entries(CATEGORIES)) {
    const habits = activeHabits().filter(h => h.cat === catId);
    if (!habits.length) continue;
    const done = habits.filter(h => checked.includes(h.id)).length;

    const group = document.createElement("div");
    group.className = "habit-group";
    group.innerHTML = `
      <div class="group-header">
        <span>${cat.icon}</span><h2>${cat.name}</h2>
        <span class="group-progress">${done}/${habits.length}</span>
      </div>`;

    for (const habit of habits) {
      const isDone = checked.includes(habit.id);
      const el = document.createElement("div");
      el.className = "habit" + (isDone ? " done" : "");
      el.innerHTML = `
        <div style="display:flex">
          <button class="habit-main" data-habit="${habit.id}" aria-pressed="${isDone}">
            <span class="habit-check">✓</span>
            <span class="habit-title">${habit.title}</span>
          </button>
          <button class="habit-info" data-info="${habit.id}" aria-label="Waarom deze gewoonte?">ⓘ</button>
        </div>
        <p class="habit-why">${habit.why}</p>`;
      group.appendChild(el);
    }
    groupsEl.appendChild(group);
  }
}

groupsEl.addEventListener("click", (e) => {
  const main = e.target.closest("[data-habit]");
  const info = e.target.closest("[data-info]");
  if (main) toggleHabit(main.dataset.habit);
  if (info) info.closest(".habit").classList.toggle("open");
});

function toggleHabit(id) {
  const key = dateKey();
  if (!state.days[key]) state.days[key] = { habits: [] };
  const list = state.days[key].habits;
  const idx = list.indexOf(id);
  const wasComplete = dayScore(key) === 100;
  if (idx >= 0) list.splice(idx, 1);
  else list.push(id);
  saveState();
  renderHabits();
  renderScore();
  if (!wasComplete && dayScore(key) === 100) celebrate();
}

/* ---------- dagscore ---------- */
const RING_CIRC = 326.7;

function renderScore() {
  const pct = dayScore(dateKey());
  document.getElementById("score-value").textContent = pct + "%";
  document.getElementById("ring-fill").style.strokeDashoffset = RING_CIRC * (1 - pct / 100);
  document.getElementById("ring-fill").style.stroke = pct === 100 ? "var(--good)" : "var(--accent)";
  document.getElementById("score-message").textContent = scoreMessage(pct, state.settings.name);
  document.getElementById("streak-count").textContent = currentStreak();
}

function celebrate() {
  showToast("🧬 Perfecte dag! Don't die.");
  const colors = ["#5eead4", "#7c8cf8", "#4ade80", "#fbbf24", "#f472b6"];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = 1.8 + Math.random() * 1.6 + "s";
    c.style.animationDelay = Math.random() * 0.5 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}

/* ---------- quote & begroeting ---------- */
function renderHeader() {
  const h = new Date().getHours();
  const name = state.settings.name ? `, ${state.settings.name}` : "";
  const greeting =
    h < 6 ? "Vroege vogel" :
    h < 12 ? "Goedemorgen" :
    h < 18 ? "Goedemiddag" : "Goedenavond";
  document.getElementById("greeting").textContent = greeting + name;

  // quote van de dag: stabiel per datum
  const dayNum = Math.floor(new Date(dateKey() + "T12:00:00").getTime() / 86400000);
  const q = QUOTES[dayNum % QUOTES.length];
  document.getElementById("quote-text").textContent = "“" + q.text + "”";
  document.getElementById("quote-author").textContent = "— " + q.author;
}

/* ---------- bedtijd-countdown ---------- */
function renderBedtime() {
  const [bh, bm] = state.settings.bedtime.split(":").map(Number);
  const now = new Date();
  const bed = new Date(now);
  bed.setHours(bh, bm, 0, 0);
  if (bed <= now) bed.setDate(bed.getDate() + 1);
  const mins = Math.round((bed - now) / 60000);
  const chip = document.getElementById("bedtime-chip");
  const label = document.getElementById("bedtime-countdown");

  if (mins > 12 * 60) {
    label.textContent = `bedtijd ${state.settings.bedtime}`;
    chip.classList.remove("soon");
  } else if (mins > 60) {
    label.textContent = `nog ${Math.floor(mins / 60)}u ${mins % 60}m`;
    chip.classList.toggle("soon", mins <= 90);
  } else {
    label.textContent = mins > 0 ? `nog ${mins} min! 🛏️` : "bedtijd!";
    chip.classList.add("soon");
  }
}
setInterval(renderBedtime, 30000);

/* bedtijd-melding (1 uur vooraf), alleen terwijl de app open is */
let lastNotifiedKey = null;
function checkBedtimeNotification() {
  if (!state.settings.notify || !("Notification" in window) || Notification.permission !== "granted") return;
  const [bh, bm] = state.settings.bedtime.split(":").map(Number);
  const now = new Date();
  const bed = new Date(now);
  bed.setHours(bh, bm, 0, 0);
  const mins = Math.round((bed - now) / 60000);
  const key = dateKey() + "-winddown";
  if (mins > 0 && mins <= 60 && lastNotifiedKey !== key) {
    lastNotifiedKey = key;
    new Notification("🌙 Wind-down tijd", {
      body: `Over ${mins} min is het bedtijd. Dim het licht, leg je telefoon weg. Elke dag begint de avond ervoor.`,
      icon: "icons/icon-192.png",
    });
  }
}
setInterval(checkBedtimeNotification, 60000);

/* ---------- protocol ---------- */
function renderProtocol() {
  const wrap = document.getElementById("protocol-cards");
  wrap.innerHTML = PROTOCOL.map(card => `
    <div class="protocol-card" style="border-left-color:${card.color}">
      <h3>${card.icon} ${card.title}</h3>
      <ul>${card.points.map(p => `<li>${p}</li>`).join("")}</ul>
    </div>`).join("");

  document.getElementById("meal-cards").innerHTML = MEALS.map(m => `
    <details class="fold-card">
      <summary>
        <span class="fold-icon">${m.icon}</span>
        <span class="fold-title">${m.name}<span class="fold-tag">${m.time}</span></span>
      </summary>
      <div class="fold-body">
        <p>${m.desc}</p>
        <ul>${m.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
        <p class="fold-prep">👨‍🍳 ${m.prep}</p>
      </div>
    </details>`).join("");

  document.getElementById("beginner-cards").innerHTML = BEGINNER_GUIDE.map(g => `
    <details class="fold-card">
      <summary>
        <span class="fold-icon">${g.icon}</span>
        <span class="fold-title">${g.title}</span>
      </summary>
      <div class="fold-body">
        <ul>${g.points.map(p => `<li>${p}</li>`).join("")}</ul>
      </div>
    </details>`).join("");

  document.getElementById("exercise-cards").innerHTML = EXERCISES.map(x => `
    <details class="fold-card exercise-card">
      <summary><span class="fold-title">${x.name}</span></summary>
      <div class="fold-body">
        <p>${x.how}</p>
        ${x.gym ? `<p class="exercise-alt">🏋️ In de gym: ${x.gym}</p>` : ""}
        ${x.easier ? `<p class="exercise-easier">🟢 Makkelijker: ${x.easier}</p>` : ""}
      </div>
    </details>`).join("");

  document.getElementById("train-legend").innerHTML = Object.values(TRAIN_TYPES).map(t => `
    <span class="legend-item"><span class="legend-ico" style="color:${t.color}">${t.svg}</span>${t.label}</span>`).join("");

  document.getElementById("training-cards").innerHTML = TRAINING_WEEK.map(d => `
    <details class="fold-card">
      <summary>
        <span class="fold-title">${d.day} — ${d.focus}<span class="fold-tag">${d.duration}</span></span>
        <span class="day-icons">${d.blocks.map(b => `<span style="color:${TRAIN_TYPES[b.type].color}">${TRAIN_TYPES[b.type].svg}</span>`).join("")}</span>
      </summary>
      <div class="fold-body">
        ${d.blocks.map(b => {
          const t = TRAIN_TYPES[b.type];
          return `
          <div class="train-block">
            <span class="train-ico" style="color:${t.color};background:${t.color}1f">${t.svg}</span>
            <div class="train-main">
              <div class="train-head"><strong>${t.label}</strong><span class="train-time">${b.time}</span></div>
              <p class="train-desc">${b.desc}</p>
            </div>
          </div>`;
        }).join("")}
      </div>
    </details>`).join("");

  document.getElementById("training-tips").innerHTML = `
    <h3>💡 Bryans trainingsregels</h3>
    <ul>${TRAINING_TIPS.map(t => `<li>${t}</li>`).join("")}</ul>`;
}

/* ---------- voortgang ---------- */
function renderProgress() {
  document.getElementById("stat-streak").textContent = currentStreak();
  document.getElementById("stat-best").textContent = bestStreak();

  const last7 = Array.from({ length: 7 }, (_, i) => dayScore(dateKey(daysAgo(i))));
  const avg = Math.round(last7.reduce((a, b) => a + b, 0) / 7);
  document.getElementById("stat-avg").textContent = avg + "%";

  // 14-daagse grafiek
  const chart = document.getElementById("history-chart");
  const dayNames = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  chart.innerHTML = "";
  for (let i = 13; i >= 0; i--) {
    const d = daysAgo(i);
    const pct = dayScore(dateKey(d));
    chart.insertAdjacentHTML("beforeend", `
      <div class="history-bar-wrap">
        <div class="history-bar-track">
          <div class="history-bar ${pct === 0 ? "empty" : ""}" style="height:${Math.max(pct, 4)}%"></div>
        </div>
        <span class="history-day">${i === 0 ? "nu" : dayNames[d.getDay()]}</span>
      </div>`);
  }

  // per categorie, laatste 7 dagen
  const catWrap = document.getElementById("category-bars");
  catWrap.innerHTML = "";
  for (const [catId, cat] of Object.entries(CATEGORIES)) {
    const habits = activeHabits().filter(h => h.cat === catId);
    if (!habits.length) continue;
    let done = 0, total = 0;
    for (let i = 0; i < 7; i++) {
      const checked = (state.days[dateKey(daysAgo(i))] || { habits: [] }).habits;
      total += habits.length;
      done += habits.filter(h => checked.includes(h.id)).length;
    }
    const pct = total ? Math.round((done / total) * 100) : 0;
    catWrap.insertAdjacentHTML("beforeend", `
      <div class="cat-bar-row">
        <div class="cat-bar-label"><span>${cat.icon} ${cat.name}</span><span>${pct}%</span></div>
        <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${pct}%;background:${cat.color}"></div></div>
      </div>`);
  }
}

/* ---------- instellingen ---------- */
function renderSettings() {
  document.getElementById("setting-name").value = state.settings.name;
  document.getElementById("setting-bedtime").value = state.settings.bedtime;
  document.getElementById("setting-eatend").value = state.settings.eatEnd;
  document.getElementById("setting-notify").checked = state.settings.notify;

  const toggles = document.getElementById("habit-toggles");
  toggles.innerHTML = HABITS.map(h => `
    <label class="setting-row">
      <span>${CATEGORIES[h.cat].icon} ${h.title}</span>
      <input type="checkbox" data-toggle-habit="${h.id}" ${state.settings.disabledHabits.includes(h.id) ? "" : "checked"}>
    </label>`).join("");
}

document.getElementById("setting-name").addEventListener("change", (e) => {
  state.settings.name = e.target.value.trim();
  saveState(); renderHeader(); renderScore();
});
document.getElementById("setting-bedtime").addEventListener("change", (e) => {
  state.settings.bedtime = e.target.value || "22:00";
  saveState(); renderBedtime();
});
document.getElementById("setting-eatend").addEventListener("change", (e) => {
  state.settings.eatEnd = e.target.value || "18:00";
  saveState();
});
document.getElementById("setting-notify").addEventListener("change", async (e) => {
  if (e.target.checked) {
    if (!("Notification" in window)) {
      showToast("Meldingen worden niet ondersteund op dit apparaat");
      e.target.checked = false;
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm !== "granted") {
      showToast("Meldingen zijn geblokkeerd in je browser");
      e.target.checked = false;
      return;
    }
    showToast("🌙 Je krijgt een seintje 1 uur vóór bedtijd");
  }
  state.settings.notify = e.target.checked;
  saveState();
});

document.getElementById("habit-toggles").addEventListener("change", (e) => {
  const id = e.target.dataset.toggleHabit;
  if (!id) return;
  const list = state.settings.disabledHabits;
  if (e.target.checked) state.settings.disabledHabits = list.filter(x => x !== id);
  else if (!list.includes(id)) list.push(id);
  saveState(); renderHabits(); renderScore();
});

document.getElementById("reset-data").addEventListener("click", () => {
  if (confirm("Weet je het zeker? Al je voortgang en instellingen worden gewist.")) {
    localStorage.removeItem(STORE_KEY);
    state = defaultState();
    renderAll();
    showToast("Alles gewist — frisse start!");
  }
});

/* ---------- navigatie ---------- */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t === tab));
    document.querySelectorAll(".view").forEach(v =>
      v.classList.toggle("active", v.id === "view-" + tab.dataset.view));
    if (tab.dataset.view === "voortgang") renderProgress();
    window.scrollTo({ top: 0 });
  });
});

/* ---------- toast ---------- */
let toastTimer;
function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
}

/* ---------- init ---------- */
function renderAll() {
  renderHeader();
  renderHabits();
  renderScore();
  renderBedtime();
  renderProtocol();
  renderProgress();
  renderSettings();
}
renderAll();

/* dag-overgang: ververs bij terugkeer naar de app */
let renderedDay = dateKey();
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && renderedDay !== dateKey()) {
    renderedDay = dateKey();
    renderAll();
  }
});

/* service worker + automatische update: zodra een nieuwe versie
   actief wordt, herlaadt de app zichzelf één keer zodat je direct
   de nieuwste inhoud ziet (geen dubbele herstart meer nodig) */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () =>
    navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }));

  let hadController = !!navigator.serviceWorker.controller;
  let refreshed = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController) { hadController = true; return; } // allereerste installatie
    if (refreshed) return;
    refreshed = true;
    location.reload();
  });
}
