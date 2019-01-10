import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { Subscription, Observable } from 'rxjs'
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ExportToCsv } from 'export-to-csv';

// user imports
import { UIService } from '../../../services/ui.service';
import { NavService } from '../../../services/nav.service';
import { RestService } from '../../../services/rest.service';
import { EventService } from '../../../services/event.service';
import { UserService } from '../../../services/user.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
    selector: 'data-table-list',
    templateUrl: './data-table-list.component.html',
    styleUrls: ['./data-table-list.component.scss']
})
export class DataTableListComponent implements OnInit, OnDestroy {
    constructor(
        private rest: RestService
        , public ui: UIService
        , private router: Router
        , private nav: NavService
        , private event: EventService
        , public user: UserService // used by user script
        , private breakpointObserver: BreakpointObserver
    ) { }

    // detect window size changes
    isHandset: boolean
    isHandset$: Observable<boolean> = this.breakpointObserver
        .observe([Breakpoints.Handset])
        .pipe(
            map(result => {
                console.log(result.matches)
                this.isHandset = result.matches
                return result.matches
            })
        );

    // configuration of the ui element
    @Input() uiElement: any;

    // initial loading
    isReady = false // is ready when first download is completed

    // configuration values
    data: any
    columns: any[]
    total: number = 0
    sort: any
    groupBy: string

    // event subscription
    eventSubscription: Subscription

    ngOnInit() {

        // check if there is any page configuration available
        this.getPage()

        // group by
        this.groupBy = this.ui.find(["list", "table", "groupBy"], this.uiElement)

        // save columns setup
        this.columns = this.ui.find(["list", "table", "columns"], this.uiElement)

        // setup workflow
        this.loadWorkflow()

        // download data through rest web services
        this.requestDownload()

        // event handler
        this.eventSubscription = this.event.onEvent.subscribe(
            event => {
                if (event && event.name == "refresh") {
                    setTimeout(() => this.requestDownload(), 0);
                }
                else if (event && event.name == 'search') {
                    setTimeout(() => {
                        // set page to 1
                        this.page = 1
                        this.nav.setParam("page", this.page)

                        // reload the page
                        this.nav.setParam("_search", event.data)
                        this.requestDownload()
                    }, 0);
                }
            }
        )

    }

    ngOnDestroy() {
        this.eventSubscription.unsubscribe()
    }

    // pagination information
    page: number = 0
    size: number = 0

    // Get Pagination information
    getPage() {

        // if pagination information is given from the URL then take it
        let param = this.nav.getParams()

        // default page is 1
        this.page = parseInt(param['page']) || 1

        // if the page size is determined in the url then use that otherwise use the one from the uiElement
        this.size = parseInt(param['size']) || this.ui.find(["list", "size"], this.uiElement, 10)

    }

    // setting page will set the values to the URL
    setPage(page, size) {

        // save pagination
        this.page = page
        this.size = size

        // set pagination information on url
        this.nav.setParam("page", this.page)
        this.nav.setParam("size", this.size)

    }

    loadWorkflow() {

        // setup workflow
        let workflow = this.ui.find(["list", "workflow"], this.uiElement, null)

        // load default workflow
        if (workflow == null) {
            workflow = []

            // add workflow
            workflow.push({
                name: "Add",
                icon: "edit",
                action: () => { this.add() }
            })

            // export to csv
            workflow.push({
                name: "Export",
                icon: "file_download",
                action: () => { this.export() }
            })
        }
        else {
            for (let item of workflow) {
                item.action = eval(item.action)
            }
        }

        // send event to the workflow layout
        this.event.send({ name: 'workflow', data: workflow })

    }

