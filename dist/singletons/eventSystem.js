import { Config } from "../config";
export class EventSystem {
    static Update() {
        for (let key in this.events.keys()) {
            this.events.set(key, false);
            console.log(key);
        }
    }
    // set an event as triggered this round
    static TriggerEvent(eventName) {
        this.events.set(eventName, true);
    }
    // check if an event happened
    static EventHappened(eventName) {
        return this.events.get(eventName);
    }
    constructor() {
        if (EventSystem.instance == undefined) {
            EventSystem.instance = this;
            Config.LogicToGUIEvents.forEach((event) => {
                console.log("SET " + event);
                EventSystem.events.set(event, false);
            });
        }
    }
}
EventSystem.events = new Map();
