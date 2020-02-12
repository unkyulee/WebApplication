const obj = require('object-path');
obj.ensureExists(window, "__CONFIG__", {})

export default {
  get(name, def_value) {
    let v = null;
    if (window.__CONFIG__) v = obj.get(window.__CONFIG__, name, def_value);
    return v;
  },
  set(name, value) {
    // set default if it doesn't exists
    obj.set(window.__CONFIG__, name, value);
  }
};
