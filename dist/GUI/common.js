import { GUIElement } from "./GUIElement";
export class ProgressLine extends GUIElement {
    constructor(parent, extraClasses = "", withLabel = false) {
        // create base container
        super(`${ProgressLine.ElementClass} ${extraClasses}`, "", parent);
        // create progress lines
        this.background = this.CreateObject(ProgressLine.ElementClass + ProgressLine.BackgroundClassSuffix, "", this.baseElement);
        this.foreground = this.CreateObject(ProgressLine.ElementClass + ProgressLine.ForegroundClassSuffix, "", this.baseElement);
        if (withLabel) {
            this.label = new Label(this.baseElement, "", true);
        }
    }
    SetUp(foregroundColor, backgroundColor) {
        this.foreground.css("backgroundColor", foregroundColor);
        this.background.css("backgroundColor", backgroundColor);
    }
    Update(current, max, min = 0, labelText = "") {
        if (!this.CanUpdate()) {
            return;
        }
        // length of the progress bar in the interval [0,1];
        let length = (current - min) / (max - min);
        // convert it to a percentage from 0 to 100
        length = length * 100;
        // set width of the foreground object
        this.foreground.css("width", length + "%");
        this.label?.Update(labelText);
    }
}
ProgressLine.ElementClass = "progress-line";
ProgressLine.ForegroundClassSuffix = "-foreground";
ProgressLine.BackgroundClassSuffix = "-background";
export class Label extends GUIElement {
    constructor(parent, extraClasses = "", center = true) {
        super(`${Label.ElementClass} ${extraClasses}`, "", parent, center);
    }
    Update(content) {
        this.baseElement.text(content);
    }
}
Label.ElementClass = "label";
export class TextBox extends GUIElement {
    constructor(parent, extraClasses = "", center = true) {
        super(`${TextBox.ElementClass} ${extraClasses}`, "", parent, center);
    }
    Update(content) {
        this.baseElement.html(content);
    }
}
TextBox.ElementClass = "label";
export class VerticalBox extends GUIElement {
    constructor(parent, extraClasses = "", extraID = "") {
        super(`${VerticalBox.ElementClass} ${extraClasses}`, extraID, parent);
    }
}
VerticalBox.ElementClass = "vertical-box";
export class HorizontalBox extends GUIElement {
    constructor(parent, extraClasses = "", extraID = "") {
        super(`${HorizontalBox.ElementClass} ${extraClasses}`, extraID, parent);
    }
}
HorizontalBox.ElementClass = "horizontal-box";
export class Button extends GUIElement {
    constructor(parent, extraClasses = "", extraID = "", center = true) {
        super(`${Button.ElementClass} ${extraClasses}`, extraID, parent, center);
        this.baseElement.on("click", () => this.OnClick());
    }
    OnClick() { }
    Update(content) {
        this.baseElement.html(content);
    }
}
Button.ElementClass = "button";
