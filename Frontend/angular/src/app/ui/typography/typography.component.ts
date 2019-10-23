import { Component } from "@angular/core";
import * as obj from "object-path";

// user Imports
import { BaseComponent } from '../base.component';

@Component({
  selector: "typography",
  template: `
    <div
      *ngIf="condition(uiElement) && value"
      [ngStyle]="uiElement.style"
      [ngClass]="uiElement.class"
      [innerHtml]="value | safe: 'html'"
      (click)="click($event)"
    ></div>
  `
})
export class TypographyComponent extends BaseComponent {
  _value;
  get value() {
    // fixed text
    if (this.uiElement.text) {
      // set value
      this._value = this.uiElement.text;
    }

    // key exists
    else if (this.data && this.uiElement.key) {
      // set value
      this._value = obj.get(this.data, this.uiElement.key);      
    }

    // if null then assign default
    if ((typeof this._value == "undefined" || this._value == null) && this.uiElement.default) {
      this._value = this.uiElement.default;
      try {
        this._value = eval(this.uiElement.default);
      } catch (e) { }
    }

    // if format is specified
    if (this.uiElement.format) {
      try {
        this._value = eval(this.uiElement.format);
      } catch (e) {
        console.error(this.uiElement.format, e)
      }
    }

    return this._value;
  }
}
