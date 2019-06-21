// user imports
import ConfigService from "../config.service";
import EventService from "../event.service";
import RestService from "../rest.service";

// auth strategy
import NoAuthStrategy from "./strategy/noauth";
import DefaultAuthStrategy from "./strategy/default";

class AuthService {
  constructor() {
    // save as services
    this.config = ConfigService;
    this.event = EventService;
    this.rest = RestService;

    // setup authentication strategy
    let strategy = this.config.get("authentication.authStrategy");
    switch (strategy) {
      case "NoAuth":
        this.authStrategy = new NoAuthStrategy();
        break;
      default:
        this.authStrategy = new DefaultAuthStrategy(
          this.rest,
          this.config,
          this.event
        );
    }

    // listen to events
    this.event.onEvent.subscribe(async e => {
      if (e === "logout") {
        await this.authStrategy.logout();
      }
    });
  }

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

// export an instance so that it stays singletone
export default new AuthService();
