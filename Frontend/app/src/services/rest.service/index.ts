// @ts-nocheck
import config from "../config.service";
import node from "./node";
import firebase from "./firebase";

export default {
  loadModule: null,
  async request(url, data = {}, method, options) {
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

    return await this.loadModule.request(url, data, method, options);
  },
};
