import { TooltipReadyElement, TooltipListItem, ListItem, List } from "./commonBases";
import { Label, Button, ProgressLine, HorizontalBox } from "./common";
import { EventSystem } from "../singletons/eventSystem";
import { Game } from "../game/game";
import { Config } from "../config";
class AddFirst extends TooltipReadyElement {
    constructor(parent) {
        super(new Button(parent, AddFirst.ElementClass));
        this.child.Update("+");
    }
    GeneratePrimaryText() {
        return "Add action to the start of the queue";
    }
}
AddFirst.ElementClass = "add-first-button";
class AddLast extends TooltipReadyElement {
    constructor(parent) {
        super(new Button(parent, AddLast.ElementClass));
        this.child.Update("=>");
    }
    GeneratePrimaryText() {
        return "Add action to the end of the queue";
    }
}
AddLast.ElementClass = "add-last-button";
class AvailableActionBase extends TooltipListItem {
    constructor(parent) {
        super(new ListItem(parent));
        this.nameLabel = new Label(this.baseElement);
        this.addFirst = new AddFirst(this.baseElement);
        this.addLast = new AddLast(this.baseElement);
    }
    SetUp(element) {
        this.item = element;
        this.nameLabel.Update(element.name);
        this.addFirst.child.OnClick = () => Game.AddActionToFront(this.item);
        this.addLast.child.OnClick = () => Game.AddActionToBack(this.item);
    }
    Update() { }
}
export class AvailableActionsGUI extends List {
    constructor(parent) {
        super(parent, "", AvailableActionsGUI.ElementID);
        this.listItems = Array.from({ length: 10 }, (_, i) => i).map((_) => new AvailableActionBase(this._baseElement));
    }
    SetUp(actions) {
        super.SetUp(actions);
    }
    Update() {
        super.Update();
    }
}
AvailableActionsGUI.ElementID = "AvailableActions";
class RemoveNow extends TooltipReadyElement {
    constructor(parent) {
        super(new Button(parent, RemoveNow.ElementClass));
        this.child.Update("ⓧ!");
    }
    GeneratePrimaryText() {
        return "Remove the action from the queue now. You won't get the reward for completing it.";
    }
}
RemoveNow.ElementClass = "remove-now-button";
class RemoveOnCompletion extends TooltipReadyElement {
    constructor(parent) {
        super(new Button(parent, RemoveOnCompletion.ElementClass));
        this.child.Update("ⓧ");
    }
    GeneratePrimaryText() {
        return "Remove action from queue on next completion. You will get its reward.";
    }
}
RemoveOnCompletion.ElementClass = "remove-on-completion-button";
class ActionQueueItemBase extends TooltipListItem {
    constructor(parent, index) {
        super(new ListItem(parent, "vertical-box"));
        let horizontalBox = new HorizontalBox(this.baseElement);
        this.nameLabel = new Label(horizontalBox.baseElement);
        this.nrExecutionsLabel = new Label(horizontalBox.baseElement);
        this.removeNow = new RemoveNow(horizontalBox.baseElement);
        this.removeOnCompletion = new RemoveOnCompletion(horizontalBox.baseElement);
        this.progressLine = new ProgressLine(this.baseElement);
        this.index = index;
    }
    SetUp(element) {
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
ActionQueueItemBase.ElementClass = "action-queue-item";
export class ActionQueueGUI extends List {
    constructor(parent) {
        super(parent, "", ActionQueueGUI.ElementID);
        this.listItems = Array.from({ length: 10 }, (_, i) => i).map((_, i) => new ActionQueueItemBase(this._baseElement, i));
    }
    SetUp(actions) {
        super.SetUp(actions);
    }
    Update() {
        super.Update();
        if (EventSystem.EventHappened("ActionQueueChanged")) {
            this.Refresh();
        }
    }
}
ActionQueueGUI.ElementID = "ActionQueue";
