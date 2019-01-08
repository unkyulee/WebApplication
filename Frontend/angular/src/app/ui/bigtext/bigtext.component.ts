import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import * as obj from 'object-path'

// user imports
import { UIService } from '../../services/ui.service';
import { EventService } from '../../services/event.service';
import { ConfigService } from '../../services/config.service';
import { RestService } from '../../services/rest.service';
import { NavService } from '../../services/nav.service';

@Component({
    selector: 'bigtext',
    templateUrl: './bigtext.component.html',
    styleUrls: ['./bigtext.component.scss']
})
export class BigTextComponent {
    constructor(
        private ui: UIService
        , private event: EventService
        , private config: ConfigService
        , private nav: NavService
        , private rest: RestService
    ) { }

    @Input() uiElement: any;

    //
    headerColor: string

    //
    onEvent: Subscription

    ngOnInit() {
        // load default header color
        this.headerColor = obj.get(this.config.configuration, 'colors.secondary')

        // set title and description
        this.title = this.ui.find(["title"], this.uiElement)
        this.description = this.ui.find(["description"], this.uiElement)

        // listen to date loaded event
        let listenDataLoad = this.ui.find(["listenDataLoad"], this.uiElement, false)
        this.onEvent = this.event.onEvent.subscribe(
            (event) => {
                if(event && event.name == 'data-loaded' && listenDataLoad) {
                    this.data = event.data
                }

                else if (event && event.name == 'refresh') {
                    setTimeout(() => this.requestDownload(), 100);
                }
            }
        )
    }

    ngAfterViewInit() {

        // request download
        this.requestDownload();

    }

    ngOnDestroy() {
        if(this.onEvent) this.onEvent.unsubscribe()
    }

    // data storage
    data: any

    // display content
    title: string
    description: string
    get content() {
        let value = this.data
        if( this.uiElement.content ) {
            try { value = eval(this.uiElement.content) }
            catch(e) {console.error(e)}
        }
        return value
    }

    requestDownload() {
        let src = this.ui.find(["src"], this.uiElement)
        if (src) {
            let method = this.ui.find(["method"], this.uiElement)
            let data = this.ui.find(["data"], this.uiElement, {})
            // combine query param to data
            data = Object.assign({}, data, this.nav.getParams())

            this.rest.request(src, data, method).subscribe(
                response => this.responseDownload(response)
            )
        }
    }

    responseDownload(response) {
        // map data from response
        let transform = this.ui.find(["transform"], this.uiElement, "response")
        try { this.data = eval(transform) } catch (e) { }
    }

}
