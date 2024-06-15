class ColorPalette {
    constructor(skillProgressForegroundColors, actionProgressForegroundColor, progressLineBackgroundColor, playerResourceColors) {
        this.skillProgFGColors = skillProgressForegroundColors.map((elem) => `rgb(${elem})`);
        this.actionProgFGColor = `rgb(${actionProgressForegroundColor})`;
        this.progressLineBGColor = `rgb(${progressLineBackgroundColor})`;
        this.playerResourceColors = playerResourceColors;
        this.playerResourceColors.health = `rgb(${this.playerResourceColors.health})`;
        this.playerResourceColors.stamina = `rgb(${this.playerResourceColors.stamina})`;
        this.playerResourceColors.mana = `rgb(${this.playerResourceColors.mana})`;
    }
}
class Config {
    static get ColorPalette() {
        return Config.ColorPalettes[this.CurrentColorPalette];
    }
    static FormatNumber(toFormat) {
        if (toFormat < 1000) {
            return toFormat.toPrecision(this.NrSignificantDigits);
        }
        else {
            return toFormat.toExponential(this.NrExponentialDigits).replace("+", "");
        }
    }
    static FormatInteger(toFormat) {
        return toFormat.toFixed(0);
    }
    static StageToString(stage, startingStage) {
        switch (stage) {
            case startingStage:
                return this.StageNames[stage];
            case startingStage + 1:
                return `${this.StageNames[stage - 1]} ${this.PrestigeStageName}`;
            default:
                return this.StageNames[stage - 1];
        }
    }
    static SurroundWithHTMLTag(tag, content) {
        return `<${tag}>${content}</${tag}>`;
    }
}
Config.NrSignificantDigits = 4;
Config.NrExponentialDigits = 2;
Config.NrStages = 2;
Config.ColorPalettes = [
    new ColorPalette(["185,30,30", "30,185,30"], "20,120,120", "20,20,20", {
        health: "185,30,30",
        stamina: "30,185,30",
        mana: "30,30,185",
    }),
];
Config.CurrentColorPalette = 0;
Config.StageNames = ["Individual"];
Config.PrestigeStageName = "Prestige";
Config.SkillNames = [
    "Hunting",
    "Fighting",
    "Navigation",
    "Processing",
    "Extraction",
    "Production",
    "Construction",
];
Config.Resources = ["Stone", "Wood", "Berries"];
Config.LogicToGUIEvents = ["ActionQueueChanged", "InventoryChanged"];
Config.PlayerResourceNames = ["Health", "Stamina", "Mana"];
var Skill;
(function (Skill_1) {
    class SkillStage {
        constructor(stage) {
            this.level = 0;
            this.multiplier = 1;
            this.experience = 0;
            this.stage = stage;
            this.required = 10;
        }
        GetSkillMultiplier() {
            return this.multiplier;
        }
        UpdateExperience(experience) {
            this.experience += experience;
            this.TryLevelUp();
        }
        TryLevelUp() {
            let canLevelUp = this.required <= this.experience;
            if (canLevelUp) {
                let oldRequired = this.required;
                this.level += 1;
                this.required = SkillStage.ScalingFunctions[this.stage](this.required, this.level);
                this.experience -= oldRequired;
                this.multiplier = SkillStage.MultiplierFunction(this.level, SkillStage.MultiplierBaseValues[this.stage]);
            }
            return 0;
        }
        GetData() {
            return [this.stage, this.level, this.experience, this.required, this.GetSkillMultiplier()];
        }
    }
    SkillStage.ScalingFunctions = [
        (required, _) => required + Math.floor(required / 10),
        (required, level) => required + level * level + 1,
    ];
    SkillStage.MultiplierFunction = (level, baseValue) => Math.pow(baseValue, level);
    SkillStage.MultiplierBaseValues = [1.05, 1.05];
    class Skill {
        constructor(name) {
            this.stages = [];
            for (let i = 0; i < Config.NrStages; i += 1) {
                this.stages.push(new SkillStage(i));
            }
            this.name = name;
        }
        GetTotalMultiplier() {
            return this.stages.map((stage) => stage.GetSkillMultiplier()).reduce((prev, curr) => prev * curr, 1);
        }
        UpdateExperience(experience) {
            this.stages.forEach((stage) => {
                stage.UpdateExperience(experience);
            });
        }
    }
    Skill_1.Skill = Skill;
})(Skill || (Skill = {}));
class Inventory {
    constructor() {
        this.inventory = new Map();
        this.inventoryLimit = 10;
        Config.Resources.forEach((resourceName) => {
            this.inventory.set(resourceName, 0);
        });
    }
    AddItem(key, value = 1) {
        let newValue = this.inventory.get(key) + value;
        if (newValue > this.inventoryLimit) {
            newValue = this.inventoryLimit;
        }
        this.inventory.set(key, newValue);
        Main.instance.eventSystem.TriggerEvent("InventoryChanged");
    }
    SpaceLeft(key) {
        return this.inventoryLimit - this.inventory.get(key);
    }
    CanRemoveItem(key, value = 1) {
        let newValue = this.inventory.get(key) - value;
        return newValue > 0;
    }
    RemoveItem(key, value = 1) {
        if (this.CanRemoveItem(key, value)) {
            this.inventory.set(key, this.inventory.get(key) - value);
            Main.instance.eventSystem.TriggerEvent("InventoryChanged");
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
/// <reference path="./skill.ts" />
/// <reference path="./inventory.ts" />
class BoundedVar {
    constructor(val, max, min) {
        this._val = val;
        this._min = min !== null && min !== void 0 ? min : 0;
        this._max = max !== null && max !== void 0 ? max : val;
    }
    get val() {
        return this._val;
    }
    set val(newVal) {
        this._val = newVal > this._max ? this._max : newVal;
        this._val = newVal < this._min ? this._min : this._val;
    }
    get min() {
        return this._min;
    }
    set min(newVal) {
        this._min = newVal > this._val ? this._val : newVal;
    }
    get max() {
        return this._max;
    }
    set max(newVal) {
        this._max = newVal < this._val ? this._val : newVal;
    }
    ToString() {
        return `${Config.FormatNumber(this.val)}/${Config.FormatNumber(this.max)}`;
    }
}
class PlayerResourceChange {
    constructor(health, stamina, mana) {
        this.health = health;
        this.stamina = stamina;
        this.mana = mana;
    }
}
class PlayerResources {
    constructor(startingValues = 100) {
        this.health = new BoundedVar(startingValues);
        this.stamina = new BoundedVar(startingValues);
        this.mana = new BoundedVar(startingValues);
    }
    Update(resourceChange) {
        this.health.val += resourceChange.health;
        this.stamina.val += resourceChange.stamina;
        this.mana.val += resourceChange.mana;
    }
}
class Player {
    constructor() {
        this.skills = new Map();
        Config.SkillNames.forEach((skillName) => {
            this.skills.set(skillName, new Skill.Skill(skillName));
        });
        this.resources = new PlayerResources();
        this.inventory = new Inventory();
    }
    Update(dTime) { }
}
class Game {
    get paused() {
        return this.actionQueue.length == 0;
    }
    static get player() {
        return this.instance._player;
    }
    constructor() {
        this.actionQueue = [];
        if (Game.instance == undefined) {
            Game.instance = this;
            this._player = new Player();
        }
    }
    GetNrExecutions(action) {
        let nrExecutions = 1;
        if (action.outcome instanceof Action.AddToInventory) {
            let resourceName = action.outcome.resourceName;
            nrExecutions = Game.player.inventory.SpaceLeft(resourceName);
        }
        return nrExecutions;
    }
    AddActionToBack(action) {
        this.actionQueue.push(new Action.ActionInstance(action, this.GetNrExecutions(action)));
        Main.instance.eventSystem.TriggerEvent("ActionQueueChanged");
    }
    AddActionToFront(action) {
        this.actionQueue.unshift(new Action.ActionInstance(action, this.GetNrExecutions(action)));
        Main.instance.eventSystem.TriggerEvent("ActionQueueChanged");
    }
    RemoveAction(index) {
        this.actionQueue.splice(index, 1);
        Main.instance.eventSystem.TriggerEvent("ActionQueueChanged");
    }
    RemoveActionOnCompletion(index) {
        this.actionQueue[index].nrExecutions = 1;
        Main.instance.eventSystem.TriggerEvent("ActionQueueChanged");
    }
    RemoveFirstIfDone() {
        if (this.actionQueue[0].nrExecutions == 0) {
            this.actionQueue.shift();
            Main.instance.eventSystem.TriggerEvent("ActionQueueChanged");
        }
    }
    Update(dTime) {
        if (!this.paused) {
            this.PrintQueue();
            this._player.Update(dTime);
            // do actions while you still have time left
            let timeLeft = this.actionQueue[0].Update(dTime, this._player);
            this.RemoveFirstIfDone();
            while (timeLeft > 0 && !this.paused) {
                timeLeft = this.actionQueue[0].Update(dTime, this._player);
                this.RemoveFirstIfDone();
            }
        }
    }
    PrintQueue() {
        console.log(this.actionQueue
            .map((elem) => elem.nrExecutions + " " + elem.cost + " " + elem.action.name)
            .reduce((prev, next) => prev + "\n" + next, ""));
    }
}
Game.instance = undefined;
class EventSystem {
    constructor() {
        this.events = new Map();
        if (EventSystem.instance == undefined) {
            EventSystem.instance = this;
            Config.LogicToGUIEvents.forEach((event) => {
                this.events.set(event, false);
            });
        }
    }
    // reset event triggers
    Update() {
        for (let key in this.events.keys()) {
            this.events.set(key, false);
        }
    }
    // set an event as triggered this round
    TriggerEvent(eventName) {
        this.events.set(eventName, true);
    }
    // check if an event happened
    EventHappened(eventName) {
        return this.events.get(eventName);
    }
}
EventSystem.instance = undefined;
/*
GUIElement Lifecycle:
  -constructor <- create all components needed and set static style
  -SetUp <- change information that doesn't need to be set every frame
  -Update <- called every frame for changing information
  -Show <- show base element in the state it currently is in
  -Hide <- hide base element
*/
class GUIElement {
    constructor(classes, id, parent, center = false) {
        if (parent != undefined)
            this._baseElement = this.CreateObject(center ? `${classes} center-text` : classes, id, parent);
    }
    CreateObject(classes, id, parent) {
        return $(`<div class='${classes}' id='${id}'>`).appendTo(parent);
    }
    get baseElement() {
        return this._baseElement;
    }
    CanUpdate() {
        if (this._baseElement.is(":hidden")) {
            return false;
        }
        return true;
    }
    Show() {
        this._baseElement.show();
    }
    Hide() {
        this._baseElement.hide();
    }
}
/// <reference path="./GUIElement.ts" />
var CommonGUIs;
(function (CommonGUIs) {
    class ProgressLine extends GUIElement {
        constructor(parent, extraClasses = "", withLabel = false) {
            // create base container
            super(`${ProgressLine.ElementClass} ${extraClasses}`, "", parent);
            // create progress lines
            this.background = this.CreateObject(ProgressLine.ElementClass + ProgressLine.BackgroundClassSuffix, "", this.baseElement);
            this.foreground = this.CreateObject(ProgressLine.ElementClass + ProgressLine.ForegroundClassSuffix, "", this.baseElement);
            if (withLabel) {
                this.label = new CommonGUIs.Label(this.baseElement, "", true);
            }
        }
        SetUp(foregroundColor, backgroundColor) {
            this.foreground.css("backgroundColor", foregroundColor);
            this.background.css("backgroundColor", backgroundColor);
        }
        Update(current, max, min = 0, labelText = "") {
            var _a;
            if (!this.CanUpdate()) {
                return;
            }
            // length of the progress bar in the interval [0,1];
            let length = (current - min) / (max - min);
            // convert it to a percentage from 0 to 100
            length = length * 100;
            // set width of the foreground object
            this.foreground.css("width", length + "%");
            (_a = this.label) === null || _a === void 0 ? void 0 : _a.Update(labelText);
        }
    }
    ProgressLine.ElementClass = "progress-line";
    ProgressLine.ForegroundClassSuffix = "-foreground";
    ProgressLine.BackgroundClassSuffix = "-background";
    CommonGUIs.ProgressLine = ProgressLine;
    class Label extends GUIElement {
        constructor(parent, extraClasses = "", center = true) {
            super(`${Label.ElementClass} ${extraClasses}`, "", parent, center);
        }
        Update(content) {
            this.baseElement.text(content);
        }
    }
    Label.ElementClass = "label";
    CommonGUIs.Label = Label;
    class TextBox extends GUIElement {
        constructor(parent, extraClasses = "", center = true) {
            super(`${TextBox.ElementClass} ${extraClasses}`, "", parent, center);
        }
        Update(content) {
            this.baseElement.html(content);
        }
    }
    TextBox.ElementClass = "label";
    CommonGUIs.TextBox = TextBox;
    class VerticalBox extends GUIElement {
        constructor(parent, extraClasses = "", extraID = "") {
            super(`${VerticalBox.ElementClass} ${extraClasses}`, extraID, parent);
        }
    }
    VerticalBox.ElementClass = "vertical-box";
    CommonGUIs.VerticalBox = VerticalBox;
    class HorizontalBox extends GUIElement {
        constructor(parent, extraClasses = "", extraID = "") {
            super(`${HorizontalBox.ElementClass} ${extraClasses}`, extraID, parent);
        }
    }
    HorizontalBox.ElementClass = "horizontal-box";
    CommonGUIs.HorizontalBox = HorizontalBox;
    class Button extends GUIElement {
        constructor(parent, extraClasses = "", extraID = "", center = true) {
            super(`${Button.ElementClass} ${extraClasses}`, extraID, parent, center);
            this.baseElement.on("click", () => this.OnClick());
        }
        OnClick() { }
        Update(content) {
            this.baseElement.html(content);
        }
    }
    Button.ElementClass = "button";
    CommonGUIs.Button = Button;
})(CommonGUIs || (CommonGUIs = {}));
var CommonGUIBases;
(function (CommonGUIBases) {
    class TooltipReadyElement extends GUIElement {
        constructor(child) {
            super();
            this.tooltipWidth = "20%";
            this.child = child;
            this.baseElement.on("mouseenter", () => this.OnMouseEnter());
            this.baseElement.on("mouseleave", () => this.OnMouseLeave());
        }
        GeneratePrimaryText() {
            return "";
        }
        GenerateSecondaryText() {
            return "";
        }
        OnMouseEnter() {
            Tooltip.instance.SetUp(this.tooltipWidth, this.baseElement, () => this.GeneratePrimaryText(), () => this.GenerateSecondaryText());
            Tooltip.instance.Show();
        }
        OnMouseLeave() {
            Tooltip.instance.Hide();
        }
        get baseElement() {
            return this.child.baseElement;
        }
        Show() {
            this.child.Show();
        }
        Hide() {
            this.child.Hide();
        }
        CanUpdate() {
            return this.child.CanUpdate();
        }
    }
    CommonGUIBases.TooltipReadyElement = TooltipReadyElement;
    class ListItem extends GUIElement {
        constructor(parent, extraClasses = "") {
            super(`${ListItem.ElementClass} ${extraClasses}`, "", parent);
        }
        SetUp(element) {
            this.item = element;
        }
        Update() { }
    }
    ListItem.ElementClass = "list-item";
    CommonGUIBases.ListItem = ListItem;
    class TooltipListItem extends TooltipReadyElement {
        constructor(listItem) {
            super(listItem);
        }
        get item() {
            return this.child.item;
        }
        set item(newItem) {
            this.child.item = newItem;
        }
        SetUp(element) {
            this.child.SetUp(element);
        }
        Update() { }
    }
    CommonGUIBases.TooltipListItem = TooltipListItem;
    class List extends CommonGUIs.VerticalBox {
        constructor(parent, extraClasses = "", extraID = "") {
            super(parent, `${List.ElementClass} ${extraClasses}`, extraID);
            this.listItems = [];
            this.currentPage = 0;
        }
        get nrPages() {
            return (this.listContents.length - 1) / List.NrElementsPerPage + 1;
        }
        /**
         * Set up the list with a new list of contents
         * @param listContents the list to follow and their content to display
         */
        SetUp(listContents) {
            this.listContents = listContents;
            this.currentPage = 0;
            this.Refresh();
        }
        /**
         * Refresh the list with a new page of items;
         */
        Refresh() {
            this.listItems.forEach((element, i) => {
                let index = this.currentPage * List.NrElementsPerPage + i;
                if (index < this.listContents.length) {
                    element.Show();
                    element.SetUp(this.listContents[index]);
                }
                else {
                    element.Hide();
                }
            });
        }
        /**
         * Go to the next page if possible
         */
        NextPage() {
            if (this.currentPage + 1 < this.nrPages) {
                this.currentPage += 1;
                this.Refresh();
            }
        }
        /**
         * Go to the previous page if possible
         */
        PreviousPage() {
            if (this.currentPage - 1 > 0) {
                this.currentPage -= 1;
                this.Refresh();
            }
        }
        /**
         * Update the contents of each element's moving parts
         */
        Update() {
            if (!this.CanUpdate()) {
                return;
            }
            this.listItems.forEach((element) => {
                element.Update();
            });
        }
    }
    List.NrElementsPerPage = 15;
    List.ElementClass = "list";
    CommonGUIBases.List = List;
})(CommonGUIBases || (CommonGUIBases = {}));
/// <reference path="./common.ts" />
class Tooltip extends CommonGUIs.VerticalBox {
    constructor(parent) {
        if (Tooltip.instance == undefined) {
            super(parent, "", Tooltip.ElementID);
            this.primaryInformation = new CommonGUIs.TextBox(this.baseElement);
            this.secondaryInformation = new CommonGUIs.TextBox(this.baseElement);
            this.Hide();
            Tooltip.instance = this;
        }
    }
    CalculateTopLeft(tooltipFor) {
        let objectPos = tooltipFor.offset();
        let objectWidth = tooltipFor.outerWidth(), objectHeight = tooltipFor.outerHeight();
        let tooltipWidth = this.baseElement.outerWidth(), tooltipHeight = this.baseElement.outerHeight();
        objectPos.left += objectWidth / 2 - tooltipWidth / 2;
        objectPos.top += objectHeight;
        //adjust left position if tooltip would go out of the screen
        let bodyWidth = $(document.body).outerWidth(), bodyHeight = $(document.body).outerHeight();
        if (objectPos.left + tooltipWidth > bodyWidth) {
            objectPos.left = bodyWidth - tooltipWidth;
        }
        else if (objectPos.left < 0) {
            objectPos.left = 0;
        }
        //adjust top position if tooltip would go out of the screen
        if (objectPos.top > bodyHeight) {
            objectPos.top -= objectHeight + tooltipHeight;
        }
        return objectPos;
    }
    SetUp(baseWidth, tooltipFor, getPrimaryInfo, getSecondaryInfo) {
        this.getPrimaryInfo = getPrimaryInfo;
        this.getSecondaryInfo = getSecondaryInfo;
        // initial text and width updates to be able to set the tooltip position
        this.primaryInformation.Update(this.getPrimaryInfo());
        this.secondaryInformation.Update(this.getSecondaryInfo());
        this.baseElement.css("width", baseWidth);
        this.baseElement.css(this.CalculateTopLeft(tooltipFor));
    }
    Update() {
        if (!this.CanUpdate()) {
            return;
        }
        this.primaryInformation.Update(this.getPrimaryInfo());
        this.secondaryInformation.Update(this.getSecondaryInfo());
    }
}
Tooltip.ElementID = "Tooltip";
Tooltip.instance = undefined;
/// <reference path="./common.ts" />
var ActionsGUI;
(function (ActionsGUI) {
    class AddFirst extends CommonGUIBases.TooltipReadyElement {
        constructor(parent) {
            super(new CommonGUIs.Button(parent, AddFirst.ElementClass));
            this.child.Update("+");
        }
        GeneratePrimaryText() {
            return "Add action to the start of the queue";
        }
    }
    AddFirst.ElementClass = "add-first-button";
    class AddLast extends CommonGUIBases.TooltipReadyElement {
        constructor(parent) {
            super(new CommonGUIs.Button(parent, AddLast.ElementClass));
            this.child.Update("=>");
        }
        GeneratePrimaryText() {
            return "Add action to the end of the queue";
        }
    }
    AddLast.ElementClass = "add-last-button";
    class AvailableActionBase extends CommonGUIBases.TooltipListItem {
        constructor(parent) {
            super(new CommonGUIBases.ListItem(parent));
            this.nameLabel = new CommonGUIs.Label(this.baseElement);
            this.addFirst = new AddFirst(this.baseElement);
            this.addLast = new AddLast(this.baseElement);
        }
        SetUp(element) {
            this.item = element;
            this.nameLabel.Update(element.name);
            this.addFirst.child.OnClick = () => Game.instance.AddActionToFront(this.item);
            this.addLast.child.OnClick = () => Game.instance.AddActionToBack(this.item);
        }
        Update() { }
    }
    class AvailableActionsGUI extends CommonGUIBases.List {
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
    ActionsGUI.AvailableActionsGUI = AvailableActionsGUI;
    class RemoveNow extends CommonGUIBases.TooltipReadyElement {
        constructor(parent) {
            super(new CommonGUIs.Button(parent, RemoveNow.ElementClass));
            this.child.Update("ⓧ!");
        }
        GeneratePrimaryText() {
            return "Remove the action from the queue now. You won't get the reward for completing it.";
        }
    }
    RemoveNow.ElementClass = "remove-now-button";
    class RemoveOnCompletion extends CommonGUIBases.TooltipReadyElement {
        constructor(parent) {
            super(new CommonGUIs.Button(parent, RemoveOnCompletion.ElementClass));
            this.child.Update("ⓧ");
        }
        GeneratePrimaryText() {
            return "Remove action from queue on next completion. You will get its reward.";
        }
    }
    RemoveOnCompletion.ElementClass = "remove-on-completion-button";
    class ActionQueueItemBase extends CommonGUIBases.TooltipListItem {
        constructor(parent, index) {
            super(new CommonGUIBases.ListItem(parent, "vertical-box"));
            let horizontalBox = new CommonGUIs.HorizontalBox(this.baseElement);
            this.nameLabel = new CommonGUIs.Label(horizontalBox.baseElement);
            this.nrExecutionsLabel = new CommonGUIs.Label(horizontalBox.baseElement);
            this.removeNow = new RemoveNow(horizontalBox.baseElement);
            this.removeOnCompletion = new RemoveOnCompletion(horizontalBox.baseElement);
            this.progressLine = new CommonGUIs.ProgressLine(this.baseElement);
            this.index = index;
        }
        SetUp(element) {
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
    ActionQueueItemBase.ElementClass = "action-queue-item";
    class ActionQueueGUI extends CommonGUIBases.List {
        constructor(parent) {
            super(parent, "", ActionQueueGUI.ElementID);
            this.listItems = Array.from({ length: 10 }, (_, i) => i).map((_, i) => new ActionQueueItemBase(this._baseElement, i));
        }
        SetUp(actions) {
            super.SetUp(actions);
        }
        Update() {
            super.Update();
            if (Main.instance.eventSystem.EventHappened("ActionQueueChanged")) {
                this.Refresh();
            }
        }
    }
    ActionQueueGUI.ElementID = "ActionQueue";
    ActionsGUI.ActionQueueGUI = ActionQueueGUI;
})(ActionsGUI || (ActionsGUI = {}));
var InventoryGUI;
(function (InventoryGUI_1) {
    class ActionQueueItemBase extends CommonGUIBases.TooltipListItem {
        constructor(parent, index) {
            super(new CommonGUIBases.ListItem(parent));
            this.nameLabel = new CommonGUIs.Label(this.baseElement);
            this.quantityLabel = new CommonGUIs.Label(this.baseElement);
        }
        SetUp(element) {
            this.item = element;
            this.nameLabel.Update(element[0]);
            this.quantityLabel.Update(`${element[1]}/${Game.player.inventory.inventoryLimit}`);
        }
        Update() { }
    }
    ActionQueueItemBase.ElementClass = "inventory-item";
    class InventoryGUI extends CommonGUIBases.List {
        constructor(parent) {
            super(parent, "", InventoryGUI.ElementID);
            this.listItems = Array.from({ length: 10 }, (_, i) => i).map((_, i) => new ActionQueueItemBase(this._baseElement, i));
        }
        SetUp(actions) {
            super.SetUp(actions);
        }
        Update() {
            super.Update();
            if (Main.instance.eventSystem.EventHappened("InventoryChanged")) {
                this.SetUp(Game.player.inventory.GetNonzeroItemData());
            }
        }
    }
    InventoryGUI.ElementID = "Inventory";
    InventoryGUI_1.InventoryGUI = InventoryGUI;
})(InventoryGUI || (InventoryGUI = {}));
var Action;
(function (Action_1) {
    class AddToInventory {
        constructor(resourceName, quantity = 1) {
            this.resourceName = resourceName;
            this.quantity = quantity;
        }
        Resolve() {
            Game.player.inventory.AddItem(this.resourceName, this.quantity);
        }
    }
    Action_1.AddToInventory = AddToInventory;
    class Action {
        constructor(name, skill, cost, outcome, metaskill = "unaided", fixedMetaskill = false) {
            this.cost = cost;
            this.skill = skill;
            this.name = name;
            this.outcome = outcome;
            this.metaskill = metaskill;
            this.fixedMetaskill = fixedMetaskill;
        }
    }
    Action_1.Action = Action;
    class ActionInstance {
        constructor(action, nrExecutions = 1) {
            this.cost = action.cost;
            this.action = action;
            this.nrExecutions = nrExecutions;
        }
        /**
         * Update the current job
         * @param dTime time between last frame and this one
         * @param player
         * @returns Time left over after performing this action to completion
         */
        Update(dTime, player) {
            let progress = player.skills.get(this.action.skill).GetTotalMultiplier() * dTime;
            let progressLeft = progress;
            while (progressLeft > 0 && this.nrExecutions > 0) {
                let progressSpent = Math.min(this.cost, progressLeft);
                this.cost -= progressSpent;
                progressLeft -= progressSpent;
                player.skills.get(this.action.skill).UpdateExperience(progressSpent);
                if (this.cost <= 0) {
                    this.nrExecutions -= 1;
                    this.action.outcome.Resolve();
                    if (this.nrExecutions > 0) {
                        this.cost = this.action.cost;
                    }
                }
            }
            return (progressLeft / progress) * dTime;
        }
    }
    Action_1.ActionInstance = ActionInstance;
    Action_1.actions = new Map([
        ["Cut wood", new Action("Cut wood", "Extraction", 1, new AddToInventory("Wood"))],
        ["Dig stone", new Action("Dig stone", "Extraction", 2, new AddToInventory("Stone"))],
        ["Pick berries", new Action("Pick berries", "Production", 3, new AddToInventory("Berries"))],
    ]);
})(Action || (Action = {}));
/// <reference path="./actions.ts" />
/// <reference path="./inventory.ts" />
/// <reference path="../game/action.ts" />
class ActionsBar extends GUIElement {
    constructor(parent) {
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
ActionsBar.ElementID = "ActionsBar";
/// <reference path="./common.ts" />
var PlayerResourcesGUI;
(function (PlayerResourcesGUI_1) {
    class ResourceBar extends CommonGUIBases.TooltipReadyElement {
        constructor(parent, resourceName) {
            super(new CommonGUIs.ProgressLine(parent, "", true));
            this.resourceName = resourceName;
        }
        SetUp(value) {
            this.value = value;
            switch (this.resourceName) {
                case "Health":
                    this.child.SetUp(Config.ColorPalette.playerResourceColors.health, Config.ColorPalette.progressLineBGColor);
                    break;
                case "Stamina":
                    this.child.SetUp(Config.ColorPalette.playerResourceColors.stamina, Config.ColorPalette.progressLineBGColor);
                    break;
                case "Mana":
                    this.child.SetUp(Config.ColorPalette.playerResourceColors.mana, Config.ColorPalette.progressLineBGColor);
                    break;
            }
        }
        Update() {
            this.child.Update(this.value.val, this.value.max, 0, this.value.ToString());
        }
        GeneratePrimaryText() {
            switch (this.resourceName) {
                case "Health":
                    return "Your health. When this reaches 0, you die.";
                case "Stamina":
                    return "Your stamina, used to perform physical actions.";
                case "Mana":
                    return "Your mana, used to perform magical actions.";
            }
            return "";
        }
    }
    class PlayerResourcesGUI extends CommonGUIs.VerticalBox {
        constructor(parent) {
            super(parent, "", PlayerResourcesGUI.ElementID);
            this.resourceBars = [];
            Config.PlayerResourceNames.forEach((resourceName) => {
                this.resourceBars.push(new ResourceBar(this.baseElement, resourceName));
            });
        }
        SetUp(playerResources) {
            Config.PlayerResourceNames.forEach((resourceName, i) => {
                switch (resourceName) {
                    case "Health":
                        this.resourceBars[i].SetUp(playerResources.health);
                        break;
                    case "Stamina":
                        this.resourceBars[i].SetUp(playerResources.stamina);
                        break;
                    case "Mana":
                        this.resourceBars[i].SetUp(playerResources.mana);
                        break;
                }
            });
        }
        Update() {
            this.resourceBars.forEach((resourceBar) => {
                resourceBar.Update();
            });
        }
    }
    PlayerResourcesGUI.ElementID = "PlayerResources";
    PlayerResourcesGUI_1.PlayerResourcesGUI = PlayerResourcesGUI;
})(PlayerResourcesGUI || (PlayerResourcesGUI = {}));
/// <reference path="./common.ts" />
var SkillsGUI;
(function (SkillsGUI_1) {
    class SkillGUI extends CommonGUIBases.TooltipReadyElement {
        constructor(parent) {
            super(new CommonGUIs.VerticalBox(parent, SkillGUI.ElementClass));
            this.progressLines = [];
            this.tooltipWidth = "33%";
            let horizontalBox = new CommonGUIs.HorizontalBox(this.baseElement);
            this.skillNameLabel = new CommonGUIs.Label(horizontalBox.baseElement);
            this.skillMulLabel = new CommonGUIs.Label(horizontalBox.baseElement);
            for (let i = 0; i < Config.NrStages; i++) {
                let extraClass = i == 0 ? "" : " no-border-top";
                let newProgressLine = new CommonGUIs.ProgressLine(this.baseElement, extraClass);
                this.progressLines.push(newProgressLine);
                newProgressLine.SetUp(Config.ColorPalette.skillProgFGColors[i], Config.ColorPalette.progressLineBGColor);
            }
        }
        FormatMultiplier(multiplier) {
            return "× " + Config.FormatNumber(multiplier);
        }
        GeneratePrimaryText() {
            // header
            let toReturn = SkillGUI.PrimaryHeaderElements.map((elem) => Config.SurroundWithHTMLTag("th", elem)).reduce((prev, curr) => prev + curr, "");
            // data row for each stage
            toReturn = Config.SurroundWithHTMLTag("tr", toReturn);
            let startingStage = this.currentSkill.stages[0].stage;
            toReturn += this.currentSkill.stages
                .map((stage) => stage
                .GetData()
                .map((elem, i) => i == 0
                ? Config.StageToString(elem, startingStage)
                : i == 1
                    ? Config.FormatInteger(elem)
                    : i == 4
                        ? this.FormatMultiplier(elem)
                        : Config.FormatNumber(elem))
                .map((elem) => Config.SurroundWithHTMLTag("td", elem))
                .reduce((prev, curr) => prev + curr, ""))
                .map((elem) => Config.SurroundWithHTMLTag("tr", elem))
                .reduce((prev, curr) => prev + curr, "");
            // total values
            let totalRow = ["Total", "", "", "", this.FormatMultiplier(this.currentSkill.GetTotalMultiplier())]
                .map((elem) => Config.SurroundWithHTMLTag("td", elem))
                .reduce((prev, curr) => prev + curr, "");
            totalRow = Config.SurroundWithHTMLTag("tr", totalRow);
            toReturn += totalRow;
            return Config.SurroundWithHTMLTag("table", toReturn);
        }
        GenerateSecondaryText() {
            return "This is a skill";
        }
        SetUp(skill) {
            this.skillNameLabel.Update(skill.name);
            this.currentSkill = skill;
        }
        Update() {
            if (!this.CanUpdate()) {
                return;
            }
            this.currentSkill.stages.forEach((stage, i) => {
                this.progressLines[i].Update(stage.experience, stage.required);
            });
            this.skillMulLabel.Update(this.FormatMultiplier(this.currentSkill.GetTotalMultiplier()));
        }
    }
    SkillGUI.PrimaryHeaderElements = ["Stage", "Level", "Experience", "Next Level In", "Multiplier"];
    SkillGUI.ElementClass = "skill-container";
    class SkillsGUI extends CommonGUIs.HorizontalBox {
        constructor(parent) {
            super(parent, "", SkillsGUI.ElementID);
            this.skillGUIs = [];
            Config.SkillNames.forEach(() => {
                this.skillGUIs.push(new SkillGUI(this.baseElement));
            });
        }
        SetUp(player) {
            Config.SkillNames.forEach((skillName, i) => {
                this.skillGUIs[i].SetUp(player.skills.get(skillName));
            });
        }
        Update(player) {
            this.skillGUIs.forEach((skillGUI) => {
                skillGUI.Update();
            });
        }
    }
    SkillsGUI.ElementID = "SkillsBar";
    SkillsGUI_1.SkillsGUI = SkillsGUI;
})(SkillsGUI || (SkillsGUI = {}));
/// <reference path="./GUIElement.ts" />
/// <reference path="./playerResources.ts" />
/// <reference path="./skills.ts" />
class InfoBar extends GUIElement {
    constructor(parent) {
        super("", InfoBar.ElementID, parent);
        this.playerResourcesBar = new PlayerResourcesGUI.PlayerResourcesGUI(this.baseElement);
        this.skillsBar = new SkillsGUI.SkillsGUI(this.baseElement);
    }
    SetUp(player) {
        this.playerResourcesBar.SetUp(player.resources);
        this.skillsBar.SetUp(player);
    }
    Update(player) {
        this.playerResourcesBar.Update();
        this.skillsBar.Update(player);
    }
}
InfoBar.ElementID = "InfoBar";
/// <reference path="./GUIElement.ts" />
/// <reference path="./tooltip.ts" />
/// <reference path="./actionsBar.ts" />
/// <reference path="./infoBar.ts" />
class GUI extends GUIElement {
    constructor() {
        super("", "GUI", $(document.body));
        if (GUI.instance == undefined) {
            GUI.instance = this;
            this.infoBar = new InfoBar(this.baseElement);
            this.actionsBar = new ActionsBar(this.baseElement);
            new Tooltip(this.baseElement);
        }
    }
    SetUp(player) {
        this.infoBar.SetUp(player);
        this.actionsBar.SetUp();
    }
    Update(player) {
        this.infoBar.Update(player);
        this.actionsBar.Update();
        Tooltip.instance.Update();
    }
}
GUI.instance = undefined;
GUI.ElementID = "GUI";
/// <reference path="./game/player.ts" />
/// <reference path="./game/game.ts" />
/// <reference path="./eventSystem/eventSystem.ts" />
/// <reference path="./GUI/GUI.ts" />
class Main {
    get player() {
        return Game.player;
    }
    constructor() {
        if (Main.instance == undefined) {
            Main.instance = this;
            // create game and GUI
            this.game = new Game();
            this.gui = new GUI();
            this.eventSystem = new EventSystem();
            // set up GUI
            this.gui.SetUp(this.player);
            // start main loop
            setInterval(() => this.Update(), 33);
        }
    }
    Update() {
        let dTime = 0.033;
        this.game.Update(dTime);
        this.gui.Update(this.player);
        this.eventSystem.Update();
    }
}
Main.instance = undefined;
let main = new Main();
//# sourceMappingURL=main.js.map