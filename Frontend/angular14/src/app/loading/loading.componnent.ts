// @ts-nocheck
import { Component } from "@angular/core";
import { AuthService } from "../services/auth/auth.service";
import { ConfigService } from "../services/config.service";
import { EventService } from "../services/event.service";
import { RestService } from "../services/rest.service";
import { UtilService } from "../services/util.service";

@Component({
  selector: "loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.css"],
})
export class LoadingComponent {
  constructor(
    private util: UtilService,
    private rest: RestService,
    private config: ConfigService,
    private event: EventService,
    private auth: AuthService
  ) {}

  // ui parameters
  message = "";
  error = "";

  async ngOnInit() {
    await this.initialize();
  }

  // loading context
  context = {};

  async initialize() {
    //
    if (!(await this.checkServiceURL())) return;

    // check onilne connection
    if (!(await this.checkOnline())) return;

    // set locale
    if (!(await this.setLocale())) return;

    // clear cache
    if (!(await this.clearCache())) return;

    // check login
    if (!(await this.checkLogin())) return;

    // download navigation
    if (!(await this.downloadNavigation())) return;

    this.message = "All Good!";

    // send navigation updated
    this.event.sendAsync({ name: "loading-completed" });
  }

  async checkServiceURL() {
    this.context.service_url = localStorage.getItem("service_url");
    if (this.context.service_url != null) {
      this.message = "Service URL found";
      return true;
    } else {
      this.error = "Service URL missing";
      return false;
    }
  }

  async checkOnline() {
    this.message = "Verifying network connection ...";

    // if not online then wait 30 seconds
    // when network comes online then move on
    //while (true)
    while (true) {
      if (window.navigator.onLine) {
        // web browser says that it is online
        // check if the service url can be loaded
        try {
          // download configuration
          let response = await this.rest.requestAsync(
            `${this.context.service_url}/index.json`
          );

          // when downloaded save to global config
          obj.set(window, "__CONFIG__", response);
          obj.set(window, "__CONFIG__.event", this.event);

          // network connected
          break;
        } catch (ex) {
          // network still not connected
          console.error(ex);
        }
      }

      // network is not connected
      this.error = `Please check your network connection`;
      await this.util.timeout(10000);
    }

    this.message = `Network connection verified`;
    return true;
  }

  async setLocale() {
    // init moment locale
    if (this.config.get("locale")) {
      moment.locale(this.config.get("locale"));
      this.message = `setting locale to <b>${this.config.get("locale")}</b>`;
    }

    return true;
  }

  async clearCache() {
    this.message = "Clearing cache ...";
    this.config.clear();
    return true;
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

  async downloadNavigation() {
    this.message = "Update navigation";

    let response = await this.rest.requestAsync(
      `${this.config.get("url")}/navigation.config`
    );

    // save theme
    this.config.set("theme", response.theme);

    // save permission
    this.config.set("permissions", response.permissions);

    // save module config
    this.config.set("module", response.module);

    // save nav
    this.config.set("nav", response.nav);

    return true;
  }
}
