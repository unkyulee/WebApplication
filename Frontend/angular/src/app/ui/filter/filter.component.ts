import { Component, Input } from "@angular/core";

// user imports
import { UIService } from "../../services/ui.service";
import { NavService } from "../../services/nav.service";
import { RestService } from "../../services/rest.service";
import { EventService } from "../../services/event.service";

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
    private event: EventService
  ) {}

  @Input() uiElement: any;
  @Input() data: any;

  ngOnInit() {
    // read url and fetch the parameter
    let params = this.nav.getParams();
    this.data[this.uiElement.key] = params[this.uiElement.key];

    // check if there is default value
    if (this.uiElement.default) {
      for (var key of Object.keys(this.uiElement.default)) {
        if (!params[this.uiElement.key]) {
          let value = this.uiElement.default[key];
          try {
            value = eval(this.uiElement.default[key]);
          } catch {}
          this.nav.setParam(key, value);
        }
      }
    }
  }

  // when value is changed
  change(v) {
    if (v && v.type) return; // autocomplete emits when empty

    //
    if (this.uiElement.type == "date" && this.uiElement.selectMode == "range") {
      this.nav.setParam(`${this.uiElement.key}_gte`, v[0]);
      this.nav.setParam(`${this.uiElement.key}_lte`, v[1]);
    }

    // apply to nav param
    else if (this.uiElement.key) {
      // save the filter value to local storage
      localStorage.setItem(this.uiElement.key, JSON.stringify(v));
      this.nav.setParam(this.uiElement.key, v);
    }

    // when filter is set change page to 1
    let params = this.nav.getParams();
    this.event.send({ name: "refresh" });
  }
}
