import { Component } from '@angular/core';

// user imports
import { UserService } from '../../services/user/user.service';
import { EventService } from '../../services/event.service';
import { ConfigService } from 'src/app/services/config.service';
import { CordovaService } from 'src/app/services/cordova.service';

@Component({
    selector: 'user',
    templateUrl: './user.component.html'
})
export class UserComponent {
    constructor(
        public user: UserService
        , public event: EventService
        , public config: ConfigService
        , public cordova: CordovaService
    ) {}

    data: any

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}