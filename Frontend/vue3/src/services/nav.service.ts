// @ts-nocheck
import rest from "./rest.service";
import config from "./config.service";

export default {
  async load() {
    // return if stored uiElement exists
    let response = await rest.request(`${config.get("url")}/navigation`);

    // save to config
    config.set("navigation", response.data);

    return response.data;
  },
};
