/// <reference path="./game/player.ts" />
/// <reference path="./game/game.ts" />

/// <reference path="./GUI/GUI.ts" />

class Main {
  static instance: Main = undefined;
  game: Game;
  gui: GUI;
  time: number;
  get player() {
    return this.game.player;
  }
  constructor() {
    if (Main.instance == undefined) {
      Main.instance = this;

      // create game and GUI
      this.game = new Game();
      this.gui = new GUI();

      // set up GUI
      this.gui.SetUp(this.player);

      // start main loop
      setInterval(() => this.Update(), 33);
    }
  }

  Update() {
    let dTime: number = 0.033;
    this.game.Update(dTime);
    this.gui.Update(this.player);
  }
}

let main = new Main();
