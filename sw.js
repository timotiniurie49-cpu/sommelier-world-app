/* SOMMELIER WORLD — Service Worker v6
   Aggiornato: forza reset totale cache */
const CACHE = 'sommelier-v6';

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(['./index.html', './manifest.json']);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  /* Sempre rete per: API, patch JS, JSON dinamici */
  if (url.includes('railway.app') ||
      url.includes('groq.com') ||
      url.includes('googleapis') ||
      url.includes('sw-patch-v') ||
      url.includes('api/') ||
      url.includes('reset.html')) {
    e.respondWith(fetch(e.request));
    return;
  }
  /* Network-first per tutto il resto */
  e.respondWith(
    fetch(e.request).then(function(res) {
      if (res.ok) {
        var clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
      }
      return res;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});
