// js/state.js
// ---------------------------------------------
// 誠仕様：試合進行の心臓部となる状態管理
// ---------------------------------------------

export const state = {
    // 現在の画面
    screen: "preGame",

    // 現在のクオータ（startQuarter OK の瞬間だけ +1）
    currentQuarter: 0,

    // 試合データ（進行中のデータ）
    matchData: {
        teams: {
            red: {
                players: [],        // { number, name, fouls[], totalFouls }
                score: [],          // 各Qの得点
                quarterFouls: []    // 各Qのチームファール
            },
            blue: {
                players: [],
                score: [],
                quarterFouls: []
            }
        },

        history: {
            quarterResults: [],    // 各Q終了時のスナップショット
            events: []             // ファール・得点などのイベントログ
        },

        startTime: null,
        endTime: null
    },

    // 保存用 JSON（試合終了時に確定）
    json: {}
};

// プレイヤー検索
export function findPlayer(team, number) {
    return state.matchData.teams[team].players.find(p => p.number === number);
}

// プレイヤーインデックス
export function playerIndex(team, number) {
    return state.matchData.teams[team].players.findIndex(p => p.number === number);
}

// JSON保存
export function saveJson() {
    localStorage.setItem("matchData", JSON.stringify(state.json));
}

// JSON読み込み
export function loadJson() {
    const data = localStorage.getItem("matchData");
    if (!data) return null;
    return JSON.parse(data);
}
