const CACHE_NAME = 'minimal-cache-v1';
const ASSETS_TO_CACHE = [
  '/index.html',
  '/index.js',
  '/service-worker.js'
];

// Install event – cache only the specified assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event – clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch event – serve from cache if available
self.addEventListener('fetch', event => {
  if (ASSETS_TO_CACHE.includes(new URL(event.request.url).pathname)) {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  } else {
    // Let everything else go to the network
    event.respondWith(fetch(event.request));
  }
});
