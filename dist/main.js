/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Game: () => (/* binding */ Game)
/* harmony export */ });
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);
/* harmony import */ var _singletons_eventSystem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);




class Game {
    static get paused() {
        return this.actionQueue.length == 0;
    }
    static get player() {
        return this.instance._player;
    }
    constructor() {
        if (Game.instance == undefined) {
            Game.instance = this;
            this._player = new _player__WEBPACK_IMPORTED_MODULE_1__.Player();
        }
        else {
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__.InstanceExistsError("Game");
        }
    }
    static GetNrExecutions(action) {
        let nrExecutions = 1;
        if (action.outcome instanceof _action__WEBPACK_IMPORTED_MODULE_2__.AddToInventory) {
            let resourceName = action.outcome.resourceName;
            nrExecutions = Game.player.inventory.SpaceLeft(resourceName);
        }
        return nrExecutions;
    }
    static AddActionToBack(action) {
        this.actionQueue.push(new _action__WEBPACK_IMPORTED_MODULE_2__.ActionInstance(action, this.GetNrExecutions(action)));
        _singletons_eventSystem__WEBPACK_IMPORTED_MODULE_3__.EventSystem.TriggerEvent("ActionQueueChanged");
    }
    static AddActionToFront(action) {
        this.actionQueue.unshift(new _action__WEBPACK_IMPORTED_MODULE_2__.ActionInstance(action, this.GetNrExecutions(action)));
        _singletons_eventSystem__WEBPACK_IMPORTED_MODULE_3__.EventSystem.TriggerEvent("ActionQueueChanged");
    }
    static RemoveAction(index) {
        this.actionQueue.splice(index, 1);
        _singletons_eventSystem__WEBPACK_IMPORTED_MODULE_3__.EventSystem.TriggerEvent("ActionQueueChanged");
    }
    static RemoveActionOnCompletion(index) {
        this.actionQueue[index].nrExecutions = 1;
        _singletons_eventSystem__WEBPACK_IMPORTED_MODULE_3__.EventSystem.TriggerEvent("ActionQueueChanged");
    }
    static RemoveFirstIfDone() {
        if (this.actionQueue[0].nrExecutions == 0) {
            this.actionQueue.shift();
            _singletons_eventSystem__WEBPACK_IMPORTED_MODULE_3__.EventSystem.TriggerEvent("ActionQueueChanged");
        }
    }
    static Update(dTime) {
        if (!this.paused) {
            this.player.Update(dTime);
            // do actions while you still have time left
            let timeLeft = this.actionQueue[0].Update(dTime, this.player);
            this.RemoveFirstIfDone();
            while (timeLeft > 0 && !this.paused) {
                timeLeft = this.actionQueue[0].Update(dTime, this.player);
                this.RemoveFirstIfDone();
            }
        }
    }
}
Game.actionQueue = [];


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InstanceExistsError: () => (/* binding */ InstanceExistsError)
/* harmony export */ });
class InstanceExistsError extends Error {
    constructor(className) {
        super(`Instance of ${className} already exists!`);
        this.name = "InstanceExistsError";
    }
}


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BoundedVar: () => (/* binding */ BoundedVar),
/* harmony export */   Player: () => (/* binding */ Player),
/* harmony export */   PlayerResourceChange: () => (/* binding */ PlayerResourceChange),
/* harmony export */   PlayerResources: () => (/* binding */ PlayerResources)
/* harmony export */ });
/* harmony import */ var _skill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _inventory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);



class BoundedVar {
    constructor(val, max, min) {
        this._val = val;
        this._min = min ?? 0;
        this._max = max ?? val;
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
        return `${_config__WEBPACK_IMPORTED_MODULE_2__.Config.FormatNumber(this.val)}/${_config__WEBPACK_IMPORTED_MODULE_2__.Config.FormatNumber(this.max)}`;
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
        _config__WEBPACK_IMPORTED_MODULE_2__.Config.SkillNames.forEach((skillName) => {
            this.skills.set(skillName, new _skill__WEBPACK_IMPORTED_MODULE_0__.Skill(skillName));
        });
        this.resources = new PlayerResources();
        this.inventory = new _inventory__WEBPACK_IMPORTED_MODULE_1__.Inventory();
    }
    Update(dTime) { }
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Skill: () => (/* binding */ Skill)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);

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
        for (let i = 0; i < _config__WEBPACK_IMPORTED_MODULE_0__.Config.NrStages; i += 1) {
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


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ColorPalette: () => (/* binding */ ColorPalette),
/* harmony export */   Config: () => (/* binding */ Config)
/* harmony export */ });
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


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Inventory: () => (/* binding */ Inventory)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _singletons_eventSystem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);


