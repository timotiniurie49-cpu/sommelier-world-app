/* SOMMELIER WORLD — Service Worker v99 ZERO CACHE
   Non memorizza nulla — ogni file viene sempre scaricato fresco dalla rete */
self.addEventListener('install', function() { self.skipWaiting(); });
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    }).then(function() { return self.clients.claim(); })
  );
});
self.addEventListener('fetch', function(e) {
  e.respondWith(fetch(e.request));
});
