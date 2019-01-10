import { Component, Input } from '@angular/core'
import { NavService } from '../../services/nav.service';

@Component({
    selector: 'filter-group',
    templateUrl: './filter-group.component.html',
    styleUrls: ['./filter-group.component.scss']
})
export class FilterGroupComponent {
    constructor(
        private nav: NavService
    ) { }

    @Input() uiElement: any;

    filterOpen: boolean = true
    ngOnInit() {
        let params = this.nav.getParams()
        for (let filter of this.uiElement.filters) {
            if (params[filter.key] != null) {
                this.filterOpen = true
                break
            }
            //
            if (Object.keys(params).find(x => x.startsWith(filter.key))) {
                this.filterOpen = true
            }
        }
    }
}
