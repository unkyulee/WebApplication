import { Component, Input, OnInit, EventEmitter, Output } from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

// user imports
import { RestService } from "../../services/rest.service";
import { UIService } from "../../services/ui.service";
import { UserService } from "src/app/services/user/user.service";
import { CordovaService } from "src/app/services/cordova.service";
import { EventService } from "src/app/services/event.service";
import { NavService } from "src/app/services/nav.service";
import { BaseComponent } from "../base.component";

@Component({
  selector: "autocomplete",
  templateUrl: "./autocomplete.component.html"
})
export class AutoCompleteComponent extends BaseComponent implements OnInit {
  // Init
  constructor(
    private rest: RestService,
    private ui: UIService,
    public nav: NavService,
    public user: UserService,
    public cordova: CordovaService,
    public event: EventService
  ) {
    super();
  }

  @Input() uiElement: any;
  @Input() data: any;
  @Output() change: EventEmitter<any> = new EventEmitter<any>(); // used for filter

  private typeAheadEventEmitter = new Subject<string>();
  ngOnInit() {
    // not all the input will be sent as an event / rest
    // will be debounced every 700 ms
    this.typeAheadEventEmitter
      .pipe(
        distinctUntilChanged(),
        debounceTime(300)
      )
      .subscribe(v => this.typeAheadEventHandler(v));

    // if src is specified then download the options
    this.loadOption();
  }

  typeAheadEventHandler(v) {
    this.change.emit(v);
    this.loadOption();

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

    if (this.data && this.data[this.uiElement.key])
      v = this.data[this.uiElement.key];

    // if the value is programmatically updated without set property called
    // then set it explicitly
    if (this._value != v) {
      this.value = v;
    }

    return v;
  }

  set value(v: any) {
    if (v != this._value) {
      this._value = v;

      if (this.data) {
        // set value to itself
        this.data[this.uiElement.key] = v;
        this.updateAlso(v);
      }

      // when value is set, reload the option
      this.typeAheadEventEmitter.next(v);
    }
  }

  updateAlso(v) {
    // updateAlso
    if (this.uiElement.updateAlso && this.uiElement.options) {
      // find selected option
      let selected = this.uiElement.options.find(
        item => item[this.uiElement.optionKey] == v
      );

      for (let update of this.uiElement.updateAlso) {
        let source;

        // update the target data
        if (selected) source = selected[update.sourceKey];

        this.data[update.targetKey] = source;
      }
    }
  }

  loadOption() {
    // if optionSrc is specified then request for option
    if (this.uiElement.src) {
      // download data through rest web services
      let src = this.ui.find(["src"], this.uiElement);
      try {
        src = eval(src);
      } catch (e) {}

      let method = this.ui.find(["method"], this.uiElement);
      let data = this.ui.find(["data"], this.uiElement, {});

      this.rest.request(src, data, method).subscribe(response => {
        let transform = this.ui.find(["transform"], this.uiElement, {});
        this.uiElement.options = eval(transform);

        // set default when options are loaded
        this.default();

        // update also
        this.updateAlso(this.value);
      });
    } else {
      // set default
      this.default();
    }
  }

  default() {
    // when data is not set then apply default value
    if (!this.data[this.uiElement.key] && this.uiElement.default) {
      this.data[this.uiElement.key] = this.uiElement.default;
      try {
        this.data[this.uiElement.key] = eval(this.uiElement.default);
      } catch {}

      // try to go through updateAlso options
      this.updateAlso(this.data[this.uiElement.key]);
      return this.data[this.uiElement.key];
    }
  }

  format(option, uiElement) {
    let value =
      option[
        uiElement.optionLabel ? uiElement.optionLabel : uiElement.optionKey
      ];

     if (uiElement.optionLabelTransform) {
      try {
        value = eval(uiElement.optionLabelTransform);
      } catch (e) {
        console.error(e);
      }
    }
    return value;
  }

}
