class Tooltip extends CommonGUIs.VerticalBox {
  private static ElementID: string = "Tooltip";
  static instance: Tooltip = undefined;
  primaryInformation: CommonGUIs.TextBox;
  secondaryInformation: CommonGUIs.TextBox;
  getPrimaryInfo: () => string;
  getSecondaryInfo: () => string;

  constructor(parent: JQuery<HTMLElement>) {
    if (Tooltip.instance == undefined) {
      super(parent, "", Tooltip.ElementID);
      this.primaryInformation = new CommonGUIs.TextBox(this.baseElement);
      this.secondaryInformation = new CommonGUIs.TextBox(this.baseElement);
      this.Hide();

      Tooltip.instance = this;
    }
  }
  private CalculateTopLeft(tooltipFor: JQuery<HTMLElement>): { left: number; top: number } {
    let objectPos = tooltipFor.offset();
    let objectWidth = tooltipFor.outerWidth(),
      objectHeight = tooltipFor.outerHeight();
    let tooltipWidth = this.baseElement.outerWidth(),
      tooltipHeight = this.baseElement.outerHeight();

    objectPos.left += objectWidth / 2 - tooltipWidth / 2;
    objectPos.top += objectHeight;

    //adjust left position if tooltip would go out of the screen
    let bodyWidth = $(document.body).outerWidth(),
      bodyHeight = $(document.body).outerHeight();
    console.log(objectPos.left, tooltipWidth, bodyWidth);
    if (objectPos.left + tooltipWidth > bodyWidth) {
      objectPos.left = bodyWidth - tooltipWidth;
    } else if (objectPos.left < 0) {
      objectPos.left = 0;
    }
    //adjust top position if tooltip would go out of the screen
    if (objectPos.top > bodyHeight) {
      objectPos.top -= objectHeight + tooltipHeight;
    }
    return objectPos;
  }
  SetUp(
    baseWidth: string,
    tooltipFor: JQuery<HTMLElement>,
    getPrimaryInfo: () => string,
    getSecondaryInfo: () => string
  ) {
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
