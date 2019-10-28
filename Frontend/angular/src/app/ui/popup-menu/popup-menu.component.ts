import { Component, Input, ViewChild } from "@angular/core";
import { MatMenuTrigger } from '@angular/material';

// user Imports
import { BaseComponent } from '../base.component';

@Component({
  selector: "popup-menu",
  templateUrl: "./popup-menu.component.html"
})
export class PopupMenuComponent extends BaseComponent {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  ngOnInit() {
    // event handler
    this.onEvent = this.event.onEvent.subscribe(event => this.eventHandler(event));
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  eventHandler(event) {
    if (
      event &&
      event.name == "popup-trigger" &&
      (!event.key || event.key == this.uiElement.key)
    ) {
      if (this.trigger)
        this.trigger.openMenu()
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
      this._value = this.data[this.uiElement.key];
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
