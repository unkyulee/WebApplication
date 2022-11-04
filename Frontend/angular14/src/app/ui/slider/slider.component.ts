// @ts-nocheck
import { Component } from "@angular/core";
import { BaseComponent } from "../base.component";
import obj from "object-path";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "slider",
  template: ` <p-slider
    [(ngModel)]="value"
    [disabled]="uiElement.disabled"
    [max]="uiElement.max"
    [min]="uiElement.min"
    [step]="uiElement.step"
    [style]="uiElement.style"
    [class]="uiElement.class"
    [range]="uiElement.range"
  >
  </p-slider>`,
})
export class SliderComponent extends BaseComponent {
  //
  typeAheadEventEmitter = new Subject<string>();
  ngOnInit() {
    super.ngOnInit();

    // not all the input will be sent as an event / rest
    // will be debounced every 700 ms
    this.typeAheadEventEmitter
      .pipe(distinctUntilChanged(), debounceTime(300))
      .subscribe((v) => this.inputChanged(v));
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
    super.ngOnDestroy();
    this.typeAheadEventEmitter.unsubscribe();
  }

  //
  _value: any;
  get value() {
    if (this.data && this.uiElement.key) {
      // if null then assign default
      if (typeof obj.get(this.data, this.uiElement.key) == "undefined") {
        let def = this.uiElement.default;
        try {
          def = eval(this.uiElement.default);
        } catch (e) {}
        obj.set(this.data, this.uiElement.key, def);
      }

      // set value
      this._value = obj.get(this.data, this.uiElement.key);
    }

    // Transform
    if (this.uiElement.transform) {
      try {
        this._value = eval(this.uiElement.transform);
      } catch (e) {}
    }

    return this._value;
  }

  set value(v: any) {
    this._value = v;

    if (this.data && this.uiElement.key) {
      obj.set(this.data, this.uiElement.key, v);
    }

    this.typeAheadEventEmitter.next(v);
  }
}
