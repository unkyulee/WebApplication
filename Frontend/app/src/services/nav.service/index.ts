// @ts-nocheck
import config from "../config.service";
import node from "./node";
import firebase from "./firebase";

export default {
  loadModule: null,
  async load() {
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

    return await this.loadModule.load();
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
    if (queryString) {
      queryString = queryString.replace("#", "");
      queryString = queryString.replace("/", "");
    }
    let urlParams = new URLSearchParams(queryString);

    return urlParams.has("embed");
  },
};
