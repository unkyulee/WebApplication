import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

// user imports
import { NavService } from './services/nav.service';
import { EventService } from './services/event.service';
import { RestService } from './services/rest.service';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(
    public nav: NavService // init navservice here to make sure that the navigation events are captured as soon as possible
    , public event: EventService
    , private rest: RestService
    , private config: ConfigService
  ) {
  }

  // receive events
  onEvent: Subscription

  ngOnInit() {
    // event handler
    this.onEvent = this.event.onEvent.subscribe(
      event => {
        if (event.name == 'email') {
          // send notification email
          let src = event.src
          try { src = eval(src) } catch (e) { }
          let method = event.method ? event.method : 'post'
          this.rest.request(src, event.data, method).subscribe(response => { })
        }
      }
    )
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe()
  }
}
