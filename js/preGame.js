// js/preGame.js
// ---------------------------------------------
// 誠仕様：preGame（試合前画面）
// ---------------------------------------------

import { state, saveJson } from "./state.js";
import { navigateTo } from "./router.js";

export function preGameInit() {
    setupEventHandlers();
}

// ---------------------------------------------
// イベント登録
// ---------------------------------------------
function setupEventHandlers() {

    const startBtn = document.getElementById("startGameBtn");
    if (!startBtn) return;

    startBtn.onclick = () => {

        // 入力値取得（任意）
        const matchTitle = document.getElementById("matchTitle")?.value.trim() || "";
        const teamAName  = document.getElementById("teamAName")?.value.trim() || "";
        const teamBName  = document.getElementById("teamBName")?.value.trim() || "";

        // 任意入力 → 未入力ならデフォルト名
        const redName  = teamAName || "teamRED";
        const blueName = teamBName || "teamBLUE";

        // 試合名は任意 → 未入力なら null（仕様どおり）
        const finalMatchTitle = matchTitle !== "" ? matchTitle : null;

        // 試合データ初期化
        state.matchData = {
            title: finalMatchTitle,   // null または文字列
            teams: {
                red:  { name: redName,  players: [], quarterFouls: [] },
                blue: { name: blueName, players: [], quarterFouls: [] }
            },
            history: { quarterResults: [], events: [] },
            startTime: new Date().toISOString(),
            endTime: null
        };

        state.currentQuarter = 0;
        state.json = state.matchData;

        // 保存
        saveJson();

        // preQuarter へ遷移
        navigateTo("preQuarter");
    };

    // 記録参照
    const recordBtn = document.getElementById("recordViewBtn");
    if (recordBtn) {
        recordBtn.onclick = () => navigateTo("recordViewMode");
    }

    // 登録クリア
    const clearBtn = document.getElementById("clearRegisterBtn");
    if (clearBtn) {
        clearBtn.onclick = () => {
            localStorage.removeItem("matchData");
            location.reload();
        };
    }
}