class Inventory {
    constructor() {
        this.inventory = new Map();
        this.inventoryLimit = 10;
        _config__WEBPACK_IMPORTED_MODULE_0__.Config.Resources.forEach((resourceName) => {
            this.inventory.set(resourceName, 0);
        });
    }
    AddItem(key, value = 1) {
        let newValue = (this.inventory.get(key) ?? 0) + value;
        if (newValue > this.inventoryLimit) {
            newValue = this.inventoryLimit;
        }
        this.inventory.set(key, newValue);
        _singletons_eventSystem__WEBPACK_IMPORTED_MODULE_1__.EventSystem.TriggerEvent("InventoryChanged");
    }
    SpaceLeft(key) {
        return this.inventoryLimit - (this.inventory.get(key) ?? 0);
    }
    CanRemoveItem(key, value = 1) {
        let newValue = (this.inventory.get(key) ?? 0) - value;
        return newValue > 0;
    }
    RemoveItem(key, value = 1) {
        if (this.CanRemoveItem(key, value)) {
            this.inventory.set(key, (this.inventory.get(key) ?? 0) - value);
            _singletons_eventSystem__WEBPACK_IMPORTED_MODULE_1__.EventSystem.TriggerEvent("InventoryChanged");
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


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventSystem: () => (/* binding */ EventSystem)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);

class EventSystem {
    static Update() {
        for (let key of this.events.keys()) {
            this.events.set(key, false);
        }
    }
    // set an event as triggered this round
    static TriggerEvent(eventName) {
        this.events.set(eventName, true);
    }
    // check if an event happened
    static EventHappened(eventName) {
        return this.events.get(eventName);
    }
    constructor() {
        if (EventSystem.instance == undefined) {
            EventSystem.instance = this;
            _config__WEBPACK_IMPORTED_MODULE_0__.Config.LogicToGUIEvents.forEach((event) => {
                EventSystem.events.set(event, false);
            });
        }
    }
}
EventSystem.events = new Map();


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Action: () => (/* binding */ Action),
/* harmony export */   ActionInstance: () => (/* binding */ ActionInstance),
/* harmony export */   AddToInventory: () => (/* binding */ AddToInventory),
/* harmony export */   actions: () => (/* binding */ actions)
/* harmony export */ });
class AddToInventory {
    constructor(resourceName, quantity = 1) {
        this.resourceName = resourceName;
        this.quantity = quantity;
    }
    Resolve(player) {
        player.inventory.AddItem(this.resourceName, this.quantity);
    }
}
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
        let progress = (player.skills.get(this.action.skill)?.GetTotalMultiplier() ?? 0) * dTime;
        let progressLeft = progress;
        while (progressLeft > 0 && this.nrExecutions > 0) {
            let progressSpent = Math.min(this.cost, progressLeft);
            this.cost -= progressSpent;
            progressLeft -= progressSpent;
            player.skills.get(this.action.skill)?.UpdateExperience(progressSpent);
            if (this.cost <= 0) {
                this.nrExecutions -= 1;
                this.action.outcome.Resolve(player);
                if (this.nrExecutions > 0) {
                    this.cost = this.action.cost;
                }
            }
        }
        return (progressLeft / progress) * dTime;
    }
}
let actions = new Map([
    ["Cut wood", new Action("Cut wood", "Extraction", 1, new AddToInventory("Wood"))],
    ["Dig stone", new Action("Dig stone", "Extraction", 2, new AddToInventory("Stone"))],
    ["Pick berries", new Action("Pick berries", "Production", 3, new AddToInventory("Berries"))],
]);


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GUI: () => (/* binding */ GUI)
/* harmony export */ });
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _GUIElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);
/* harmony import */ var _singletons_tooltipGUI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11);
/* harmony import */ var _infoBar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(13);
/* harmony import */ var _actionsBar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(17);





