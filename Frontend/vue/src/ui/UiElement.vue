<template>
  <component
    v-if="ready && condition(uiElement)"
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

import Input from "./Input";
import Button from "./Button";
import DataTable from "./DataTable";
import Stepper from "./Stepper";

import Chips from "./Chips";
import Select from "./Select";
import Icon from "./Icon";

export default Vue.component("UiElement", {
  props: ["uiElement", "data"],
  inject: ["config", "event", "rest", "ui", "auth"],
  data: function() {
    return {
      ready: false
    }
  },
  mounted: async function () {
    // prepare uielement
    this.ready = false;

    // convert to component
    if (this.uiElement && this.uiElement.type == "image") this.uiElement.type = "image-loader";
    else if (this.uiElement && this.uiElement.type == "input") this.uiElement.type = "input-component";
    else if (this.uiElement && this.uiElement.type == "button") this.uiElement.type = "button-component";

    // resolve ui-element-id
    if (this.uiElement && this.uiElement.type == "ui-element-id") {
      let element = await this.ui.get(this.uiElement.uiElementId);
      if (element) {
        this.$set(this, "uiElement", Object.assign(this.uiElement, element));

        // run init script
        if (this.uiElement.uiElementInit) {
          try {
            eval(this.uiElement.uiElementInit);
          } catch (e) {
            console.error(e);
          }
        }
      } else {
        console.error(`uiElement missing ${this.uiElement.uiElementId}`);
      }
    }

    // run init script
    try {
      if (obj.get(this.uiElement, "init")) {
        await eval(this.uiElement.init);
      }
    } catch (ex) {
      console.error(this.uiElement.init);
      console.error(ex);
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