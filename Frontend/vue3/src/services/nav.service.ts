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

  find(children, url) {
    let found;
    for (let child of children) {
      if (child.url == url) {
        found = child;
        break;
      }
      // search in children
      if (child.children) {
        found = this.find(child.children, url);
        if (found) break;
      }
    }

    return found;
  },

  is_embed() {
    let queryString = window.location.hash;
    if(queryString) {
      queryString = queryString.replace("#", "");
      queryString = queryString.replace("/", "");
    }
    let urlParams = new URLSearchParams(queryString);
    
    return urlParams.has("embed");
  },
};
