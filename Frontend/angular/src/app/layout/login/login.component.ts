import { Component, OnInit, OnDestroy } from '@angular/core';
import * as obj from 'object-path'

// user imports
import { ConfigService } from '../../services/config.service';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { NavService } from 'src/app/services/nav.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    constructor(
        public config: ConfigService
        , private auth: AuthService
        , private event: EventService
        , private nav: NavService
    ) {
    }

    // title
    title: string

    ngOnInit() {
        // load title
        this.title = obj.get(this.config.configuration, 'name')

        // check auto login
        let params = this.nav.getParams()
        if(params['autologin']) {
            this.nav.setParam('autologin', null, false)

            this.id = params['id']
            this.nav.setParam('id', null, false)

            this.password = params['password']
            this.nav.setParam('password', null, false)

            this.login()
        }

    }

    ngOnDestroy() {
    }

    // login
    id: string
    password: string
    error: string
    login() {
        // reset error message
        this.error = null;

        //
        if(!this.id) {
            this.error = 'please, enter your id'
            return
        }

        // try login
        this.event.send("splash-show") // show splash
        this.auth.authenticate(this.id, this.password).subscribe(
            result => {
                this.event.send("splash-hide") // hide splash

                // evaluate the result
                if( result != true ) {
                    // login error
                    this.error = result
                }

                else {
                    // login success
                    this.event.send('authenticated')
                }
            }
        )

    }
}
