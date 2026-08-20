/* ============================================================
   状態管理
============================================================ */
let currentQuarter = 1;
let selectedTeam = null;
let selectedPlayer = null;

let players = [];
let onCourtPlayers = [];
let benchPlayers = [];
let outPlayers = [];

let teamAFoul = 0;
let teamBFoul = 0;

/* ============================================================
   初期化
============================================================ */
function initPlayers() {
    players = [];
    for (let i = 1; i <= 12; i++) {
        players.push({
            number: i,
            personalFouls: 0,
            isOnCourt: i <= 5,
            isFouledOut: false,
            team: i <= 6 ? "red" : "blue"
        });
    }

    onCourtPlayers = players.filter(p => p.isOnCourt);
    benchPlayers = players.filter(p => !p.isOnCourt);
}

/* ============================================================
   画面遷移
============================================================ */
function navigateTo(path) {
    window.location.href = path;
}

/* ============================================================
   チーム選択
============================================================ */
function selectTeam(team) {
    selectedTeam = team;

    document.querySelectorAll(".team-btn").forEach(btn => {
        btn.classList.remove("selected-team");
    });

    if (team === "red") {
        document.querySelector(".team-red").classList.add("selected-team");
    } else {
        document.querySelector(".team-blue").classList.add("selected-team");
    }
}

/* ============================================================
   preQuarter：選手リスト描画
============================================================ */
function renderPreQuarter() {
    const starterList = document.getElementById("starterList");
    const benchList = document.getElementById("benchList");

    if (!starterList || !benchList) return;

    starterList.innerHTML = "";
    benchList.innerHTML = "";

    onCourtPlayers.forEach(p => {
        const btn = document.createElement("button");
        btn.className = "player-btn starter";
        btn.textContent = p.number;
        starterList.appendChild(btn);
    });

    benchPlayers.forEach(p => {
        const btn = document.createElement("button");
        btn.className = "player-btn bench";
        btn.textContent = p.number;
        benchList.appendChild(btn);
    });
}

/* ============================================================
   試合開始
============================================================ */
function startGame() {
    navigateTo("inGame.html");
}

/* ============================================================
   inGame：出場選手描画
============================================================ */
function renderInGame() {
    const onCourtList = document.getElementById("onCourtList");
    const foulList = document.getElementById("foulList");

    if (!onCourtList || !foulList) return;

    onCourtList.innerHTML = "";
    foulList.innerHTML = "";

    onCourtPlayers.forEach(p => {
        const btn = document.createElement("button");
        btn.className = "player-btn starter";
        btn.textContent = p.number;
        btn.onclick = () => selectPlayer(p);
        onCourtList.appendChild(btn);

        const foulItem = document.createElement("div");
        foulItem.className = "foul-item";
        foulItem.textContent = `${p.number}: ${p.personalFouls}`;
        foulList.appendChild(foulItem);
    });

    document.getElementById("teamAFoul").textContent = teamAFoul;
    document.getElementById("teamBFoul").textContent = teamBFoul;
}

/* ============================================================
   選手選択
============================================================ */
function selectPlayer(player) {
    selectedPlayer = player;
    addPersonalFoul(player);
}

/* ============================================================
   個人ファール追加
============================================================ */
function addPersonalFoul(player) {
    player.personalFouls++;

    if (player.team === "red") teamAFoul++;
    if (player.team === "blue") teamBFoul++;

    if (player.personalFouls >= 5 && !player.isFouledOut) {
        player.isFouledOut = true;
        player.isOnCourt = false;

        outPlayers.push({
            number: player.number,
            team: player.team,
            justOut: true
        });

        onCourtPlayers = onCourtPlayers.filter(p => p.number !== player.number);
    }

    renderInGame();
}

/* ============================================================
   選択クリア
============================================================ */
function onClearSelection() {
    selectedPlayer = null;
}

/* ============================================================
   試合中止
============================================================ */
function onEndGame() {
    openDialog("試合を終了しますか？", () => {
        navigateTo("../index.html");
    });
}

/* ============================================================
   postQuarter：退場選手描画
============================================================ */
function renderPostQuarter() {
    const outGrid = document.getElementById("outGrid");
    if (!outGrid) return;

    outGrid.innerHTML = "";

    outPlayers.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("out-item");
        div.classList.add(p.team === "red" ? "out-red" : "out-blue");

        if (p.justOut) {
            setTimeout(() => {
                p.justOut = false;
            }, 3000);
        }

        div.textContent = p.number;
        outGrid.appendChild(div);
    });

    document.getElementById("teamAFoul").textContent = teamAFoul;
    document.getElementById("teamBFoul").textContent = teamBFoul;
}

/* ============================================================
   次Qへ
============================================================ */
function nextQuarter() {
    currentQuarter++;
    navigateTo("preQuarter.html");
}

/* ============================================================
   ダイアログ
============================================================ */
function openDialog(message, okCallback) {
    document.getElementById("dialogMessage").textContent = message;
    document.getElementById("dialogOverlay").style.display = "flex";

    const okBtn = document.getElementById("dialogOkButton");
    okBtn.onclick = () => {
        closeDialog();
        okCallback();
    };
}

function closeDialog() {
    document.getElementById("dialogOverlay").style.display = "none";
}

/* ============================================================
   画面ロード時の処理
============================================================ */
window.onload = () => {
    initPlayers();

    renderPreQuarter();
    renderInGame();
    renderPostQuarter();
};
