import { Component, Input } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

// user imports
import { NavService } from '../../services/nav.service';
import { UIService } from '../../services/ui.service';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user/user.service';

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
    constructor(
        private nav: NavService
        , private ui: UIService
        , private rest: RestService
        , private route: ActivatedRoute // used by user scripts
        , private event: EventService
        , private user: UserService
    ) { }

    // configuration of the ui element
    @Input() uiElement: any;

    // date
    lang: any
    format: any
    filterStartDate: any // 1 day before than the start date for filter
    startDate: any
    endDate: any
    dateRange: any[] = []

    // download data
    data: any
    length: any

    // event subscription
    onEvent: Subscription

    ngOnInit() {

        // date format
        this.lang = this.ui.find(["lang"], this.uiElement, "en-GB")
        this.format = this.ui.find(["format"], this.uiElement, "L")
        this.length = this.ui.find(["length"], this.uiElement, 7)

        // download
        this.requestDownload()

        // subscript to event
        this.onEvent = this.event.onEvent.subscribe(
            event => {
                if (event && event.name == "refresh") {
                    setTimeout(() => this.requestDownload(), 0);
                }
                else if (event && event.name == 'search') {
                    setTimeout(() => {
                        this.nav.setParam("_search", event.data)
                        this.requestDownload()
                    }, 100);
                }
            }
        )

    }

    ngOnDestroy() {
        this.onEvent.unsubscribe()
    }

    requestDownload() {

        // see if start date is set
        let params = this.nav.getParams()
        if (params["startDate"]) this.startDate = moment(params["startDate"]).startOf('week').toISOString()
        else this.startDate = moment().startOf('week').toISOString()

        // set EndDate
        this.endDate = moment(this.startDate).add(this.length, 'days').endOf('day').toISOString()

        // init date range
        this.dateRange = []
        for (let i = 0; i < this.length; i++) this.dateRange.push(moment(this.startDate).add(i, 'days').toDate())

        //
        let src = this.ui.find(["src"], this.uiElement)
        try { src = eval(src) } catch (e) { }

        let method = this.ui.find(["method"], this.uiElement)
        let data = this.ui.find(["data"], this.uiElement, {})

        // ignore startDate
        delete params['startDate']
        data = Object.assign(data, params)

        // show splash
        this.event.send("splash-show")

        this.rest.request(src, data, method).subscribe(
            response => this.responseDownload(response)
        )
    }

    responseDownload(response) {
        // stop the loading indicator
        this.event.send("splash-hide")

        // map data from response
        if (this.uiElement.transform) try { this.data = eval(this.uiElement.transform) } catch (e) { }
        if (!this.data) this.data = []
    }

}
