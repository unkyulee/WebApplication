import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// auth strategy
import { DefaultAuthStrategy } from "./service/default";
import { NoAuthStrategy } from "./service/noauth";

// user imports
import { RestService } from "../rest.service";
import { EventService } from "../event.service";
import { ConfigService } from "../config.service";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    public rest: RestService,
    public event: EventService,
    public config: ConfigService,
    public user: UserService
  ) {
    // setup authentication strategy
    let strategy = this.config.get("authentication.authStrategy");
    switch (strategy) {
      case "NoAuth":
        this.authStrategy = new NoAuthStrategy();
        break;
      default:
        this.authStrategy = new DefaultAuthStrategy(rest, config, event, user);
    }

    // listen to events
    this.event.onEvent.subscribe(async e => {
      if (e == "logout") {
        await this.authStrategy.logout();
      }
    });
  }

  // authenticateion strategy object
  authStrategy: any;
  isAuthenticated$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  async login(data) {
    return this.authStrategy.login(data, this.isAuthenticated$);
  }

  async isAuthenticated() {
    return this.authStrategy.isAuthenticated(this.isAuthenticated$);
  }

  async logout() {
    return this.authStrategy.logout(this.isAuthenticated$);
  }
}
