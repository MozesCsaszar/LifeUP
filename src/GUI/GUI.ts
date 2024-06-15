/// <reference path="./GUIElement.ts" />
/// <reference path="./tooltip.ts" />
/// <reference path="./actionsBar.ts" />
/// <reference path="./infoBar.ts" />

class GUI extends GUIElement {
  static instance: GUI = undefined;
  static ElementID: string = "GUI";
  infoBar: InfoBar;
  actionsBar: ActionsBar;
  constructor() {
    super("", "GUI", $(document.body));
    if (GUI.instance == undefined) {
      GUI.instance = this;
      this.infoBar = new InfoBar(this.baseElement);
      this.actionsBar = new ActionsBar(this.baseElement);

      new Tooltip(this.baseElement);
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
