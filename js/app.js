// js/app.js
// ---------------------------------------------
// 誠仕様：アプリ全体の初期化＆Service Worker登録
// ---------------------------------------------

import { renderScreen } from "./router.js";

window.addEventListener("DOMContentLoaded", () => {
    // 初期画面描画（preGame）
    renderScreen();

    // Service Worker 登録
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js").catch(err => {
            console.error("Service Worker registration failed:", err);
        });
    }
});
