import { Component, Input } from "@angular/core";
import { Subscription } from "rxjs";
import * as moment from 'moment';

// user imports
import { EventService } from "../../services/event.service";
import { UserService } from "../../services/user.service";

@Component({
    selector: 'card-list'
    , templateUrl: './card-list.component.html',
    styleUrls: ['./card-list.component.scss']
})
export class CardListComponent {

    constructor(
        private event: EventService
        , private user: UserService
    ) { }

    @Input() uiElement: any

    // get data
    _data: any
    @Input() get data() {
        return this._data
    }
    set data(v) {
        this._data = v
    }

    _tempData: any
    get value() {
        let data = this.data

        // If the card should display one by one like PowerPoint
        if (this.uiElement.cardType == 'slide') {
            // find the current slide
            if (data && this.uiElement.key && this.uiElement.indexFrom) {
                let d = data[this.uiElement.key]
                if (d) {
                    // get saved indexValue
                    if (!data[this.uiElement.indexFrom]) data[this.uiElement.indexFrom] = this.uiElement.indexDefault
                    let index = data[this.uiElement.indexFrom]

                    // get the slide matches the indexValue
                    let slide = d.find(item => item[this.uiElement.indexKey] == index)
                    if (slide)
                        return [slide]

                    // if everything fails then try to return the first slide
                    return [d[0]]
                }
            }
        }

        else if (data && this.uiElement.key) {
            return data[this.uiElement.key]
        }

        // if there is no key specified then just return tmpData
        return this._tempData
    }

    set value(v: any) {
        if (this.data && this.uiElement.key) {
            this.data[this.uiElement.key] = v
        }
        else {
            this._tempData = v
        }

    }

    // event subscription
    eventSubscription: Subscription

    //
    ngOnInit() {
        // subscript to event
        this.eventSubscription = this.event.onEvent.subscribe(
            event => {
                if (event && event.key == this.uiElement.key) {
                    if (event.name == 'update-index') {
                        this.data[this.uiElement.indexFrom] = event.index
                    }
                }
            }

        )
    }

    ngOnDestroy() {
        this.eventSubscription.unsubscribe()
    }

    run(script, item) {
        try { eval(script) } catch (e) { console.error(e) }
    }

    format(value, transform) {
        if(transform) try { eval(transform) } catch {}
        return value
    }
}
