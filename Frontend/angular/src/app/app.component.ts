import { Component, Injector } from "@angular/core";
import { Subscription } from "rxjs";
import * as moment from "moment";
import obj from "object-path";

// user imports
import { NavService } from "./services/nav.service";
import { EventService } from "./services/event.service";
import { ConfigService } from "./services/config.service";
import { CordovaService } from "./services/cordova.service";
import { UtilService } from "./services/util.service";
import { RestService } from "./services/rest.service";
import { AuthService } from "./services/auth/auth.service";

// Global Injector
export let AppInjector: Injector;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor(
    private injector: Injector,
    public nav: NavService,
    public event: EventService,
    private config: ConfigService,
    private cordova: CordovaService,
    private util: UtilService,
    private rest: RestService,
    private auth: AuthService
  ) {
    AppInjector = this.injector;
  }

  // receive events
  onResume: Subscription;
  onEvent: Subscription;
  // last resume
  lastResumed: any;

  ngOnInit() {
    // init moment locale
    if (this.config.get("locale")) {
      moment.locale(this.config.get("locale"));
    }

    // onresume - fire validate every 6 hours
    this.onResume = this.cordova.resume.subscribe((event) => {
      if (
        !this.lastResumed ||
        Math.abs(new Date().getTime() - this.lastResumed.getTime()) / 36e5 > 6
      ) {
        this.initialize();
        this.lastResumed = new Date();
      }
    });

    // event handler
    this.onEvent = this.event.onEvent.subscribe((event) => {
      if (event.name == "initialize") this.initialize();
    });

    // initialize the app
    this.initialize();
  }

  ngOnDestroy() {
    this.onResume.unsubscribe();
    this.onEvent.unsubscribe();
  }

  // initilize app
  initialized = false;
  view = null;
  message = "";
  logs = [];
  context: any = {};

  async initialize() {
    this.message = "";
    this.initialized = false;
    this.view = null;
    this.logs = [];

    // step 1. check app environment
    await this.checkPlatform();
    this.logs.push(`Platform detected: ${this.context.platform}`);

    // step 2. check onilne connection
    if (!(await this.checkOnline())) return;
    this.logs.push(`Network connected`);

    // step 3. check service url
    if (!(await this.checkServiceURL())) return;
    this.logs.push(`Service URL: ${this.context.service_url}`);

    // Step 4. download app config
    await this.downloadAppConfig();
    this.logs.push(`App Config downloaded: ${this.config.get("name")}`);

    // Step 5. Check login
    if (!(await this.checkLogin())) return;
    this.logs.push(`Login verified`);

    // step 6. Clear Cache
    this.clearCache();
    this.logs.push("Cache cleared");

    // Step 7. Download Navigation
    await this.downloadNavigation();
    this.logs.push("Navigation downloaded");

    // final step
    this.initialized = true;

    // send navigation updated
    this.event.sendAsync({ name: "navigation-updated" });
  }

  // retrieve platformat information
  checkPlatform() {
    this.message = "Checking platform";
    // check is it cordova?
    if (this.util.isCordova()) {
      this.context.platform = "mobile";
    } else if (this.util.isElectron()) {
      this.context.platform = "desktop";
    } else {
      this.context.platform = "web";
    }
  }

  async checkOnline() {
    this.message = "Checking online";
    // check if online
    this.context.online = window.navigator.onLine;
    // if not online then wait 30 seconds
    while (true) {
      this.message = `Please check your network connection.`;
      // when network comes online then move on
      if (window.navigator.onLine) {
        this.context.online = window.navigator.onLine;
        break;
      }
      await this.util.timeout(10000);
    }

    return this.context.online;
  }

  async checkServiceURL() {
    this.context.service_url = localStorage.getItem("service_url");
    if (this.context.service_url != null) {
      this.message = "Service URL discovered";
      return true;
    } else {
      this.message = "Service URL missing";
      // load service_url screen
      setTimeout(() => {
        this.view = "service-url";
      }, 1000);
      return false;
    }
  }

  async downloadAppConfig() {
    this.message = "Downloading App Configuration";
    let response = await this.rest.requestAsync(
      `${this.context.service_url}/index.json`
    );

    obj.set(window, "__CONFIG__", response);
    obj.set(window, "__CONFIG__.event", this.event);
  }

  async checkLogin() {
    this.message = "Verifying Login ...";
    // is authenticated?
    let valid = await this.auth.isAuthenticated();
    if (!valid) {
      // load service_url screen
      setTimeout(() => {
        this.view = "login";
      }, 1000);
    }

    return valid;
  }

  clearCache() {
    this.message = "Clearing cache";
    this.config.clear();
  }

  async downloadNavigation() {
    this.message = "Download navigation";
    let r: any = await this.rest.requestAsync(
      `${this.config.get("url")}/navigation.config`
    );

    // save theme
    this.config.set("theme", r.theme);

    // save permission
    this.config.set("permissions", r.permissions);

    // save module config
    this.config.set("module", r.module);

    // save nav
    this.config.set("nav", r.nav);
  }
}