class GUI extends _GUIElement__WEBPACK_IMPORTED_MODULE_1__.GUIElement {
    constructor() {
        super("", "GUI", $(document.body));
        if (GUI.instance == undefined) {
            GUI.instance = this;
            this.infoBar = new _infoBar__WEBPACK_IMPORTED_MODULE_3__.InfoBar(this.baseElement);
            this.actionsBar = new _actionsBar__WEBPACK_IMPORTED_MODULE_4__.ActionsBar(this.baseElement);
            new _singletons_tooltipGUI__WEBPACK_IMPORTED_MODULE_2__.Tooltip(this.baseElement);
        }
        else {
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__.InstanceExistsError("GUI");
        }
    }
    SetUp(player) {
        this.infoBar.SetUp(player);
        this.actionsBar.SetUp();
    }
    Update(player) {
        this.infoBar.Update(player);
        this.actionsBar.Update();
        _singletons_tooltipGUI__WEBPACK_IMPORTED_MODULE_2__.Tooltip.instance.Update();
    }
}
GUI.ElementID = "GUI";


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GUIElement: () => (/* binding */ GUIElement)
/* harmony export */ });
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
        this._baseElement = undefined;
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
        if (this._baseElement?.is(":hidden")) {
            return false;
        }
        return true;
    }
    Show() {
        this._baseElement?.show();
    }
    Hide() {
        this._baseElement?.hide();
    }
}


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Tooltip: () => (/* binding */ Tooltip)
/* harmony export */ });
/* harmony import */ var _GUI_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);


class Tooltip extends _GUI_common__WEBPACK_IMPORTED_MODULE_0__.VerticalBox {
    constructor(parent) {
        super(parent, "", Tooltip.ElementID);
        this.getPrimaryInfo = () => "";
        this.getSecondaryInfo = () => "";
        if (Tooltip.instance == undefined) {
            this.primaryInformation = new _GUI_common__WEBPACK_IMPORTED_MODULE_0__.TextBox(this.baseElement);
            this.secondaryInformation = new _GUI_common__WEBPACK_IMPORTED_MODULE_0__.TextBox(this.baseElement);
            this.Hide();
            Tooltip.instance = this;
        }
        else {
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.InstanceExistsError("TooltipGUI");
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


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Button: () => (/* binding */ Button),
/* harmony export */   HorizontalBox: () => (/* binding */ HorizontalBox),
/* harmony export */   Label: () => (/* binding */ Label),
/* harmony export */   ProgressLine: () => (/* binding */ ProgressLine),
/* harmony export */   TextBox: () => (/* binding */ TextBox),
/* harmony export */   VerticalBox: () => (/* binding */ VerticalBox)
/* harmony export */ });
/* harmony import */ var _GUIElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);

