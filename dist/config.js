export class ColorPalette {
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
export class Config {
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
