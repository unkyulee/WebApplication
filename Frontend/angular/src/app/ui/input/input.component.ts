import { Component, Input, Output, EventEmitter } from "@angular/core";
import { DateTimeAdapter } from "ng-pick-datetime";

import { UserService } from "../../services/user/user.service";
import { EventService } from "../../services/event.service";
import { ConfigService } from "src/app/services/config.service";
import { NavService } from "src/app/services/nav.service";

@Component({
  selector: "input-component",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"]
})
export class InputComponent {
  constructor(
    public user: UserService,
    public event: EventService,
    private dateTimeAdapter: DateTimeAdapter<any>,
    private config: ConfigService,
    public nav: NavService
  ) {}

  @Input() uiElement: any;
  @Input() data: any;
  @Output() change: EventEmitter<any> = new EventEmitter<any>(); // used for filter

  ngOnInit() {
    this.dateTimeAdapter.setLocale(
      this.uiElement.locale
        ? this.uiElement.locale
        : this.config.configuration.locale_long
    );
  }

  _value: any;
  get value() {
    let v = null;

    // do not set value if it is password
    if (this.uiElement.inputType == "password") return;

    if (this.data && this.uiElement.key) {
      // if null then assign default
      if (!this.data[this.uiElement.key]) {
        let def = this.uiElement.default;
        try {
          def = eval(this.uiElement.default);
        } catch (e) {}
        this.data[this.uiElement.key] = def;
      }

      // set value
      v = this.data[this.uiElement.key];
    }

    // if number
    if (v && this.uiElement.inputType == "number") v = parseFloat(v);

    // if the value is programmatically updated without set property called
    // then set it explicitly
    if (this._value != v) {
      // Transform
      if (this.uiElement.transform) {
        try {
          v = eval(this.uiElement.transform);
        } catch (e) {}
      }

      this._value = v;
      this.value = v;
    }

    return v;
  }

  set value(v: any) {
    this._value = v;
    this.change.emit(v)

    if (this.data && this.uiElement.key) {
      this.data[this.uiElement.key] = v;
      // if number
      if (v && this.uiElement.inputType == "number")
        this.data[this.uiElement.key] = parseFloat(v);
    }
  }

  condition() {
    let result = true;
    if (this.uiElement.condition) {
      try {
        result = eval(this.uiElement.condition);
      } catch (e) {
        console.error(e);
      }
    }
    return result;
  }

  click() {
    if (this.uiElement.click) {
      try {
        eval(this.uiElement.click);
      } catch (e) {
        console.error(e);
      }
    }
  }

  eval(script) {
    eval(script);
  }

  changed(e) {
    if (this.uiElement.changed) {
      try {
        eval(this.uiElement.changed);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
