// js/postQuarter.js
// ---------------------------------------------
// 誠仕様：postQuarter（第 currentQuarter Q 終了） ES Module版
// ---------------------------------------------

import { state } from "./state.js";
import { navigateTo } from "./router.js";

// ---------------------------------------------
// 画面初期化（router.js から呼ばれる）
// ---------------------------------------------
export function postQuarterInit() {

    // Q表示
    const qLabel = document.getElementById("quarterLabel");
    if (qLabel) {
        qLabel.textContent = `第 ${state.currentQuarter} Q 終了`;
    }

    setupEventHandlers();
}

// ---------------------------------------------
// イベント登録
// ---------------------------------------------
function setupEventHandlers() {

    // 次のクオータへ（誠仕様：currentQuarter は進めない）
    const nextBtn = document.getElementById("nextQuarterBtn");
    if (nextBtn) {
        nextBtn.onclick = () => {
            navigateTo("preQuarter");
        };
    }

    // 延長戦へ（誠仕様：currentQuarter は進めない）
    const otBtn = document.getElementById("nextOTBtn");
    if (otBtn) {
        otBtn.onclick = () => {
            navigateTo("preQuarter");
        };
    }

    // 戻る → inGame（誤操作救済）
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.onclick = () => {
            navigateTo("inGame");
        };
    }

    // 試合終了 → postGame
    const abortBtn = document.getElementById("abortBtn");
    if (abortBtn) {
        abortBtn.onclick = () => {
            navigateTo("postGame");
        };
    }
}
