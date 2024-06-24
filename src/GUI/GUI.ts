import { InstanceExistsError } from "../utils/errors";
import { GUIElement } from "./GUIElement";
import { Player } from "../game/player";
import { Tooltip } from "../singletons/tooltipGUI";
import { InfoBar } from "./infoBar";
import { ActionsBar } from "./actionsBar";

export class GUI extends GUIElement {
  static instance: GUI;
  static ElementID: string = "GUI";
  infoBar: InfoBar;
  actionsBar: ActionsBar;
  constructor() {
    super("", "GUI", $(document.body));
    if (GUI.instance == undefined) {
      GUI.instance = this;
      this.infoBar = new InfoBar(this.baseElement!);
      this.actionsBar = new ActionsBar(this.baseElement!);

      new Tooltip(this.baseElement!);
    } else {
      throw new InstanceExistsError("GUI");
    }
  }

  SetUp(player: Player) {
    this.infoBar.SetUp(player);
    this.actionsBar.SetUp();
  }

  Update(player: Player) {
    this.infoBar.Update(player);
    this.actionsBar.Update();

    Tooltip.instance.Update();
  }
}
