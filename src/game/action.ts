import { Player } from "./player";

interface IOutcome {
  Resolve(player: Player): void;
}
export class AddToInventory implements IOutcome {
  resourceName: string;
  quantity: number;
  constructor(resourceName: string, quantity: number = 1) {
    this.resourceName = resourceName;
    this.quantity = quantity;
  }

  Resolve(player: Player): void {
    player.inventory.AddItem(this.resourceName, this.quantity);
  }
}

export class Action {
  cost: number;
  name: string;
  skill: string;
  metaskill: string;
  fixedMetaskill: boolean;
  outcome: IOutcome;
  constructor(
    name: string,
    skill: string,
    cost: number,
    outcome: IOutcome,
    metaskill = "unaided",
    fixedMetaskill = false
  ) {
    this.cost = cost;
    this.skill = skill;
    this.name = name;
    this.outcome = outcome;
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
    let progress: number = (player.skills.get(this.action.skill)?.GetTotalMultiplier() ?? 0) * dTime;
    let progressLeft: number = progress;
    while (progressLeft > 0 && this.nrExecutions > 0) {
      let progressSpent: number = Math.min(this.cost, progressLeft);
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
export let actions = new Map<string, Action>([
  ["Cut wood", new Action("Cut wood", "Extraction", 1, new AddToInventory("Wood"))],
  ["Dig stone", new Action("Dig stone", "Extraction", 2, new AddToInventory("Stone"))],
  ["Pick berries", new Action("Pick berries", "Production", 3, new AddToInventory("Berries"))],
]);
