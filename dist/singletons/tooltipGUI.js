import { VerticalBox, TextBox } from "../GUI/common";
import { InstanceExistsError } from "../utils/errors";
export class Tooltip extends VerticalBox {
    constructor(parent) {
        super(parent, "", Tooltip.ElementID);
        this.getPrimaryInfo = () => "";
        this.getSecondaryInfo = () => "";
        if (Tooltip.instance == undefined) {
            this.primaryInformation = new TextBox(this.baseElement);
            this.secondaryInformation = new TextBox(this.baseElement);
            this.Hide();
            Tooltip.instance = this;
        }
        else {
            throw new InstanceExistsError("TooltipGUI");
        }
    }
    CalculateTopLeft(tooltipFor) {
        let objectPos = tooltipFor.offset();
        let objectWidth = tooltipFor.outerWidth(), objectHeight = tooltipFor.outerHeight();
        let tooltipWidth = this.baseElement.outerWidth(), tooltipHeight = this.baseElement.outerHeight();
        objectPos.left += objectWidth / 2 - tooltipWidth / 2;
        objectPos.top += objectHeight;
        //adjust left position if tooltip would go out of the screen
        let bodyWidth = $(document.body).outerWidth(), bodyHeight = $(document.body).outerHeight();
        if (objectPos.left + tooltipWidth > bodyWidth) {
            objectPos.left = bodyWidth - tooltipWidth;
        }
        else if (objectPos.left < 0) {
            objectPos.left = 0;
        }
        //adjust top position if tooltip would go out of the screen
        if (objectPos.top > bodyHeight) {
            objectPos.top -= objectHeight + tooltipHeight;
        }
        return objectPos;
    }
    SetUp(baseWidth, tooltipFor, getPrimaryInfo, getSecondaryInfo) {
        this.getPrimaryInfo = getPrimaryInfo;
        this.getSecondaryInfo = getSecondaryInfo;
        // initial text and width updates to be able to set the tooltip position
        this.primaryInformation.Update(this.getPrimaryInfo());
        this.secondaryInformation.Update(this.getSecondaryInfo());
        this.baseElement.css("width", baseWidth);
        this.baseElement.css(this.CalculateTopLeft(tooltipFor));
    }
    Update() {
        if (!this.CanUpdate()) {
            return;
        }
        this.primaryInformation.Update(this.getPrimaryInfo());
        this.secondaryInformation.Update(this.getSecondaryInfo());
    }
}
Tooltip.ElementID = "Tooltip";
