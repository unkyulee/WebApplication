import { Component, Injector } from "@angular/core";
import { Subscription } from "rxjs";
import * as moment from "moment";

// user imports
import { NavService } from "./services/nav.service";
import { EventService } from "./services/event.service";
import { ConfigService } from "./services/config.service";
import { CordovaService } from "./services/cordova.service";

// Global Injector
export let AppInjector: Injector;

@Component({
  selector: "app-root",
  template: "<router-outlet></router-outlet>"
})
export class AppComponent {
  constructor(
    public nav: NavService, // init navservice here to make sure that the navigation events are captured as soon as possible
    public event: EventService,
    private config: ConfigService,
    private cordova: CordovaService,
    private injector: Injector
  ) {
    AppInjector = this.injector;
  }

  // receive events
  onEvent: Subscription;
  onResume: Subscription;

  // last resume
  lastResumed: any;

  ngOnInit() {
    // init moment locale
    if (this.config.get("locale")) moment.locale(this.config.get("locale"));

    // onresume - fire validate every 6 hours
    this.onResume = this.cordova.resume.subscribe(event => {
      if (
        !this.lastResumed ||
        Math.abs(new Date().getTime() - this.lastResumed.getTime()) / 36e5 > 6
      ) {
        this.nav.loadNavigation();
        this.lastResumed = new Date();
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }
}
