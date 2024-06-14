class ColorPalette {
    constructor(skillProgressForegroundColors, skillProgressBackgroundColor, playerResourceColors) {
        this.skillProgFGColors = skillProgressForegroundColors.map((elem) => `rgb(${elem})`);
        this.skillProgBGColor = `rgb(${skillProgressBackgroundColor})`;
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
    new ColorPalette(["185,30,30", "30,185,30"], "20,20,20", {
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
    "Extracting",
    "Producing",
    "Construction",
    "Magical",
];
Config.PlayerResourceNames = ["Health", "Stamina", "Mana"];
var Skill;
(function (Skill_1) {
    class SkillStage {
        constructor(stage) {
            this.level = 0;
            this.experience = 0;
            this.stage = stage;
            this.required = 10;
        }
        GetSkillMultiplier() {
            return SkillStage.MultiplierFunction(this.level, SkillStage.MultiplierBaseValues[this.stage]);
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
/// <reference path="./skill.ts" />
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
    }
    Update(experience) {
        this.skills.forEach((skill) => skill.UpdateExperience(experience));
    }
}
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
        this.baseElement = this.CreateObject(center ? `${classes} center-text` : classes, id, parent);
    }
    CreateObject(classes, id, parent) {
        return $(`<div class='${classes}' id='${id}'>`).appendTo(parent);
    }
    CanUpdate() {
        if (this.baseElement.is(":hidden")) {
            return false;
        }
        return true;
    }
    Show() {
        this.baseElement.show();
    }
    Hide() {
        this.baseElement.hide();
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
})(CommonGUIs || (CommonGUIs = {}));
var CommonGUIBases;
(function (CommonGUIBases) {
    class TooltipReadyElement {
        constructor(child) {
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
})(CommonGUIBases || (CommonGUIBases = {}));
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
                    this.child.SetUp(Config.ColorPalette.playerResourceColors.health, Config.ColorPalette.skillProgBGColor);
                    break;
                case "Stamina":
                    this.child.SetUp(Config.ColorPalette.playerResourceColors.stamina, Config.ColorPalette.skillProgBGColor);
                    break;
                case "Mana":
                    this.child.SetUp(Config.ColorPalette.playerResourceColors.mana, Config.ColorPalette.skillProgBGColor);
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
                newProgressLine.SetUp(Config.ColorPalette.skillProgFGColors[i], Config.ColorPalette.skillProgBGColor);
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
var InfoBar;
(function (InfoBar_1) {
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
    InfoBar_1.InfoBar = InfoBar;
})(InfoBar || (InfoBar = {}));
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
        console.log(objectPos.left, tooltipWidth, bodyWidth);
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
/// <reference path="./GUIElement.ts" />
/// <reference path="./InfoBar.ts" />
/// <reference path="./tooltip.ts" />
class GUI extends GUIElement {
    constructor() {
        super("", "GUI", $(document.body));
        if (GUI.instance == undefined) {
            GUI.instance = this;
            this.infoBar = new InfoBar.InfoBar(this.baseElement);
            new Tooltip(this.baseElement);
        }
    }
    SetUp(player) {
        this.infoBar.SetUp(player);
    }
    Update(player) {
        this.infoBar.Update(player);
        Tooltip.instance.Update();
    }
}
GUI.instance = undefined;
GUI.ElementID = "GUI";
/// <reference path="./player/player.ts" />
/// <reference path="./GUI/GUI.ts" />
class Main {
    constructor() {
        if (Main.instance == undefined) {
            Main.instance = this;
            this.player = new Player();
            this.gui = new GUI();
            // set up GUI
            this.gui.SetUp(this.player);
            // start main loop
            setInterval(() => this.Update(), 33);
        }
    }
    Update() {
        let dTime = 0.033;
        let experience = 100;
        this.player.Update(experience * dTime);
        this.gui.Update(this.player);
    }
}
Main.instance = undefined;
let main = new Main();
//# sourceMappingURL=main.js.map