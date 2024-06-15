class ColorPalette {
  // color format: (rgb) "0-255,0-255,0-255";
  skillProgFGColors: string[];
  skillProgBGColor: string;
  playerResourceColors: { health: string; stamina: string; mana: string };
  constructor(
    skillProgressForegroundColors: string[],
    skillProgressBackgroundColor: string,
    playerResourceColors: { health: string; stamina: string; mana: string }
  ) {
    this.skillProgFGColors = skillProgressForegroundColors.map((elem) => `rgb(${elem})`);
    this.skillProgBGColor = `rgb(${skillProgressBackgroundColor})`;
    this.playerResourceColors = playerResourceColors;
    this.playerResourceColors.health = `rgb(${this.playerResourceColors.health})`;
    this.playerResourceColors.stamina = `rgb(${this.playerResourceColors.stamina})`;
    this.playerResourceColors.mana = `rgb(${this.playerResourceColors.mana})`;
  }
}

class Config {
  private static readonly NrSignificantDigits = 4;
  private static readonly NrExponentialDigits = 2;
  static readonly NrStages = 2;
  static readonly ColorPalettes: ColorPalette[] = [
    new ColorPalette(["185,30,30", "30,185,30"], "20,20,20", {
      health: "185,30,30",
      stamina: "30,185,30",
      mana: "30,30,185",
    }),
  ];
  private static CurrentColorPalette: number = 0;
  private static StageNames: string[] = ["Individual"];
  private static PrestigeStageName: string = "Prestige";
  static readonly SkillNames: string[] = [
    "Hunting",
    "Fighting",
    "Navigation",
    "Processing",
    "Extraction",
    "Production",
    "Construction",
  ];

  static readonly PlayerResourceNames: string[] = ["Health", "Stamina", "Mana"];

  static get ColorPalette() {
    return Config.ColorPalettes[this.CurrentColorPalette];
  }
  static FormatNumber(toFormat: number): string {
    if (toFormat < 1000) {
      return toFormat.toPrecision(this.NrSignificantDigits);
    } else {
      return toFormat.toExponential(this.NrExponentialDigits).replace("+", "");
    }
  }
  static FormatInteger(toFormat: number): string {
    return toFormat.toFixed(0);
  }
  static StageToString(stage: number, startingStage: number) {
    switch (stage) {
      case startingStage:
        return this.StageNames[stage];
      case startingStage + 1:
        return `${this.StageNames[stage - 1]} ${this.PrestigeStageName}`;
      default:
        return this.StageNames[stage - 1];
    }
  }
  static SurroundWithHTMLTag(tag: string, content: string) {
    return `<${tag}>${content}</${tag}>`;
  }
}
