/* ============================================================
   Webslinger — mobiele 3D-webswing game
   Slinger als een spin van flat naar flat door een eindeloze
   nachtstad. Houd het scherm vast om een web te schieten,
   laat los om te vliegen. Pure Three.js, geen verdere deps.
   ============================================================ */

import * as THREE from "./vendor/three.module.min.js";

/* ===== Afstemming ===== */
const WALL_X = 18;        // x-positie van de binnengevels
const XMAX = 16.4;        // speler blijft binnen de straat-canyon
const GRAV = 27;          // zwaartekracht (m/s²)
const PUMP = 9;           // voorwaartse "zwaai-pomp" terwijl je hangt
const REEL = 3.0;         // web wordt langzaam ingehaald (m/s)
const DRAG = 0.05;        // luchtweerstand per seconde
const VMAX = 55;          // maximumsnelheid
const START_Y = 34;       // starthoogte
const ROPE_MIN = 7, ROPE_MAX = 40;
const VIEW_AHEAD = 270;   // zoveel meter stad vooruit genereren
const BEST_KEY = "webslinger_best";

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rand = (a, b) => a + Math.random() * (b - a);

/* ===== Renderer & scène ===== */
const canvas = document.getElementById("game");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const scene = new THREE.Scene();
const SKY = new THREE.Color(0x101a33);
scene.background = SKY;
scene.fog = new THREE.Fog(SKY, 45, 235);

const camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, 0.1, 400);
camera.position.set(0, 30, 12);

scene.add(new THREE.HemisphereLight(0x44558a, 0x0a0d18, 1.0));
const sun = new THREE.DirectionalLight(0x9fb0ff, 0.7);
sun.position.set(-30, 80, 20);
scene.add(sun);

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

/* ===== Sterrenhemel (volgt de camera in z) ===== */
const stars = (() => {
  const n = 350, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = rand(-350, 350);
    pos[i * 3 + 1] = rand(60, 320);
    pos[i * 3 + 2] = rand(-350, 100);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xbcd0ff, size: 1.4, sizeAttenuation: false, fog: false }));
  p.frustumCulled = false;
  scene.add(p);
  return p;
})();

