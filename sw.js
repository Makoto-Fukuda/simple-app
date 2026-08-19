// sw.js — Basket Foul Counter PWA Service Worker

const CACHE_NAME = "bfc-cache-v1";

// キャッシュするファイル一覧（誠のフォルダ構成に完全一致）
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./sw.js",

  // JS
  "./stateMachine.js",

  // config
  "./config/game.json",
  "./config/players.json",
  "./config/sound.json",
  "./config/stateMachine.json",
  "./config/teams.json",
  "./config/ui.json",

  // icons
  "./icons/icon-DFC.png"
];

// --------------------------------------
// インストール（初回キャッシュ）
// --------------------------------------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// --------------------------------------
// 有効化（古いキャッシュ削除）
// --------------------------------------
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

// --------------------------------------
// fetch（キャッシュ優先）
// --------------------------------------
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // キャッシュがあればそれを返す
      if (response) {
        return response;
      }
      // なければネットワーク
      return fetch(event.request);
    })
  );
});
