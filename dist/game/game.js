import { InstanceExistsError } from "../utils/errors";
import { Player } from "./player";
import { ActionInstance, AddToInventory } from "./action";
import { EventSystem } from "../singletons/eventSystem";
export class Game {
    static get paused() {
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
        else {
            throw new InstanceExistsError("Game");
        }
    }
    static GetNrExecutions(action) {
        let nrExecutions = 1;
        if (action.outcome instanceof AddToInventory) {
            let resourceName = action.outcome.resourceName;
            nrExecutions = Game.player.inventory.SpaceLeft(resourceName);
        }
        return nrExecutions;
    }
    static AddActionToBack(action) {
        this.actionQueue.push(new ActionInstance(action, this.GetNrExecutions(action)));
        EventSystem.TriggerEvent("ActionQueueChanged");
    }
    static AddActionToFront(action) {
        this.actionQueue.unshift(new ActionInstance(action, this.GetNrExecutions(action)));
        EventSystem.TriggerEvent("ActionQueueChanged");
    }
    static RemoveAction(index) {
        this.actionQueue.splice(index, 1);
        EventSystem.TriggerEvent("ActionQueueChanged");
    }
    static RemoveActionOnCompletion(index) {
        this.actionQueue[index].nrExecutions = 1;
        EventSystem.TriggerEvent("ActionQueueChanged");
    }
    static RemoveFirstIfDone() {
        if (this.actionQueue[0].nrExecutions == 0) {
            this.actionQueue.shift();
            EventSystem.TriggerEvent("ActionQueueChanged");
        }
    }
    static Update(dTime) {
        if (!this.paused) {
            this.player.Update(dTime);
            // do actions while you still have time left
            let timeLeft = this.actionQueue[0].Update(dTime, this.player);
            this.RemoveFirstIfDone();
            while (timeLeft > 0 && !this.paused) {
                timeLeft = this.actionQueue[0].Update(dTime, this.player);
                this.RemoveFirstIfDone();
            }
        }
    }
}
Game.actionQueue = [];
