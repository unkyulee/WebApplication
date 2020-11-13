<template>
  <div></div>
</template>

<script>
//
const obj = require("object-path");
const moment = require("moment");
const Mustache = require('mustache');

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

    this.event.unsubscribe_all(this._uid);
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
    },
    safeGet(data, path, def) {
      return obj.get(data, path, def);
    },
  },
};
</script>