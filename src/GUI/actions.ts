/// <reference path="./common.ts" />

namespace ActionsGUI {
  class AddFirst extends CommonGUIBases.TooltipReadyElement<CommonGUIs.Button> {
    protected static ElementClass: string = "add-first-button";
    constructor(parent: JQuery<HTMLElement>) {
      super(new CommonGUIs.Button(parent, AddFirst.ElementClass));
      this.child.Update("+");
    }
    protected GeneratePrimaryText(): string {
      return "Add action to the start of the queue";
    }
  }
  class AddLast extends CommonGUIBases.TooltipReadyElement<CommonGUIs.Button> {
    protected static ElementClass: string = "add-last-button";

    constructor(parent: JQuery<HTMLElement>) {
      super(new CommonGUIs.Button(parent, AddLast.ElementClass));
      this.child.Update("=>");
    }
    protected GeneratePrimaryText(): string {
      return "Add action to the end of the queue";
    }
  }
  class AvailableActionBase extends CommonGUIBases.TooltipListItem<Action.Action> {
    private nameLabel: CommonGUIs.Label;
    private addFirst: AddFirst;
    private addLast: AddLast;
    constructor(parent: JQuery<HTMLElement>) {
      super(new CommonGUIBases.ListItem<Action.Action>(parent));
      this.nameLabel = new CommonGUIs.Label(this.baseElement);
      this.addFirst = new AddFirst(this.baseElement);
      this.addLast = new AddLast(this.baseElement);
    }
    SetUp(element: Action.Action): void {
      this.item = element;
      this.nameLabel.Update(element.name);
      this.addFirst.child.OnClick = () => Game.instance.AddActionToFront(this.item);
      this.addLast.child.OnClick = () => Game.instance.AddActionToBack(this.item);
    }
    Update() {}
  }
  export class AvailableActionsGUI extends CommonGUIBases.List<AvailableActionBase, Action.Action> {
    protected static ElementID: string = "AvailableActions";

    constructor(parent: JQuery<HTMLElement>) {
      super(parent, "", AvailableActionsGUI.ElementID);
      this.listItems = Array.from({ length: 10 }, (_, i) => i).map((_) => new AvailableActionBase(this._baseElement));
    }
    SetUp(actions: Action.Action[]) {
      super.SetUp(actions);
    }
    Update() {
      super.Update();
    }
  }
  class RemoveNow extends CommonGUIBases.TooltipReadyElement<CommonGUIs.Button> {
    protected static ElementClass: string = "remove-now-button";

    constructor(parent: JQuery<HTMLElement>) {
      super(new CommonGUIs.Button(parent, RemoveNow.ElementClass));
      this.child.Update("ⓧ!");
    }
    protected GeneratePrimaryText(): string {
      return "Remove the action from the queue now. You won't get the reward for completing it.";
    }
  }
  class RemoveOnCompletion extends CommonGUIBases.TooltipReadyElement<CommonGUIs.Button> {
    protected static ElementClass: string = "remove-on-completion-button";

    constructor(parent: JQuery<HTMLElement>) {
      super(new CommonGUIs.Button(parent, RemoveOnCompletion.ElementClass));
      this.child.Update("ⓧ");
    }
    protected GeneratePrimaryText(): string {
      return "Remove action from queue on next completion. You will get its reward.";
    }
  }
  class ActionQueueItemBase extends CommonGUIBases.TooltipListItem<Action.ActionInstance> {
    protected static ElementClass: string = "action-queue-item";

    private nameLabel: CommonGUIs.Label;
    private nrExecutionsLabel: CommonGUIs.Label;
    private removeNow: RemoveNow;
    private removeOnCompletion: RemoveOnCompletion;
    private progressLine: CommonGUIs.ProgressLine;
    private index: number;
    constructor(parent: JQuery<HTMLElement>, index: number) {
      super(new CommonGUIBases.ListItem<Action.ActionInstance>(parent, "vertical-box"));
      let horizontalBox = new CommonGUIs.HorizontalBox(this.baseElement);
      this.nameLabel = new CommonGUIs.Label(horizontalBox.baseElement);
      this.nrExecutionsLabel = new CommonGUIs.Label(horizontalBox.baseElement);
      this.removeNow = new RemoveNow(horizontalBox.baseElement);
      this.removeOnCompletion = new RemoveOnCompletion(horizontalBox.baseElement);
      this.progressLine = new CommonGUIs.ProgressLine(this.baseElement);
      this.index = index;
    }
    SetUp(element: Action.ActionInstance): void {
      this.progressLine.SetUp(Config.ColorPalette.actionProgFGColor, Config.ColorPalette.progressLineBGColor);
      this.item = element;
      this.nameLabel.Update(element.action.name);
      this.removeNow.child.OnClick = () => Game.instance.RemoveAction(this.index);
      this.removeOnCompletion.child.OnClick = () => Game.instance.RemoveActionOnCompletion(this.index);
    }
    Update() {
      if (!this.CanUpdate()) {
        return;
      }
      this.progressLine.Update(this.item.cost, this.item.action.cost);
      this.nrExecutionsLabel.Update("× " + this.item.nrExecutions);
    }
  }
  export class ActionQueueGUI extends CommonGUIBases.List<ActionQueueItemBase, Action.ActionInstance> {
    protected static ElementID: string = "ActionQueue";

    constructor(parent: JQuery<HTMLElement>) {
      super(parent, "", ActionQueueGUI.ElementID);
      this.listItems = Array.from({ length: 10 }, (_, i) => i).map(
        (_, i) => new ActionQueueItemBase(this._baseElement, i)
      );
    }
    SetUp(actions: Action.ActionInstance[]) {
      super.SetUp(actions);
    }
    Update() {
      super.Update();
      if (Main.instance.eventSystem.EventHappened("ActionQueueChanged")) {
        this.Refresh();
      }
    }
  }
}
