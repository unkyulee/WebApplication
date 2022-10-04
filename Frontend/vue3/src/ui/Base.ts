// @ts-nocheck
import * as obj from "object-path";
import * as moment from "moment";
import * as mustache from "mustache";

export default {
  props: ["uiElement", "data"],
  inject: ["config", "event", "rest", "ui", "auth"],
  mounted: function () {
    // data refresh
    this.event.subscribe(this._uid, "data", (event) => {      
      this.$forceUpdate();
    });
  },
  destroyed: function () {
    //
    this.event.unsubscribe_all(this._uid);
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
    condition: function (uiElement) {
      let passed = true;
      if (uiElement.condition) {
        passed = eval(uiElement.condition);
      }
      return passed;
    },
    click: function ($event, uiElement, item) {
      if (this.uiElement.click) {
        try {
          eval(this.uiElement.click);
        } catch (ex) {
          console.error(ex);
        }
      }
    },
    safeEval(script) {
      try {
        return eval(script);
      } catch (ex) {
        console.error(script, ex);
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
        if(
          this.uiElement.lang && 
          this.config.get("locale") &&
          this.uiElement.lang[this.config.get("locale")]
        ) {
          text = this.uiElement.lang[this.config.get("locale")]
        }
      }

      return text;
    },
  },
};
