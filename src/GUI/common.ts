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

  export class Button extends GUIElement {
    private static ElementClass: string = "button";
    constructor(parent: JQuery<HTMLElement>, extraClasses: string = "", extraID: string = "", center: boolean = true) {
      super(`${Button.ElementClass} ${extraClasses}`, extraID, parent, center);

      this.baseElement.on("click", () => this.OnClick());
    }

    OnClick() {}

    Update(content: string) {
      this.baseElement.html(content);
    }
  }
}

namespace CommonGUIBases {
  export class TooltipReadyElement<T extends GUIElement> extends GUIElement {
    protected tooltipWidth: string = "20%";
    child: T;
    constructor(child: T) {
      super();
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
    override get baseElement() {
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

  export class ListItem<T> extends GUIElement {
    private static ElementClass: string = "list-item";
    item: T;
    constructor(parent: JQuery<HTMLElement>, extraClasses: string = "") {
      super(`${ListItem.ElementClass} ${extraClasses}`, "", parent);
    }
    SetUp(element: T) {
      this.item = element;
    }
    Update() {}
  }
  export class TooltipListItem<T> extends TooltipReadyElement<ListItem<T>> {
    constructor(listItem: ListItem<T>) {
      super(listItem);
    }
    get item() {
      return this.child.item;
    }
    set item(newItem: T) {
      this.child.item = newItem;
    }
    SetUp(element: T) {
      this.child.SetUp(element);
    }
    Update() {}
  }
  export class List<T extends ListItem<V>, V> extends CommonGUIs.VerticalBox {
    protected static NrElementsPerPage: number = 15;
    protected static ElementClass: string = "list";
    listItems: T[] = [];
    listContents: V[];
    currentPage: number = 0;
    constructor(parent: JQuery<HTMLElement>, extraClasses: string = "", extraID: string = "") {
      super(parent, `${List.ElementClass} ${extraClasses}`, extraID);
    }
    get nrPages() {
      return (this.listContents.length - 1) / List.NrElementsPerPage + 1;
    }
    /**
     * Set up the list with a new list of contents
     * @param listContents the list to follow and their content to display
     */
    SetUp(listContents: V[]) {
      this.listContents = listContents;
      this.currentPage = 0;
      this.Refresh();
    }
    /**
     * Refresh the list with a new page of items;
     */
    Refresh() {
      this.listItems.forEach((element, i) => {
        let index = this.currentPage * List.NrElementsPerPage + i;
        if (index < this.listContents.length) {
          element.Show();
          element.SetUp(this.listContents[index]);
        } else {
          element.Hide();
        }
      });
    }
    /**
     * Go to the next page if possible
     */
    NextPage() {
      if (this.currentPage + 1 < this.nrPages) {
        this.currentPage += 1;
        this.Refresh();
      }
    }
    /**
     * Go to the previous page if possible
     */
    PreviousPage() {
      if (this.currentPage - 1 > 0) {
        this.currentPage -= 1;
        this.Refresh();
      }
    }
    /**
     * Update the contents of each element's moving parts
     */
    Update() {
      if (!this.CanUpdate()) {
        return;
      }
      this.listItems.forEach((element) => {
        element.Update();
      });
    }
  }
}
