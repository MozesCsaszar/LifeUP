/// <reference path="./player/player.ts" />
/// <reference path="./GUI/GUI.ts" />

class Main {
  static instance: Main = undefined;
  player: Player;
  gui: GUI;
  time: number;
  constructor() {
    if (Main.instance == undefined) {
      Main.instance = this;
      this.player = new Player();
      this.gui = new GUI();
      // set up GUI
      this.gui.SetUp(this.player);

      // start main loop
      setInterval(() => this.Update(), 33);
    }
  }

  Update() {
    let dTime: number = 0.033;
    let experience: number = 100;
    this.player.Update(experience * dTime);
    this.gui.Update(this.player);
  }
}

let main = new Main();
