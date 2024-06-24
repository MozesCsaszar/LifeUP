import { GUIElement } from "./GUIElement";
import { AvailableActionsGUI } from "./actions";
import { InventoryGUI } from "./inventory";
import { ActionQueueGUI } from "./actions";
import { actions } from "../game/action";
import { Game } from "../game/game";

export class ActionsBar extends GUIElement {
  protected static ElementID: string = "ActionsBar";
  availableActions: AvailableActionsGUI;
  inventory: InventoryGUI;
  actionQueue: ActionQueueGUI;
  constructor(parent: JQuery<HTMLElement>) {
    super("", ActionsBar.ElementID, parent);
    this.availableActions = new AvailableActionsGUI(this.baseElement!);
    this.inventory = new InventoryGUI(this.baseElement!);
    this.actionQueue = new ActionQueueGUI(this.baseElement!);
  }
  SetUp() {
    this.availableActions.SetUp(Array.from(actions.values()));
    this.inventory.SetUp(Game.player.inventory.GetNonzeroItemData());
    this.actionQueue.SetUp(Game.actionQueue);
  }
  Update() {
    this.availableActions.Update();
    this.inventory.Update();
    this.actionQueue.Update();
  }
}
