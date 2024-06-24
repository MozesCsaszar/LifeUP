import { GUIElement } from "./GUIElement";
import { VerticalBox } from "./common";
import { Tooltip } from "../singletons/tooltipGUI";
export class TooltipReadyElement extends GUIElement {
    constructor(child) {
        super();
        this.tooltipWidth = "20%";
        this.child = child;
        this.baseElement.on("mouseenter", () => this.OnMouseEnter());
        this.baseElement.on("mouseleave", () => this.OnMouseLeave());
    }
    GeneratePrimaryText() {
        return "";
    }
    GenerateSecondaryText() {
        return "";
    }
    OnMouseEnter() {
        Tooltip.instance.SetUp(this.tooltipWidth, this.baseElement, () => this.GeneratePrimaryText(), () => this.GenerateSecondaryText());
        Tooltip.instance.Show();
    }
    OnMouseLeave() {
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
    CanUpdate() {
        return this.child.CanUpdate();
    }
}
export class ListItem extends GUIElement {
    constructor(parent, extraClasses = "") {
        super(`${ListItem.ElementClass} ${extraClasses}`, "", parent);
    }
    SetUp(element) {
        this.item = element;
    }
    Update() { }
}
ListItem.ElementClass = "list-item";
export class TooltipListItem extends TooltipReadyElement {
    constructor(listItem) {
        super(listItem);
    }
    get item() {
        return this.child.item;
    }
    set item(newItem) {
        this.child.item = newItem;
    }
    SetUp(element) {
        this.child.SetUp(element);
    }
    Update() { }
}
export class List extends VerticalBox {
    constructor(parent, extraClasses = "", extraID = "") {
        super(parent, `${List.ElementClass} ${extraClasses}`, extraID);
        this.listItems = [];
        this.listContents = [];
        this.currentPage = 0;
    }
    get nrPages() {
        return (this.listContents.length - 1) / List.NrElementsPerPage + 1;
    }
    /**
     * Set up the list with a new list of contents
     * @param listContents the list to follow and their content to display
     */
    SetUp(listContents) {
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
            }
            else {
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
List.NrElementsPerPage = 15;
List.ElementClass = "list";
