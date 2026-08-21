// js/recordViewMode.js
// ---------------------------------------------
// 誠仕様：recordViewMode（記録参照） ES Module版
// ---------------------------------------------

import { state, loadJson } from "./state.js";
import { navigateTo } from "./router.js";

// ---------------------------------------------
// 画面初期化（router.js から呼ばれる）
// ---------------------------------------------
export function recordViewModeInit() {

    const saved = loadJson();
    if (!saved) {
        alert("保存された試合データがありません");
        navigateTo("preGame");
        return;
    }

    state.json = saved;

    setupQuarterButtons(saved);
    renderQuarterView("all");
    setupEventHandlers();
}

// ---------------------------------------------
// イベント登録
// ---------------------------------------------
function setupEventHandlers() {

    // preGame へ戻る
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.onclick = () => {
            navigateTo("preGame");
        };
    }

    // 保存データから再開
    const resumeBtn = document.getElementById("resumeBtn");
    if (resumeBtn) {
        resumeBtn.onclick = () => {
            state.currentQuarter = state.json.currentQuarter;
            navigateTo("preQuarter");
        };
    }

    // Q切替ボタン（動的生成）
    document.querySelectorAll("[data-quarter]").forEach(btn => {
        btn.onclick = () => {
            const q = btn.dataset.quarter;
            renderQuarterView(q);
        };
    });
}

// ---------------------------------------------
// Q切替ボタン生成
// ---------------------------------------------
function setupQuarterButtons(saved) {

    const container = document.getElementById("quarterButtons");
    if (!container) return;

    container.innerHTML = "";

    const maxQ = saved.currentQuarter;

    // Q1〜Q4＋OT
    for (let q = 1; q <= maxQ; q++) {
        const btn = document.createElement("button");
        btn.textContent = q <= 4 ? `Q${q}` : `OT${q - 4}`;
        btn.dataset.quarter = q;
        container.appendChild(btn);
    }

    // 全体
    const allBtn = document.createElement("button");
    allBtn.textContent = "全体";
    allBtn.dataset.quarter = "all";
    container.appendChild(allBtn);
}

// ---------------------------------------------
// Qごとの表示
// ---------------------------------------------
function renderQuarterView(q) {

    const redArea = document.getElementById("redTeamView");
    const blueArea = document.getElementById("blueTeamView");
    if (!redArea || !blueArea) return;

    const json = state.json;

    // 全体表示（ファール数の多い順）
    if (q === "all") {
        const redPlayers = [...json.teams.red.players].sort((a, b) => b.totalFouls - a.totalFouls);
        const bluePlayers = [...json.teams.blue.players].sort((a, b) => b.totalFouls - a.totalFouls);

        redArea.innerHTML = buildPlayerList(redPlayers, "red", "all");
        blueArea.innerHTML = buildPlayerList(bluePlayers, "blue", "all");
        return;
    }

    // Qごとの表示
    const redPlayers = json.teams.red.players;
    const bluePlayers = json.teams.blue.players;

    redArea.innerHTML = buildPlayerList(redPlayers, "red", q);
    blueArea.innerHTML = buildPlayerList(bluePlayers, "blue", q);
}

// ---------------------------------------------
// プレイヤーリスト生成
// ---------------------------------------------
function buildPlayerList(players, team, q) {

    let html = "<ul>";

    players.forEach(p => {

        const fouls = q === "all"
            ? p.totalFouls
            : (p.fouls[q] || 0);

        const played = q === "all"
            ? p.totalFouls > 0
            : (p.fouls[q] > 0);

        html += `
            <li style="color:${played ? 'red' : 'black'}">
                #${p.number} ${p.name} - ファール: ${fouls}
            </li>
        `;
    });

    html += "</ul>";
    return html;
}
