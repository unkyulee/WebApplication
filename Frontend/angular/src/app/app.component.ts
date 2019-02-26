import { Component } from "@angular/core";
import { Subscription, config } from "rxjs";
import * as moment from "moment";

// user imports
import { NavService } from "./services/nav.service";
import { EventService } from "./services/event.service";
import { RestService } from "./services/rest.service";
import { ConfigService } from "./services/config.service";
import { CordovaService } from './services/cordova.service';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: "app-root",
  template: "<router-outlet></router-outlet>"
})
export class AppComponent {
  constructor(
    public nav: NavService, // init navservice here to make sure that the navigation events are captured as soon as possible
    public event: EventService,
    private rest: RestService,
    private config: ConfigService,
    private cordova: CordovaService,
    private auth: AuthService
  ) {}

  // receive events
  onEvent: Subscription;
  onResume: Subscription;

  // last resume
  lastResumed: any

  ngOnInit() {
    // init moment locale
    if (this.config.configuration.locale)
      moment.locale(this.config.configuration.locale);

    // onresume - fire validate every 6 hours
    this.onResume = this.cordova.resume.subscribe(
      event => {
        if(!this.lastResumed) {
          this.auth.refreshAuthentication()
          this.lastResumed = new Date()
        }
        else if(Math.abs((new Date()).getTime() - this.lastResumed.getTime()) / 36e5 > 6) {
          // check if last resumed was 6 hours ago
          this.auth.refreshAuthentication()
          this.lastResumed = new Date()
        }
      }
    )

    // event handler
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (event.name == "email") {
        // send notification email
        let src = event.src;
        try {
          src = eval(src);
        } catch (e) {}
        let method = event.method ? event.method : "post";
        this.rest.request(src, event.data, method).subscribe(response => {});
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }
}
