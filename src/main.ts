/// <reference path="./game/player.ts" />
/// <reference path="./game/game.ts" />
/// <reference path="./eventSystem/eventSystem.ts" />
/// <reference path="./GUI/GUI.ts" />

class Main {
  static instance: Main = undefined;
  game: Game;
  gui: GUI;
  eventSystem: EventSystem;
  time: number;
  get player() {
    return Game.player;
  }
  constructor() {
    if (Main.instance == undefined) {
      Main.instance = this;

      // create game and GUI
      this.game = new Game();
      this.gui = new GUI();
      this.eventSystem = new EventSystem();

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
    this.eventSystem.Update();
  }
}

let main = new Main();
