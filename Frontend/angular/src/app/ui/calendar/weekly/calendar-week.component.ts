import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment";

// user imports
import { ConfigService } from "src/app/services/config.service";
import { NavService } from "src/app/services/nav.service";
import { RestService } from "src/app/services/rest.service";
import { EventService } from "src/app/services/event.service";
import { Subscription } from "rxjs";

/*


    
   


  set data(v) {
    this._data = v;
    if (this._data) {
      // filter data matches this.day
      this.items = this._data.filter(item => {
        let start = new Date(item[this.uiElement.startDateField]);
        let end = new Date(item[this.uiElement.endDateField]);
        let day_end = moment(this.day)
          .endOf("day")
          .toDate();

        if (day_end >= start && this.day <= end) return true;

        return false;
      });
    }
  }



  // date format
  today: Date;
  lang: string;
  items: any[] = [];

//
    this.today = new Date();

    // load locale for date format
    this.lang = this.ui.find(["lang"], this.uiElement);

    // contents
    this.contents = this.ui.find(["event", "contents"], this.uiElement);
*/

@Component({
  selector: "calendar-week",
  templateUrl: "./calendar-week.component.html"
})
export class CalendarColumnComponent {
  constructor(
    public config: ConfigService,
    public router: Router,
    private nav: NavService,
    private rest: RestService,
    private event: EventService
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
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  // 7 days
  _startDate: any;
  _dates: any[];
  get dates(): any[] {
    if (!this._dates) this._dates = [];

    // update when startDate is changed
    if (this.data.startDate != this._startDate || this._dates.length < 7) {
      // check startDate
      this.data.startDate = moment(this.data.startDate)
        .startOf("isoWeek") // starts from monday
        .toISOString();

      this.data.endDate = moment(this.data.startDate)
        .add(7, "day")
        .toISOString();

      // save the date
      this._startDate = this.data.startDate;

      // for 7 days weekly view
      this._dates = [];
      for (let i = 0; i < 7; i++) {
        this._dates.push(
          moment(this.data.startDate)
            .add(i, "days")
            .toDate()
        );
      }

      // request for data
      this.requestDownload();
    }

    return this._dates;
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

  itemsOfTheDay(date) {
    return this.data.items.filter(x => {
      return (
        moment(date).format("YYYYMMDD") ==
        moment(x[this.uiElement.startDateField]).format("YYYYMMDD")
      );
    });
  }
}
