import { Component } from "@angular/core";
import * as moment from "moment";

// user imports
import { BaseComponent } from '../../base.component';


@Component({
  selector: "calendar-monthly",
  templateUrl: "./calendar-monthly.component.html"
})
export class CalendarMonthlyComponent extends BaseComponent {  

  // event subscription
  weekDays = []; // mon, tue, ... , sun
  days = []; // first monday till last friday
  
  ngOnInit() {
    // setup weekDays
    for (let i of [1, 2, 3, 4, 5, 6, 0]) {
      this.weekDays.push(moment.weekdays(i).substring(0, 3));
    }

    // setup start - end days in calendar
    let startOfCalendar = moment().add(
      1 -
        moment()
          .startOf("month")
          .isoWeekday(),
      "days"
    );
    let endOfCalendar = moment()
      .endOf("month")
      .add(
        7 -
          moment()
            .endOf("month")
            .isoWeekday(),
        "days"
      );

    while(true) {
      this.days.push(startOfCalendar.toObject());
      startOfCalendar = startOfCalendar.add(1, "days")
      if(startOfCalendar > endOfCalendar) break;
    }

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
}
