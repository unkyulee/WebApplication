import { Component, Input, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription, Subject } from "rxjs";
import { Router } from "@angular/router";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";

// user imports
import { UIService } from "../../services/ui.service";
import { NavService } from "../../services/nav.service";
import { RestService } from "../../services/rest.service";
import { EventService } from "../../services/event.service";
import { UserService } from "../../services/user/user.service";
import { ConfigService } from "src/app/services/config.service";
import { DBService } from "src/app/services/db/db.service";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "data-table",
  templateUrl: "./data-table.component.html"
})
export class DataTableComponent implements OnInit, OnDestroy {
  constructor(
    public config: ConfigService,
    private rest: RestService,
    public ui: UIService,
    public router: Router,
    private nav: NavService,
    private event: EventService,
    public user: UserService, // used by user script
    public db: DBService
  ) {}

  // configuration of the ui element
  @Input() uiElement: any;
  @Input() data: any;

  ///
  _rows = [];
  get rows() {
    // set default key
    if (!this.uiElement.key) this.uiElement.key = "table";

    if (this.data && this.uiElement.key) {
      if (this._rows != this.data[this.uiElement.key]) {
        this._rows = this.data[this.uiElement.key];
        // if the external paging is not used then recalculate the total, size variable
        if (this.uiElement.externalPaging == false) {
          this.total = this._rows ? this._rows.length : 0;
          this.size = this.total;
        }
      }
      this._rows = this.data[this.uiElement.key];
    }

    if (!this._rows) this._rows = [];
    return this._rows;
  }

  set rows(v: any) {
    if (this.data && this.uiElement.key) {
      this.data[this.uiElement.key] = v;
    }

    // set default when value is empty
    if (!v && this.uiElement.key && this.uiElement.default) {
      this.data[this.uiElement.key] = this.uiElement.default;
      try {
        this.data[this.uiElement.key] = eval(this.uiElement.default);
      } catch (e) {}
    }

    if (this.uiElement.format) {
      try {
        this.data[this.uiElement.key] = eval(this.uiElement.format);
      } catch (e) {
        console.error(e);
      }
    }
  }

  // pagination information
  total: number = 0;
  page: number = 0;
  size: number = 0;

  // event subscription
  onEvent: Subscription;

  // Scrolling viewport
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  requestThrottle = new Subject();
  infiniteScroll(e) {
    // when it reached the end
    let bottom = this.viewport.getRenderedRange().end;
    let total = this.viewport.getDataLength();
    if (total < this.total) {
      if (bottom == total) {
        this.requestThrottle.next();
      }
    }
  }

  ngOnInit() {
    this.requestThrottle.pipe(debounceTime(300)).subscribe(v => {
      this.page += 1;
      this.requestDownload();
    });

    // run init script
    if (this.uiElement.init) {
      try {
        eval(this.uiElement.init);
      } catch (e) {
        console.error(e);
      }
    }

    // check if there is any page configuration available
    this.getPage();

    // download data through rest web services
    this.requestDownload();

    // event handler
    this.onEvent = this.event.onEvent.subscribe(event =>
      this.eventHandler(event)
    );
  }

  eventHandler(event) {
    if (event && (!event.key || event.key == this.uiElement.key)) {
      if (event.name == "refresh") {
        this.page = 0; // reset to first page
        this.rows = [];
        // run refresh script
        if (this.uiElement.refresh) {
          try {
            eval(this.uiElement.refresh);
          } catch (e) {
            console.error(e);
          }
        }
        this.data._params_ = this.nav.getParams();
        setTimeout(() => this.requestDownload(), 0);
      } else if (event.name == "pagination") {
        this.page = event.page;
        this.size = event.size;
        setTimeout(() => this.requestDownload(), 0);
      }
    }
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  // Get Pagination information
  getPage() {
    let params = this.nav.getParams();

    // default page is 1
    if (!this.page) {
      this.page = 1;
      // if nav param has page then use it
      if (this.uiElement.externalPaging != false && params["page"]) {
        this.page = params["page"];
      }
    }

    // if the page size is determined in the url then use that otherwise use the one from the uiElement
    if (!this.size) {
      this.size = this.ui.find(["size"], this.uiElement, 10);
      // if nav param has page then use it
      if (this.uiElement.externalPaging != false && params["size"]) {
        this.size = params["size"];
      }
    }
  }

  // setting page will set the values to the URL
  setPage(page, size) {
    // save pagination
    this.page = page;
    this.size = size;

    // parameters
    // do not set pagination when card or list
    if (
      this.uiElement.tableType != "card" &&
      this.uiElement.tableType != "list"
    ) {
      if (this.uiElement.externalPaging != false) {
        this.nav.setParam("page", this.page);
        this.nav.setParam("size", this.size);
      }
    }
  }

  requestDownload(pageInfo?) {
    // get page
    this.getPage();

    // set pagination
    if (!pageInfo) pageInfo = { offset: this.page - 1 };

    // save the pagination passed by data-table
    this.setPage(pageInfo.offset + 1, this.size);

    // download data through rest web services
    let src = this.uiElement.src;
    try {
      src = eval(src);
    } catch (e) {}

    if (src) {
      let method = this.ui.find(["method"], this.uiElement);

      // look at query params and pass it on to the request
      let data = this.ui.find(["data"], this.uiElement, {});
      // apply nav parameters if necessary
      if (this.uiElement.useNavParams != false) {
        let params = this.nav.getParams();
        delete params["_id"];
        data = Object.assign({}, data, params);
      }
      // apply pagination
      data = Object.assign(data, {
        page: this.page,
        size: this.size
      });

      // sorting options
      if (this.uiElement.sort) {
        if (this.sort.dir == "asc") data["_sort"] = this.sort.prop;
        else if (this.sort.dir == "desc") data["_sort_desc"] = this.sort.prop;
      }

      let options = {};
      if (this.uiElement.options) {
        options = this.uiElement.options;
        try {
          options = eval(`${options}`);
        } catch {}
      }

      // send REST request
      this.event.send("splash-show"); // show splash
      this.rest
        .request(
          src,
          data,
          method,
          options,
          this.uiElement.tableType == "card" ? false : true
        )
        .subscribe(response => this.responseDownload(response));
    } else {
      this.total = this.rows ? this.rows.length : 0;
      this.size = this.total;
    }
  }

  responseDownload(response) {
    // hide splash
    this.event.send("splash-hide");

    // map data from response
    let transform = this.uiElement.transform || "response.data";
    try {
      this.rows = eval(transform);
    } catch (e) {}

    // get total records
    let transformTotal = this.uiElement.transformTotal || "response.total";
    try {
      this.total = parseInt(eval(transformTotal));
    } catch (e) {}
    if (this.total != 0 && !this.total) this.total = this.rows.length;
  }

  // -------------------------------------------------------

  click(row, click) {
    if (click) {
      try {
        eval(click);
      } catch (e) {
        console.error(e);
      }
    }
  }

  // format to date on the column
  format(v, transform?, row?) {
    // transform
    if (transform) {
      try {
        v = eval(transform);
      } catch (e) {
        console.error(e);
      }
    }
    return v;
  }

  sort: any;
  onSort(event: any) {
    // event.sorts.dir / prop
    this.sort = event.sorts[0];
    if (this.sort) this.requestDownload();
  }

  condition(uiElement) {
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
