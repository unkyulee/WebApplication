import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSelect } from "@angular/material";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import * as obj from "object-path";

// user imports
import { RestService } from "../../services/rest.service";
import { UserService } from "src/app/services/user/user.service";
import { CordovaService } from "src/app/services/cordova.service";
import { EventService } from "src/app/services/event.service";
import { NavService } from "src/app/services/nav.service";
import { BaseComponent } from "../base.component";

@Component({
  selector: "selection",
  templateUrl: "./selection.component.html"
})
export class SelectionComponent extends BaseComponent implements OnInit {
  // Init
  constructor(
    private rest: RestService,
    public nav: NavService,
    public user: UserService,
    public cordova: CordovaService,
    public event: EventService
  ) {
    super();
  }

  @ViewChild("select") select: MatSelect;

  ngOnInit() {
    // not all the input will be sent as an event / rest
    // will be debounced every 700 ms
    this.typeAheadEventEmitter
      .pipe(
        distinctUntilChanged(),
        debounceTime(300)
      )
      .subscribe(v => {        
        this.typeAheadEventHandler(v);
      });
  }

  ngOnDestroy() {
    this.typeAheadEventEmitter.unsubscribe();
  }

  _value: any;
  get value() {
    // if the key is specify fied then find it from this.data
    if (this.data && this.uiElement.key) {
      // if null then assign default
      if (typeof this.data[this.uiElement.key] == "undefined") {
        let defaultValue = this.uiElement.default;
        try {
          defaultValue = eval(this.uiElement.default);
        } catch (e) {}
        obj.set(this.data, this.uiElement.key, defaultValue);
      }

      //
      this._value = obj.get(this.data, this.uiElement.key);      
    }

    // selection multiple mode must be array
    if (
      typeof this._value !== "undefined" &&
      this.uiElement.multiple &&
      !Array.isArray(this._value)
    ) {
      this._value = [this._value];      
    }

    // because autocomplete assumes that the value displayed is string
    // whereas option can be an object, it requires formatting
    if (this.uiElement.selectionType == "autocomplete")
      return this.format(this._value);

    return this._value;
  }

  set value(v: any) {
    this._value = v;

    // if the key is specify fied then save it to this.data
    if (this.data && this.uiElement.key) {
      obj.set(this.data, this.uiElement.key, v);      
    }

    // check if the minimumLength is specified
    if (
      this.uiElement.minimumLength > 0 &&
      this.uiElement.minimumLength > this._value
        ? this._value.length
        : 0
    ) {
      // search value has not reached the minimum length
      return;
    } else if (this.uiElement.selectionType == "autocomplete") {
      // proceed with deferred type
      this.typeAheadEventEmitter.next(v);
    }

    // close the selection panel
    if (this.select && this.uiElement.keepOpen != true) this.select.close();
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

      this.rest
        .request(src, data, this.uiElement.method)
        .subscribe(response => {
          this.isLoading = false;

          if (this.uiElement.transform)
            this.uiElement.options = eval(this.uiElement.transform);
        });
    } else {
      this.isLoading = false;
    }
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

  selected() {	
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
    if (this.uiElement.optionKey && option && option[this.uiElement.optionKey])
      value = option[this.uiElement.optionKey];

    if (this.uiElement.optionLabelTransform) {
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
    this.loadOption();
  }
}
