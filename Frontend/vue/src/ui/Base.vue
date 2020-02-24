<template>
  <div></div>
</template>

<script>
const Vue = require("vue");
const obj = require("object-path");

export default {
  props: ["uiElement", "data"],
  inject: ["config", "event", "rest"],
  mounted: function() {
    if (this.uiElement && this.uiElement.init) {
      try {
        eval(this.uiElement.init);
      } catch (ex) {
        console.error(ex);
      }
    }
  },
  methods: {
    condition: function(uiElement) {
      let passed = true;
      if (uiElement.condition) {
        passed = eval(uiElement.condition);
      }
      return passed;
    },
    click: function($event, uiElement, item) {
      if(this.uiElement.click) {
        try {
          eval(this.uiElement.click)
        } catch(ex) {
          console.error(ex)
        }
      }
    },
    filterUiElement(uiElement, data) {
      if (uiElement.filterUiElement) {
        try {
          eval(uiElement.filterUiElement);
        } catch (ex) {
          console.error(ex);
        }
      }
      return uiElement;
    },
    filterData(uiElement, data) {
      if (uiElement.filterData) {
        try {
          eval(uiElement.filterData);
        } catch (ex) {
          console.error(ex);
        }
      }
      return data;
    },
    safeEval(script) {
      try {
        return eval(script)
      } catch(ex) {
        console.error(script, ex)
      }
    }
  }
};
</script>