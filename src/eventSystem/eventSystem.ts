class EventSystem {
  static instance: EventSystem = undefined;
  private events: Map<string, boolean> = new Map<string, boolean>();
  constructor() {
    if (EventSystem.instance == undefined) {
      EventSystem.instance = this;

      Config.LogicToGUIEvents.forEach((event) => {
        this.events.set(event, false);
      });
    }
  }
  // reset event triggers
  Update() {
    for (let key in this.events.keys()) {
      this.events.set(key, false);
    }
  }
  // set an event as triggered this round
  TriggerEvent(eventName: string) {
    this.events.set(eventName, true);
  }
  // check if an event happened
  EventHappened(eventName: string) {
    return this.events.get(eventName);
  }
}
