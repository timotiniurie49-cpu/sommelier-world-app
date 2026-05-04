/**
 * SOMMELIER WORLD — Service Worker v21-FINAL
 * Strategia: JS sempre dalla rete, HTML sempre dalla rete
 * Cache SOLO per asset statici (icone, font) 
 */

const CACHE_NAME = 'sw-v22';

/* ── Install: cancella TUTTI i cache precedenti ── */
self.addEventListener('install', function(event) {
  self.skipWaiting(); /* Prendi controllo immediatamente */
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        console.log('[SW v21] Elimino cache vecchio:', k);
        return caches.delete(k);
      }));
    })
  );
});

/* ── Activate: claim immediato + pulizia ── */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

/* ── Fetch: NETWORK FIRST per tutto ── */
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  /* Ignora richieste non-GET */
  if(event.request.method !== 'GET') return;

  /* Ignora richieste cross-origin (worker Cloudflare, API, CDN) */
  if(url.origin !== location.origin) return;

  /* JS, HTML → SEMPRE dalla rete (mai da cache) */
  if(url.pathname.endsWith('.js') ||
     url.pathname.endsWith('.html') ||
     url.pathname === '/') {
    event.respondWith(
      fetch(event.request, {cache: 'no-cache'}).catch(function() {
        return caches.match(event.request);
      })
    );
    return;
  }

  /* PNG, ico, woff → cache OK */
  if(url.pathname.match(/\.(png|ico|woff2?|svg)$/)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(cached) {
          return cached || fetch(event.request).then(function(response) {
            if(response && response.status === 200)
              cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  /* Tutto il resto: network con fallback cache */
  event.respondWith(
    fetch(event.request, {cache: 'no-store'}).catch(function(){
      return caches.match(event.request);
    })
  );
});
