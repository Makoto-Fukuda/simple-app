// stateMachine.js
export class StateMachine {
  constructor(config) {
    this.game = config.game;
    this.operation = config.operation;
    this.confirm = config.confirm;

    this.teams = config.teams;
    this.players = config.players;
    this.ui = config.ui;
    this.sound = config.sound;

    // 初期状態
    this.currentGameState = "preGame";
    this.currentOperationMode = null;
    this.currentConfirmState = null;
  }

  // -----------------------------
  // GameState（第1階層）
  // -----------------------------
  transitionGame(action) {
    const table = this.game.transitions[this.currentGameState];
    if (!table) return;

    const next = table[action];
    if (next) {
      this.currentGameState = next;
      this.currentOperationMode = null;
      this.currentConfirmState = null;
    }
  }

  // -----------------------------
  // OperationMode（第2階層）
  // -----------------------------
  enterOperationMode(mode) {
    if (this.currentGameState !== "inGame") return;
    if (!this.operation.modes[mode]) return;

    this.currentOperationMode = mode;
    this.currentConfirmState = null;
  }

  transitionOperation(action) {
    if (!this.currentOperationMode) return;

    const table = this.operation.transitions[this.currentOperationMode];
    if (!table) return;

    const next = table[action];
    if (next) {
      // confirmFoul / confirmSubstitution / halfTime
      if (next === "halfTime") {
        this.currentGameState = "halfTime";
        this.currentOperationMode = null;
        this.currentConfirmState = null;
      } else {
        this.currentConfirmState = next;
      }
    }
  }

  // -----------------------------
  // ConfirmState（第3階層）
  // -----------------------------
  transitionConfirm(action) {
    if (!this.currentConfirmState) return;

    const table = this.confirm.transitions[this.currentConfirmState];
    if (!table) return;

    const next = table[action];
    if (!next) return;

    // OK → inGame / Fix → foul
    if (next === "inGame") {
      this.currentGameState = "inGame";
      this.currentOperationMode = null;
      this.currentConfirmState = null;
    } else {
      this.currentOperationMode = next;
      this.currentConfirmState = null;
    }
  }

  // -----------------------------
  // チームファール操作
  // -----------------------------
  addTeamFoul(teamSide) {
    const team = this.teams.teams[teamSide];
    team.teamFouls += 1;

    const max = this.teams.rules.maxTeamFoulsPerQuarter;
    if (team.teamFouls >= max) {
      console.log("ボーナス状態");
    }
  }

  resetTeamFouls() {
    this.teams.teams.teamA.teamFouls = 0;
    this.teams.teams.teamB.teamFouls = 0;
  }

  // -----------------------------
  // 個人ファール操作
  // -----------------------------
  addPersonalFoul(playerId) {
    const p = this.players.players.find(x => x.playerId === playerId);
    if (!p) return;

    p.personalFouls += 1;

    const max = this.players.rules.maxPersonalFouls;
    if (p.personalFouls >= max) {
      p.isDisqualified = true;
    }
  }

  // -----------------------------
  // 交代操作
  // -----------------------------
  substitute(onCourtId, benchId) {
    const on = this.players.players.find(x => x.playerId === onCourtId);
    const bn = this.players.players.find(x => x.playerId === benchId);

    if (!on || !bn) return;

    on.isOnCourt = false;
    on.isBench = true;

    bn.isOnCourt = true;
    bn.isBench = false;
  }

  // -----------------------------
  // 状態の取得（UI側で使う）
  // -----------------------------
  getState() {
    return {
      game: this.currentGameState,
      operation: this.currentOperationMode,
      confirm: this.currentConfirmState
    };
  }
}
