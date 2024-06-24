import { TooltipReadyElement } from "./commonBases";
import { Label, ProgressLine, VerticalBox, HorizontalBox } from "./common";
import { Config } from "../config";
class SkillGUI extends TooltipReadyElement {
    constructor(parent) {
        super(new VerticalBox(parent, SkillGUI.ElementClass));
        this.progressLines = [];
        this.tooltipWidth = "33%";
        let horizontalBox = new HorizontalBox(this.baseElement);
        this.skillNameLabel = new Label(horizontalBox.baseElement);
        this.skillMulLabel = new Label(horizontalBox.baseElement);
        for (let i = 0; i < Config.NrStages; i++) {
            let extraClass = i == 0 ? "" : " no-border-top";
            let newProgressLine = new ProgressLine(this.baseElement, extraClass);
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
        let startingStage = this.currentSkill?.stages[0].stage;
        toReturn += this.currentSkill?.stages
            .map((stage) => stage
            .GetData()
            .map((elem, i) => i == 0
            ? Config.StageToString(elem, startingStage ?? 0)
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
        let totalRow = ["Total", "", "", "", this.FormatMultiplier(this.currentSkill?.GetTotalMultiplier() ?? 1)]
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
        this.currentSkill?.stages.forEach((stage, i) => {
            this.progressLines[i].Update(stage.experience, stage.required);
        });
        this.skillMulLabel.Update(this.FormatMultiplier(this.currentSkill?.GetTotalMultiplier() ?? 1));
    }
}
SkillGUI.PrimaryHeaderElements = ["Stage", "Level", "Experience", "Next Level In", "Multiplier"];
SkillGUI.ElementClass = "skill-container";
export class SkillsGUI extends HorizontalBox {
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
