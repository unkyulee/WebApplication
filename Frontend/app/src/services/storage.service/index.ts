// @ts-nocheck
import { getDownloadURL } from "firebase/storage";
import config from "../config.service";
import firebase from "./firebase";

export default {
  loadModule: null,
  async upload(path, file) {
    if (!this.loadModule) {
      switch (config.get("module")) {
        case "firebase":
          this.loadModule = firebase;
          break;
      }
    }

    return await this.loadModule.upload(path, file);
  },

  async list(path) {
    if (!this.loadModule) {
      switch (config.get("module")) {
        case "firebase":
          this.loadModule = firebase;
          break;
      }
    }

    return await this.loadModule.list(path);
  },

  async url(path) {
    if (!this.loadModule) {
      switch (config.get("module")) {
        case "firebase":
          this.loadModule = firebase;
          break;
      }
    }

    return await this.loadModule.url(path);
  },
};
