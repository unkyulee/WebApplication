import { Component, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MatMenuTrigger } from '@angular/material';
import { Subscription } from 'rxjs';

// user Imports
import { BaseComponent } from '../base.component';
import { ConfigService } from "src/app/services/config.service";
import { UserService } from "src/app/services/user/user.service";
import { EventService } from "src/app/services/event.service";
import { RestService } from "src/app/services/rest.service";

@Component({
  selector: "popup-menu",
  templateUrl: "./popup-menu.component.html"
})
export class PopupMenuComponent extends BaseComponent {
  @Input() uiElement: any;
  @Input() data: any;

  // event subscription
  onEvent: Subscription;

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  constructor(
    public config: ConfigService,
    public user: UserService,
    public event: EventService,
    public rest: RestService,
    public router: Router
  ) { super(); }

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
