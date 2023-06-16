// @ts-nocheck
import { Component } from "@angular/core";

// user Imports
import { BaseComponent } from "../base.component";

@Component({
  selector: "chart",
  template: `<p-chart
    [type]="uiElement.chartType"
    [data]="value"
    [options]="uiElement.options"
    [height]="uiElement.height"
    [width]="uiElement.width"
  ></p-chart> `,
})
export class ChartComponent extends BaseComponent {
  _value;
  get value() {
    // key exists
    if (this.data && this.uiElement.key) {
      // set value
      this._value = obj.get(this.data, this.uiElement.key);
    }

    // read returns local variable because of the format that can change its own value
    // and next time it will try to format the already formatted text <- which is to be prevented
    let v = this._value;

    // if format is specified
    if (this.uiElement.format) {
      try {
        v = eval(this.uiElement.format);
      } catch (e) {
        console.error(this.uiElement.format, e);
      }
    }

    return v;
  }
}
