// stateMachine.js — Basket Foul Counter Final Version
export class StateMachine {
  constructor(config) {
    // FSM 設定
    this.game = config.game;
    this.operation = config.operation;
    this.confirm = config.confirm;

    // チーム・選手・UI・サウンド設定
    this.teams = config.teams;
    this.players = config.players;
    this.ui = config.ui;
    this.sound = config.sound;

    // 状態
    this.currentGameState = "preGame";
    this.currentOperationMode = null;
    this.currentConfirmState = null;

    // ★ 直前状態の保存用
    this.previousState = null;

    // クオーター管理
    this.currentQuarter = 1;

    // 選手選択状態
    this.selectedTeamSide = null;
    this.selectedPlayers_A = [];
    this.selectedPlayers_B = [];

    // 状態復元
    this.loadState();
  }

  // ============================================================
  // ★ 直前状態を保存
  // ============================================================
  savePreviousState() {
    this.previousState = {
      game: this.currentGameState,
      operation: this.currentOperationMode,
      confirm: this.currentConfirmState
    };
  }

  // ============================================================
  // Q表示ラベル
  // ============================================================
  get currentQuarterLabel() {
    if (this.currentGameState === "postGame") return "試合終了";
    if (this.currentGameState === "halfTime") return "ハーフタイム";

    if (this.currentGameState === "inGame") {
      if (this.currentQuarter <= 4) return `第${this.currentQuarter}Q`;
      return "延長戦";
    }
    return "";
  }

  // ============================================================
  // GameState（第1階層）
  // ============================================================
  transitionGame(action) {
    const table = this.game.transitions[this.currentGameState];
    if (!table) return;

    const next = table[action];
    if (!next) return;

    // ★ 直前状態を保存
    this.savePreviousState();

    // クオーター進行
    if (action === "startGame") {
      this.currentQuarter = 1;
    } else if (action === "endQuarter") {
      this.currentQuarter += 1;
    } else if (action === "startOT") {
      this.currentQuarter = 5; // 延長戦
    }

    this.currentGameState = next;
    this.currentConfirmState = null;

    if (next === "inGame") {
      this.currentOperationMode = "foulMode";
    } else {
      this.currentOperationMode = null;
    }

    this.saveState();
  }

  // ============================================================
  // OperationMode（第2階層）
  // ============================================================
  enterOperationMode(mode) {
    if (this.currentGameState !== "inGame") return;
    if (!this.operation.modes[mode]) return;

    // ★ 直前状態を保存
    this.savePreviousState();

    this.currentOperationMode = mode;
    this.currentConfirmState = null;
    this.saveState();
  }

  transitionOperation(action) {
    if (!this.currentOperationMode) return;

    const table = this.operation.transitions[this.currentOperationMode];
    if (!table) return;

    const next = table[action];
    if (!next) return;

    // ★ 直前状態を保存
    this.savePreviousState();

    const gameStates = ["preGame", "preQuarter", "inGame", "halfTime", "postGame"];

    if (gameStates.includes(next)) {
      this.currentGameState = next;
      this.currentOperationMode = null;
      this.currentConfirmState = null;
      this.saveState();
      return;
    }

    this.currentConfirmState = next;
    this.saveState();
  }

  // ============================================================
  // ConfirmState（第3階層）
  // ============================================================
  transitionConfirm(action) {
    if (!this.currentConfirmState) return;

    const table = this.confirm.transitions[this.currentConfirmState];
    if (!table) return;

    const next = table[action];
    if (!next) return;

    // ★ 直前状態を保存
    this.savePreviousState();

    const gameStates = ["preGame", "preQuarter", "inGame", "halfTime", "postGame"];

    if (gameStates.includes(next)) {
      this.currentGameState = next;
      this.currentOperationMode = null;
      this.currentConfirmState = null;
      this.saveState();
      return;
    }

    this.currentOperationMode = next;
    this.currentConfirmState = null;
    this.saveState();
  }

  // ============================================================
  // チームファール
  // ============================================================
  addTeamFoul(teamSide) {
    const team = this.teams.teams[teamSide];
    if (!team) return;

    // ★ 直前状態を保存
    this.savePreviousState();

    team.teamFouls += 1;

    const max = this.teams.rules.maxTeamFoulsPerQuarter;
    if (team.teamFouls >= max) {
      console.log("ボーナス状態");
    }
    this.saveState();
  }

