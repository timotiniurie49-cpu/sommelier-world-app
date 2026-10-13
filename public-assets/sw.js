/**
 * SOMMELIER WORLD — Service Worker DISATTIVATO
 * Questo SW si auto-disattiva e pulisce tutta la cache
 */

const CACHE_NAME = 'sw-disabled-20261013';

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        return caches.delete(k);
      }));
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        return caches.delete(k);
      }));
    }).then(function() {
      return self.clients.claim();
    }).then(function() {
      return self.registration.unregister();
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
