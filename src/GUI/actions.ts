import { TooltipReadyElement, TooltipListItem, ListItem, List } from "./commonBases";
import { Label, Button, ProgressLine, HorizontalBox } from "./common";
import { Action, ActionInstance } from "../game/action";
import { EventSystem } from "../singletons/eventSystem";
import { Game } from "../game/game";
import { Config } from "../config";

class AddFirst extends TooltipReadyElement<Button> {
  protected static ElementClass: string = "add-first-button";
  constructor(parent: JQuery<HTMLElement>) {
    super(new Button(parent, AddFirst.ElementClass));
    this.child.Update("+");
  }
  protected GeneratePrimaryText(): string {
    return "Add action to the start of the queue";
  }
}
class AddLast extends TooltipReadyElement<Button> {
  protected static ElementClass: string = "add-last-button";

  constructor(parent: JQuery<HTMLElement>) {
    super(new Button(parent, AddLast.ElementClass));
    this.child.Update("=>");
  }
  protected GeneratePrimaryText(): string {
    return "Add action to the end of the queue";
  }
}
class AvailableActionBase extends TooltipListItem<Action> {
  private nameLabel: Label;
  private addFirst: AddFirst;
  private addLast: AddLast;
  constructor(parent: JQuery<HTMLElement>) {
    super(new ListItem<Action>(parent));
    this.nameLabel = new Label(this.baseElement!);
    this.addFirst = new AddFirst(this.baseElement!);
    this.addLast = new AddLast(this.baseElement!);
  }
  SetUp(element: Action): void {
    this.item = element;
    this.nameLabel.Update(element.name);
    this.addFirst.child.OnClick = () => Game.AddActionToFront(this.item!);
    this.addLast.child.OnClick = () => Game.AddActionToBack(this.item!);
  }
  Update() {}
}
export class AvailableActionsGUI extends List<AvailableActionBase, Action> {
  protected static ElementID: string = "AvailableActions";

  constructor(parent: JQuery<HTMLElement>) {
    super(parent, "", AvailableActionsGUI.ElementID);
    this.listItems = Array.from({ length: 10 }, (_, i) => i).map((_) => new AvailableActionBase(this._baseElement!));
  }
  SetUp(actions: Action[]) {
    super.SetUp(actions);
  }
  Update() {
    super.Update();
  }
}
class RemoveNow extends TooltipReadyElement<Button> {
  protected static ElementClass: string = "remove-now-button";

  constructor(parent: JQuery<HTMLElement>) {
    super(new Button(parent, RemoveNow.ElementClass));
    this.child.Update("ⓧ!");
  }
  protected GeneratePrimaryText(): string {
    return "Remove the action from the queue now. You won't get the reward for completing it.";
  }
}
class RemoveOnCompletion extends TooltipReadyElement<Button> {
  protected static ElementClass: string = "remove-on-completion-button";

  constructor(parent: JQuery<HTMLElement>) {
    super(new Button(parent, RemoveOnCompletion.ElementClass));
    this.child.Update("ⓧ");
  }
  protected GeneratePrimaryText(): string {
    return "Remove action from queue on next completion. You will get its reward.";
  }
}
class ActionQueueItemBase extends TooltipListItem<ActionInstance> {
  protected static ElementClass: string = "action-queue-item";

  private nameLabel: Label;
  private nrExecutionsLabel: Label;
  private removeNow: RemoveNow;
  private removeOnCompletion: RemoveOnCompletion;
  private progressLine: ProgressLine;
  private index: number;
  constructor(parent: JQuery<HTMLElement>, index: number) {
    super(new ListItem<ActionInstance>(parent, "vertical-box"));
    let horizontalBox = new HorizontalBox(this.baseElement!);
    this.nameLabel = new Label(horizontalBox.baseElement!);
    this.nrExecutionsLabel = new Label(horizontalBox.baseElement!);
    this.removeNow = new RemoveNow(horizontalBox.baseElement!);
    this.removeOnCompletion = new RemoveOnCompletion(horizontalBox.baseElement!);
    this.progressLine = new ProgressLine(this.baseElement!);
    this.index = index;
  }
  SetUp(element: ActionInstance): void {
    this.progressLine.SetUp(Config.ColorPalette.actionProgFGColor, Config.ColorPalette.progressLineBGColor);
    this.item = element;
    this.nameLabel.Update(element.action.name);
    this.removeNow.child.OnClick = () => Game.RemoveAction(this.index);
    this.removeOnCompletion.child.OnClick = () => Game.RemoveActionOnCompletion(this.index);
  }
  Update() {
    if (!this.CanUpdate()) {
      return;
    }
    this.progressLine.Update(this.item?.cost ?? 0, this.item?.action.cost ?? 0);
    this.nrExecutionsLabel.Update("× " + (this.item?.nrExecutions ?? 0));
  }
}
export class ActionQueueGUI extends List<ActionQueueItemBase, ActionInstance> {
  protected static ElementID: string = "ActionQueue";

  constructor(parent: JQuery<HTMLElement>) {
    super(parent, "", ActionQueueGUI.ElementID);
    this.listItems = Array.from({ length: 10 }, (_, i) => i).map(
      (_, i) => new ActionQueueItemBase(this._baseElement!, i)
    );
  }
  SetUp(actions: ActionInstance[]) {
    super.SetUp(actions);
  }
  Update() {
    super.Update();
    if (EventSystem.EventHappened("ActionQueueChanged")) {
      this.Refresh();
    }
  }
}
