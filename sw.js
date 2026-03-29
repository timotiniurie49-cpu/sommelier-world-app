const CACHE = 'sommelier-world-v2'; // Cambiato a v2 per svuotare la cache
const FILES = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Permette le chiamate al tuo server Railway e a Gemini senza bloccarle
  if(e.request.url.includes('railway.app') || e.request.url.includes('google')) {
    return fetch(e.request);
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
