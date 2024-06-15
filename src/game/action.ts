namespace Action {
  export class Action {
    cost: number;
    name: string;
    skill: string;
    metaskill: string;
    fixedMetaskill: boolean;
    constructor(name: string, skill: string, cost: number, metaskill = "unaided", fixedMetaskill = false) {
      this.cost = cost;
      this.skill = skill;
      this.name = name;
      this.metaskill = metaskill;
      this.fixedMetaskill = fixedMetaskill;
    }
  }
  export class ActionInstance {
    cost: number;
    action: Action;
    nrExecutions: number;
    constructor(action: Action, nrExecutions: number = 1) {
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
    Update(dTime: number, player: Player): number {
      let progress: number = player.skills.get(this.action.skill).GetTotalMultiplier() * dTime;
      let progressLeft: number = progress;
      while (progressLeft > 0 && this.nrExecutions > 0) {
        let progressSpent: number = Math.min(this.cost, progressLeft);
        this.cost -= progressSpent;
        progressLeft -= progressSpent;
        player.skills.get(this.action.skill).UpdateExperience(progressSpent);
        if (this.cost <= 0) {
          this.nrExecutions -= 1;
        }
      }
      return (progressLeft / progress) * dTime;
    }
  }
  export let actions = new Map<string, Action>([
    ["Cut wood", new Action("Cut wood", "Extraction", 10)],
    ["Dig stone", new Action("Dig stone", "Extraction", 12)],
    ["Pick berries", new Action("Pick berries", "Production", 3)],
  ]);
}
