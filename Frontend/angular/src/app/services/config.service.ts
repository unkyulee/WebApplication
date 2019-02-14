import { Injectable } from '@angular/core';

// get config from index.html
declare var __CONFIG__: any

@Injectable()
export class ConfigService {
  constructor(
  ) {
    // load from the config if defined
    this.set(this.global.angular_client)
  }

  // save global configuration
  global = __CONFIG__

  // default configuration
  configuration: any = {}

  set(configuration) {
    // Set the settings from the given object
    this.configuration = Object.assign(this.configuration, configuration);
  }

}
