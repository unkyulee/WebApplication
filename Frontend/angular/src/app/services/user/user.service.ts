import { Injectable } from "@angular/core";
var obj = require("object-path");
import { ConfigService } from "../config.service";
import { DefaultUserStrategy } from "./service/default";

@Injectable()
export class UserService {
  constructor(public config: ConfigService) {
    // setup strategy
    let strategy = this.config.get("auth.userStrategy");
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

  // check access control on roles
  acl(roles: any[]) {
    let result = false;
    for(let role of roles) {
      let userRoles = this.userStrategy.roles();
      if(userRoles == role) {
        result = true;
        break;
      }
      if(Array.isArray(userRoles) && userRoles.includes(role)) {
        result = true;
        break;
      }
    }
    return result;
  }
}
