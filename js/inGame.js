// js/inGame.js
// ---------------------------------------------
// 誠仕様：inGame（試合中）
// ---------------------------------------------

import { state } from "./state.js";
import { navigateTo } from "./router.js";

let currentTeam = null;
let selectedButton = null;

export function inGameInit() {

    // タイトル
    const title = document.getElementById("quarterLabel");
    if (title) title.textContent = `第 ${state.currentQuarter}Q 試合中`;

    // 固定ボタン表示（選手交代から戻った場合）
    const footer = document.getElementById("ingameFooter");
    if (footer) footer.classList.remove("hidden");

    // チーム名
    document.getElementById("teamA").textContent = state.matchData.teams.red.name;
    document.getElementById("teamB").textContent = state.matchData.teams.blue.name;

    setupEventHandlers();
}

function setupEventHandlers() {
    const foulArea = document.getElementById("foulArea");
    const onCourtArea = document.getElementById("onCourtArea");
    const playerFoulCount = document.getElementById("playerFoulCount");
    const foulSection = document.getElementById("foulSection");
    const teamAFoul = document.getElementById("teamAFoul");
    const teamBFoul = document.getElementById("teamBFoul");

    // チーム選択
    document.getElementById("teamA").onclick = () => toggleTeam("A");
    document.getElementById("teamB").onclick = () => toggleTeam("B");

    // OKボタン
    document.getElementById("okBtn").onclick = () => {
        if (!selectedButton || !currentTeam) return;

        const playerNum = Number(selectedButton.textContent);
        const teamData =
            currentTeam === "A" ? state.matchData.teams.red : state.matchData.teams.blue;
        const player = teamData.players.find(p => p.number === playerNum);

        if (player) {
            const newFoulCount = Number(playerFoulCount.textContent);
            player.totalFouls = newFoulCount;

            // チームファール（MAX4）
            const teamFoulLabel = currentTeam === "A" ? teamAFoul : teamBFoul;
            const currentTeamFouls = Number(teamFoulLabel.textContent);
            if (currentTeamFouls < 4) {
                teamFoulLabel.textContent = currentTeamFouls + 1;
            }
        }

        // メイン画面に戻る
        foulArea.classList.add("hidden");
        currentTeam = null;
        clearSelection();
        playerFoulCount.textContent = "0";

        // 背景リセット
        foulSection.style.backgroundColor = "#ffffff";
        foulSection.style.color = "#000000";
        foulSection.style.border = "none";
    };

    // 🔹 選手交代 → preQuarter
    document.getElementById("changePlayerBtn").onclick = () => {

        // 固定ボタン非表示
        const footer = document.getElementById("ingameFooter");
        if (footer) footer.classList.add("hidden");

        // 選手交代モードへ
        state.isSubstitution = true;

        navigateTo("preQuarter");
    };

    // Q終了
    document.getElementById("endQuarterBtn").onclick = () => navigateTo("postQuarter");

    // チーム切替
    function toggleTeam(team) {
        if (currentTeam === team) {
            foulArea.classList.add("hidden");
            currentTeam = null;
            clearSelection();
        } else {
            foulArea.classList.remove("hidden");
            foulArea.classList.toggle("teamA-bg", team === "A");
            foulArea.classList.toggle("teamB-bg", team === "B");
            currentTeam = team;
            renderPlayers(team);
        }
    }

    // 出場選手描画
    function renderPlayers(team) {
        onCourtArea.innerHTML = "";
        const players =
            team === "A"
                ? state.matchData.teams.red.players
                : state.matchData.teams.blue.players;

        players.forEach(p => {
            const btn = document.createElement("button");
            btn.className = "player-btn unselected";
            btn.textContent = p.number;
            btn.onclick = () => selectPlayer(btn, p);
            onCourtArea.appendChild(btn);
        });
    }

    // 選手選択
    function selectPlayer(btn, player) {
        if (selectedButton) {
            selectedButton.classList.remove("selected");
            selectedButton.classList.add("unselected");
        }
        btn.classList.remove("unselected");
        btn.classList.add("selected");
        selectedButton = btn;

        const nextFoulCount = (player.totalFouls ?? 0) + 1;
        playerFoulCount.textContent = nextFoulCount;

        // 背景色切替
        if (nextFoulCount === 4) {
            foulSection.style.backgroundColor = "#f39c12"; // 警告
            foulSection.style.color = "#ffffff";
            foulSection.style.border = "3px solid #ffffff";
        } else if (nextFoulCount >= 5) {
            foulSection.style.backgroundColor =
                currentTeam === "A" ? "#c0392b" : "#2980b9"; // 退場
            foulSection.style.color = "#ffffff";
            foulSection.style.border = "3px solid #ffffff";
        } else {
            foulSection.style.backgroundColor = "#ffffff";
            foulSection.style.color = "#000000";
            foulSection.style.border = "none";
        }
    }

    function clearSelection() {
        onCourtArea.querySelectorAll(".player-btn").forEach(btn => {
            btn.classList.remove("selected");
            btn.classList.add("unselected");
        });
        selectedButton = null;
    }
}
