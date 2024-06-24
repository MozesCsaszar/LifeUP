import { InstanceExistsError } from "../utils/errors";
import { Player } from "./player";
import { ActionInstance, Action, AddToInventory } from "./action";
import { EventSystem } from "../singletons/eventSystem";

export class Game {
  static instance: Game;

  private _player: Player;
  static actionQueue: ActionInstance[] = [];
  static get paused(): boolean {
    return this.actionQueue.length == 0;
  }
  static get player(): Player {
    return this.instance._player;
  }

  constructor() {
    if (Game.instance == undefined) {
      Game.instance = this;

      this._player = new Player();
    } else {
      throw new InstanceExistsError("Game");
    }
  }
  static GetNrExecutions(action: Action): number {
    let nrExecutions: number = 1;
    if (action.outcome instanceof AddToInventory) {
      let resourceName: string = action.outcome.resourceName;
      nrExecutions = Game.player.inventory.SpaceLeft(resourceName);
    }
    return nrExecutions;
  }
  static AddActionToBack(action: Action) {
    this.actionQueue.push(new ActionInstance(action, this.GetNrExecutions(action)));
    EventSystem.TriggerEvent("ActionQueueChanged");
  }
  static AddActionToFront(action: Action) {
    this.actionQueue.unshift(new ActionInstance(action, this.GetNrExecutions(action)));
    EventSystem.TriggerEvent("ActionQueueChanged");
  }
  static RemoveAction(index: number) {
    this.actionQueue.splice(index, 1);
    EventSystem.TriggerEvent("ActionQueueChanged");
  }
  static RemoveActionOnCompletion(index: number) {
    this.actionQueue[index].nrExecutions = 1;
    EventSystem.TriggerEvent("ActionQueueChanged");
  }
  static RemoveFirstIfDone() {
    if (this.actionQueue[0].nrExecutions == 0) {
      this.actionQueue.shift();
      EventSystem.TriggerEvent("ActionQueueChanged");
    }
  }

  static Update(dTime: number) {
    if (!this.paused) {
      this.player.Update(dTime);

      // do actions while you still have time left
      let timeLeft: number = this.actionQueue[0].Update(dTime, this.player);
      this.RemoveFirstIfDone();
      while (timeLeft > 0 && !this.paused) {
        timeLeft = this.actionQueue[0].Update(dTime, this.player);
        this.RemoveFirstIfDone();
      }
    }
  }
}
