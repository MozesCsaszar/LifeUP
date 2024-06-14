/// <reference path="./GUIElement.ts" />

namespace CommonGUIs {
  export class ProgressLine extends GUIElement {
    private static ElementClass: string = "progress-line";
    private static ForegroundClassSuffix: string = "-foreground";
    private static BackgroundClassSuffix: string = "-background";

    foreground: JQuery<HTMLElement>;
    background: JQuery<HTMLElement>;
    label?: CommonGUIs.Label;

    constructor(parent: JQuery<HTMLElement>, extraClasses: string = "", withLabel: boolean = false) {
      // create base container
      super(`${ProgressLine.ElementClass} ${extraClasses}`, "", parent);
      // create progress lines
      this.background = this.CreateObject(
        ProgressLine.ElementClass + ProgressLine.BackgroundClassSuffix,
        "",
        this.baseElement
      );
      this.foreground = this.CreateObject(
        ProgressLine.ElementClass + ProgressLine.ForegroundClassSuffix,
        "",
        this.baseElement
      );
      if (withLabel) {
        this.label = new CommonGUIs.Label(this.baseElement, "", true);
      }
    }

    SetUp(foregroundColor: string, backgroundColor: string) {
      this.foreground.css("backgroundColor", foregroundColor);
      this.background.css("backgroundColor", backgroundColor);
    }

    Update(current: number, max: number, min: number = 0, labelText: string = "") {
      if (!this.CanUpdate()) {
        return;
      }
      // length of the progress bar in the interval [0,1];
      let length: number = (current - min) / (max - min);
      // convert it to a percentage from 0 to 100
      length = length * 100;
      // set width of the foreground object
      this.foreground.css("width", length + "%");

      this.label?.Update(labelText);
    }
  }

  export class Label extends GUIElement {
    private static ElementClass: string = "label";

    constructor(parent: JQuery<HTMLElement>, extraClasses: string = "", center: boolean = true) {
      super(`${Label.ElementClass} ${extraClasses}`, "", parent, center);
    }

    Update(content: string) {
      this.baseElement.text(content);
    }
  }

  export class TextBox extends GUIElement {
    private static ElementClass: string = "label";

    constructor(parent: JQuery<HTMLElement>, extraClasses: string = "", center: boolean = true) {
      super(`${TextBox.ElementClass} ${extraClasses}`, "", parent, center);
    }

    Update(content: string) {
      this.baseElement.html(content);
    }
  }

  export class VerticalBox extends GUIElement {
    protected static ElementClass: string = "vertical-box";
    constructor(parent: JQuery<HTMLElement>, extraClasses: string = "", extraID: string = "") {
      super(`${VerticalBox.ElementClass} ${extraClasses}`, extraID, parent);
    }
  }

  export class HorizontalBox extends GUIElement {
    private static ElementClass: string = "horizontal-box";
    constructor(parent: JQuery<HTMLElement>, extraClasses: string = "", extraID: string = "") {
      super(`${HorizontalBox.ElementClass} ${extraClasses}`, extraID, parent);
    }
  }
}

namespace CommonGUIBases {
  export class TooltipReadyElement<T extends GUIElement> {
    protected tooltipWidth: string = "20%";
    child: T;
    constructor(child: T) {
      this.child = child;

      this.baseElement.on("mouseenter", () => this.OnMouseEnter());
      this.baseElement.on("mouseleave", () => this.OnMouseLeave());
    }
    protected GeneratePrimaryText(): string {
      return "";
    }
    protected GenerateSecondaryText(): string {
      return "";
    }
    private OnMouseEnter() {
      Tooltip.instance.SetUp(
        this.tooltipWidth,
        this.baseElement,
        () => this.GeneratePrimaryText(),
        () => this.GenerateSecondaryText()
      );
      Tooltip.instance.Show();
    }
    private OnMouseLeave() {
      Tooltip.instance.Hide();
    }
    get baseElement() {
      return this.child.baseElement;
    }
    Show() {
      this.child.Show();
    }
    Hide() {
      this.child.Hide();
    }
    CanUpdate(): boolean {
      return this.child.CanUpdate();
    }
  }
}
