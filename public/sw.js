// Very lightweight, caches shell only. You can remove this file if you don’t want SW.
const CACHE = 'mindsight-v1';
const ASSETS = ['/', '/index.html', '/manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k))))
    )
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  // Cache-first for same-origin; fall back to network.
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
