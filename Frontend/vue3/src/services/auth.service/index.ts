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
  async login(data) {
    return await this.getModule().login(data);
  },
  async logout() {
    return await this.getModule().logout();
  },
  async isAuthenticated() {
    return await this.getModule().isAuthenticated();
  },
  async client() {
    return await this.getModule().client();
  },
  user() {
    return this.getModule().user();
  },
};
