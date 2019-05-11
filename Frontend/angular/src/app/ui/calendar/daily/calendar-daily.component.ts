import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment";

// user imports
import { ConfigService } from "src/app/services/config.service";
import { NavService } from "src/app/services/nav.service";
import { RestService } from "src/app/services/rest.service";
import { EventService } from "src/app/services/event.service";
import { Subscription } from "rxjs";
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: "calendar-daily",
  templateUrl: "./calendar-daily.component.html"
})
export class CalendarDailyComponent {
  constructor(
    public config: ConfigService,
    public router: Router,
    private nav: NavService,
    private rest: RestService,
    private event: EventService,
    public uis: UIService
  ) {}

  // configuration of the ui element
  @Input() uiElement: any;
  @Input() data: any;

  // event subscription
  onEvent: Subscription;
  ngOnInit() {
    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (event && event.name == "refresh") {
        setTimeout(() => this.requestDownload(), 0);
      }
    });

    this.requestDownload();
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  requestDownload() {
    // check startDate
    this.data.startDate = moment(this.data.startDate)
      .startOf("day") // starts from monday
      .toISOString();

    this.data.endDate = moment(this.data.startDate)
      .endOf("day")
      .toISOString();

    //
    if (this.uiElement.src) {
      let src = this.uiElement.src;
      try {
        src = eval(src);
      } catch (e) {
        console.error(e);
      }

      // ignore startDate
      let params = this.nav.getParams();
      delete params["startDate"];
      let data = Object.assign({}, params);

      // show splash
      this.event.send("splash-show");

      this.rest
        .request(src, data, this.uiElement.method)
        .subscribe(response => this.responseDownload(response));
    }
  }

  responseDownload(response) {
    // stop the loading indicator
    this.event.send("splash-hide");

    // map data from response
    this.data.items = [];
    if (this.uiElement.transform) {
      try {
        this.data.items = eval(this.uiElement.transform);
      } catch (e) {
        console.error(e);
      }
    }
  }

  click(item) {
    if (this.uiElement.click) {
      try {
        eval(this.uiElement.click);
      } catch (e) {}
    }
  }

  format(value, data) {
    try {
      value = eval(value);
    } catch (e) {
      console.error(e);
    }
    return value;
  }
}
