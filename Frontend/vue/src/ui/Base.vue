<template>
  <div></div>
</template>

<script>
const obj = require("object-path");

export default {
  props: ["uiElement", "data"],
  inject: ["config", "event"],
  mounted: function() {
    if (this.uiElement.init) {
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
    click: function($event) {
      console.log(`clicked`, $event);
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
    }
  }
};
</script>