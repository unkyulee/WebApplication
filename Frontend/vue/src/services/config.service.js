export default {
  get(name) {
    let v = null;
    if (window.__CONFIG__ && window.__CONFIG__[name])
      v = window.__CONFIG__[name];
    return v;
  },
  set(name, value) {
    // set default if it doesn't exists
    if (!window.__CONFIG__) window.__CONFIG__ = {};
    window.__CONFIG__[name] = value;
  }
};
