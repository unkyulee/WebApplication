// @ts-nocheck
import { Component } from "@angular/core";

// user Imports
import { BaseComponent } from "../base.component";

//
import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);
import "chartjs-adapter-moment";

@Component({
  selector: "chart",
  template: `<p-chart
    [type]="uiElement.chartType"
    [data]="value"
    [options]="options"
    [height]="uiElement.height"
    [width]="uiElement.width"
    (onDataSelect)="onDataSelect($event)"
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

    return this._value;
  }

  _options;
  get options() {
    // key exists
    if (this.data && this.uiElement.optionsKey) {
      // set value
      this._options = obj.get(this.data, this.uiElement.optionsKey);
    }

    return this._options;
  }

  onDataSelect(event) {
    if (this.uiElement.onDataSelect) {
      eval(this.uiElement.onDataSelect);
    }
  }
}