    requestDownload(pageInfo?, ) {
        // show splash
        this.event.send("splash-show")

        // get page
        this.getPage()

        // set pagination
        if (!pageInfo) pageInfo = { offset: this.page - 1 }

        // save the pagination passed by data-table
        this.setPage(pageInfo.offset + 1, this.size)

        // download data through rest web services
        let src = this.ui.find(["list", "src"], this.uiElement)
        try { src = eval(src) } catch (e) { }
        let method = this.ui.find(["list", "method"], this.uiElement)

        // look at query params and pass it on to the request
        let data = this.ui.find(["list", "data"], this.uiElement, {})
        data = Object.assign({}, data, this.nav.getParams())

        // sorting options
        if (this.sort) {
            if (this.sort.dir == "asc") data['_sort'] = this.sort.prop
            else if (this.sort.dir == "desc") data['_sort_desc'] = this.sort.prop
        }

        // send REST request
        this.rest.request(src, data, method).subscribe(response => this.responseDownload(response))

    }

    responseDownload(response) {
        this.isReady = true;

        // hide splash
        this.event.send("splash-hide")

        // send event that data is downloaded
        this.event.send({ name: 'data-loaded', _id: this.uiElement._id,data: response })

        // map data from response
        let transform = this.ui.find(["list", "transform"], this.uiElement, "response")
        try { this.data = eval(transform) } catch (e) { }
        if (!this.data) this.data = []

        // get total records
        let transformTotal = this.ui.find(["list", "total"], this.uiElement, "response.total")
        try { this.total = parseInt(eval(transformTotal)) } catch (e) { }
        if (!this.total) this.total = this.data.length
    }

    // -------------------------------------------------------

    // format to date on the column
    format(column, value) {
        // transform
        if (column.transform) {
            try { value = eval(column.transform) } catch (e) { }
        }

        if (column.type == "date") {
            value = moment(value).locale(column.lang).format(column.format)
        }
        return value
    }

    // when item in the cell is clicked
    clickLink(link: string, row: any) {

        // compile link
        let routerLink: string

        // compile with values if necessary
        try { link = eval(link) } catch (e) { }

        //
        if (link.startsWith("/")) routerLink = `${link}`
        else routerLink = `${this.nav.currNav.url}/${link}`

        // navigate to the link
        this.router.navigateByUrl(routerLink)
    }

    onSort(event: any) {

        // event.sorts.dir / prop
        this.sort = event.sorts[0]
        if (this.sort) this.requestDownload()

    }

    //
    add() {
        // navigate to add page
        this.router.navigateByUrl(`${this.nav.currNav.url}/add`);
    }

    // export to excel
    export() {
        this.event.send("splash-show") // show splash

        // download data through rest web services
        let src = this.ui.find(["list", "src"], this.uiElement)
        try { src = eval(src) } catch (e) { }
        let method = this.ui.find(["list", "method"], this.uiElement)

        // look at query params and pass it on to the request
        let data = Object.assign(this.nav.getParams(), { page: '1', size: '10000' })

        // sorting options
        if (this.sort) {
            if (this.sort.dir == "asc") data['_sort'] = this.sort.prop
            else if (this.sort.dir == "desc") data['_sort_desc'] = this.sort.prop
        }

        // csv file name
        let title = this.ui.find(["list", "name"], this.uiElement, document.title)

        // send REST request
        this.rest.request(src, data, method, {}, false).subscribe(response => {
            this.event.send("splash-hide") // show splash

            let transform = this.ui.find(["list", "transform"], this.uiElement, "response")
            try { this.data = eval(transform) } catch (e) { }
            if (!this.data) this.data = []

            // remove array objects
            let columns = {}
            for (let row of this.data)
                for (let col of Object.keys(row)) {
                    if (Array.isArray(row[col])) continue
                    else if (col.endsWith('_id')) continue
                    else columns[col] = 1

                }

            let newData = []
            for (let row of this.data) {
                let newRow = {}
                for (let col of Object.keys(columns)) {
                    if (Array.isArray(row[col])) continue
                    else if (!row[col]) newRow[col] = ''
                    else newRow[col] = `${row[col]}`.replace(/\n/g, " ")
                }
                newData.push(newRow)
            }

            const csvExporter = new ExportToCsv({
                decimalseparator: 'locale',
                title: title,
                filename: title,
                useBom: true,
                showLabels: true,
                useKeysAsHeaders: true
            })

            csvExporter.generateCsv(newData)
        })

    }

}
