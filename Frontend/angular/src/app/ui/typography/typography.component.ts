import { Component, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

// user Imports
import { BaseComponent } from '../base.component';
import { ConfigService } from "src/app/services/config.service";
import { UserService } from "src/app/services/user/user.service";
import { EventService } from "src/app/services/event.service";
import { RestService } from "src/app/services/rest.service";

@Component({
  selector: "typography",
  templateUrl: "./typography.component.html"
})
export class TypographyComponent extends BaseComponent {
  constructor(
    public config: ConfigService,
    public user: UserService,
    public event: EventService,
    public rest: RestService,
    public router: Router
  ) {
    super()
  }

  @Input() uiElement: any;
  @Input() data: any;

  // event subscription
  onEvent: Subscription;

  ngOnInit() {
  }

  ngOnDestroy() {
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
      } catch (e) {}
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
