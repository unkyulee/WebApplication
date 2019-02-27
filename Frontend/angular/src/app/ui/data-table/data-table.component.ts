import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

// user imports
import { UIService } from "../../services/ui.service";
import { NavService } from "../../services/nav.service";
import { RestService } from "../../services/rest.service";
import { EventService } from "../../services/event.service";
import { UserService } from "../../services/user/user.service";
import { ConfigService } from "src/app/services/config.service";

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
    public user: UserService // used by user script
  ) {}

  // configuration of the ui element
  @Input() uiElement: any;
  @Input() data: any;

  get rows() {
    let v = null;

    if (this.data && this.uiElement.key) {
      // if null then assign default
      if (!this.data[this.uiElement.key]) {
        let def = this.uiElement.default;
        try {
          def = eval(this.uiElement.default);
        } catch (e) {}
        this.data[this.uiElement.key] = def;
      }

      // set value
      v = this.data[this.uiElement.key];
    }

    if(v && this.uiElement.format) {
      try {
        v = eval(this.uiElement.format)
      } catch(e) {
        console.error(e)
      }
    }

    // if the src is not there then recaluculate the total
    if(v && !this.uiElement.src)
      this.total = v.length

    return v;
  }

  set rows(v: any) {
    if (this.data && this.uiElement.key) {
      this.data[this.uiElement.key] = v;
    }
  }

  // configuration values
  columns: any[];
  total: number = 0;
  sort: any;
  groupBy: string;

  // event subscription
  onEvent: Subscription;

  ngOnInit() {
    // check if there is any page configuration available
    this.getPage();

    // download data through rest web services
    this.requestDownload();

    // event handler
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (
        event &&
        event.name == "refresh" &&
        (!event.key || event.key == this.uiElement.key)
      ) {
        this.page = 1; // reset to first page
        setTimeout(() => this.requestDownload(), 0);
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  // pagination information
  page: number = 0;
  size: number = 0;

  // Get Pagination information
  getPage() {
    // default page is 1
    if (!this.page) this.page = 1;

    // if the page size is determined in the url then use that otherwise use the one from the uiElement
    if (!this.size) this.size = this.ui.find(["size"], this.uiElement, 10);
  }

  // setting page will set the values to the URL
  setPage(page, size) {
    // save pagination
    this.page = page;
    this.size = size;
  }

  requestDownload(pageInfo?) {
    // get page
    this.getPage();

    // set pagination
    if (!pageInfo) pageInfo = { offset: this.page - 1 };

    // save the pagination passed by data-table
    this.setPage(pageInfo.offset + 1, this.size);

    // parameters
    let params = this.nav.getParams();
    delete params["_id"];

    // download data through rest web services
    let src = this.ui.find(["src"], this.uiElement);
    try { src = eval(src); } catch (e) {}

    if(src) {
      let method = this.ui.find(["method"], this.uiElement);

      // look at query params and pass it on to the request
      let data = this.ui.find(["data"], this.uiElement, {});
      data = Object.assign({}, data, params);

      // sorting options
      if (this.sort) {
        if (this.sort.dir == "asc") data["_sort"] = this.sort.prop;
        else if (this.sort.dir == "desc") data["_sort_desc"] = this.sort.prop;
      }

      // send REST request
      this.event.send("splash-show");     // show splash
      this.rest
        .request(src, data, method)
        .subscribe(response => this.responseDownload(response));
    } else {
      this.total = this.rows?this.rows.length: 0;
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
  format(value, transform?, row?) {
    // transform
    if (transform) {
      try {
        value = eval(transform);
      } catch (e) {
        console.error(e);
      }
    }
    return value;
  }

  onSort(event: any) {
    // event.sorts.dir / prop
    this.sort = event.sorts[0];
    if (this.sort) this.requestDownload();
  }
}