  resetTeamFouls() {
    // ★ 直前状態を保存
    this.savePreviousState();

    this.teams.teams.teamA.teamFouls = 0;
    this.teams.teams.teamB.teamFouls = 0;
    this.saveState();
  }

  // ============================================================
  // 個人ファール
  // ============================================================
  addPersonalFoul(playerId) {
    const p = this.players.players.find(x => x.playerId === playerId);
    if (!p) return;

    // ★ 直前状態を保存
    this.savePreviousState();

    p.personalFouls += 1;

    const max = this.players.rules.maxPersonalFouls;
    if (p.personalFouls >= max) {
      p.isDisqualified = true;
    }
    this.saveState();
  }

  // ============================================================
  // 交代
  // ============================================================
  substitute(onCourtId, benchId) {
    const on = this.players.players.find(x => x.playerId === onCourtId);
    const bn = this.players.players.find(x => x.playerId === benchId);

    if (!on || !bn) return;

    // ★ 直前状態を保存
    this.savePreviousState();

    on.isOnCourt = false;
    on.isBench = true;

    bn.isOnCourt = true;
    bn.isBench = false;

    this.saveState();
  }

  // ============================================================
  // 状態取得
  // ============================================================
  getState() {
    return {
      game: this.currentGameState,
      operation: this.currentOperationMode,
      confirm: this.currentConfirmState
    };
  }

  // ============================================================
  // 選手選択 UI 用ロジック
  // ============================================================
  selectTeamSide(teamSide) {
    // ★ 直前状態を保存
    this.savePreviousState();

    this.selectedTeamSide = teamSide;
    this.saveState();
  }

  toggleSelectPlayer(jerseyNumber) {
    if (!this.selectedTeamSide) return;

    // ★ 直前状態を保存
    this.savePreviousState();

    const existingPlayer = this.players.players.find(
      p =>
        p.teamSide === this.selectedTeamSide &&
        p.jerseyNumber === jerseyNumber
    );
    if (existingPlayer && existingPlayer.isDisqualified) {
      return;
    }

    const key = this.selectedTeamSide === "A"
      ? "selectedPlayers_A"
      : "selectedPlayers_B";

    const list = this[key];

    const idx = list.indexOf(jerseyNumber);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      if (list.length < 5) list.push(jerseyNumber);
    }

    this.saveState();
  }

  // ============================================================
  // 選手選択確定 → players に追加して Q開始
  // ============================================================
  commitSelectedPlayers() {
    // ★ 直前状態を保存
    this.savePreviousState();

    const listA = this.selectedPlayers_A;
    const listB = this.selectedPlayers_B;

    if (listA.length === 0 && listB.length === 0) return;

    listA.forEach((num, idx) => {
      this.players.players.push({
        playerId: this.players.players.length + idx,
        playerName: `Player A-${num}`,
        teamSide: "A",
        jerseyNumber: num,
        personalFouls: 0,
        isDisqualified: false,
        isOnCourt: true,
        isBench: false
      });
    });

    const offsetB = this.players.players.length;
    listB.forEach((num, idx) => {
      this.players.players.push({
        playerId: offsetB + idx,
        playerName: `Player B-${num}`,
        teamSide: "B",
        jerseyNumber: num,
        personalFouls: 0,
        isDisqualified: false,
        isOnCourt: true,
        isBench: false
      });
    });

    this.transitionGame("startQuarter");
    this.saveState();
  }

  // ============================================================
  // 状態保存・復元
  // ============================================================
  saveState() {
    localStorage.setItem("selectedPlayers_A", JSON.stringify(this.selectedPlayers_A));
    localStorage.setItem("selectedPlayers_B", JSON.stringify(this.selectedPlayers_B));
    localStorage.setItem("currentGameState", this.currentGameState);
    localStorage.setItem("selectedTeamSide", this.selectedTeamSide || "");
    localStorage.setItem("currentQuarter", String(this.currentQuarter));
  }

  loadState() {
    this.selectedPlayers_A = JSON.parse(localStorage.getItem("selectedPlayers_A") || "[]");
    this.selectedPlayers_B = JSON.parse(localStorage.getItem("selectedPlayers_B") || "[]");
    this.currentGameState = localStorage.getItem("currentGameState") || "preGame";
    this.selectedTeamSide = localStorage.getItem("selectedTeamSide") || null;

    const q = parseInt(localStorage.getItem("currentQuarter") || "1", 10);
    this.currentQuarter = isNaN(q) ? 1 : q;
  }
}
