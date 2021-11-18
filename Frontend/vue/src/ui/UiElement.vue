<template>
  <component
    v-if="ready"
    :is="uiElement.type"
    :data="data"
    :uiElement="uiElement"
    :class="uiElement.layoutClass"
    :style="uiElement.layoutStyle"
  >
  </component>
</template>

<script>
import Vue from "vue";
const obj = require("object-path");
const moment = require("moment");

import Base from "./Base";
import "./Layout";
import "./Typography";
import "./Image";
import "./Tabs";
import "./Divider";
import "./Input";
import "./Button";
import "./DataTable";
import "./Icon";
import "./Date";
import "./Selection";
import "./Progress";
import "./ExpansionPanel";
import "./Carousel";
import "./Iframe"

export default Vue.component("UiElement", {
  props: ["uiElement", "data"],
  inject: ["config", "event", "rest", "ui", "auth"],
  data: function () {
    return {
      ready: false,
    };
  },
  mounted: async function () {
    // prepare uielement
    this.ready = false;
    
    // resolve ui-element-id
    if (this.uiElement && this.uiElement.type == "ui-element-id") {
      let element = await this.ui.get(this.uiElement.uiElementId);
      if (element) {
        delete this.uiElement.type;
        delete this.uiElement.uiElementId;
        this.$set(
          this,
          "uiElement",
          Object.assign(this.uiElement, {
            ...element,
            ...this.uiElement,
          })
        );
      } else {
        console.error(`uiElement missing ${this.uiElement.uiElementId}`);
      }
    }

    // convert to component
    if (this.uiElement && this.uiElement.type == "image")
      this.uiElement.type = "image-loader";
    else if (this.uiElement && this.uiElement.type == "input")
      this.uiElement.type = "input-component";
    else if (this.uiElement && this.uiElement.type == "button")
      this.uiElement.type = "button-component";
    else if (this.uiElement && this.uiElement.type == "progress")
      this.uiElement.type = "progress-component";
      else if (this.uiElement && this.uiElement.type == "iframe")
      this.uiElement.type = "iframe-view";

    // run init
    if (this.uiElement && this.uiElement.init) {      
      try {
        await eval(this.uiElement.init);
      } catch (ex) {
        console.error(ex);
        console.error(JSON.stringify(this.uiElement));
      }
    }

    // uiElement ready
    this.ready = true;
  },
  methods: {
    condition: function (uiElement) {
      let passed = true;
      if (uiElement.condition) {
        passed = eval(uiElement.condition);
      }
      return passed;
    },
  },
});
</script>