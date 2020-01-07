import { Component, ViewChild } from "@angular/core";
var obj = require("object-path");

// user imports
import { BaseComponent } from "../base.component";
import { jqxDataTableComponent } from "jqwidgets-ng/jqxdatatable";

@Component({
  selector: "data-sheet",
  templateUrl: "./data-sheet.component.html"
})
export class DataSheetComponent extends BaseComponent {
  @ViewChild("dataTableReference", {static: false}) table: jqxDataTableComponent;

  _data;
  get data() {
    return this._data;
  }
  set data(v) {
    this._data = v;
    //
    setTimeout(() => this.requestDownload(), 1000);
  }

  ///
  _rows;
  get rows() {
    if (this.data && this.uiElement.key) {
      this._rows = obj.get(this.data, this.uiElement.key, []);
    }

    if (typeof this._rows != "undefined" && !Array.isArray(this._rows))
      this._rows = [this._rows];

    // when data gets updated
    this._rows = new jqx.observableArray(
      this._rows,
      v => (this.rows = this.dataAdapter.records)
    );

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
        console.error(e);
      }
      obj.set(this.data, this.uiElement.key, defaultValue);
    }
  }

  ngOnInit() {
    super.ngOnInit();

    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (
        event &&
        event.name == "refresh" &&
        (!event.key || event.key == this.uiElement.key)
      ) {
        setTimeout(() => this.requestDownload(), 0);
      }
      else if (
        event &&
        event.name == "refreshDataAdapter" &&
        (!event.key || event.key == this.uiElement.key)
      ) {
        setTimeout(() => this.refreshDataAdapter(), 0);
      }
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.onEvent.unsubscribe();
  }

  requestDownload() {
    this.refreshDataAdapter();

    //
    if (this.uiElement.src) {
      let src = this.uiElement.src;
      try {
        src = eval(src);
      } catch (e) {
        console.error(e);
      }
      let data = this.nav.getParams();

      if (this.uiElement.preProcess) {
        try {
          eval(this.uiElement.preProcess);
        } catch (e) {
          console.error(e);
        }
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
        this.rows = await eval(this.uiElement.transform);;
      } catch (e) {
        console.error(e);
      }
    }

    // refresh data table
    this.refreshDataAdapter();
  }

  // dataTable dataAdapter
  dataAdapter: any;
  refreshDataAdapter() {
    // refresh data table
    this.dataAdapter = new jqx.dataAdapter({
      localdata: this.rows,
      datatype: "observableArray",
      datafields: this.uiElement.datafields
    });
  }

  onRowClick(event) {
    // event.args.row
    let script = obj.get(this.uiElement, "onRowClick");
    if (script) {
      try {
        eval(script);
      } catch (e) {
        console.error(e);
      }
    }
  }

  onRowDoubleClick(event) {
    // event.args.row
    let script = obj.get(this.uiElement, "onRowDoubleClick");
    if (script) {
      try {
        eval(script);
      } catch (e) {
        console.error(e);
      }
    }
  }

  onCellBeginEdit(event) {
    let script = obj.get(this.uiElement, "onCellBeginEdit");
    if (script) {
      try {
        eval(script);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
