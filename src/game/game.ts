class Game {
  static instance: Game = undefined;

  private _player: Player;
  actionQueue: Action.ActionInstance[] = [];
  get paused(): boolean {
    return this.actionQueue.length == 0;
  }
  static get player() {
    return this.instance._player;
  }

  constructor() {
    if (Game.instance == undefined) {
      Game.instance = this;

      this._player = new Player();
    }
  }
  GetNrExecutions(action: Action.Action): number {
    let nrExecutions: number = 1;
    if (action.outcome instanceof Action.AddToInventory) {
      let resourceName: string = action.outcome.resourceName;
      nrExecutions = Game.player.inventory.SpaceLeft(resourceName);
    }
    return nrExecutions;
  }
  AddActionToBack(action: Action.Action) {
    this.actionQueue.push(new Action.ActionInstance(action, this.GetNrExecutions(action)));
    Main.instance.eventSystem.TriggerEvent("ActionQueueChanged");
  }
  AddActionToFront(action: Action.Action) {
    this.actionQueue.unshift(new Action.ActionInstance(action, this.GetNrExecutions(action)));
    Main.instance.eventSystem.TriggerEvent("ActionQueueChanged");
  }
  RemoveAction(index: number) {
    this.actionQueue.splice(index, 1);
    Main.instance.eventSystem.TriggerEvent("ActionQueueChanged");
  }
  RemoveActionOnCompletion(index: number) {
    this.actionQueue[index].nrExecutions = 1;
    Main.instance.eventSystem.TriggerEvent("ActionQueueChanged");
  }
  RemoveFirstIfDone() {
    if (this.actionQueue[0].nrExecutions == 0) {
      this.actionQueue.shift();
      Main.instance.eventSystem.TriggerEvent("ActionQueueChanged");
    }
  }

  Update(dTime: number) {
    if (!this.paused) {
      this._player.Update(dTime);

      // do actions while you still have time left
      let timeLeft: number = this.actionQueue[0].Update(dTime, this._player);
      this.RemoveFirstIfDone();
      while (timeLeft > 0 && !this.paused) {
        timeLeft = this.actionQueue[0].Update(dTime, this._player);
        this.RemoveFirstIfDone();
      }
    }
  }
}
