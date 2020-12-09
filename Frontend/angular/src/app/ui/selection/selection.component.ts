import { Component, ViewChild, ElementRef } from "@angular/core";
import { MatSelect } from "@angular/material/select";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import obj from "object-path";

// user imports
import { BaseComponent } from "../base.component";
import { MatChipInputEvent } from "@angular/material/chips";

@Component({
  selector: "selection",
  templateUrl: "./selection.component.html",
})
export class SelectionComponent extends BaseComponent {
  @ViewChild("select") select: MatSelect;
  @ViewChild("autocomplete") autocomplete: ElementRef;

  ngOnInit() {
    super.ngOnInit();
    // load options
    if (!this.uiElement.minimumLength) {
      this.loadOption();
    }

    // not all the input will be sent as an event / rest
    // will be debounced every 700 ms
    this.typeAheadEventEmitter
      .pipe(distinctUntilChanged(), debounceTime(300))
      .subscribe((v) => {
        this.typeAheadEventHandler(v);
      });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    // bind compare function for mat-select
    if (this.select)
      this.select.compareWith = (o1, o2) => this.compareWith(o1, o2);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.typeAheadEventEmitter.unsubscribe();
  }

  _value: any;
  get value() {
    // if the key is specify fied then find it from this.data
    if (this.data && this.uiElement.key) {
      //
      this._value = obj.get(this.data, this.uiElement.key);
    }

    // because autocomplete assumes that the value displayed is string
    // whereas option can be an object, it requires formatting
    if (this.uiElement.inputValueTransform) {
      try {
        return eval(this.uiElement.inputValueTransform);
      } catch (e) {
        console.error(e);
      }
    }

    return this._value;
  }

  set value(v: any) {
    this._value = v;

    // if the key is specify fied then save it to this.data
    if (this.data && this.uiElement.key) {
      // selection multiple mode must be array
      if (
        typeof this._value !== "undefined" &&
        this.uiElement.multiple &&
        !Array.isArray(this._value)
      ) {
        this._value = [this._value];
      }
      // if null then assign default
      if (typeof this._value == "undefined" && this.uiElement.default) {
        try {
          this._value = eval(this.uiElement.default);
        } catch {}
      }
      obj.set(this.data, this.uiElement.key, this._value);
    }

    // check if the minimumLength is specified
    if (
      typeof this._value != "undefined" &&
      this.uiElement.minimumLength > 0 &&
      this.uiElement.minimumLength > this._value.length
    ) {
      // search value has not reached the minimum length
      return;
    } else if (this.uiElement.selectionType == "autocomplete") {
      // proceed with deferred type
      this.typeAheadEventEmitter.next(v);
    }
  }

  // value operation for chips
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if (this.data && this.uiElement.key) {
      if ((value || "").trim()) {
        obj.ensureExists(this.data, this.uiElement.key, []);
        this.data[this.uiElement.key].push(value.trim());
      }
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  remove(v): void {
    if (this.data && this.uiElement.key) {
      obj.ensureExists(this.data, this.uiElement.key, []);
      const index = obj.get(this.data, this.uiElement.key, []).indexOf(v);
      if (index >= 0) {
        obj.get(this.data, this.uiElement.key, []).splice(index, 1);
      }
    }
  }

  loadOption() {
    if (this.uiElement.src) {
      // download data through rest web services
      let src = this.uiElement.src;
      try {
        src = eval(src);
      } catch (e) {}

      let data = this.uiElement.data;
      try {
        data = eval(data);
      } catch (e) {}

      this.isLoading = true;
      this.rest
        .request(src, data, this.uiElement.method, {}, this.uiElement.cached)
        .subscribe((response) => this.loadOptionHandler(response));
    } else {
      this.isLoading = false;
    }
  }

  loadOptionHandler(response) {
    this.isLoading = false;

    if (this.uiElement.transform)
      this.uiElement.options = eval(this.uiElement.transform);
  }

  // delayed typing -> send rest request
  private typeAheadEventEmitter = new Subject<string>();
  typeAheadEventHandler(v) {
    this.loadOption();
    this.changed();
  }

  changed() {
    if (this.uiElement.changed) {
      try {
        eval(this.uiElement.changed);
      } catch (e) {
        console.error(e);
      }
    }
  }

  selected(option?) {
    if (this.uiElement.selected) {
      try {
        eval(this.uiElement.selected);
      } catch (e) {
        console.error(e);
      }
    }
  }

  format(option) {
    let value = option;

    if (value && this.uiElement.optionLabelTransform) {
      try {
        value = eval(this.uiElement.optionLabelTransform);
      } catch (e) {
        console.error(e);
      }
    }
    return value;
  }

  isLoading = false;
  isOpen = false;
  openChanged(event) {
    this.isOpen = event;
    this.isLoading = event;
  }

  compareWith(o1: any, o2: any): boolean {
    if (this.uiElement.compare) {
      try {
        return eval(this.uiElement.compare) == true;
      } catch {}
    }
    return JSON.stringify(o1) == JSON.stringify(o2);
  }
}
