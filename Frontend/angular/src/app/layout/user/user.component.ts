import { Component } from '@angular/core';

// user imports
import { UserService } from '../../services/user/user.service';
import { EventService } from '../../services/event.service';
import { ConfigService } from 'src/app/services/config.service';

// cordova
declare var navigator: any

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent {
    constructor(
        public user: UserService
        , private event: EventService
        , public config: ConfigService
    ) {}

    isCordova: any = navigator.app

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    logout() {
        this.event.send('logout')
    }

    open(url, target = null) {
        window.open(url, target);
    }

    exit() {
        navigator.app.exitApp()
    }
}
