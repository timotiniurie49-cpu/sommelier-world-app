/**
 * SOMMELIER WORLD — Service Worker v10-FORCE
 * Cancella TUTTO il cache precedente e forza ricarica file aggiornati
 */

const CACHE_NAME = 'sw-v17';
const STATIC_ASSETS = ['/', '/index.html'];

/* ── Install: cancella TUTTI i cache vecchi ── */
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        console.log('[SW v10] Deleting old cache:', k);
        return caches.delete(k);
      }));
    }).then(function() {
      return caches.open(CACHE_NAME).then(function(cache) {
        return cache.addAll(STATIC_ASSETS);
      });
    })
  );
});

/* ── Activate: prendi controllo immediato ── */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
  /* Aggiornamento silenzioso — nessun reload automatico */
});

/* ── Fetch: NETWORK FIRST per JS, Stale-While-Revalidate per il resto ── */
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  /* Ignora richieste non-GET e cross-origin */
  if (event.request.method !== 'GET') return;
  if (url.origin !== location.origin && !url.hostname.includes('sommelierworld')) return;

  /* File JS con ?v= → SEMPRE rete (mai cache) */
  if (url.search.includes('v=') || url.pathname.endsWith('.js')) {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request);
      })
    );
    return;
  }

  /* index.html → SEMPRE rete */
  if (url.pathname === '/' || url.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clone); });
        return response;
      }).catch(function() {
        return caches.match(event.request);
      })
    );
    return;
  }

  /* Tutto il resto: Stale-While-Revalidate */
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function(cached) {
        var networkFetch = fetch(event.request).then(function(response) {
          if (response && response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(function() { return cached; });
        return cached || networkFetch;
      });
    })
  );
});
