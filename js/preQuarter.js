// js/preQuarter.js
// ---------------------------------------------
// 誠仕様：preQuarter（試合開始前／選手交代）
// ---------------------------------------------

import { state } from "./state.js";
import { navigateTo } from "./router.js";

const players = Array.from({ length: 999 }, (_, i) => i + 1);
let redSelected = [];
let blueSelected = [];
let currentTeam = "A";

export function preQuarterInit() {
    const qLabel = document.getElementById("quarterLabel");
    const backBtn = document.getElementById("backBtn");
    const startBtn = document.getElementById("startQuarterBtn");
    const abortBtn = document.getElementById("abortBtn");
    const returnBtn = document.getElementById("returnToGameBtn");

    const isSubstitution = state.isSubstitution === true;

    if (isSubstitution) {
        // 🔸 選手交代モード
        qLabel.textContent = `第 ${state.currentQuarter}Q 試合中`;

        backBtn.classList.add("hidden");
        startBtn.classList.add("hidden");
        abortBtn.classList.add("hidden");
        returnBtn.classList.remove("hidden");
    } else {
        // 🔸 試合開始前モード
        const nextQ = state.currentQuarter + 1;
        const quarterName = formatQuarterName(nextQ);

        qLabel.textContent = `${quarterName} 開始前`;
        startBtn.textContent = `${quarterName} 開始`;

        backBtn.classList.remove("hidden");
        startBtn.classList.remove("hidden");
        abortBtn.classList.remove("hidden");
        returnBtn.classList.add("hidden");
    }

    // チーム名反映
    document.getElementById("teamA").textContent = state.matchData.teams.red.name;
    document.getElementById("teamB").textContent = state.matchData.teams.blue.name;

    setupEventHandlers();
    renderOnCourt();
    renderReserve();
}

function formatQuarterName(q) {
    if (q <= 4) return `第${q}Q`;
    return `OT${q - 4}`;
}

function setupEventHandlers() {
    const reserveArea = document.getElementById("reserveArea");

    document.getElementById("teamA").onclick = () => {
        currentTeam = "A";
        reserveArea.classList.add("teamA-bg");
        reserveArea.classList.remove("teamB-bg");
        renderReserve();
    };

    document.getElementById("teamB").onclick = () => {
        currentTeam = "B";
        reserveArea.classList.add("teamB-bg");
        reserveArea.classList.remove("teamA-bg");
        renderReserve();
    };

    // 試合開始前モード
    document.getElementById("startQuarterBtn").onclick = () => {
        if (state.isSubstitution) return;

        state.currentQuarter += 1;

        state.matchData.teams.red.players = redSelected.map(num => ({
            number: num,
            name: `#${num}`,
            fouls: [],
            totalFouls: 0
        }));

        state.matchData.teams.blue.players = blueSelected.map(num => ({
            number: num,
            name: `#${num}`,
            fouls: [],
            totalFouls: 0
        }));

        navigateTo("inGame");
    };

    // 戻る（試合前のみ）
    document.getElementById("backBtn").onclick = () => {
        if (state.currentQuarter === 0) navigateTo("preGame");
        else navigateTo("postQuarter");
    };

    // 試合終了
    document.getElementById("abortBtn").onclick = () => navigateTo("postGame");

    // 試合に戻る（選手交代モード）
    document.getElementById("returnToGameBtn").onclick = () => {
        state.isSubstitution = false;
        navigateTo("inGame");
    };
}

// 出場選手描画
function renderOnCourt() {
    const redArea = document.getElementById("redOnCourt");
    const blueArea = document.getElementById("blueOnCourt");

    redArea.innerHTML = "";
    blueArea.innerHTML = "";

    const redSorted = [...redSelected].sort((a, b) => a - b);
    for (let i = 0; i < 5; i++) {
        const btn = document.createElement("button");
        if (redSorted[i] !== undefined) {
            btn.className = "player-btn selected";
            btn.textContent = redSorted[i];
        } else {
            btn.className = "player-btn placeholder";
            btn.textContent = "";
        }
        redArea.appendChild(btn);
    }

    const blueSorted = [...blueSelected].sort((a, b) => a - b);
    for (let i = 0; i < 5; i++) {
        const btn = document.createElement("button");
        if (blueSorted[i] !== undefined) {
            btn.className = "player-btn selected";
            btn.textContent = blueSorted[i];
        } else {
            btn.className = "player-btn placeholder";
            btn.textContent = "";
        }
        blueArea.appendChild(btn);
    }
}

// 控え選手描画
function renderReserve() {
    const reserveArea = document.getElementById("reserveArea");
    reserveArea.innerHTML = "";

    players.forEach(num => {
        const btn = document.createElement("button");
        btn.className = "player-btn";
        btn.textContent = num;

        const isSelected =
            currentTeam === "A" ? redSelected.includes(num) : blueSelected.includes(num);

        btn.classList.add(isSelected ? "selected" : "unselected");
        btn.onclick = () => togglePlayer(num);
        reserveArea.appendChild(btn);
    });
}

// ---------------------------------------------
// 選手選択切替（最大5名）
// ---------------------------------------------
function togglePlayer(num) {
    if (currentTeam === "A") {
        if (redSelected.includes(num)) {
            // すでに選択済み → 解除
            redSelected = redSelected.filter(n => n !== num);
        } else if (redSelected.length < 5) {
            // 未選択 → 追加（最大5名）
            redSelected.push(num);
        }
    } else {
        if (blueSelected.includes(num)) {
            blueSelected = blueSelected.filter(n => n !== num);
        } else if (blueSelected.length < 5) {
            blueSelected.push(num);
        }
    }

    // 出場枠と控え一覧を再描画
    renderOnCourt();
    renderReserve();
}
