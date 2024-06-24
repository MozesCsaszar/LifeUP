import { TooltipListItem, ListItem, List } from "./commonBases";
import { Label } from "./common";
import { EventSystem } from "../singletons/eventSystem";
import { Game } from "../game/game";
class ActionQueueItemBase extends TooltipListItem {
    constructor(parent, index) {
        super(new ListItem(parent));
        this.nameLabel = new Label(this.baseElement);
        this.quantityLabel = new Label(this.baseElement);
    }
    SetUp(element) {
        this.item = element;
        this.nameLabel.Update(element[0]);
        this.quantityLabel.Update(`${element[1]}/${Game.player.inventory.inventoryLimit}`);
    }
    Update() { }
}
ActionQueueItemBase.ElementClass = "inventory-item";
export class InventoryGUI extends List {
    constructor(parent) {
        super(parent, "", InventoryGUI.ElementID);
        this.listItems = Array.from({ length: 10 }, (_, i) => i).map((_, i) => new ActionQueueItemBase(this._baseElement, i));
    }
    SetUp(actions) {
        super.SetUp(actions);
    }
    Update() {
        super.Update();
        if (EventSystem.EventHappened("InventoryChanged")) {
            this.SetUp(Game.player.inventory.GetNonzeroItemData());
        }
    }
}
InventoryGUI.ElementID = "Inventory";
