/// <reference path="./actions.ts" />
/// <reference path="../game/action.ts" />

class ActionsBar extends GUIElement {
  protected static ElementID: string = "ActionsBar";
  availableActions: ActionsGUI.AvailableActionsGUI;
  constructor(parent: JQuery<HTMLElement>) {
    super("", ActionsBar.ElementID, parent);
    this.availableActions = new ActionsGUI.AvailableActionsGUI(this.baseElement);
  }
  SetUp() {
    this.availableActions.SetUp(Array.from(Action.actions.values()));
  }
  Update() {
    this.availableActions.Update();
  }
}
