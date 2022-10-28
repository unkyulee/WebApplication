// @ts-nocheck
import rest from "../../rest.service";
import config from "../../config.service";

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

  async page(_id) {
    let uiElement = obj.get(this.storage, _id);

    // return if stored uiElement exists
    if (!uiElement) {
      // if storage doesn't have it then load it
      let url = `${config.get("url")}/page?_id=${_id}`;
      let response = await rest.request(url);

      // save the uiElement
      this.storage[_id] = response.data;
      uiElement = response.data;
    }

    return uiElement;
  },
};
