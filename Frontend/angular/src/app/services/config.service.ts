import { Injectable } from "@angular/core";
import * as obj from "object-path";
import { EventService } from './event.service';

// get config from index.html
declare var window: any;

@Injectable()
export class ConfigService {
  constructor(private event: EventService) {
    // load UI
    this.loadUI()

    // load Navigation
    this.loadNavigation()

    // event handler
    this.event.onEvent.subscribe(e => {
      if (e == "authenticated") {
        this.loadUI()
      } else if (e.name == "ui-updated") {
        // when server has new navigation
        this.set("uiElements", e.data);
      }
    });
  }

  loadUI() {
    let uiElements = this.get("uiElements");
    if (!uiElements) {
      // if index.js doesn't contain uiElements then get it from the cache
      // Set the settings from the given object
      uiElements = JSON.parse(localStorage.getItem("uiElements"));
    }

    // set to ui
    this.set("uiElements", uiElements)
  }

  loadNavigation() {
    try {
      let navigation = this.get("nav");
      if (!navigation) {
        // if index.js doesn't contain nav then get it from the cache
        navigation = JSON.parse(localStorage.getItem("nav"));
        this.set("nav", navigation)
      }
    } catch (e) {
      console.error(e);
    }
  }


  get(name, def_value?) {
    let v = null;
    if (window.__CONFIG__)
      v = obj.get(window.__CONFIG__, name, def_value);
    return v;
  }

  set(name, value) {
    // set default if it doesn't exists
    if (!window.__CONFIG__) window.__CONFIG__ = {};
    obj.set(window.__CONFIG__, name, value);
  }
}
