const CACHE_NAME = 'od600-calculator-v6';
// Vite generates hashed assets, so we only cache the entry points.
// The build process would typically inject a manifest of files to cache here.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // We are not caching the JS entry points because Vite will give them
        // unique hashes on each build. A more advanced service worker
        // would use a tool like Workbox to handle this automatically.
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
        ).catch(error => {
          console.error('Service Worker fetch request failed:', error);
          // When a fetch fails, we don't want to cause an "unexpected error".
          // By not returning anything from the catch, the promise resolves to 'undefined'
          // and the browser handles the network failure as if the SW wasn't there.
        });
      })
    );
});