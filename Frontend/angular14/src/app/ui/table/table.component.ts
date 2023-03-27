// @ts-nocheck
import { Component } from "@angular/core";
import { CdkDragDrop } from "@angular/cdk/drag-drop";

// user imports
import { BaseComponent } from "../base.component";

@Component({
  selector: "table-component",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"],
})
export class TableComponent extends BaseComponent {
  ///
  _rows = [];
  _selection;

  //
  sort: any;
  onGoingSort = false;

  // pagination information
  loading = false;
  total: number = 0;
  page: number = 0;
  pageInfo = {};

  //
  show_filter = !this.config.isHandset;

  ngOnInit() {
    super.ngOnInit();

    // event handler
    this.onEvent = this.event.onEvent.subscribe((event) =>
      this.eventHandler(event)
    );

    if (this.uiElement.tableType != "table") {
      this.requestDownload();
    }
  }

  eventHandler(event) {
    if (event && (!event.key || event.key == this.uiElement.key)) {
      if (
        event.name == "refresh" &&
        (!event.key || event.key == this.uiElement.key)
      ) {
        setTimeout(() => this.requestDownload(), 0);
      }
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.onEvent.unsubscribe();
  }

  async requestDownload(pageInfo?) {
    if (pageInfo) this.pageInfo = pageInfo;
    else pageInfo = this.pageInfo;

    // parse page information
    this.uiElement.size = pageInfo?.rows ?? 25;
    this.page = Math.ceil((pageInfo?.first + 1) / (this.uiElement.size ?? 25));

    // download data through rest web services
    let src = this.uiElement.src;
    if (src) {
      try {
        src = await eval(src);
      } catch (e) {
        console.error(e, this.uiElement);
      }

      // look at query params and pass it on to the request
      let filter = this.data?.filter ?? {};

      // apply pagination
      filter = Object.assign(filter, {
        page: this.page,
        size: this.uiElement.size,
      });

      // sorting options
      if (pageInfo?.sortField) {
        if (pageInfo?.sortOrder == 1) filter["_sort"] = pageInfo?.sortField;
        else if ((pageInfo?.sortOrder = -1))
          filter["_sort_desc"] = pageInfo?.sortField;
      }

      // apply pre Process
      if (this.uiElement.preProcess) {
        try {
          eval(this.uiElement.preProcess);
        } catch (e) {
          console.error(e, this.uiElement);
        }
      }

      // send REST request
      this.loading = true;
      this.rest
        .request(
          src,
          filter,
          this.uiElement.method,
          this.uiElement?.options ?? {},
          this.uiElement.cached
        )
        .subscribe((response) => {
          this.responseDownload(response);
          this.loading = false;
        });
    } else {
      // calculate the page, size and total when src is not given
      this.total = this.rows ? this.rows.length : 0;
      this.size = this.total;
    }
  }

  async responseDownload(response) {
    // map data from response
    let transform = this.uiElement.transform || "response.data";
    try {
      this.rows = await eval(transform);
    } catch (e) {
      console.error(e, this.uiElement);
    }

    // get total records
    let transformTotal = this.uiElement.transformTotal || "response.total";
    try {
      this.total = parseInt(await eval(transformTotal));
    } catch (e) {
      console.error(e, this.uiElement);
    }
    if (this.total != 0 && !this.total)
      this.total = obj.get(this, "rows", []).length;

    // hide splash
    this.event.send({ name: "changed" });
  }

  get rows() {
    if (this.data && this.uiElement.key) {
      this._rows = obj.get(this.data, this.uiElement.key);
    } else if (Array.isArray(this.data)) {
      this._rows = this.data;
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

  get selection() {
    return this._selection;
  }
  set selection(item: any) {
    this._selection = item;
  }

  onRowSelect(event) {
    let item = event.data;
    if (obj.get(this.uiElement, "click")) {
      try {
        eval(this.uiElement.click);
      } catch {}
    }
  }

  onRowUnselect(event) {
    let item = event.data;
    if (obj.get(this.uiElement, "click")) {
      try {
        eval(this.uiElement.click);
      } catch {}
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.uiElement.drop) {
      try {
        eval(this.uiElement.drop);
      } catch (e) {
        console.error(e, this.uiElement);
      }
    }
  }

  condition(uiElement, row) {
    let result = true;
    if (uiElement && uiElement.condition) {
      try {
        result = eval(uiElement.condition);
      } catch (e) {
        console.error(uiElement.condition, e);
        result = false;
      }
    }

    return result;
  }
}