/* ===== Texturen (procedureel, geen assets nodig) ===== */
function facadeTexture(hue) {
  const c = document.createElement("canvas");
  c.width = 128; c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = `hsl(${hue}, 22%, 11%)`;
  g.fillRect(0, 0, 128, 512);
  // ramen: 6 kolommen, 16 verdiepingen per tegel
  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 6; col++) {
      const lit = Math.random() < 0.34;
      g.fillStyle = lit
        ? (Math.random() < 0.7 ? `hsl(${rand(36, 52)}, 90%, ${rand(55, 70)}%)` : `hsl(${rand(170, 200)}, 80%, 62%)`)
        : `hsl(${hue}, 18%, ${rand(5, 9)}%)`;
      g.fillRect(8 + col * 20, 10 + row * 31, 12, 18);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function streetTexture() {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 256; // één tegel = 10 m straat
  const g = c.getContext("2d");
  g.fillStyle = "#141823";
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = "#1b2030"; // stoepen
  g.fillRect(0, 0, 34, 256); g.fillRect(222, 0, 34, 256);
  g.strokeStyle = "#2a3350"; g.lineWidth = 3;
  g.beginPath(); g.moveTo(36, 0); g.lineTo(36, 256); g.moveTo(220, 0); g.lineTo(220, 256); g.stroke();
  g.fillStyle = "#9aa8cf"; // middenstreep
  g.fillRect(124, 20, 8, 90); g.fillRect(124, 150, 8, 90);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ===== Straat ===== */
const STREET_LEN = 420;
const street = new THREE.Mesh(
  new THREE.PlaneGeometry(WALL_X * 2 + 0.5, STREET_LEN),
  new THREE.MeshLambertMaterial({ map: streetTexture() })
);
street.material.map.repeat.set(1, STREET_LEN / 10);
street.rotation.x = -Math.PI / 2;
scene.add(street);

/* ===== Flats (gepoolde meshes) ===== */
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const roofMat = new THREE.MeshLambertMaterial({ color: 0x10141f });
const buildings = []; // actieve flats: { mesh, sideTex, side, x, z, w, d, h }
const pool = [];

function makeSlot() {
  const tex = facadeTexture(rand(200, 250));
  const sideMat = new THREE.MeshLambertMaterial({
    map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.42,
  });
  // [+x, -x, +y(top), -y, +z, -z]
  const mesh = new THREE.Mesh(boxGeo, [sideMat, sideMat, roofMat, roofMat, sideMat, sideMat]);
  scene.add(mesh);
  return { mesh, sideTex: tex };
}

function spawnBuilding(side, zNear) {
  const slot = pool.pop() || makeSlot();
  const w = rand(12, 16), d = rand(16, 30), h = rand(28, 74);
  const b = {
    ...slot, side,
    x: side * (WALL_X + w / 2),
    z: zNear - d / 2,
    w, d, h,
  };
  b.mesh.visible = true;
  b.mesh.scale.set(w, h, d);
  b.mesh.position.set(b.x, h / 2, b.z);
  b.sideTex.repeat.set(2, Math.max(1, Math.round(h / 30)));
  buildings.push(b);
  return zNear - d - rand(3, 9); // volgende zNear (incl. steegje)
}

const nextZ = { "-1": 40, "1": 28 }; // licht verspringend per kant
function updateCity(focusZ) {
  for (const s of [-1, 1]) {
    while (nextZ[s] > focusZ - VIEW_AHEAD) nextZ[s] = spawnBuilding(s, nextZ[s]);
  }
  for (let i = buildings.length - 1; i >= 0; i--) {
    const b = buildings[i];
    if (b.z - b.d / 2 > focusZ + 50) { // ver achter de camera
      b.mesh.visible = false;
      pool.push({ mesh: b.mesh, sideTex: b.sideTex });
      buildings.splice(i, 1);
    }
  }
  // straat meeschuiven in stappen van één textuurtegel (10 m) — naadloos
  street.position.z = Math.round(focusZ / 10) * 10 - STREET_LEN / 4;
}

/* ===== Speler (mini-Spider, opgebouwd uit primitieven) ===== */
const player = new THREE.Group();
{
  const red = new THREE.MeshLambertMaterial({ color: 0xd9342b });
  const blue = new THREE.MeshLambertMaterial({ color: 0x2547c9 });
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.32), red);
  torso.position.y = 0.45;
  const hips = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.3), blue);
  hips.position.y = 0.0;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 12, 10), red);
  head.position.y = 0.98;
  player.add(torso, hips, head);
  for (const s of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.62, 0.15), blue);
    arm.position.set(s * 0.4, 0.42, 0);
    arm.rotation.z = s * 0.35;
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.7, 0.17), blue);
    leg.position.set(s * 0.16, -0.48, 0);
    leg.rotation.x = -s * 0.25;
    player.add(arm, leg);
  }
}
scene.add(player);

/* ===== Webdraad ===== */
const webGeo = new THREE.BufferGeometry();
webGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
const web = new THREE.Line(webGeo, new THREE.LineBasicMaterial({ color: 0xf0f4ff }));
web.frustumCulled = false;
web.visible = false;
scene.add(web);

/* ===== Crash-deeltjes ===== */
const debris = [];
{
  const mats = [0xd9342b, 0x2547c9, 0xe8edf7].map((c) => new THREE.MeshBasicMaterial({ color: c }));
  for (let i = 0; i < 16; i++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.16), mats[i % 3]);
    m.visible = false;
    scene.add(m);
    debris.push({ mesh: m, v: new THREE.Vector3() });
  }
}
function burst(at) {
  for (const d of debris) {
    d.mesh.visible = true;
    d.mesh.position.copy(at);
    d.v.set(rand(-8, 8), rand(3, 13), rand(-8, 8));
  }
}

/* ===== Geluid (WebAudio, optioneel) ===== */
let AC = null;
function initAudio() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch { /* stil */ } }
  AC?.resume?.();
}
function blip(f0, f1, dur, vol, type = "sine") {
  if (!AC || AC.state !== "running") return;
  const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime;
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(AC.destination);
  o.start(t); o.stop(t + dur);
}
const sndThwip = () => blip(1400, 280, 0.09, 0.12);
const sndRelease = () => blip(300, 700, 0.1, 0.06);
const sndCrash = () => blip(110, 38, 0.4, 0.3, "square");

/* ===== Spelstatus ===== */
const pos = new THREE.Vector3(0, 26, 0);
const vel = new THREE.Vector3();
const anchor = new THREE.Vector3();
let attached = false, ropeLen = 0, webProg = 0;
let state = "menu"; // menu | playing | dead
let startZ = 0, runStart = 0, deadAt = 0;
let best = parseInt(localStorage.getItem(BEST_KEY) || "0", 10) || 0;

