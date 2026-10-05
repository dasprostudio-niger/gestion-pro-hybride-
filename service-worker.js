const CACHE_NAME = 'gestion-pro-hybride-v1.0.0';

// Domaines autorisés à passer par le réseau (non mis en cache)
const DOMAINES_RESEAU = ['world.openfoodfacts.org', 'images.openfoodfacts.org'];

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

// Installation : mise en cache des fichiers
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(urlsToCache.map(url => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

// Activation : nettoyage des anciens caches
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

// Interception des requêtes : cache-first + exceptions réseau
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // Laisser passer les requêtes vers Open Food Facts (scan hybride)
  if (DOMAINES_RESEAU.some(d => url.includes(d))) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Cache-first pour tout le reste
  event.respondWith(
    caches.match(event.request).then(reponse => {
      return reponse || fetch(event.request);
    })
  );
});