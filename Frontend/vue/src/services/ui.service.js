const obj = require('object-path');
import rest from "./rest.service";
import config from "./config.service";

export default {
  async get(uiElementId) {
    // load initial configuration
    let url = `${config.get('host')}${config.get('url')}/ui.element?uiElementId=${uiElementId}`;
    let response = await rest.request(url);
    // save the uiElement
    let uiElement = response.data;
    // resolve ui-element-id
    if(uiElement.screens)
      this.resolveUiElementId(uiElement)

    return uiElement;
  },
  async resolveUiElementId(uiElement) {
    for(let screen of uiElement.screens) {
      if(screen.type == 'ui-element-id') {
        let element = await this.get(screen.uiElementId);
        screen = Object.assign(screen, element);
      }

      if(screen.screens) {
        await this.resolveUiElementId(screen);
      }
    }
  }
};
