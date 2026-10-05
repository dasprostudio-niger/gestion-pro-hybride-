const CACHE_NAME = 'gestion-pro-hybride-v1.0.0';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './premium.js',
  './qrcode.min.js',
  './html5-qrcode.min.js',
  './html2canvas.min.js',
  './logo.png',
  './launchericon-48x48.png',
  './launchericon-72x72.png',
  './launchericon-96x96.png',
  './launchericon-144x144.png',
  './launchericon-192x192.png',
  './launchericon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(urlsToCache.map(url => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(noms => {
      return Promise.all(
        noms.map(nom => {
          if (nom !== CACHE_NAME) {
            return caches.delete(nom);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(reponse => {
      return reponse || fetch(event.request);
    })
  );
});
