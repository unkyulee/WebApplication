import { Component, Input } from "@angular/core";

@Component({
  template: ""
})
export class BaseComponent {
  constructor() {}

  // configuration of the ui element
  @Input() uiElement: any;
  @Input() data: any;

  click(item) {
    if (this.uiElement.click) {
      try {
        eval(this.uiElement.click);
      } catch (e) {}
    }
  }

  format(value, data) {
    try {
      value = eval(value);
    } catch (e) {
      console.error(e);
    }
    return value;
  }

  condition(uiElement) {
    let result = true;
    if (uiElement && uiElement.condition) {
      try {
        result = eval(uiElement.condition);
      } catch (e) {
        console.error(uiElement.condition, e);
        result = false;
      }
    }
    return result;
  }
}
