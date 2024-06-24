import { TooltipListItem, ListItem, List } from "./commonBases";
import { Label } from "./common";
import { EventSystem } from "../singletons/eventSystem";
import { Player } from "../game/player";
import { Game } from "../game/game";

class ActionQueueItemBase extends TooltipListItem<[string, number]> {
  protected static ElementClass: string = "inventory-item";

  private nameLabel: Label;
  private quantityLabel: Label;
  constructor(parent: JQuery<HTMLElement>, index: number) {
    super(new ListItem<[string, number]>(parent));
    this.nameLabel = new Label(this.baseElement!);
    this.quantityLabel = new Label(this.baseElement!);
  }
  SetUp(element: [string, number]): void {
    this.item = element;
    this.nameLabel.Update(element[0]);
    this.quantityLabel.Update(`${element[1]}/${Game.player.inventory.inventoryLimit}`);
  }
  Update() {}
}
export class InventoryGUI extends List<ActionQueueItemBase, [string, number]> {
  protected static ElementID: string = "Inventory";

  constructor(parent: JQuery<HTMLElement>) {
    super(parent, "", InventoryGUI.ElementID);
    this.listItems = Array.from({ length: 10 }, (_, i) => i).map(
      (_, i) => new ActionQueueItemBase(this._baseElement!, i)
    );
  }
  SetUp(actions: [string, number][]) {
    super.SetUp(actions);
  }
  Update() {
    super.Update();
    if (EventSystem.EventHappened("InventoryChanged")) {
      console.log("EVENT HAPPENED");
      this.SetUp(Game.player.inventory.GetNonzeroItemData());
    }
  }
}