class ProgressLine extends _GUIElement__WEBPACK_IMPORTED_MODULE_0__.GUIElement {
    constructor(parent, extraClasses = "", withLabel = false) {
        // create base container
        super(`${ProgressLine.ElementClass} ${extraClasses}`, "", parent);
        // create progress lines
        this.background = this.CreateObject(ProgressLine.ElementClass + ProgressLine.BackgroundClassSuffix, "", this.baseElement);
        this.foreground = this.CreateObject(ProgressLine.ElementClass + ProgressLine.ForegroundClassSuffix, "", this.baseElement);
        if (withLabel) {
            this.label = new Label(this.baseElement, "", true);
        }
    }
    SetUp(foregroundColor, backgroundColor) {
        this.foreground.css("backgroundColor", foregroundColor);
        this.background.css("backgroundColor", backgroundColor);
    }
    Update(current, max, min = 0, labelText = "") {
        if (!this.CanUpdate()) {
            return;
        }
        // length of the progress bar in the interval [0,1];
        let length = (current - min) / (max - min);
        // convert it to a percentage from 0 to 100
        length = length * 100;
        // set width of the foreground object
        this.foreground.css("width", length + "%");
        this.label?.Update(labelText);
    }
}
ProgressLine.ElementClass = "progress-line";
ProgressLine.ForegroundClassSuffix = "-foreground";
ProgressLine.BackgroundClassSuffix = "-background";
class Label extends _GUIElement__WEBPACK_IMPORTED_MODULE_0__.GUIElement {
    constructor(parent, extraClasses = "", center = true) {
        super(`${Label.ElementClass} ${extraClasses}`, "", parent, center);
    }
    Update(content) {
        this.baseElement.text(content);
    }
}
Label.ElementClass = "label";
class TextBox extends _GUIElement__WEBPACK_IMPORTED_MODULE_0__.GUIElement {
    constructor(parent, extraClasses = "", center = true) {
        super(`${TextBox.ElementClass} ${extraClasses}`, "", parent, center);
    }
    Update(content) {
        this.baseElement.html(content);
    }
}
TextBox.ElementClass = "label";
class VerticalBox extends _GUIElement__WEBPACK_IMPORTED_MODULE_0__.GUIElement {
    constructor(parent, extraClasses = "", extraID = "") {
        super(`${VerticalBox.ElementClass} ${extraClasses}`, extraID, parent);
    }
}
VerticalBox.ElementClass = "vertical-box";
class HorizontalBox extends _GUIElement__WEBPACK_IMPORTED_MODULE_0__.GUIElement {
    constructor(parent, extraClasses = "", extraID = "") {
        super(`${HorizontalBox.ElementClass} ${extraClasses}`, extraID, parent);
    }
}
HorizontalBox.ElementClass = "horizontal-box";
class Button extends _GUIElement__WEBPACK_IMPORTED_MODULE_0__.GUIElement {
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


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InfoBar: () => (/* binding */ InfoBar)
/* harmony export */ });
/* harmony import */ var _GUIElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _skills__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
/* harmony import */ var _playerResources__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(16);



class InfoBar extends _GUIElement__WEBPACK_IMPORTED_MODULE_0__.GUIElement {
    constructor(parent) {
        super("", InfoBar.ElementID, parent);
        this.playerResourcesBar = new _playerResources__WEBPACK_IMPORTED_MODULE_2__.PlayerResourcesGUI(this.baseElement);
        this.skillsBar = new _skills__WEBPACK_IMPORTED_MODULE_1__.SkillsGUI(this.baseElement);
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


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SkillsGUI: () => (/* binding */ SkillsGUI)
/* harmony export */ });
/* harmony import */ var _commonBases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);



