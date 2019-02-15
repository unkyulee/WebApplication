import { Component, Input } from '@angular/core'
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';

// user imports
import { UIService } from '../../services/ui.service';
import { NavService } from '../../services/nav.service';
import { RestService } from '../../services/rest.service';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html'
})
export class FilterComponent {
  // Init
  constructor(
    private rest: RestService
    , private ui: UIService
    , private nav: NavService
    , private event: EventService
  ) { }

  @Input() uiElement: any
  @Input() data: any

  ngOnInit() {

    // read url and fetch the parameter
    let params = this.nav.getParams()
    this.data[this.uiElement.key] = params[this.uiElement.key]

    if (!this.data[this.uiElement.key]) {
      // if there is no url value then load from the local storage
      let cache = localStorage.getItem(this.uiElement.key)
      if (cache)
        this.data[this.uiElement.key] = JSON.parse(cache)
    }

    // check if there is default value
    if (this.uiElement.default) {
      for (var key of Object.keys(this.uiElement.default)) {
        if (!params[this.uiElement.key]) {
          let value = this.uiElement.default[key];
          try { value = eval(this.uiElement.default[key]) } catch { }
          this.nav.setParam(key, value)
        }
      }
    }

  }

  // when value is changed
  keywordChanged: Subject<string>
  change(v) {
    if (v && v.type) return; // autocomplete emits when empty

    //
    if (this.uiElement.type == "date" && this.uiElement.selectMode == "range") {
      this.nav.setParam(`${this.uiElement.key}_gte`, v[0])
      this.nav.setParam(`${this.uiElement.key}_lte`, v[1])
    }

    // apply to nav param
    else if (this.uiElement.key) {
      // save the filter value to local storage
      localStorage.setItem(this.uiElement.key, JSON.stringify(v))
      this.nav.setParam(this.uiElement.key, v)
    }

    // initialize keyword change handler
    if (this.keywordChanged == null) {
      this.keywordChanged = new Subject<string>()
      this.keywordChanged
        .pipe(
          debounceTime(300)
          , distinctUntilChanged()
        )
        .subscribe(v => {
          // when filter is set change page to 1
          let params = this.nav.getParams()
          if (params['page']) this.nav.setParam("page", '1')
          this.event.send({ 'name': 'refresh' })
        })
    }

    // push keyword change
    this.keywordChanged.next(v)
  }


}
