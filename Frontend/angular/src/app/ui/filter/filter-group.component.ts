import { Component, Input } from '@angular/core'
import { ConfigService } from 'src/app/services/config.service';

@Component({
    selector: 'filter-group',
    templateUrl: './filter-group.component.html'
})
export class FilterGroupComponent {
    constructor(
        public config: ConfigService
    ) { }

    @Input() uiElement: any;
    @Input() data: any;
}
