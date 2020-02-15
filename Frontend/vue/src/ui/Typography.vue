<template>
  <div
    v-html="value()"
    @click="click($event)"
    :class="uiElement.class"
    :style="uiElement.style"
  ></div>
</template>

<script>
import Base from "./Base";
const obj = require("object-path");
const moment = require("moment");

export default {
  extends: Base,
  methods: {
    value: function() {
      let text = null;

      // fixed text
      if (this.uiElement.text) {
        // set value
        text = this.uiElement.text;
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

      return text;
    }
  }
};
</script>