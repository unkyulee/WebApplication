// @ts-nocheck
import { Component } from "@angular/core";

// user Imports
import { BaseComponent } from "../base.component";

@Component({
  selector: "progress",
  templateUrl: "./progress.component.html",
})
export class ProgressComponent extends BaseComponent {
  ngOnInit() {
    super.ngOnInit();
    // event handler
    this.onEvent = this.event.onEvent.subscribe((event) =>
      this.eventHandler(event)
    );
  }

  eventHandler(event) {
    if (
      event &&
      event.name == "progress" &&
      (!event.key || event.key == this.uiElement.key)
    ) {
      // progress
      this.value = event.value;
      this.bufferValue = event.bufferValue;
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.onEvent.unsubscribe();
  }

  // value
  bufferValue = 0;

  _value = 0;
  get value() {
    // fixed text
    if (this.uiElement.value) {
      // set value
      this._value = this.uiElement.value;
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

  set value(v: any) {
    this._value = v;

    if (this.data && this.uiElement.key) {
      obj.set(this.data, this.uiElement.key, v);
    }
  }
}
