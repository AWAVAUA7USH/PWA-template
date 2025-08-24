self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('hello-cache').then(cache => cache.addAll([
      '/PWA-template/index.html',
      '/PWA-template/manifest.json',
      '/PWA-template/service-worker.js'
    ]))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
