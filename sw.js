const CACHE = 'sommelier-world-v1';
const FILES = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
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
  // Per le API esterne usa sempre la rete
  if(e.request.url.includes('groq.com') || 
     e.request.url.includes('unsplash.com') ||
     e.request.url.includes('cartocdn.com') ||
     e.request.url.includes('arcgisonline.com')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
