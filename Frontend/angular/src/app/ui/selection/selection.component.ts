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

@Component({
  selector: "selection",
  templateUrl: "./selection.component.html"
})
export class SelectionComponent implements OnInit {
  // Init
  constructor(private rest: RestService, public user: UserService) {}

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
          let that = this; // make it compatible with autocomplete
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
        for (let update of this.uiElement.updateAlso) {
          // update the target data
          this.data[update.targetKey] = selected[update.sourceKey];
        }
      } else {
        for (let value of v) {
          // find selected option
          let selected = this.uiElement.options.find(
            item => item[this.uiElement.optionKey] == value
          );

          for (let update of this.uiElement.updateAlso) {
            // get source data
            let source = selected[update.sourceKey];

            // update the target data
            obj.ensureExists(this.data, update.targetKey, []);
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
    if (this.uiElement.optionSrc) {
      let src = this.uiElement.optionSrc;
      try {
        src = eval(src);
      } catch (e) {}

      let data = this.uiElement.optionData;
      let method = this.uiElement.optionMethod;
      this.rest.request(src, data, method).subscribe(response => {
        if (this.uiElement.optionTransform)
          this.uiElement.options = eval(this.uiElement.optionTransform);
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
}