const $ = (id) => document.getElementById(id);
$("best").textContent = best + " m";
$("menu-best").textContent = best > 0 ? `🏆 Jouw record: ${best} m` : "Nog geen record — zet de eerste!";

/* ===== Webanker zoeken =====
   Kies de flat aan de gevraagde kant die het dichtst bij het
   ideale ankerpunt (schuin omhoog, vooruit) ligt. Geen geschikte
   flat (speler boven alles uit)? Dan een onzichtbaar "lucht-anker"
   zodat je nooit hulpeloos valt. */
const _ideal = new THREE.Vector3(), _cand = new THREE.Vector3();
function findAnchor(side, out) {
  _ideal.set(side * WALL_X, pos.y + 20, pos.z - 26);
  let bestD = Infinity, found = false;
  for (const b of buildings) {
    if (b.side !== side) continue;
    const zFar = b.z - b.d / 2, zNear = b.z + b.d / 2;
    if (zFar > pos.z - 6) continue;      // flat moet vóór de speler liggen
    if (b.h < pos.y + 6) continue;       // en boven de speler uitsteken
    _cand.set(
      side * WALL_X,
      clamp(pos.y + 22, pos.y + 6, b.h),
      clamp(_ideal.z, zFar + 1, zNear - 1)
    );
    const d = _cand.distanceToSquared(_ideal);
    if (d < bestD) { bestD = d; out.copy(_cand); found = true; }
  }
  if (!found) out.set(side * (WALL_X - 5), pos.y + 18, pos.z - 24);
  return out;
}

function shootWeb(side) {
  findAnchor(side, anchor);
  ropeLen = clamp(pos.distanceTo(anchor) * 0.99, ROPE_MIN, ROPE_MAX);
  attached = true;
  webProg = 0;
  web.visible = true;
  sndThwip();
}

function releaseWeb(silent) {
  if (attached && !silent) sndRelease();
  attached = false;
  web.visible = false;
}

/* ===== Invoer ===== */
let activePointer = null;
canvas.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  initAudio();
  if (state !== "playing" || activePointer !== null) return;
  activePointer = e.pointerId;
  shootWeb(e.clientX < innerWidth / 2 ? -1 : 1);
});
function pointerEnd(e) {
  if (e.pointerId !== activePointer) return;
  activePointer = null;
  if (state === "playing") releaseWeb();
}
addEventListener("pointerup", pointerEnd);
addEventListener("pointercancel", pointerEnd);
// desktop: spatiebalk slingert om-en-om
let keySide = 1;
addEventListener("keydown", (e) => {
  if (e.code !== "Space" || e.repeat || state !== "playing") return;
  initAudio();
  keySide = -keySide;
  shootWeb(keySide);
});
addEventListener("keyup", (e) => {
  if (e.code === "Space" && state === "playing") releaseWeb();
});

/* ===== Start / herstart / crash ===== */
function startRun() {
  pos.set(0, START_Y, pos.z);
  vel.set(0, -2, -16);
  releaseWeb(true);
  activePointer = null;
  startZ = pos.z;
  runStart = performance.now();
  for (const d of debris) d.mesh.visible = false;
  player.visible = true;
  state = "playing";
  $("menu").classList.add("hidden");
  $("gameover").classList.add("hidden");
  $("hint").classList.add("show");
}

function crash() {
  state = "dead";
  deadAt = performance.now();
  releaseWeb(true);
  player.visible = false;
  burst(pos);
  sndCrash();
  navigator.vibrate?.(120);

  const dist = Math.max(0, Math.round(startZ - pos.z));
  const isRecord = dist > best;
  if (isRecord) {
    best = dist;
    localStorage.setItem(BEST_KEY, String(best));
    $("best").textContent = best + " m";
  }
  $("go-dist").innerHTML = `${dist} <small>m</small>`;
  const rec = $("go-record");
  rec.textContent = isRecord ? "🏆 Nieuw record!" : `Record: ${best} m`;
  rec.classList.toggle("new", isRecord);
  setTimeout(() => {
    if (state === "dead") $("gameover").classList.remove("hidden");
  }, 750);
}

