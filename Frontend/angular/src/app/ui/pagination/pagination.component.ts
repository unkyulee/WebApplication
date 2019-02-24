import { Component, Input } from '@angular/core'

// user imports
import { NavService } from '../../services/nav.service';
import { EventService } from 'src/app/services/event.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
    selector: 'pagination',
    templateUrl: './pagination.component.html'
})
export class PaginationComponent {
    // Init
    constructor(
        private nav: NavService
        , private event: EventService
        , public config: ConfigService
    ) { }

    // pagination
    @Input() total: any
    @Input() size: any
    @Input() page: any

    ngOnInit() {
        // if pagination information is given from the URL then take it
        let param = this.nav.getParams()

        // default page is 1
        this.page = parseInt(param['page']) || 1

        // if the page size is determined in the url then use that otherwise use the one from the uiElement
        this.size = parseInt(param['size']) || 10
    }

    changePage(event) {
        // set pagination information on url
        this.nav.setParam("page", event.pageIndex+1)
        this.nav.setParam("size", event.pageSize)

        this.event.send({name: 'refresh'})
    }

}
