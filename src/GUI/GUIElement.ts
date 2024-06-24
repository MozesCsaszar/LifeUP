/*
GUIElement Lifecycle:
  -constructor <- create all components needed and set static style
  -SetUp <- change information that doesn't need to be set every frame
  -Update <- called every frame for changing information
  -Show <- show base element in the state it currently is in
  -Hide <- hide base element
*/

export class GUIElement {
  protected _baseElement: JQuery<HTMLElement> | undefined = undefined;
  constructor(classes?: string, id?: string, parent?: JQuery<HTMLElement>, center?: boolean);
  constructor(classes: string, id: string, parent: JQuery<HTMLElement> | undefined, center: boolean = false) {
    if (parent != undefined)
      this._baseElement = this.CreateObject(center ? `${classes} center-text` : classes, id, parent);
  }

  protected CreateObject(classes: string, id: string, parent: JQuery<HTMLElement>): JQuery<HTMLElement> {
    return $(`<div class='${classes}' id='${id}'>`).appendTo(parent);
  }

  get baseElement() {
    return this._baseElement;
  }

  CanUpdate(): boolean {
    if (this._baseElement?.is(":hidden")) {
      return false;
    }
    return true;
  }

  Show() {
    this._baseElement?.show();
  }
  Hide() {
    this._baseElement?.hide();
  }
}