class SkillGUI extends _commonBases__WEBPACK_IMPORTED_MODULE_0__.TooltipReadyElement {
    constructor(parent) {
        super(new _common__WEBPACK_IMPORTED_MODULE_1__.VerticalBox(parent, SkillGUI.ElementClass));
        this.progressLines = [];
        this.tooltipWidth = "33%";
        let horizontalBox = new _common__WEBPACK_IMPORTED_MODULE_1__.HorizontalBox(this.baseElement);
        this.skillNameLabel = new _common__WEBPACK_IMPORTED_MODULE_1__.Label(horizontalBox.baseElement);
        this.skillMulLabel = new _common__WEBPACK_IMPORTED_MODULE_1__.Label(horizontalBox.baseElement);
        for (let i = 0; i < _config__WEBPACK_IMPORTED_MODULE_2__.Config.NrStages; i++) {
            let extraClass = i == 0 ? "" : " no-border-top";
            let newProgressLine = new _common__WEBPACK_IMPORTED_MODULE_1__.ProgressLine(this.baseElement, extraClass);
            this.progressLines.push(newProgressLine);
            newProgressLine.SetUp(_config__WEBPACK_IMPORTED_MODULE_2__.Config.ColorPalette.skillProgFGColors[i], _config__WEBPACK_IMPORTED_MODULE_2__.Config.ColorPalette.progressLineBGColor);
        }
    }
    FormatMultiplier(multiplier) {
        return "× " + _config__WEBPACK_IMPORTED_MODULE_2__.Config.FormatNumber(multiplier);
    }
    GeneratePrimaryText() {
        // header
        let toReturn = SkillGUI.PrimaryHeaderElements.map((elem) => _config__WEBPACK_IMPORTED_MODULE_2__.Config.SurroundWithHTMLTag("th", elem)).reduce((prev, curr) => prev + curr, "");
        // data row for each stage
        toReturn = _config__WEBPACK_IMPORTED_MODULE_2__.Config.SurroundWithHTMLTag("tr", toReturn);
        let startingStage = this.currentSkill?.stages[0].stage;
        toReturn += this.currentSkill?.stages
            .map((stage) => stage
            .GetData()
            .map((elem, i) => i == 0
            ? _config__WEBPACK_IMPORTED_MODULE_2__.Config.StageToString(elem, startingStage ?? 0)
            : i == 1
                ? _config__WEBPACK_IMPORTED_MODULE_2__.Config.FormatInteger(elem)
                : i == 4
                    ? this.FormatMultiplier(elem)
                    : _config__WEBPACK_IMPORTED_MODULE_2__.Config.FormatNumber(elem))
            .map((elem) => _config__WEBPACK_IMPORTED_MODULE_2__.Config.SurroundWithHTMLTag("td", elem))
            .reduce((prev, curr) => prev + curr, ""))
            .map((elem) => _config__WEBPACK_IMPORTED_MODULE_2__.Config.SurroundWithHTMLTag("tr", elem))
            .reduce((prev, curr) => prev + curr, "");
        // total values
        let totalRow = ["Total", "", "", "", this.FormatMultiplier(this.currentSkill?.GetTotalMultiplier() ?? 1)]
            .map((elem) => _config__WEBPACK_IMPORTED_MODULE_2__.Config.SurroundWithHTMLTag("td", elem))
            .reduce((prev, curr) => prev + curr, "");
        totalRow = _config__WEBPACK_IMPORTED_MODULE_2__.Config.SurroundWithHTMLTag("tr", totalRow);
        toReturn += totalRow;
        return _config__WEBPACK_IMPORTED_MODULE_2__.Config.SurroundWithHTMLTag("table", toReturn);
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
        this.currentSkill?.stages.forEach((stage, i) => {
            this.progressLines[i].Update(stage.experience, stage.required);
        });
        this.skillMulLabel.Update(this.FormatMultiplier(this.currentSkill?.GetTotalMultiplier() ?? 1));
    }
}
SkillGUI.PrimaryHeaderElements = ["Stage", "Level", "Experience", "Next Level In", "Multiplier"];
SkillGUI.ElementClass = "skill-container";
class SkillsGUI extends _common__WEBPACK_IMPORTED_MODULE_1__.HorizontalBox {
    constructor(parent) {
        super(parent, "", SkillsGUI.ElementID);
        this.skillGUIs = [];
        _config__WEBPACK_IMPORTED_MODULE_2__.Config.SkillNames.forEach(() => {
            this.skillGUIs.push(new SkillGUI(this.baseElement));
        });
    }
    SetUp(player) {
        _config__WEBPACK_IMPORTED_MODULE_2__.Config.SkillNames.forEach((skillName, i) => {
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


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   List: () => (/* binding */ List),
/* harmony export */   ListItem: () => (/* binding */ ListItem),
/* harmony export */   TooltipListItem: () => (/* binding */ TooltipListItem),
/* harmony export */   TooltipReadyElement: () => (/* binding */ TooltipReadyElement)
/* harmony export */ });
/* harmony import */ var _GUIElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _singletons_tooltipGUI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11);



class TooltipReadyElement extends _GUIElement__WEBPACK_IMPORTED_MODULE_0__.GUIElement {
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
        _singletons_tooltipGUI__WEBPACK_IMPORTED_MODULE_2__.Tooltip.instance.SetUp(this.tooltipWidth, this.baseElement, () => this.GeneratePrimaryText(), () => this.GenerateSecondaryText());
        _singletons_tooltipGUI__WEBPACK_IMPORTED_MODULE_2__.Tooltip.instance.Show();
    }
    OnMouseLeave() {
        _singletons_tooltipGUI__WEBPACK_IMPORTED_MODULE_2__.Tooltip.instance.Hide();
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
class ListItem extends _GUIElement__WEBPACK_IMPORTED_MODULE_0__.GUIElement {
    constructor(parent, extraClasses = "") {
        super(`${ListItem.ElementClass} ${extraClasses}`, "", parent);
    }
    SetUp(element) {
        this.item = element;
    }
    Update() { }
}
ListItem.ElementClass = "list-item";
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
class List extends _common__WEBPACK_IMPORTED_MODULE_1__.VerticalBox {
    constructor(parent, extraClasses = "", extraID = "") {
        super(parent, `${List.ElementClass} ${extraClasses}`, extraID);
        this.listItems = [];
        this.listContents = [];
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


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PlayerResourcesGUI: () => (/* binding */ PlayerResourcesGUI)
/* harmony export */ });
/* harmony import */ var _commonBases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _game_player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);




class ResourceBar extends _commonBases__WEBPACK_IMPORTED_MODULE_0__.TooltipReadyElement {
    constructor(parent, resourceName) {
        super(new _common__WEBPACK_IMPORTED_MODULE_1__.ProgressLine(parent, "", true));
        this.value = new _game_player__WEBPACK_IMPORTED_MODULE_2__.BoundedVar(0);
        this.resourceName = resourceName;
    }
    SetUp(value) {
        this.value = value;
        switch (this.resourceName) {
            case "Health":
                this.child.SetUp(_config__WEBPACK_IMPORTED_MODULE_3__.Config.ColorPalette.playerResourceColors.health, _config__WEBPACK_IMPORTED_MODULE_3__.Config.ColorPalette.progressLineBGColor);
                break;
            case "Stamina":
                this.child.SetUp(_config__WEBPACK_IMPORTED_MODULE_3__.Config.ColorPalette.playerResourceColors.stamina, _config__WEBPACK_IMPORTED_MODULE_3__.Config.ColorPalette.progressLineBGColor);
                break;
            case "Mana":
                this.child.SetUp(_config__WEBPACK_IMPORTED_MODULE_3__.Config.ColorPalette.playerResourceColors.mana, _config__WEBPACK_IMPORTED_MODULE_3__.Config.ColorPalette.progressLineBGColor);
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
class PlayerResourcesGUI extends _common__WEBPACK_IMPORTED_MODULE_1__.VerticalBox {
    constructor(parent) {
        super(parent, "", PlayerResourcesGUI.ElementID);
        this.resourceBars = [];
        _config__WEBPACK_IMPORTED_MODULE_3__.Config.PlayerResourceNames.forEach((resourceName) => {
            this.resourceBars.push(new ResourceBar(this.baseElement, resourceName));
        });
    }
    SetUp(playerResources) {
        _config__WEBPACK_IMPORTED_MODULE_3__.Config.PlayerResourceNames.forEach((resourceName, i) => {
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


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActionsBar: () => (/* binding */ ActionsBar)
/* harmony export */ });
/* harmony import */ var _GUIElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18);
/* harmony import */ var _inventory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19);
/* harmony import */ var _game_action__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8);
/* harmony import */ var _game_game__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1);






class ActionsBar extends _GUIElement__WEBPACK_IMPORTED_MODULE_0__.GUIElement {
    constructor(parent) {
        super("", ActionsBar.ElementID, parent);
        this.availableActions = new _actions__WEBPACK_IMPORTED_MODULE_1__.AvailableActionsGUI(this.baseElement);
        this.inventory = new _inventory__WEBPACK_IMPORTED_MODULE_2__.InventoryGUI(this.baseElement);
        this.actionQueue = new _actions__WEBPACK_IMPORTED_MODULE_1__.ActionQueueGUI(this.baseElement);
    }
    SetUp() {
        this.availableActions.SetUp(Array.from(_game_action__WEBPACK_IMPORTED_MODULE_3__.actions.values()));
        this.inventory.SetUp(_game_game__WEBPACK_IMPORTED_MODULE_4__.Game.player.inventory.GetNonzeroItemData());
        this.actionQueue.SetUp(_game_game__WEBPACK_IMPORTED_MODULE_4__.Game.actionQueue);
    }
    Update() {
        this.availableActions.Update();
        this.inventory.Update();
        this.actionQueue.Update();
    }
}
ActionsBar.ElementID = "ActionsBar";


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActionQueueGUI: () => (/* binding */ ActionQueueGUI),
/* harmony export */   AvailableActionsGUI: () => (/* binding */ AvailableActionsGUI)
/* harmony export */ });
/* harmony import */ var _commonBases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _singletons_eventSystem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _game_game__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);





