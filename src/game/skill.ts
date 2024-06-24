import { Config } from "../config";

class SkillStage {
  static readonly ScalingFunctions = [
    (required: number, _: number) => required + Math.floor(required / 10),
    (required: number, level: number) => required + level * level + 1,
  ];
  static readonly MultiplierFunction = (level: number, baseValue: number) => Math.pow(baseValue, level);
  static readonly MultiplierBaseValues = [1.05, 1.05];
  required: number;
  level: number = 0;
  multiplier: number = 1;
  experience: number = 0;
  stage: number;
  constructor(stage: number) {
    this.stage = stage;
    this.required = 10;
  }
  GetSkillMultiplier(): number {
    return this.multiplier;
  }
  UpdateExperience(experience: number) {
    this.experience += experience;
    this.TryLevelUp();
  }

  private TryLevelUp(): number {
    let canLevelUp: boolean = this.required <= this.experience;
    if (canLevelUp) {
      let oldRequired = this.required;
      this.level += 1;
      this.required = SkillStage.ScalingFunctions[this.stage](this.required, this.level);
      this.experience -= oldRequired;
      this.multiplier = SkillStage.MultiplierFunction(this.level, SkillStage.MultiplierBaseValues[this.stage]);
    }
    return 0;
  }
  GetData(): [number, number, number, number, number] {
    return [this.stage, this.level, this.experience, this.required, this.GetSkillMultiplier()];
  }
}

export class Skill {
  stages: SkillStage[] = [];
  name: string;
  constructor(name: string) {
    for (let i: number = 0; i < Config.NrStages; i += 1) {
      this.stages.push(new SkillStage(i));
    }
    this.name = name;
  }
  GetTotalMultiplier(): number {
    return this.stages.map((stage) => stage.GetSkillMultiplier()).reduce((prev, curr) => prev * curr, 1);
  }
  UpdateExperience(experience: number) {
    this.stages.forEach((stage) => {
      stage.UpdateExperience(experience);
    });
  }
}
