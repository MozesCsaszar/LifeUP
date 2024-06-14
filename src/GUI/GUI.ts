/// <reference path="./GUIElement.ts" />
/// <reference path="./InfoBar.ts" />
/// <reference path="./tooltip.ts" />

class GUI extends GUIElement {
  static instance: GUI = undefined;
  static ElementID: string = "GUI";
  infoBar: InfoBar.InfoBar;
  constructor() {
    super("", "GUI", $(document.body));
    if (GUI.instance == undefined) {
      GUI.instance = this;
      this.infoBar = new InfoBar.InfoBar(this.baseElement);

      new Tooltip(this.baseElement);
    }
  }

  SetUp(player: Player) {
    this.infoBar.SetUp(player);
  }

  Update(player: Player) {
    this.infoBar.Update(player);

    Tooltip.instance.Update();
  }
}
