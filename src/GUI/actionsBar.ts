/// <reference path="./actions.ts" />
/// <reference path="./inventory.ts" />
/// <reference path="../game/action.ts" />

class ActionsBar extends GUIElement {
  protected static ElementID: string = "ActionsBar";
  availableActions: ActionsGUI.AvailableActionsGUI;
  inventory: InventoryGUI.InventoryGUI;
  actionQueue: ActionsGUI.ActionQueueGUI;
  constructor(parent: JQuery<HTMLElement>) {
    super("", ActionsBar.ElementID, parent);
    this.availableActions = new ActionsGUI.AvailableActionsGUI(this.baseElement);
    this.inventory = new InventoryGUI.InventoryGUI(this.baseElement);
    this.actionQueue = new ActionsGUI.ActionQueueGUI(this.baseElement);
  }
  SetUp() {
    this.availableActions.SetUp(Array.from(Action.actions.values()));
    this.inventory.SetUp(Game.player.inventory.GetNonzeroItemData());
    this.actionQueue.SetUp(Game.instance.actionQueue);
  }
  Update() {
    this.availableActions.Update();
    this.inventory.Update();
    this.actionQueue.Update();
  }
}
