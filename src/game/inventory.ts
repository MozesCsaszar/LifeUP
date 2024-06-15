class Inventory {
  private inventory: Map<string, number> = new Map<string, number>();
  inventoryLimit: number = 10;
  constructor() {
    Config.Resources.forEach((resourceName) => {
      this.inventory.set(resourceName, 0);
    });
  }
  AddItem(key: string, value: number = 1) {
    let newValue: number = this.inventory.get(key) + value;
    if (newValue > this.inventoryLimit) {
      newValue = this.inventoryLimit;
    }
    this.inventory.set(key, newValue);
    Main.instance.eventSystem.TriggerEvent("InventoryChanged");
  }
  SpaceLeft(key: string): number {
    return this.inventoryLimit - this.inventory.get(key);
  }
  CanRemoveItem(key: string, value: number = 1): boolean {
    let newValue: number = this.inventory.get(key) - value;
    return newValue > 0;
  }
  RemoveItem(key: string, value: number = 1) {
    if (this.CanRemoveItem(key, value)) {
      this.inventory.set(key, this.inventory.get(key) - value);
      Main.instance.eventSystem.TriggerEvent("InventoryChanged");
    }
  }
  GetNonzeroItemData(): [string, number][] {
    let toReturn: [string, number][] = [];
    this.inventory.forEach((value, key) => {
      if (value != 0) {
        toReturn.push([key, value]);
      }
    });
    return toReturn;
  }
}
