// js/postGame.js
// ---------------------------------------------
// 誠仕様：postGame（試合終了） ES Module版
// ---------------------------------------------

import { state, saveJson } from "./state.js";
import { navigateTo } from "./router.js";

// ---------------------------------------------
// 画面初期化（router.js から呼ばれる）
// ---------------------------------------------
export function postGameInit() {

    // 最終Q表示
    const qLabel = document.getElementById("quarterLabel");
    if (qLabel) {
        qLabel.textContent = `試合終了（最終Q：${state.currentQuarter}）`;
    }

    setupEventHandlers();
}

// ---------------------------------------------
// イベント登録
// ---------------------------------------------
function setupEventHandlers() {

    // 保存 → preGame
    const saveBtn = document.getElementById("saveBtn");
    if (saveBtn) {
        saveBtn.onclick = () => {

            // JSON確定
            state.json.currentQuarter = state.currentQuarter;
            state.json.teams = state.matchData.teams;
            state.json.history = state.matchData.history;
            state.json.startTime = state.matchData.startTime;
            state.json.endTime = new Date().toISOString();

            // 保存
            saveJson();

            // preGameへ戻る
            navigateTo("preGame");
        };
    }

    // 戻る → postQuarter（延長戦救済）
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.onclick = () => {
            navigateTo("postQuarter");
        };
    }
}
