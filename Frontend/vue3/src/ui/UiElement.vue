<template>
  <component v-if="ready" :is="uiElement.type" :data="data" :uiElement="uiElement" :class="uiElement.layoutClass"
    :style="uiElement.layoutStyle">
  </component>
</template>

<script lang="ts">
// @ts-nocheck

// implict reference
import * as obj from "object-path";
import * as moment from "moment";

//
import Layout from "./Layout.vue";
import ImageLoader from "./Image.vue";
//import Typography from "./Typography.vue";
/*

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
import "./QRScanner"
*/
import { defineComponent } from 'vue';
export default defineComponent({
  props: ["uiElement", "data"],
  inject: ["config", "event", "rest", "ui", "auth"],
  data: function () {
    return {
      ready: false,
    };
  },
  mounted: async function () {    
    console.log(JSON.stringify(this.uiElement, null, 4))

    // prepare uielement
    this.ready = false;

    //this.uiElement.type = 'layout'
/*
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
    if (this.uiElement && this.uiElement.type == "image") {
      this.uiElement.type = "image-loader";
      console.log(this.uiElement)
    }
      
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
  */

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