/// <reference path="./common.ts" />

namespace SkillsGUI {
  class SkillGUI extends CommonGUIBases.TooltipReadyElement<CommonGUIs.VerticalBox> {
    private static PrimaryHeaderElements = ["Stage", "Level", "Experience", "Next Level In", "Multiplier"];
    protected static ElementClass = "skill-container";
    skillNameLabel: CommonGUIs.Label;
    skillMulLabel: CommonGUIs.Label;
    progressLines: CommonGUIs.ProgressLine[] = [];
    currentSkill: Skill.Skill;
    protected override tooltipWidth: string = "33%";
    constructor(parent: JQuery<HTMLElement>) {
      super(new CommonGUIs.VerticalBox(parent, SkillGUI.ElementClass));
      let horizontalBox = new CommonGUIs.HorizontalBox(this.baseElement);

      this.skillNameLabel = new CommonGUIs.Label(horizontalBox.baseElement);
      this.skillMulLabel = new CommonGUIs.Label(horizontalBox.baseElement);

      for (let i: number = 0; i < Config.NrStages; i++) {
        let extraClass: string = i == 0 ? "" : " no-border-top";
        let newProgressLine = new CommonGUIs.ProgressLine(this.baseElement, extraClass);

        this.progressLines.push(newProgressLine);
        newProgressLine.SetUp(Config.ColorPalette.skillProgFGColors[i], Config.ColorPalette.progressLineBGColor);
      }
    }
    private FormatMultiplier(multiplier: number): string {
      return "× " + Config.FormatNumber(multiplier);
    }
    protected GeneratePrimaryText(): string {
      // header
      let toReturn: string = SkillGUI.PrimaryHeaderElements.map((elem) =>
        Config.SurroundWithHTMLTag("th", elem)
      ).reduce((prev, curr) => prev + curr, "");

      // data row for each stage
      toReturn = Config.SurroundWithHTMLTag("tr", toReturn);
      let startingStage = this.currentSkill.stages[0].stage;
      toReturn += this.currentSkill.stages
        .map((stage) =>
          stage
            .GetData()
            .map((elem, i) =>
              i == 0
                ? Config.StageToString(elem, startingStage)
                : i == 1
                ? Config.FormatInteger(elem)
                : i == 4
                ? this.FormatMultiplier(elem)
                : Config.FormatNumber(elem)
            )
            .map((elem) => Config.SurroundWithHTMLTag("td", elem))
            .reduce((prev, curr) => prev + curr, "")
        )
        .map((elem) => Config.SurroundWithHTMLTag("tr", elem))
        .reduce((prev, curr) => prev + curr, "");
      // total values
      let totalRow: string = ["Total", "", "", "", this.FormatMultiplier(this.currentSkill.GetTotalMultiplier())]
        .map((elem) => Config.SurroundWithHTMLTag("td", elem))
        .reduce((prev, curr) => prev + curr, "");
      totalRow = Config.SurroundWithHTMLTag("tr", totalRow);
      toReturn += totalRow;
      return Config.SurroundWithHTMLTag("table", toReturn);
    }
    protected GenerateSecondaryText(): string {
      return "This is a skill";
    }
    SetUp(skill: Skill.Skill) {
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

  export class SkillsGUI extends CommonGUIs.HorizontalBox {
    private static ElementID: string = "SkillsBar";
    skillGUIs: SkillGUI[] = [];
    constructor(parent: JQuery<HTMLElement>) {
      super(parent, "", SkillsGUI.ElementID);

      Config.SkillNames.forEach(() => {
        this.skillGUIs.push(new SkillGUI(this.baseElement));
      });
    }

    SetUp(player: Player) {
      Config.SkillNames.forEach((skillName, i) => {
        this.skillGUIs[i].SetUp(player.skills.get(skillName));
      });
    }

    Update(player: Player) {
      this.skillGUIs.forEach((skillGUI) => {
        skillGUI.Update();
      });
    }
  }
}
