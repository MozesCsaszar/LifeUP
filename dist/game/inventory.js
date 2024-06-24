import { Config } from "../config";
import { EventSystem } from "../singletons/eventSystem";
export class Inventory {
    constructor() {
        this.inventory = new Map();
        this.inventoryLimit = 10;
        Config.Resources.forEach((resourceName) => {
            this.inventory.set(resourceName, 0);
        });
    }
    AddItem(key, value = 1) {
        let newValue = this.inventory.get(key) ?? 0;
        if (newValue > this.inventoryLimit) {
            newValue = this.inventoryLimit;
        }
        this.inventory.set(key, newValue);
        EventSystem.TriggerEvent("InventoryChanged");
    }
    SpaceLeft(key) {
        return this.inventoryLimit - (this.inventory.get(key) ?? 0);
    }
    CanRemoveItem(key, value = 1) {
        let newValue = (this.inventory.get(key) ?? 0) - value;
        return newValue > 0;
    }
    RemoveItem(key, value = 1) {
        if (this.CanRemoveItem(key, value)) {
            this.inventory.set(key, (this.inventory.get(key) ?? 0) - value);
            EventSystem.TriggerEvent("InventoryChanged");
        }
    }
    GetNonzeroItemData() {
        let toReturn = [];
        this.inventory.forEach((value, key) => {
            if (value != 0) {
                toReturn.push([key, value]);
            }
        });
        return toReturn;
    }
}
