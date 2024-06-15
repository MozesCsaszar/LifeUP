class Game {
  static instance: Game = undefined;

  player: Player;
  actionQueue: Action.ActionInstance[] = [];
  get paused(): boolean {
    return this.actionQueue.length == 0;
  }

  constructor() {
    if (Game.instance == undefined) {
      Game.instance = this;

      this.player = new Player();
    }
  }
  AddActionToBack(action: Action.Action) {
    this.actionQueue.push(new Action.ActionInstance(action));
  }
  AddActionToFront(action: Action.Action) {
    this.actionQueue.unshift(new Action.ActionInstance(action));
  }
  RemoveAction(index: number) {
    this.actionQueue.splice(index, 1);
  }
  Update(dTime: number) {
    if (!this.paused) {
      this.PrintQueue();
      this.player.Update(dTime);

      // do actions while you still have time left
      let timeLeft: number = this.actionQueue[0].Update(dTime, this.player);
      if (this.actionQueue[0].nrExecutions == 0) {
        this.actionQueue.shift();
      }
      while (timeLeft > 0 && !this.paused) {
        timeLeft = this.actionQueue[0].Update(dTime, this.player);
        if (this.actionQueue[0].nrExecutions == 0) {
          this.actionQueue.shift();
        }
      }
    }
  }
  PrintQueue() {
    console.log(
      this.actionQueue
        .map((elem) => elem.nrExecutions + " " + elem.cost + " " + elem.action.name)
        .reduce((prev, next) => prev + "\n" + next, "")
    );
  }
}
