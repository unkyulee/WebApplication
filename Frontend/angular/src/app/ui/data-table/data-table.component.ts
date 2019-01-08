import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { NavService } from '../../services/nav.service';
import { EventService } from '../../services/event.service';

@Component({
    selector: 'data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss']
})

export class DataTableComponent implements OnInit, OnDestroy {
    constructor(
        private nav: NavService
        , private event: EventService
    ) { }

    // configuration of the ui element
    @Input() uiElement: any;

    // find which module to load
    isSubNavigation = false;
    action: string;
    ngOnInit() {
        this.isSubNavigation = false;

        // depending on the path what is displayed will be decided
        let url = this.nav.currUrl.replace(this.nav.currNav.url, '')
        let paths = url.split("?")[0].split("/")

        if (url.split("?")[0] == '') // default action
        {
            if (this.uiElement.list) this.action = "list"
            else this.action = "detail"
        }

        else if (paths.length > 1) {
            this.action = paths[1]
            this.isSubNavigation = true
        }
    }

    ngAfterViewInit() {
        if(this.isSubNavigation)
            // set as sub-navigation
            this.event.send('sub-navigation')
    }

    ngOnDestroy() {
    }

}
