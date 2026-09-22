// LaundryKu PWA Service Worker
const CACHE_NAME = 'laundryku-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through fetch handler required for PWA installability criteria
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
