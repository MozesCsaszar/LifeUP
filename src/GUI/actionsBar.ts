/// <reference path="./actions.ts" />
/// <reference path="../game/action.ts" />

class ActionsBar extends GUIElement {
  protected static ElementID: string = "ActionsBar";
  availableActions: ActionsGUI.AvailableActionsGUI;
  actionQueue: ActionsGUI.ActionQueueGUI;
  constructor(parent: JQuery<HTMLElement>) {
    super("", ActionsBar.ElementID, parent);
    this.availableActions = new ActionsGUI.AvailableActionsGUI(this.baseElement);
    this.actionQueue = new ActionsGUI.ActionQueueGUI(this.baseElement);
  }
  SetUp() {
    this.availableActions.SetUp(Array.from(Action.actions.values()));
    this.actionQueue.SetUp(Game.instance.actionQueue);
  }
  Update() {
    this.availableActions.Update();
    this.actionQueue.Update();
  }
}
