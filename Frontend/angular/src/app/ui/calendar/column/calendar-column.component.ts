import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';

// user imports
import { UIService } from '../../../services/ui.service';
import { EventService } from '../../../services/event.service';
import { RestService } from '../../../services/rest.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
    selector: 'calendar-column',
    templateUrl: './calendar-column.component.html',
    styleUrls: ['./calendar-column.component.scss']
})
export class CalendarColumnComponent {
    constructor(
        private ui: UIService
        , public event: EventService
        , public rest: RestService
        , public user: UserService // these are used by the user code
        , public snackBar: MatSnackBar // userd in user code
        , public router: Router
    ) {
    }

    // configuration of the ui element
    @Input() uiElement: any;
    @Input() day: Date;

    contents: any[]

    _data: any[]
    @Input() get data() {
        return this._data
    }

    set data(v) {
        this._data = v
        if (this._data) {
            // filter data matches this.day
            this.items = this._data.filter(item => {
                let start = new Date(item[this.uiElement.startDateField])
                let end = new Date(item[this.uiElement.endDateField])
                let day_end = moment(this.day).endOf('day').toDate()

                if (day_end >= start && this.day <= end)
                    return true

                return false
            })
        }
    }

    // date format
    today: Date
    lang: string
    items: any[] = []

    ngOnInit() {

        //
        this.today = new Date()

        // load locale for date format
        this.lang = this.ui.find(["lang"], this.uiElement)

        // contents
        this.contents = this.ui.find(["event", "contents"], this.uiElement)

    }


    click(item) {
        let clickHandler = this.ui.find(["event", "click"], this.uiElement)
        if (clickHandler) {
            try { eval(clickHandler) } catch (e) { }
        }
    }


    getShortDate(value) {
        return moment(value).locale(this.lang).format("L")
    }

    getWeekday(value) {
        return moment(value).locale(this.lang).format("ddd")
    }

    getWeekNum(value) {
        return moment(value).isoWeekday()
    }

    format(value, data) {
        try { value = eval(value) }
        catch(e) { console.error(e) }
        return value
    }

}
