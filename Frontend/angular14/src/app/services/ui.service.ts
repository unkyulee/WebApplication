import { Injectable } from "@angular/core";

// services
import { ConfigService } from "./config.service";
import { RestService } from "./rest.service";

@Injectable()
export class UIService {
  constructor(private config: ConfigService, private rest: RestService) {}

  async get(uiElementId) {
    let uiElement = this.config.get(`ui.${uiElementId}`);
    if (!uiElement) {
      // use cache when offline
      let url = `${this.config.get("host")}${this.config.get(
        "url"
      )}/ui.element`;
      uiElement = await this.rest.requestAsync(url, { uiElementId });
      if (!uiElement) {
        throw `ui element missing ${uiElementId}`;
      }
      this.config.set(`ui.${uiElementId}`, uiElement);
    }

    return JSON.parse(JSON.stringify(uiElement));
  }

  clear() {
    this.config.set("ui", {});
  }
}
