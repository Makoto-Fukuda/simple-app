const CACHE_NAME = 'bfc-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-DFC.png'
];

// インストール（初回読み込み時）
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// オフライン対応（キャッシュ → ネットの順で返す）
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
