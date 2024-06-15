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
}
