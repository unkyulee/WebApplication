import {
  Component,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter
} from "@angular/core";
import { MatSelect } from "@angular/material";
import * as obj from "object-path";

// user imports
import { RestService } from "../../services/rest.service";
import { UserService } from "src/app/services/user/user.service";
import { UIService } from "src/app/services/ui.service";
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
    public ui: UIService,
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

  @ViewChild("select") select: MatSelect;

  _value: any;
  get value() {
    let v = null;
    if (this.data && this.uiElement.key) {
      // if null then assign default
      if (typeof this.data[this.uiElement.key] == "undefined") {
        let def = this.uiElement.default;
        try {
          def = eval(this.uiElement.default);
        } catch (e) {}
        this.data[this.uiElement.key] = def;
      }

      v = this.data[this.uiElement.key];
      if (
        typeof v !== "undefined" &&
        this.uiElement.multiple &&
        !Array.isArray(v)
      ) {
        v = [v];
      }
    }

    // if the value is programmatically updated without set property called
    // then set it explicitly
    if (this._value != v) {
      this._value = v;
      this.value = v;
    }

    return v;
  }

  set value(v: any) {
    if (v != this._value) {
      this._value = v;
      this.change.emit(v);

      if (this.uiElement.changed) {
        try {
          eval(this.uiElement.changed);
        } catch (ex) {
          console.error(ex);
        }
      }
    }

    // close the selection panel
    if (this.select) this.select.close();

    if (this.data) {
      // set value to itself
      this.data[this.uiElement.key] = v;

      // updateAlso
      this.updateAlso(v);
    }
  }

  updateAlso(v) {
    // updateAlso
    if (this.uiElement.updateAlso && this.uiElement.options) {
      if (this.uiElement.multiple != true) {
        // find selected option
        let selected = this.uiElement.options.find(
          item => item[this.uiElement.optionKey] == v
        );
        if(selected) {
          for (let update of this.uiElement.updateAlso) {
            // update the target data
            this.data[update.targetKey] = selected[update.sourceKey];
          }
        }
      } else {
        // reset target values
        for (let update of this.uiElement.updateAlso) {
          obj.ensureExists(this.data, update.targetKey, []);
          let target = obj.get(this.data, update.targetKey);
          if(Array.isArray(target)) target.length = 0; // reset the array of the target
        }

        // for each value update the updateAlso values
        for (let value of v) {
          // find selected option
          let selected = this.uiElement.options.find(
            item => item[this.uiElement.optionKey] == value
          );

          for (let update of this.uiElement.updateAlso) {
            // get source data
            let source = selected[update.sourceKey];

            // update the target data
            let target = obj.get(this.data, update.targetKey);
            if (Array.isArray(target) && target.indexOf(source) < 0)
              target.push(source);
          }
        }
      }
    }
  }

  ngOnInit() {
    // if optionSrc is specified then download the options
    if (this.uiElement.src) {
      let src = this.uiElement.src;
      try {
        src = eval(src);
      } catch (e) {}

      let data = this.uiElement.data;
      let method = this.uiElement.method;
      this.rest.request(src, data, method).subscribe(response => {
        if (this.uiElement.transform)
          this.uiElement.options = eval(this.uiElement.transform);
        else this.uiElement.options = response;

        // when options are ready then run
        this.default();
      });
    } else {
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
      if (this.data[this.uiElement.key])
        this.updateAlso(this.data[this.uiElement.key]);
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
