/* Blueprint Coach — service worker
   Cache-first voor de app-shell, zodat de app volledig offline werkt. */

const VERSION = "v10";
const CACHE = "focus-platform-" + VERSION;
const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/data.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./game/",
  "./game/index.html",
  "./game/game.js",
  "./game/vendor/three.module.min.js",
];

self.addEventListener("install", (e) => {
  // ?v=… dwingt verse bestanden af langs de CDN-cache van GitHub Pages;
  // bij ophalen matchen we met ignoreSearch, dus de query stoort niet
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS.map((a) => a + "?v=" + VERSION))));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(
      (cached) =>
        cached ||
        fetch(e.request).then((res) => {
          // alleen same-origin responses bijcachen
          if (res.ok && new URL(e.request.url).origin === location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
    )
  );
});
