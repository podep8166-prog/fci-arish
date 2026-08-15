/* ===================================================================
   SERVICE WORKER — caches the static app shell only.
   Bump CACHE_NAME whenever shell assets change to force a refresh.
   =================================================================== */
const CACHE_NAME = 'fci-arish-shell-v1';
const SHELL_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './css/departments.css',
  './css/animations.css',
  './css/responsive.css',
  './js/app.js',
  './js/navigation.js',
  './js/animations.js',
  './js/departments.js',
  './js/interactions.js',
  './js/content.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => cached);
    })
  );
});