$("start-btn").addEventListener("click", () => { initAudio(); startRun(); });
$("retry-btn").addEventListener("click", () => { initAudio(); startRun(); });
$("gameover").addEventListener("pointerdown", (e) => {
  if (e.target.id === "retry-btn") return; // knop heeft eigen handler
  if (performance.now() - deadAt > 600) { initAudio(); startRun(); }
});

/* ===== Fysica =====
   Semi-impliciete Euler met substappen; aan het web wordt de
   positie op de touwbol geprojecteerd en de uitgaande radiale
   snelheid verwijderd (slinger-constraint). */
const _d = new THREE.Vector3();
function physics(dt) {
  const steps = 3, h = dt / steps;
  for (let i = 0; i < steps; i++) {
    vel.y -= GRAV * h;
    if (attached) {
      vel.z -= PUMP * h;                       // zwaai-pomp naar voren
      ropeLen = Math.max(ROPE_MIN, ropeLen - REEL * h); // web inhalen
    }
    pos.addScaledVector(vel, h);
    if (attached) {
      _d.subVectors(pos, anchor);
      const L = _d.length();
      if (L > ropeLen) {
        _d.divideScalar(L);
        pos.copy(anchor).addScaledVector(_d, ropeLen);
        const vr = vel.dot(_d);
        if (vr > 0) vel.addScaledVector(_d, -vr);
      }
    }
  }
  vel.multiplyScalar(Math.max(0, 1 - DRAG * dt));
  const sp = vel.length();
  if (sp > VMAX) vel.multiplyScalar(VMAX / sp);
  // langs de gevels schuren in plaats van erdoorheen
  if (Math.abs(pos.x) > XMAX) {
    pos.x = Math.sign(pos.x) * XMAX;
    vel.x *= -0.3;
  }
  if (pos.y < 1.1) crash();
}

/* ===== Weergave per frame ===== */
const _look = new THREE.Vector3(), _camTo = new THREE.Vector3();
function draw(dt, now) {
  // speler-pose: neus in de vliegrichting, lichte roll in bochten
  player.position.copy(pos);
  if (vel.lengthSq() > 4) {
    _look.copy(pos).add(vel);
    player.lookAt(_look);
    player.rotateZ(clamp(-vel.x * 0.03, -0.6, 0.6));
    if (attached) player.rotateX(-0.35);
  }

  // webdraad (schiet in ~80 ms uit)
  if (web.visible) {
    webProg = Math.min(1, webProg + dt / 0.08);
    const a = webGeo.attributes.position.array;
    a[0] = pos.x; a[1] = pos.y + 0.7; a[2] = pos.z;
    a[3] = pos.x + (anchor.x - pos.x) * webProg;
    a[4] = pos.y + 0.7 + (anchor.y - pos.y - 0.7) * webProg;
    a[5] = pos.z + (anchor.z - pos.z) * webProg;
    webGeo.attributes.position.needsUpdate = true;
  }

  // crash-deeltjes
  if (state === "dead") {
    for (const d of debris) {
      if (!d.mesh.visible) continue;
      d.v.y -= GRAV * 0.6 * dt;
      d.mesh.position.addScaledVector(d.v, dt);
      d.mesh.rotation.x += dt * 7; d.mesh.rotation.y += dt * 9;
      if (d.mesh.position.y < 0.1) { d.mesh.position.y = 0.1; d.v.set(0, 0, 0); }
    }
  }

  // achtervolg-camera
  const k = 1 - Math.exp(-5 * dt);
  _camTo.set(pos.x * 0.55, pos.y + 4.5, pos.z + 11);
  if (state === "dead") _camTo.y = Math.max(_camTo.y, 8);
  camera.position.lerp(_camTo, k);
  camera.lookAt(pos.x * 0.8, pos.y + 1.2, pos.z - 10);
  stars.position.z = camera.position.z;

  // HUD
  if (state === "playing") {
    $("dist").textContent = Math.max(0, Math.round(startZ - pos.z)) + " m";
    if (now - runStart > 5000) $("hint").classList.remove("show");
  }
}

/* ===== Hoofdlus ===== */
let prev = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (now - prev) / 1000);
  prev = now;

  if (state === "menu") {
    // rustige fly-through achter het startscherm
    pos.z -= 8 * dt;
    pos.y = 26;
    pos.x = Math.sin(now / 2600) * 6;
    vel.set(0, 0, -8);
    player.visible = false;
  } else if (state === "playing") {
    physics(dt);
  }

  updateCity(pos.z);
  draw(dt, now);
  renderer.render(scene, camera);
}
requestAnimationFrame(loop);
