// @ts-nocheck
import { Component, HostListener, ElementRef, ViewChild } from "@angular/core";
import { BaseComponent } from "../base.component";
import obj from "object-path";

@Component({
  selector: "barcode",
  templateUrl: "barcode.component.html",
})
export class BarcodeComponent extends BaseComponent {
  constructor(public elRef: ElementRef) {
    super();
  }

  @ViewChild("print") print: ElementRef;

  @HostListener("click", ["$event"]) onClick(event) {
    if (obj.has(this.uiElement, "click")) {
      this.click(event, this.data, this.uiElement.click);
    }
  }

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
    if (
      (typeof this._value == "undefined" || this._value == null) &&
      this.uiElement.default
    ) {
      this._value = this.uiElement.default;
      try {
        this._value = eval(this.uiElement.default);
      } catch (e) {}
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
