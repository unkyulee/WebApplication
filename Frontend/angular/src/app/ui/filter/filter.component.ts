import { Component, Input } from "@angular/core";
import * as moment from "moment";

// user imports
import { UIService } from "../../services/ui.service";
import { NavService } from "../../services/nav.service";
import { RestService } from "../../services/rest.service";
import { EventService } from "../../services/event.service";
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: "filter",
  templateUrl: "./filter.component.html"
})
export class FilterComponent {
  // Init
  constructor(
    public rest: RestService,
    public ui: UIService,
    private nav: NavService,
    private event: EventService,
    public user: UserService
  ) {}

  @Input() uiElement: any;
  @Input() data: any;

  ngOnInit() {
    // read url and fetch the parameter
    let params = this.nav.getParams();
    if (
      this.uiElement.inputType == "date" &&
      this.uiElement.selectMode == "range"
    ) {
      // if the date range params exists then set
      let lt = params[`${this.uiElement.key}_lte`];
      let gte = params[`${this.uiElement.key}_gte`];
      if (gte && lt) {
        this.data[this.uiElement.key] = [
          moment.utc(gte).toDate(),
          moment.utc(lt).toDate()
        ];
        // display filter
        this.event.send({ name: "show-filter" });
      }
    } else {
      if (
        params[this.uiElement.key] != null &&
        typeof params[this.uiElement.key] != "undefined"
      ) {
        // display filter
        this.event.send({ name: "show-filter" });
        this.data[this.uiElement.key] = params[this.uiElement.key];
      }
    }

    // check if there is default value
    if (this.uiElement.default) {
      for (var key of Object.keys(this.uiElement.default)) {
        if (!params[this.uiElement.key]) {
          let value = this.uiElement.default[key];
          try {
            value = eval(this.uiElement.default[key]);
          } catch(e) { console.error(e) }
          this.nav.setParam(key, value);
        }
      }
    }
  }

  // when value is changed
  change(v) {
    if (v && v.type) return; // autocomplete emits when empty

    //
    if (
      this.uiElement.inputType == "date" &&
      this.uiElement.selectMode == "range"
    ) {
      this.nav.setParam(
        `${this.uiElement.key}_gte`,
        moment(v[0]).format("YYYY-MM-DDTHH:mm:ss")
      );
      this.nav.setParam(
        `${this.uiElement.key}_lte`,
        moment(v[1]).endOf('day').format("YYYY-MM-DDTHH:mm:ss")
      );
    }

    // apply to nav param
    else if (this.uiElement.key) {
      // save the filter value to local storage
      localStorage.setItem(this.uiElement.key, JSON.stringify(v));
      this.nav.setParam(this.uiElement.key, v);
    }

    this.event.send({ name: "refresh" });
  }
}
