/**
 * SOMMELIER WORLD — Service Worker v2.0
 * Strategia: Stale-While-Revalidate
 * - Serve subito dalla cache (velocità)
 * - Aggiorna in background (sempre fresco)
 * - Rispetta il versionamento ?v= dei file JS
 */

const CACHE_NAME = 'sw-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
];

/* ── Install: precache solo index ── */
self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS).catch(function() {});
    })
  );
});

/* ── Activate: elimina cache vecchi ── */
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

/* ── Fetch: Stale-While-Revalidate ── */
self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);

  /* Richieste API/Worker → bypass cache sempre */
  if (url.hostname.includes('workers.dev') ||
      url.hostname.includes('groq.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('formspree.io') ||
      url.hostname.includes('rss') ||
      url.hostname.includes('decanter') ||
      url.hostname.includes('thedrinksbusiness')) {
    return; /* Lascia passare senza cache */
  }

  /* File JS con versione ?v=XXX → NETWORK FIRST (sempre aggiornato) */
  if (url.search.includes('v=') && (
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css'))) {
    e.respondWith(
      fetch(e.request).then(function(response) {
        if (response.ok) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      }).catch(function() {
        return caches.match(e.request);
      })
    );
    return;
  }

  /* Tutto il resto → Stale-While-Revalidate */
  e.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(e.request).then(function(cached) {
        var networkFetch = fetch(e.request).then(function(response) {
          if (response.ok) {
            cache.put(e.request, response.clone());
          }
          return response;
        }).catch(function() {
          return cached;
        });
        /* Ritorna subito il cached, aggiorna in background */
        return cached || networkFetch;
      });
    })
  );
});

/* ── Message: force update da index.html ── */
self.addEventListener('message', function(e) {
  if (e.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (e.data === 'CLEAR_CACHE') {
    caches.keys().then(function(keys) {
      keys.forEach(function(k) { caches.delete(k); });
    });
  }
});
