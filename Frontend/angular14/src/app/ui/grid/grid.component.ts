// @ts-nocheck
import { Component, ChangeDetectionStrategy } from "@angular/core";

// user Imports
import { BaseComponent } from "../base.component";

@Component({
  selector: "grid",
  templateUrl: `./grid.component.html`,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class GridComponent extends BaseComponent {
  get rows() {
    if (this.data && this.uiElement.key) {
      this._rows = obj.get(this.data, this.uiElement.key);
    }

    //
    if (typeof this._rows != "undefined" && !Array.isArray(this._rows)) {
      let rows = [];
      for (let key of Object.keys(this._rows)) {
        rows.push(this._rows[key]);
      }
      this._rows = rows;
    }

    // if there is a filter
    if (this.uiElement.filter) {
      obj.ensureExists(this, "_rows", []);
      this._rows = this._rows.filter((item) => eval(this.uiElement.filter));
    }

    return this._rows;
  }

  set rows(v: any) {
    if (this.data && this.uiElement.key) {
      obj.set(this.data, this.uiElement.key, v);
    }

    // set default when value is empty
    if (!v && this.uiElement.key && this.uiElement.default) {
      let defaultValue = this.uiElement.default;
      try {
        defaultValue = eval(this.uiElement.default);
      } catch (e) {
        console.error(e, this.uiElement);
      }
      obj.set(this.data, this.uiElement.key, defaultValue);
    }
  }
}
