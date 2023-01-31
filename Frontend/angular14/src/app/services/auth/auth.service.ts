import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// auth strategy
import { DefaultAuthStrategy } from "./service/default";
import { NoAuthStrategy } from "./service/noauth";

// user imports
import { RestService } from "../rest.service";
import { EventService } from "../event.service";
import { ConfigService } from "../config.service";
import { NavService } from "../nav.service";
import { UIService } from "../ui.service";

@Injectable()
export class AuthService {
  constructor(
    public rest: RestService,
    public event: EventService,
    public config: ConfigService,
    public nav: NavService,
    public ui: UIService
  ) {
    // setup authentication strategy
    let strategy = this.config.get("auth");
    switch (strategy) {
      case "NoAuth":
        this.authStrategy = new NoAuthStrategy();
        break;
      default:
        this.authStrategy = new DefaultAuthStrategy(
          rest,
          event,
          config,
          nav,
          ui
        );
    }

    // listen to events
    this.event.onEvent.subscribe(async (e) => {
      if (e == "logout") {
        await this.logout();
      }
    });
  }

  // authenticateion strategy object
  authStrategy: any;
  isAuthenticated$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  async login(data) {
    return this.authStrategy.login(data);
  }

  async isAuthenticated() {
    return this.authStrategy.isAuthenticated();
  }

  async logout() {
    this.authStrategy.logout();
    this.event.send({ name: "initialize" });
  }

  id() {
    return this.authStrategy.id();
  }

  name() {
    return this.authStrategy.name();
  }

  roles() {
    return this.authStrategy.roles();
  }

  token() {
    return this.authStrategy.token();
  }
}
