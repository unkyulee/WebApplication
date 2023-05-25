// @ts-nocheck
export default {
  props: ["uiElement", "data"],
  inject: ["config", "event", "rest", "ui", "auth", "util"],
  async created() {
    // run init if defined
    if (this.uiElement && this.uiElement.init) {
      try {
        //
        await eval(this.uiElement.init);
        //
      } catch (ex) {
        console.error(ex);
      }
    }
  },
  async mounted() {
    // run init if defined
    if (this.uiElement && this.uiElement.mounted) {
      try {
        await eval(this.uiElement.mounted);
      } catch (ex) {
        console.error(ex);
      }
    }
  },
  unmounted() {
    //
    if (this.uiElement && this.uiElement.destroy) {
      try {
        eval(this.uiElement.destroy);
      } catch (ex) {
        console.error(ex);
      }
    }
  },
  methods: {
    // defense code from vue2
    $set(data, path, value) {
      obj.set(data, path, value);
    },
    condition(uiElement) {
      let passed = true;
      if (uiElement.condition) {
        passed = eval(uiElement.condition);
      }
      return passed;
    },
    click($event, uiElement, item) {
      if (this.uiElement.click) {
        try {
          eval(this.uiElement.click);
        } catch (ex) {
          console.error(ex, this.uiElement, this.uiElement.click);
        }
      }
    },
    safeEval(script) {
      try {
        return eval(script);
      } catch (ex) {
        console.error(this.uiElement, script, ex);
      }
      return script;
    },
    safeGet(data, path, def) {
      return obj.get(data, path, def);
    },
    label() {
      let text = null;

      // fixed text
      if (this.uiElement.label) {
        // set value
        text = this.uiElement.label;
        // check if lang option exists
        if (
          this.uiElement.lang &&
          this.config.get("locale") &&
          this.uiElement.lang[this.config.get("locale")]
        ) {
          text = this.uiElement.lang[this.config.get("locale")];
        }
      }

      return text;
    },
  },
};
