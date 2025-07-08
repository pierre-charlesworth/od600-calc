const CACHE_NAME = 'od600-calculator-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.tsx',
  '/App.tsx',
  '/components/InputControl.tsx',
  '/components/ResultDisplay.tsx',
  '/components/icons/BeakerIcon.tsx',
  '/components/icons/FlaskIcon.tsx',
  '/components/icons/InfoIcon.tsx',
  '/components/icons/ResetIcon.tsx',
  '/components/icons/TargetIcon.tsx',
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

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // We only handle GET requests, POSTs, etc. should not be cached.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          networkResponse => {
            // We don't cache opaque responses or error responses.
            // .ok is true for status codes in the range 200-299.
            if (!networkResponse || !networkResponse.ok || networkResponse.type === 'opaque') {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
    );
});
