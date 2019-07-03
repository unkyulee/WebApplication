import * as obj from "object-path";

class ConfigService {
  get(name) {
    let v = null;
    if (window.__CONFIG__)
      v = obj.get(window.__CONFIG__, name);
    return v;
  }

  set(name, value) {
    // set default if it doesn't exists
    if (!window.__CONFIG__) window.__CONFIG__ = {};
    obj.get(window.__CONFIG__, name, value);
  }
}

// export an instance so that it stays singletone
export default new ConfigService();