class AddFirst extends _commonBases__WEBPACK_IMPORTED_MODULE_0__.TooltipReadyElement {
    constructor(parent) {
        super(new _common__WEBPACK_IMPORTED_MODULE_1__.Button(parent, AddFirst.ElementClass));
        this.child.Update("+");
    }
    GeneratePrimaryText() {
        return "Add action to the start of the queue";
    }
}
AddFirst.ElementClass = "add-first-button";
class AddLast extends _commonBases__WEBPACK_IMPORTED_MODULE_0__.TooltipReadyElement {
    constructor(parent) {
        super(new _common__WEBPACK_IMPORTED_MODULE_1__.Button(parent, AddLast.ElementClass));
        this.child.Update("=>");
    }
    GeneratePrimaryText() {
        return "Add action to the end of the queue";
    }
}
AddLast.ElementClass = "add-last-button";
class AvailableActionBase extends _commonBases__WEBPACK_IMPORTED_MODULE_0__.TooltipListItem {
    constructor(parent) {
        super(new _commonBases__WEBPACK_IMPORTED_MODULE_0__.ListItem(parent));
        this.nameLabel = new _common__WEBPACK_IMPORTED_MODULE_1__.Label(this.baseElement);
        this.addFirst = new AddFirst(this.baseElement);
        this.addLast = new AddLast(this.baseElement);
    }
    SetUp(element) {
        this.item = element;
        this.nameLabel.Update(element.name);
        this.addFirst.child.OnClick = () => _game_game__WEBPACK_IMPORTED_MODULE_3__.Game.AddActionToFront(this.item);
        this.addLast.child.OnClick = () => _game_game__WEBPACK_IMPORTED_MODULE_3__.Game.AddActionToBack(this.item);
    }
    Update() { }
}
class AvailableActionsGUI extends _commonBases__WEBPACK_IMPORTED_MODULE_0__.List {
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
class RemoveNow extends _commonBases__WEBPACK_IMPORTED_MODULE_0__.TooltipReadyElement {
    constructor(parent) {
        super(new _common__WEBPACK_IMPORTED_MODULE_1__.Button(parent, RemoveNow.ElementClass));
        this.child.Update("ⓧ!");
    }
    GeneratePrimaryText() {
        return "Remove the action from the queue now. You won't get the reward for completing it.";
    }
}
RemoveNow.ElementClass = "remove-now-button";
class RemoveOnCompletion extends _commonBases__WEBPACK_IMPORTED_MODULE_0__.TooltipReadyElement {
    constructor(parent) {
        super(new _common__WEBPACK_IMPORTED_MODULE_1__.Button(parent, RemoveOnCompletion.ElementClass));
        this.child.Update("ⓧ");
    }
    GeneratePrimaryText() {
        return "Remove action from queue on next completion. You will get its reward.";
    }
}
RemoveOnCompletion.ElementClass = "remove-on-completion-button";
class ActionQueueItemBase extends _commonBases__WEBPACK_IMPORTED_MODULE_0__.TooltipListItem {
    constructor(parent, index) {
        super(new _commonBases__WEBPACK_IMPORTED_MODULE_0__.ListItem(parent, "vertical-box"));
        let horizontalBox = new _common__WEBPACK_IMPORTED_MODULE_1__.HorizontalBox(this.baseElement);
        this.nameLabel = new _common__WEBPACK_IMPORTED_MODULE_1__.Label(horizontalBox.baseElement);
        this.nrExecutionsLabel = new _common__WEBPACK_IMPORTED_MODULE_1__.Label(horizontalBox.baseElement);
        this.removeNow = new RemoveNow(horizontalBox.baseElement);
        this.removeOnCompletion = new RemoveOnCompletion(horizontalBox.baseElement);
        this.progressLine = new _common__WEBPACK_IMPORTED_MODULE_1__.ProgressLine(this.baseElement);
        this.index = index;
    }
    SetUp(element) {
        this.progressLine.SetUp(_config__WEBPACK_IMPORTED_MODULE_4__.Config.ColorPalette.actionProgFGColor, _config__WEBPACK_IMPORTED_MODULE_4__.Config.ColorPalette.progressLineBGColor);
        this.item = element;
        this.nameLabel.Update(element.action.name);
        this.removeNow.child.OnClick = () => _game_game__WEBPACK_IMPORTED_MODULE_3__.Game.RemoveAction(this.index);
        this.removeOnCompletion.child.OnClick = () => _game_game__WEBPACK_IMPORTED_MODULE_3__.Game.RemoveActionOnCompletion(this.index);
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
class ActionQueueGUI extends _commonBases__WEBPACK_IMPORTED_MODULE_0__.List {
    constructor(parent) {
        super(parent, "", ActionQueueGUI.ElementID);
        this.listItems = Array.from({ length: 10 }, (_, i) => i).map((_, i) => new ActionQueueItemBase(this._baseElement, i));
    }
    SetUp(actions) {
        super.SetUp(actions);
    }
    Update() {
        super.Update();
        if (_singletons_eventSystem__WEBPACK_IMPORTED_MODULE_2__.EventSystem.EventHappened("ActionQueueChanged")) {
            this.Refresh();
        }
    }
}
ActionQueueGUI.ElementID = "ActionQueue";


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InventoryGUI: () => (/* binding */ InventoryGUI)
/* harmony export */ });
/* harmony import */ var _commonBases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _singletons_eventSystem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _game_game__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1);




