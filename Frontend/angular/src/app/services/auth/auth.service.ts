import { Injectable } from "@angular/core";
import * as obj from "object-path";

// user imports
import { RestService } from "../rest.service";
import { EventService } from "../event.service";
import { ConfigService } from "../config.service";
import { DefaultAuthStrategy } from "./service/default";

@Injectable()
export class AuthService {
  constructor(
    public rest: RestService,
    public event: EventService,
    public config: ConfigService
  ) {
    // setup authentication strategy
    let strategy = obj.get(this.config.configuration, "auth.authStrategy");
    switch (strategy) {
      default:
        this.authStrategy = new DefaultAuthStrategy(rest, config, event);
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

  async login(data) {
    return this.authStrategy.login(data);
  }

  async logout() {
    return this.authStrategy.logout();
  }

  async isAuthenticated() {
    return this.authStrategy.isAuthenticated();
  }

  async refreshAuthentication() {
    return this.authStrategy.refreshAuthentication();
  }
}
