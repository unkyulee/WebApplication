import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets'
import * as obj from 'object-path'

// user imports
import { UIService } from '../../services/ui.service';
import { EventService } from '../../services/event.service';
import { NavService } from '../../services/nav.service';
import { RestService } from '../../services/rest.service';
import { ConfigService } from '../../services/config.service';

@Component({
    selector: 'chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {
    constructor(
        private ui: UIService
        , private event: EventService
        , private nav: NavService
        , private rest: RestService
        , private config: ConfigService
    ) {
        Object.assign(this, { colorSets });
    }

    // configuration of the ui element
    @Input() uiElement: any;
    @Input() data: any;

    // header color
    headerColor: string

    ngOnInit() {
        // load default header color
        this.headerColor = obj.get(this.config.configuration, 'colors.secondary')

        // option
        this.showXAxis = this.ui.find(["showXAxis"], this.uiElement, false)
        this.showLabels = this.ui.find(["showLabels"], this.uiElement, true)
        this.colorSchemeName = this.ui.find(["colorSchemeName"], this.uiElement, 'natural')
        this.colorScheme = this.colorSets.find(s => s.name === this.colorSchemeName);

        // listen to date loaded event
        let listenDataLoad = this.ui.find(["listenDataLoad"], this.uiElement, false)
        this.onEvent = this.event.onEvent.subscribe(
            (event) => {
                if (listenDataLoad == true && event && event.name == 'data-loaded') {
                    let response = event.data
                    if (this.uiElement.trasform) {
                        try { this.data = eval(this.uiElement.trasform) }
                        catch (e) { console.error(e) }
                    }
                }

                else if (event && event.name == 'refresh') {
                    this.requestDownload()
                }
            }
        )
    }

    ngAfterViewInit() {

        // request download
        this.requestDownload();

    }

    ngOnDestroy() {
        if (this.onEvent) this.onEvent.unsubscribe()
    }

    //
    colorSets: any
    colorScheme: any
    colorSchemeName = 'natural'

    // options
    gradient = false;
    showLegend = false;

    // pie-chart
    showLabels = true;
    explodeSlices = false;
    doughnut = false;

    // bar-chart
    showXAxis = false;
    showXAxisLabel = false;
    xAxisLabel = 'X';

    showYAxis = false;
    showYAxisLabel = false;
    yAxisLabel = 'Y';

    // event subscription
    onEvent: Subscription

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
        if (!this.data) this.data = []
    }

    onSelect(value) {
        if (this.uiElement.onSelect) {
            try { eval(this.uiElement.onSelect) }
            catch (e) { console.error(e) }
        }
    }

}
