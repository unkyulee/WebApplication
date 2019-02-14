import { Injectable } from "@angular/core";

// get config from index.html
declare var __CONFIG__: any;

@Injectable()
export class ConfigService {
  constructor() {
    // load from the config if defined
    this.configuration = Object.assign(this.configuration, __CONFIG__);
  }

  // default configuration
  configuration: any = {};
}
