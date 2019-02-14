import { Injectable } from "@angular/core";
import { EventService } from "./event.service";
import { ConfigService } from "./config.service";

@Injectable()
export class UIService {
  constructor(private event: EventService, private config: ConfigService) {
    // init ui element
    this.set();

    // event handler
    this.event.onEvent.subscribe(e => {
      if (e == "authenticated") {
        // set navigation
        this.set();
      } else if (e.name == "ui-updated") {
        // when server has new navigation
        this.config.configuration.angular_ui = e.data;
        this.set();
      }
    });
  }

  // navigation model
  uiElements: any[] = [];

  set() {
    try {
      this.uiElements = this.config.configuration.angular_ui;
      if (!this.uiElements) {
        // if index.js doesn't contain angular_navigation then get it from the cache
        // Set the settings from the given object
        this.uiElements = JSON.parse(localStorage.getItem("angular_ui"));
      }
    } catch (e) {}
  }

  // given data find value and if not found then look up in parent
  find(path: string[], data: any, defaultValue?: any) {
    let retValue = null;

    let currPath = Object.assign([], path);
    for (let i in path) {
      retValue = this.get(currPath, data);
      if (!retValue) currPath.shift();
      else return retValue;
    }

    return retValue == null ? defaultValue : retValue;
  }

  get(path: string[], data: any) {
    let value = data;
    for (let pathname of path) {
      if (!value[pathname]) return null;
      value = value[pathname];
    }

    return value;
  }
}
