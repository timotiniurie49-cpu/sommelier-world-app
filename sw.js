/* SOMMELIER WORLD — Service Worker v5
   Aggiornato: forza reset della cache vecchia */

const CACHE = 'sommelier-world-v5';

/* Metti in cache SOLO index.html e manifest — NON i file JS
   così ogni aggiornamento dei patch viene scaricato fresco */
const FILES = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting(); /* Attiva subito senza aspettare */
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => {
        console.log('[SW] Elimino cache vecchia:', k);
        return caches.delete(k);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  /* Sempre rete (no cache) per: Railway, Google, patch JS, JSON */
  if (
    url.includes('railway.app') ||
    url.includes('googleapis') ||
    url.includes('groq.com') ||
    url.includes('sw-patch-v') ||    /* tutti i patch JS */
    url.includes('articles.json') ||
    url.includes('api/')
  ) {
    e.respondWith(fetch(e.request));
    return;
  }

  /* Per tutto il resto: rete prima, cache come fallback */
  e.respondWith(
    fetch(e.request)
      .then(res => {
        /* Aggiorna la cache con la risposta fresca */
        if (res.ok) {
          var clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
