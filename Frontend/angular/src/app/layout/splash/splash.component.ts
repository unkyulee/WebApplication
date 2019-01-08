import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { EventService } from '../../services/event.service';

@Component({
    selector: 'splash',
    templateUrl: './splash.component.html',
    styleUrls: ['./splash.component.scss']
})
export class SplashComponent {
    constructor(
        private event: EventService
    ) { }

    // show splash
    show: boolean = false

    // event subscription
    onEvent: Subscription

    ngOnInit() {
        // subscript to event
        this.onEvent = this.event.onEvent.subscribe(
            event => {
                if (event == "splash-show") {
                    setTimeout(() => { this.show = true }, 0);
                }
                else if (event == "splash-hide") {
                    setTimeout(() => { this.show = false }, 0);
                }
            }
        )
    }

    ngOnDestroy() {
        this.onEvent.unsubscribe()
    }

}
