import { GUIElement } from "./GUIElement";
import { Player } from "../game/player";
import { SkillsGUI } from "./skills";
import { PlayerResourcesGUI } from "./playerResources";

export class InfoBar extends GUIElement {
  private static readonly ElementID: string = "InfoBar";
  skillsBar: SkillsGUI;
  playerResourcesBar: PlayerResourcesGUI;
  constructor(parent: JQuery<HTMLElement>) {
    super("", InfoBar.ElementID, parent);

    this.playerResourcesBar = new PlayerResourcesGUI(this.baseElement!);
    this.skillsBar = new SkillsGUI(this.baseElement!);
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