class ActionQueueItemBase extends _commonBases__WEBPACK_IMPORTED_MODULE_0__.TooltipListItem {
    constructor(parent, index) {
        super(new _commonBases__WEBPACK_IMPORTED_MODULE_0__.ListItem(parent));
        this.nameLabel = new _common__WEBPACK_IMPORTED_MODULE_1__.Label(this.baseElement);
        this.quantityLabel = new _common__WEBPACK_IMPORTED_MODULE_1__.Label(this.baseElement);
    }
    SetUp(element) {
        this.item = element;
        this.nameLabel.Update(element[0]);
        this.quantityLabel.Update(`${element[1]}/${_game_game__WEBPACK_IMPORTED_MODULE_3__.Game.player.inventory.inventoryLimit}`);
    }
    Update() { }
}
ActionQueueItemBase.ElementClass = "inventory-item";
class InventoryGUI extends _commonBases__WEBPACK_IMPORTED_MODULE_0__.List {
    constructor(parent) {
        super(parent, "", InventoryGUI.ElementID);
        this.listItems = Array.from({ length: 10 }, (_, i) => i).map((_, i) => new ActionQueueItemBase(this._baseElement, i));
    }
    SetUp(actions) {
        super.SetUp(actions);
    }
    Update() {
        super.Update();
        if (_singletons_eventSystem__WEBPACK_IMPORTED_MODULE_2__.EventSystem.EventHappened("InventoryChanged")) {
            console.log("EVENT HAPPENED");
            this.SetUp(_game_game__WEBPACK_IMPORTED_MODULE_3__.Game.player.inventory.GetNonzeroItemData());
        }
    }
}
InventoryGUI.ElementID = "Inventory";


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game_game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _singletons_eventSystem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _GUI_GUI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);




class Main {
    // time: number;
    constructor() {
        if (Main.instance == undefined) {
            Main.instance = this;
            // create game, GUI and EventSystem
            new _game_game__WEBPACK_IMPORTED_MODULE_0__.Game();
            this.gui = new _GUI_GUI__WEBPACK_IMPORTED_MODULE_3__.GUI();
            new _singletons_eventSystem__WEBPACK_IMPORTED_MODULE_1__.EventSystem();
            // set up GUI
            this.gui.SetUp(_game_game__WEBPACK_IMPORTED_MODULE_0__.Game.player);
            // start main loop
            setInterval(() => this.Update(), 33);
        }
        else {
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.InstanceExistsError("Main");
        }
    }
    Update() {
        let dTime = 0.033;
        _game_game__WEBPACK_IMPORTED_MODULE_0__.Game.Update(dTime);
        this.gui.Update(_game_game__WEBPACK_IMPORTED_MODULE_0__.Game.player);
        _singletons_eventSystem__WEBPACK_IMPORTED_MODULE_1__.EventSystem.Update();
    }
}
new Main();

/******/ })()
;