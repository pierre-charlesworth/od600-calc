import { precacheAndRoute } from 'workbox-precaching';

// self.__WB_MANIFEST is injected by workbox at build time
precacheAndRoute(self.__WB_MANIFEST);

// Basic runtime cache: try cache first, fallback to network, then cache new request
self.addEventListener('fetch', (event) => {
  const { request } = event as FetchEvent;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Clone and store in runtime cache
        const responseClone = response.clone();
        caches.open('runtime-cache').then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      });
    })
  );
}); 