// @ts-nocheck
import config from "../config.service";
import node from "./node";
import firebase from "./firebase";

export default {
  loadModule: null,
  getModule() {
    if (!this.loadModule) {
      switch (config.get("module")) {
        case "firebase":
          this.loadModule = firebase;
          break;
        default:
          this.loadModule = node;
          break;
      }
    }
    return this.loadModule;
  },
  async get(uiElementId) {
    return await this.getModule().get(uiElementId);
  },

  translate_type(uiElement) {
    switch (obj.get(uiElement, "type")) {
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
      case "table":
      case "data-table":
        uiElement.type = "table-component";
        break;
      case "file-upload":
        uiElement.type = "file-upload-component";
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
        console.error(`uiElement missing ${uiElement?.uiElementId}`);
      }
    }
  },
};
