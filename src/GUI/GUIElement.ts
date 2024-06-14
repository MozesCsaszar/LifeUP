/*
GUIElement Lifecycle:
  -constructor <- create all components needed and set static style
  -SetUp <- change information that doesn't need to be set every frame
  -Update <- called every frame for changing information
  -Show <- show base element in the state it currently is in
  -Hide <- hide base element
*/

class GUIElement {
  baseElement: JQuery<HTMLElement>;

  constructor(classes: string, id: string, parent: JQuery<HTMLElement>, center: boolean = false) {
    this.baseElement = this.CreateObject(center ? `${classes} center-text` : classes, id, parent);
  }

  protected CreateObject(classes: string, id: string, parent: JQuery<HTMLElement>): JQuery<HTMLElement> {
    return $(`<div class='${classes}' id='${id}'>`).appendTo(parent);
  }

  CanUpdate(): boolean {
    if (this.baseElement.is(":hidden")) {
      return false;
    }
    return true;
  }

  Show() {
    this.baseElement.show();
  }
  Hide() {
    this.baseElement.hide();
  }
}
