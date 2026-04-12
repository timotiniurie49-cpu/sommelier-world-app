/* SOMMELIER WORLD — sw.js — Zero Cache — sw-final-v1 */
const SW_VERSION = 'sw-final-v1';

self.addEventListener('install', function(e){
  console.log('[SW] install', SW_VERSION);
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  console.log('[SW] activate', SW_VERSION, '— elimino cache precedenti');
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).catch(function(){
      return new Response('Offline', { status: 503 });
    })
  );
});
