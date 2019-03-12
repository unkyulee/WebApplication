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

    if (v && this.uiElement.format) {
      try {
        v = eval(this.uiElement.format);
      } catch (e) {
        console.error(e);
      }
    }

    return v;
  }

  set rows(v: any) {
    if (this.data && this.uiElement.key) {
      this.data[this.uiElement.key] = v;
    }
  }

  // pagination information
  total: number = 0;
  page: number = 0;
  size: number = 0;

  // event subscription
  onEvent: Subscription;

  ngOnInit() {
    // check if there is any page configuration available
    this.getPage();

    // download data through rest web services
    this.requestDownload();

    // event handler
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (event && (!event.key || event.key == this.uiElement.key)) {
        if (event.name == "refresh") {
          this.page = 1; // reset to first page
          setTimeout(() => this.requestDownload(), 0);
        } else if (event.name == "pagination") {
          this.page = event.page;
          this.size = event.size;
          setTimeout(() => this.requestDownload(), 0);
        }
      }
    });
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
    if (this.uiElement.externalPaging != false) {
      this.nav.setParam("page", this.page);
      this.nav.setParam("size", this.size);
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
    let src = this.ui.find(["src"], this.uiElement);
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

      // send REST request
      this.event.send("splash-show"); // show splash
      this.rest
        .request(src, data, method)
        .subscribe(response => this.responseDownload(response));
    } else {
      this.uiElement.externalPaging = false;
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

  sort: any;
  onSort(event: any) {
    // event.sorts.dir / prop
    this.sort = event.sorts[0];
    if (this.sort) this.requestDownload();
  }
}
