import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

// user imports
import { EventService } from '../../services/event.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'ui-composer-overlay',
    templateUrl: './ui-composer-overlay.component.html',
    styleUrls: ['./ui-composer-overlay.component.scss']
})
export class UIComposerOverlayComponent {
    constructor(
        public dialogRef: MatDialogRef<UIComposerOverlayComponent>
        , private event: EventService
        , public user: UserService
    ) { }

    @Input() uiElement: any;
    @Input() data: any = {}

    // event subscription
    onEvent: Subscription

    ngOnInit() {

        // subscript to event
        this.onEvent = this.event.onEvent.subscribe(
            event => {
                if (event && event.name == "close-dialog") {
                    setTimeout(() => this.dialogRef.close(true), 100);
                }
            }
        )

    }

    ngOnDestroy() {
        this.onEvent.unsubscribe()
    }

}
