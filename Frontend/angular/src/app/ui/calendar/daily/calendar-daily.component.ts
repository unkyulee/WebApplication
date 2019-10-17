import { Component } from "@angular/core";
import * as moment from "moment";

// user imports
import { BaseComponent } from '../../base.component';

@Component({
  selector: "calendar-daily",
  templateUrl: "./calendar-daily.component.html"
})
export class CalendarDailyComponent extends BaseComponent {  
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
    this.data.startDate = moment(this.data.startDate ? this.data.startDate : this.data._params_.startDate)
      .startOf("day") // starts from monday
      .toISOString();

    this.data.endDate = moment(this.data.startDate ? this.data.startDate : this.data._params_.startDate)
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
