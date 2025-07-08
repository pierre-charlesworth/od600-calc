
const CACHE_NAME = 'od600-calculator-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Note: The bundled JS/CSS files should be added here.
  // Since the filenames are dynamic, a more robust service worker would
  // get these from a build manifest. For this simple case, we cache the basics.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Serve from cache
        }
        return fetch(event.request); // Fetch from network
      }
    )
  );
});
