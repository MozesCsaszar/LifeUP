/// <reference path="./GUIElement.ts" />
/// <reference path="./playerResources.ts" />
/// <reference path="./skills.ts" />

namespace InfoBar {
  export class InfoBar extends GUIElement {
    private static readonly ElementID: string = "InfoBar";
    skillsBar: SkillsGUI.SkillsGUI;
    playerResourcesBar: PlayerResourcesGUI.PlayerResourcesGUI;
    constructor(parent: JQuery<HTMLElement>) {
      super("", InfoBar.ElementID, parent);

      this.playerResourcesBar = new PlayerResourcesGUI.PlayerResourcesGUI(this.baseElement);
      this.skillsBar = new SkillsGUI.SkillsGUI(this.baseElement);
    }

    SetUp(player: Player) {
      this.playerResourcesBar.SetUp(player.resources);
      this.skillsBar.SetUp(player);
    }

    Update(player: Player) {
      this.playerResourcesBar.Update();
      this.skillsBar.Update(player);
    }
  }
}
