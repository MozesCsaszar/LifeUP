import { Config } from "../config";
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
export class Skill {
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
