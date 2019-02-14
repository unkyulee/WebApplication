import { Injectable } from "@angular/core";
import * as obj from "object-path";
import { ConfigService } from "../config.service";
import { DefaultUserStrategy } from "./service/default";

@Injectable()
export class UserService {
  constructor(public config: ConfigService) {
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
