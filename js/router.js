// js/router.js
// ---------------------------------------------
// 誠仕様：SPA画面遷移マネージャ（動的 import 版）
// ---------------------------------------------

import { state } from "./state.js";

// 画面ID → HTMLファイルの対応表
const screenMap = {
    preGame:        "screens/preGame.html",
    preQuarter:     "screens/preQuarter.html",
    inGame:         "screens/inGame.html",
    postQuarter:    "screens/postQuarter.html",
    postGame:       "screens/postGame.html",
    recordViewMode: "screens/recordViewMode.html",
    listView:       "screens/listView.html"
};

// 画面描画
export async function renderScreen() {
    const screen = state.screen;
    const path = screenMap[screen];

    if (!path) {
        console.error("画面が存在しません:", screen);
        return;
    }

    // HTMLを読み込む
    const html = await fetch(path).then(res => res.text());
    document.getElementById("app").innerHTML = html;

    // 対応するJSを動的 import
    await callScreenInit(screen);
}

// 画面遷移
export function navigateTo(screenName) {
    state.screen = screenName;
    renderScreen();
}

// 画面ごとの初期化処理呼び出し（動的 import）
async function callScreenInit(screen) {
    switch (screen) {
        case "preGame": {
            const module = await import("./preGame.js");
            module.preGameInit();
            break;
        }
        case "preQuarter": {
            const module = await import("./preQuarter.js");
            module.preQuarterInit();
            break;
        }
        case "inGame": {
            const module = await import("./inGame.js");
            module.inGameInit();
            break;
        }
        case "postQuarter": {
            const module = await import("./postQuarter.js");
            module.postQuarterInit();
            break;
        }
        case "postGame": {
            const module = await import("./postGame.js");
            module.postGameInit();
            break;
        }
        case "recordViewMode": {
            const module = await import("./recordViewMode.js");
            module.recordViewModeInit();
            break;
        }
        case "listView": {
            const module = await import("./listView.js");
            module.listViewInit();
            break;
        }
    }
}
