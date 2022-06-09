<template>
  <div
    v-if="condition(uiElement)"
    v-html="value"
    @click="click($event)"
    :class="uiElement.class"
    :style="uiElement.style"
  ></div>
</template>

<script>
import Vue from "vue";
import Base from "./Base";
const obj = require("object-path");
const moment = require("moment");

export default Vue.component("typography", {
  extends: Base,
  data: function () {
    return {
      value: null,
    };
  },
  mounted: function () {
    this.$set(this, "value", this.update());
  },
  updated: function () {
    this.$set(this, "value", this.update());
  },
  methods: {
    update: function () {
      let text = null;

      // fixed text
      if (this.uiElement.text) {
        // set value
        text = this.uiElement.text;
        // check if lang option exists
        if(
          this.uiElement.lang && 
          this.config.get("locale") &&
          this.uiElement.lang[this.config.get("locale")]
        ) {
          text = this.uiElement.lang[this.config.get("locale")]
        }
      }

      // key exists
      else if (this.data && this.uiElement.key) {
        // set value
        text = obj.get(this.data, this.uiElement.key);
      }

      // if null then assign default
      if (
        (typeof this._value == "undefined" || this._value == null) &&
        this.uiElement.default
      ) {
        text = this.uiElement.default;
        try {
          text = eval(this.uiElement.default);
        } catch {
          //
        }
      }

      // if format is specified
      if (this.uiElement.format) {
        try {
          text = eval(this.uiElement.format);
        } catch (e) {
          console.error(this.uiElement.format, e);
        }
      }

      if (this.uiElement.key == "order_qty") console.log(text);
      return text;
    },
  },
});
</script>