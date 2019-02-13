import { Component, OnInit, OnDestroy } from '@angular/core';
import * as obj from 'object-path'

// user imports
import { ConfigService } from '../../services/config.service';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';

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
  ) {
  }

  // login screen
  screen: any

  // data
  data: any = {}

  onEvent: Subscription
  ngOnInit() {
    // load default login screen
    this.screen = this.config.configuration.login.screen

    // handle events
    this.onEvent = this.event.onEvent.subscribe(
      event => {
        if (event.name == 'login') {
          this.login()
        }
      }
    )
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe()
  }

  // login
  login() {
    // validate input
    this.data.error = '';
    for (let ui of this.screen) {
      let value = this.data[ui.key] // used by the evaluation script
      let error = eval(ui.errorCondition)
      if (error) {
        this.data.error += `${ui.errorMessage}\n`
      }
    }

    // if there are error don't continue
    if (this.data.error) return

    // try login
    this.event.send("splash-show") // show splash
    this.auth.authenticate(this.data).subscribe(
      result => {
        this.event.send("splash-hide") // hide splash
        // evaluate the result
        if (result != true) {
          // login error
          this.data.error = result
        }
        else {
          // login success
          this.event.send('authenticated')
        }
      }
    )
  }

}
