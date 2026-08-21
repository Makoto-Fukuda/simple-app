// sw.js — Basket Foul Counter PWA Service Worker（誠仕様・完全版）

const CACHE_NAME = "bfc-cache-v2";

// ---------------------------------------------
// 誠仕様：SPA の ES Module をすべてキャッシュ
// ---------------------------------------------
const FILES_TO_CACHE = [
  "./",
  "./index.html",

  // CSS
  "./css/style.css",

  // JS（ES Module 全部）
  "./js/app.js",
  "./js/router.js",
  "./js/state.js",
  "./js/preGame.js",
  "./js/preQuarter.js",
  "./js/inGame.js",
  "./js/postQuarter.js",
  "./js/postGame.js",
  "./js/listView.js",
  "./js/recordViewMode.js",

  // manifest & sw
  "./manifest.json",
  "./sw.js",

  // 画面 HTML（SPAの画面）
  "./screens/preGame.html",
  "./screens/preQuarter.html",
  "./screens/inGame.html",
  "./screens/postQuarter.html",
  "./screens/postGame.html",
  "./screens/listView.html",
  "./screens/recordViewMode.html",

  // 共通コンポーネント
  "./components/dialog.html",

  // icons
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// ---------------------------------------------
// install（初回キャッシュ）
// ---------------------------------------------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ---------------------------------------------
// activate（古いキャッシュ削除）
// ---------------------------------------------
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ---------------------------------------------
// fetch（キャッシュ優先）
// ---------------------------------------------
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
