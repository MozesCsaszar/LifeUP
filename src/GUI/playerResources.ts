/// <reference path="./common.ts" />

namespace PlayerResourcesGUI {
  class ResourceBar extends CommonGUIBases.TooltipReadyElement<CommonGUIs.ProgressLine> {
    value: BoundedVar;
    resourceName: string;
    constructor(parent: JQuery<HTMLElement>, resourceName: string) {
      super(new CommonGUIs.ProgressLine(parent, "", true));

      this.resourceName = resourceName;
    }

    SetUp(value: BoundedVar) {
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

    protected GeneratePrimaryText(): string {
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
  export class PlayerResourcesGUI extends CommonGUIs.VerticalBox {
    private static ElementID: string = "PlayerResources";
    resourceBars: ResourceBar[] = [];
    constructor(parent: JQuery<HTMLElement>) {
      super(parent, "", PlayerResourcesGUI.ElementID);
      Config.PlayerResourceNames.forEach((resourceName) => {
        this.resourceBars.push(new ResourceBar(this.baseElement, resourceName));
      });
    }
    SetUp(playerResources: PlayerResources) {
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
}
