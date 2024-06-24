/*
GUIElement Lifecycle:
  -constructor <- create all components needed and set static style
  -SetUp <- change information that doesn't need to be set every frame
  -Update <- called every frame for changing information
  -Show <- show base element in the state it currently is in
  -Hide <- hide base element
*/
export class GUIElement {
    constructor(classes, id, parent, center = false) {
        this._baseElement = undefined;
        if (parent != undefined)
            this._baseElement = this.CreateObject(center ? `${classes} center-text` : classes, id, parent);
    }
    CreateObject(classes, id, parent) {
        return $(`<div class='${classes}' id='${id}'>`).appendTo(parent);
    }
    get baseElement() {
        return this._baseElement;
    }
    CanUpdate() {
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
