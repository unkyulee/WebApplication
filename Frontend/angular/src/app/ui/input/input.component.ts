import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from "@angular/core";
import { DateTimeAdapter } from "ng-pick-datetime";
import { Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import { UserService } from "../../services/user/user.service";
import { EventService } from "../../services/event.service";
import { ConfigService } from "src/app/services/config.service";
import { NavService } from "src/app/services/nav.service";
import { RestService } from "src/app/services/rest.service";
import { BaseComponent } from '../base.component';

@Component({
  selector: "input-component",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"]
})
export class InputComponent extends BaseComponent {
  constructor(
    public user: UserService,
    public event: EventService,
    private dateTimeAdapter: DateTimeAdapter<any>,
    private config: ConfigService,
    public nav: NavService,
    public rest: RestService
  ) { super() }
  
  typeAheadEventEmitter = new Subject<string>();

  ngOnInit() {
    // not all the input will be sent as an event / rest
    // will be debounced every 700 ms
    this.typeAheadEventEmitter
      .pipe(
        distinctUntilChanged(),
        debounceTime(300)
      )
      .subscribe(v => this.inputChanged(v));

    this.dateTimeAdapter.setLocale(
      this.uiElement.locale
        ? this.uiElement.locale
        : this.config.get("locale_long")
    );

    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(event =>
      this.eventHandler(event)
    );
  }

  @ViewChild("datetimepicker_target") datetimepicker: ElementRef;
  eventHandler(event) {
    if (
      event &&
      event.name == "datepicker-trigger" &&
      event.key == this.uiElement.key &&
      this.datetimepicker
      ) {
        this.datetimepicker.nativeElement.click()
    }
  }

  inputChanged(v) {    
    // see if there are any input change handlers
    if (this.uiElement.changed) {
      try {
        eval(this.uiElement.changed);
      } catch (ex) {
        console.error(ex);
      }
    }
  }

  ngOnDestroy() {
    this.typeAheadEventEmitter.unsubscribe();
  }

  _value: any;
  get value() {
    let v = null;

    // do not set value if it is password
    if (this.uiElement.inputType == "password") return;

    if (this.data && this.uiElement.key) {
      // if null then assign default
      if (typeof this.data[this.uiElement.key] == "undefined") {
        let def = this.uiElement.default;
        try {
          def = eval(this.uiElement.default);
        } catch (e) {}
        this.data[this.uiElement.key] = def;
      }

      // set value
      v = this.data[this.uiElement.key];
    }

    // Transform
    if (this.uiElement.transform) {
      try {
        v = eval(this.uiElement.transform);
      } catch (e) {}
    }

    // if number
    if (v && this.uiElement.inputType == "number") v = parseFloat(v);

    // if the value is programmatically updated without set property called
    // then set it explicitly
    if (this._value != v) {
      this._value = v;
      this.value = v;
    }

    return v;
  }

  set value(v: any) {
    if (this._value != v) {
      this._value = v;

      if (this.data && this.uiElement.key) {
        this.data[this.uiElement.key] = v;
        // if number
        if (v && this.uiElement.inputType == "number")
          this.data[this.uiElement.key] = parseFloat(v);
      }
    }

    this.typeAheadEventEmitter.next(v);
  }

  yearSelected(date, trigger) {
    if(this.uiElement.yearSelected) {
      eval(this.uiElement.yearSelected)
    }
  }

  monthSelected(date, trigger) {
    if(this.uiElement.monthSelected) {
      eval(this.uiElement.monthSelected)
    }
  }

}
