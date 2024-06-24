import { GUIElement } from "./GUIElement";
import { SkillsGUI } from "./skills";
import { PlayerResourcesGUI } from "./playerResources";
export class InfoBar extends GUIElement {
    constructor(parent) {
        super("", InfoBar.ElementID, parent);
        this.playerResourcesBar = new PlayerResourcesGUI(this.baseElement);
        this.skillsBar = new SkillsGUI(this.baseElement);
    }
    SetUp(player) {
        this.playerResourcesBar.SetUp(player.resources);
        this.skillsBar.SetUp(player);
    }
    Update(player) {
        this.playerResourcesBar.Update();
        this.skillsBar.Update(player);
    }
}
InfoBar.ElementID = "InfoBar";
