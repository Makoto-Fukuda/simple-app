import { StateMachine } from "./stateMachine.js";

let sm = null;

// 初期化
async function init() {
  const config = await fetch("./config/stateMachine.json").then(r => r.json());
  sm = new StateMachine(config);

  console.log("初期状態:", sm.getState());
}

// UIイベントの接続例
function setupUI() {
  document.getElementById("btnStartGame").addEventListener("click", () => {
    sm.transitionGame("startGame");
    console.log("状態:", sm.getState());
    updateUI();
  });
}

// UI更新（誠のUI構造に合わせて後で拡張）
function updateUI() {
  const state = sm.getState();
  document.getElementById("stateDisplay").innerText = state.game;
}

// 実行
init().then(setupUI);
