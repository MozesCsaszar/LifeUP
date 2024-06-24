import { Game } from "./game/game";
import { EventSystem } from "./singletons/eventSystem";
import { InstanceExistsError } from "./utils/errors";
import { GUI } from "./GUI/GUI";

class Main {
  static instance: Main;
  gui: GUI;
  // time: number;
  constructor() {
    if (Main.instance == undefined) {
      Main.instance = this;

      // create game, GUI and EventSystem
      new Game();
      this.gui = new GUI();
      new EventSystem();

      // set up GUI
      this.gui.SetUp(Game.player);

      // start main loop
      setInterval(() => this.Update(), 33);
    } else {
      throw new InstanceExistsError("Main");
    }
  }

  Update() {
    let dTime: number = 0.033;
    Game.Update(dTime);
    this.gui.Update(Game.player);
    EventSystem.Update();
  }
}

new Main();
