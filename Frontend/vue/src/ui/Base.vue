<template>
  <div></div>
</template>

<script>
//
const obj = require("object-path");
const moment = require("moment");

export default {
  props: ["uiElement", "data"],
  inject: ["config", "event", "rest", "ui", "auth"],
  mounted: function () {
    if (this.uiElement && this.uiElement.init) {
      try {
        eval(this.uiElement.init);
      } catch (ex) {
        console.error(ex);
      }
    }
  },
  destroyed: function () {
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
    },
  },
};
</script>