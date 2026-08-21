// js/listView.js
// ---------------------------------------------
// 誠仕様：listView（ファール一覧・閲覧専用） ES Module版
// ---------------------------------------------

import { state, loadJson } from "./state.js";
import { navigateTo } from "./router.js";

// ---------------------------------------------
// 画面初期化（router.js から呼ばれる）
// ---------------------------------------------
export function listViewInit() {

    const saved = loadJson();
    if (!saved) {
        alert("保存された試合データがありません");
        navigateTo("preGame");
        return;
    }

    state.json = saved;

    renderListView(saved);
    setupEventHandlers();
}

// ---------------------------------------------
// イベント登録
// ---------------------------------------------
function setupEventHandlers() {
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.onclick = () => {
            navigateTo("preGame");
        };
    }
}

// ---------------------------------------------
// ファール一覧表示
// ---------------------------------------------
function renderListView(json) {
    const redArea = document.getElementById("redTeamList");
    const blueArea = document.getElementById("blueTeamList");

    if (!redArea || !blueArea) return;

    redArea.innerHTML = buildTeamTable(json.teams.red.players, "red", json.currentQuarter);
    blueArea.innerHTML = buildTeamTable(json.teams.blue.players, "blue", json.currentQuarter);
}

// ---------------------------------------------
// チームテーブル生成
// ---------------------------------------------
function buildTeamTable(players, team, maxQuarter) {

    let html = `
        <table class="foul-table">
            <thead>
                <tr>
                    <th>背番号</th>
                    <th>名前</th>
                    <th>合計ファール</th>
    `;

    // Q1〜maxQuarter の列を生成
    for (let q = 1; q <= maxQuarter; q++) {
        html += `<th>${q <= 4 ? `Q${q}` : `OT${q - 4}`}</th>`;
    }

    html += `
                </tr>
            </thead>
            <tbody>
    `;

    // プレイヤー行
    players.forEach(p => {
        html += `
            <tr>
                <td>${p.number}</td>
                <td>${p.name}</td>
                <td>${p.totalFouls}</td>
        `;

        for (let q = 1; q <= maxQuarter; q++) {
            const fouls = p.fouls[q] || 0;
            html += `<td>${fouls}</td>`;
        }

        html += `</tr>`;
    });

    html += `
            </tbody>
        </table>
    `;

    return html;
}
