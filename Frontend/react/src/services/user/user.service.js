import * as obj from "object-path";

// user service
import ConfigService from "../config.service"

// auth strategy
import DefaultUserStrategy from "./strategy/default";

class UserService {
  constructor() {
    this.config = ConfigService;

    // setup strategy
    let strategy = obj.get(this.config.configuration, "auth.userStrategy");
    switch (strategy) {
      default:
        this.userStrategy = new DefaultUserStrategy();
    }
  }

  userStrategy: any;

  id() {
    return this.userStrategy.id();
  }

  name() {
    return this.userStrategy.name();
  }

  roles() {
    return this.userStrategy.roles();
  }

  token() {
    return this.userStrategy.token();
  }

  get(name) {
    return this.userStrategy.get(name);
  }
}

// export an instance so that it stays singletone
export default new UserService();
