import { Config } from "../config";

export class EventSystem {
  private static instance: EventSystem;
  private static events: Map<string, boolean> = new Map<string, boolean>();

  static Update() {
    for (let key of this.events.keys()) {
      this.events.set(key, false);
    }
  }
  // set an event as triggered this round
  static TriggerEvent(eventName: string) {
    this.events.set(eventName, true);
  }
  // check if an event happened
  static EventHappened(eventName: string) {
    return this.events.get(eventName);
  }
  constructor() {
    if (EventSystem.instance == undefined) {
      EventSystem.instance = this;

      Config.LogicToGUIEvents.forEach((event) => {
        EventSystem.events.set(event, false);
      });
    }
  }
}
