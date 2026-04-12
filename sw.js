/**
 * SOMMELIER WORLD — sw.js v23
 * Service Worker ZERO CACHE
 * Passa tutto al network, non mette nulla in cache
 */
const SW_VERSION = 'sw23-tabularasa';
console.log('[SW]', SW_VERSION, 'installato');

/* Installazione: salta waiting immediato */
self.addEventListener('install', function(e){
  console.log('[SW] Install', SW_VERSION);
  self.skipWaiting();
});

/* Attivazione: elimina TUTTE le cache vecchie */
self.addEventListener('activate', function(e){
  console.log('[SW] Activate', SW_VERSION);
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        console.log('[SW] Elimino cache:', k);
        return caches.delete(k);
      }));
    }).then(function(){
      return self.clients.claim();
    })
  );
});

/* Fetch: SEMPRE dal network, mai dalla cache */
self.addEventListener('fetch', function(e){
  /* Ignora richieste non-GET */
  if(e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .catch(function(err){
        console.warn('[SW] Fetch fallito:', e.request.url, err.message);
        return new Response('Offline - riprova più tardi', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});
