namespace InventoryGUI {
  class ActionQueueItemBase extends CommonGUIBases.TooltipListItem<[string, number]> {
    protected static ElementClass: string = "inventory-item";

    private nameLabel: CommonGUIs.Label;
    private quantityLabel: CommonGUIs.Label;
    constructor(parent: JQuery<HTMLElement>, index: number) {
      super(new CommonGUIBases.ListItem<[string, number]>(parent));
      this.nameLabel = new CommonGUIs.Label(this.baseElement);
      this.quantityLabel = new CommonGUIs.Label(this.baseElement);
    }
    SetUp(element: [string, number]): void {
      this.item = element;
      this.nameLabel.Update(element[0]);
      this.quantityLabel.Update(`${element[1]}/${Game.player.inventory.inventoryLimit}`);
    }
    Update() {}
  }
  export class InventoryGUI extends CommonGUIBases.List<ActionQueueItemBase, [string, number]> {
    protected static ElementID: string = "Inventory";

    constructor(parent: JQuery<HTMLElement>) {
      super(parent, "", InventoryGUI.ElementID);
      this.listItems = Array.from({ length: 10 }, (_, i) => i).map(
        (_, i) => new ActionQueueItemBase(this._baseElement, i)
      );
    }
    SetUp(actions: [string, number][]) {
      super.SetUp(actions);
    }
    Update() {
      super.Update();
      if (Main.instance.eventSystem.EventHappened("InventoryChanged")) {
        this.SetUp(Game.player.inventory.GetNonzeroItemData());
      }
    }
  }
}
