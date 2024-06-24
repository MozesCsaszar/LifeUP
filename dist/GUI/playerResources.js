import { TooltipReadyElement } from "./commonBases";
import { ProgressLine, VerticalBox } from "./common";
import { BoundedVar } from "../game/player";
import { Config } from "../config";
class ResourceBar extends TooltipReadyElement {
    constructor(parent, resourceName) {
        super(new ProgressLine(parent, "", true));
        this.value = new BoundedVar(0);
        this.resourceName = resourceName;
    }
    SetUp(value) {
        this.value = value;
        switch (this.resourceName) {
            case "Health":
                this.child.SetUp(Config.ColorPalette.playerResourceColors.health, Config.ColorPalette.progressLineBGColor);
                break;
            case "Stamina":
                this.child.SetUp(Config.ColorPalette.playerResourceColors.stamina, Config.ColorPalette.progressLineBGColor);
                break;
            case "Mana":
                this.child.SetUp(Config.ColorPalette.playerResourceColors.mana, Config.ColorPalette.progressLineBGColor);
                break;
        }
    }
    Update() {
        this.child.Update(this.value.val, this.value.max, 0, this.value.ToString());
    }
    GeneratePrimaryText() {
        switch (this.resourceName) {
            case "Health":
                return "Your health. When this reaches 0, you die.";
            case "Stamina":
                return "Your stamina, used to perform physical actions.";
            case "Mana":
                return "Your mana, used to perform magical actions.";
        }
        return "";
    }
}
export class PlayerResourcesGUI extends VerticalBox {
    constructor(parent) {
        super(parent, "", PlayerResourcesGUI.ElementID);
        this.resourceBars = [];
        Config.PlayerResourceNames.forEach((resourceName) => {
            this.resourceBars.push(new ResourceBar(this.baseElement, resourceName));
        });
    }
    SetUp(playerResources) {
        Config.PlayerResourceNames.forEach((resourceName, i) => {
            switch (resourceName) {
                case "Health":
                    this.resourceBars[i].SetUp(playerResources.health);
                    break;
                case "Stamina":
                    this.resourceBars[i].SetUp(playerResources.stamina);
                    break;
                case "Mana":
                    this.resourceBars[i].SetUp(playerResources.mana);
                    break;
            }
        });
    }
    Update() {
        this.resourceBars.forEach((resourceBar) => {
            resourceBar.Update();
        });
    }
}
PlayerResourcesGUI.ElementID = "PlayerResources";
