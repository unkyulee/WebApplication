import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from 'moment';

// user imports
import { EventService } from "../../services/event.service";
import { UserService } from "../../services/user.service";
import { RestService } from "../../services/rest.service";
import { UIService } from "../../services/ui.service";
import { ConfigService } from "../../services/config.service";
import { NavService } from "src/app/services/nav.service";

@Component({
    selector: 'simple-table'
    , templateUrl: './simple-table.component.html',
    styleUrls: ['./simple-table.component.scss']
})
export class SimpleTableComponent {
    constructor(
        private rest: RestService
        , public ui: UIService
        , public route: ActivatedRoute
        , private router: Router
        , public event: EventService
        , public user: UserService
        , public config: ConfigService
        , public nav: NavService
    ) {
    }

    @Input() uiElement: any

    //
    isReady = true

    // get data
    _data: any
    @Input() get data() {
        return this._data
    }
    set data(v) {
        this._data = v

        // download when data is set
        if (v) {
            if (!this.uiElement.key) {
                this.isReady = false
                this.requestDownload()
            }
        }
    }

    _tempData: any
    get value() {
        if (this.data && this.uiElement.key) {
            // return value
            return this.data[this.uiElement.key]
        }

        return this._tempData
    }

    set value(v: any) {
        if (this.data.transform) {
            try { v = eval(this.data.transform) }
            catch (e) { console.error(e) }
        }
        if (this.data && this.uiElement.key) {
            this.data[this.uiElement.key] = v
        }
        else {
            this._tempData = v
        }
    }

    // config
    columns: any[]
    rowHeaderDef: any[]

    //
    isSearch: boolean
    _search: string = ""
    _searchTimeout: any = null


    get search() { return this._search }
    set search(v) {
        this._search = v

        // cancel previous search
        clearTimeout(this._searchTimeout)

        // make interval of key input
        this._searchTimeout = setTimeout(() => {
            this._searchTimeout = null
            this.requestDownload()
        }, 1000)

    }

    // loading
    loadingIndicator: boolean = false

    async ngOnInit() {

        // set default script
        if (this.uiElement.default) {
            try { eval(this.uiElement.default) }
            catch (e) { console.error(e) }
        }

        // search
        this.isSearch = this.ui.find(["isSearch"], this.uiElement)

        // save columns setup
        this.columns = this.ui.find(["columns"], this.uiElement)

        //
        if (this.columns) this.rowHeaderDef = this.columns.map(item => item.key)


    }

    ngOnDestroy() {
    }


    requestDownload() {

        // download data through rest web services
        let src = this.ui.find(["src"], this.uiElement)
        try { src = eval(src) } catch (e) { }

        let method = this.ui.find(["method"], this.uiElement)
        let data = this.ui.find(["data"], this.uiElement, {})
        try { data = eval(data) } catch (e) { }

        //
        this.loadingIndicator = true
        this.rest.request(src, data, method)
            .subscribe(data => this.responseDownload(data))
    }

    responseDownload(response) {
        this.isReady = true

        //
        this.loadingIndicator = false

        // map data from response
        let transform = this.ui.find(["transform"], this.uiElement, "response")
        this.value = eval(transform)

    }

    // when item in the cell is clicked
    clickLink(link: string, row: any) {

        // compile with values if necessary
        try { link = eval(link) } catch (e) { }

        //
        if (link) {
            // compile link
            let routerLink: string

            if (link.startsWith("/")) routerLink = `${link}`
            else routerLink = `${this.nav.currNav.url}/${link}`

            // navigate to the link
            this.router.navigateByUrl(routerLink)
        }

    }

    format(column, value) {
        if (column.type == "date") {
            value = moment(value).locale(column.lang).format(column.format)
        }

        // if there is no value to put anchor on then place ...... as a placeholder
        if (column.link && !column.icon && !value) {
            value = '......'
        }

        return value
    }

    checked(event, column, row) {
        if (column.change) {
            try { eval(column.change) } catch (e) { console.error(e) }
        }
    }

}
