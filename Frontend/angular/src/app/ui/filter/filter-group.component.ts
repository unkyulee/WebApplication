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
}
