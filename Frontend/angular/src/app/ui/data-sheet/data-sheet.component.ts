import { Component } from "@angular/core";
import * as obj from "object-path";

// user imports
import { BaseComponent } from "../base.component";

@Component({
  selector: "data-sheet",
  templateUrl: "./data-sheet.component.html"
})
export class DataSheetComponent extends BaseComponent {
  /// rows
  _rows = [];
  get rows() {
    // set default key
    if (!this.uiElement.key) this.uiElement.key = "sheet";

    if (this.data && this.uiElement.key) {
      if (this._rows != obj.get(this.data, this.uiElement.key)) {
        this._rows = obj.get(this.data, this.uiElement.key);
      }
      this._rows = obj.get(this.data, this.uiElement.key);
    }

    if (!this._rows) this._rows = [];
    return this._rows;
  }

  set rows(v: any) {
    if (this.data && this.uiElement.key) {
      obj.set(this.data, this.uiElement.key, v);
    }

    // set default when value is empty
    if (!v && this.uiElement.key && this.uiElement.default) {
      obj.set(this.data, this.uiElement.key, this.uiElement.default);
      try {
        obj.set(this.data, this.uiElement.key, eval(this.uiElement.default));
      } catch (e) {}
    }

    if (this.uiElement.format) {
      try {
        obj.set(this.data, this.uiElement.key, eval(this.uiElement.format));
      } catch (e) {
        console.error(e);
      }
    }
  }

  ngOnInit() {
    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (
        event &&
        event.name == "refresh" &&
        (!event.key || event.key == this.uiElement.key)
      ) {
        setTimeout(() => this.requestDownload(), 0);
      }
    });

    this.requestDownload();
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  requestDownload() {
    //
    if (this.uiElement.src) {
      let src = this.uiElement.src;
      try {
        src = eval(src);
      } catch (e) {
        console.error(e);
      }
      let data = this.nav.getParams();
      try {
        eval(this.uiElement.preProcess);
      } catch (e) {
        console.error(e);
      }

      // show splash
      this.event.send("splash-show");

      this.rest
        .request(
          src,
          data,
          this.uiElement.method,
          {},
          typeof this.uiElement.cache === "undefined"
            ? true
            : this.uiElement.cache
        )
        .subscribe(response => this.responseDownload(response));
    }
  }

  async responseDownload(response) {
    // stop the loading indicator
    this.event.send("splash-hide");

    // map data from response
    if (this.uiElement.transform) {
      try {
        this.data[this.uiElement.key] = await eval(this.uiElement.transform);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
