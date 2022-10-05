// @ts-nocheck
import rest from "./rest.service";
import config from "./config.service";
import * as obj from "object-path";

export default {
  storage: {},
  async get(uiElementId) {
    let uiElement = obj.get(this.storage, uiElementId);

    // return if stored uiElement exists
    if (!uiElement) {
      // if storage doesn't have it then load it
      let url = `${config.get("url")}/ui.element?uiElementId=${uiElementId}`;
      let response = await rest.request(url);

      // save the uiElement
      this.storage[uiElementId] = response.data;
      uiElement = response.data;
    }

    return uiElement;
  },
  translate_type(uiElement) {
    switch (obj.get(uiElement, "type")) {
      case "layout":
        uiElement.type = "ui-elements";
        break;
      case "image":
        uiElement.type = "image-loader";
        break;
      case "input":
        uiElement.type = "input-component";
        break;
      case "button":
        uiElement.type = "button-component";
        break;
      case "progress":
        uiElement.type = "progress-component";
        break;
      case "iframe":
        uiElement.type = "iframe-component";
        break;
    }
  },
  async compile(uiElement) {
    // if type is ui-element-id
    if (obj.get(uiElement, "type") == "ui-element-id") {
      let element = await this.get(uiElement.uiElementId);
      if (element) {
        // delete ui-element-id props
        delete uiElement.type;
        delete uiElement.uiElementId;

        // replace with new elements
        Object.assign(uiElement, {
          ...element,
          ...uiElement,
        });
      } else {
        console.error(`uiElement missing ${this.uiElement.uiElementId}`);
      }
    }
  },
};
