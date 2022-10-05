<template>
  <div :class="uiElement.layoutClass" :style="uiElement.layoutStyle">
    <div
      v-html="value"
      @click="click($event)"
      :class="uiElement.class"
      :style="uiElement.style"
    ></div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import * as obj from "object-path";
import * as moment from "moment";

import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  computed: {
    value() {
      let text = null;

      // fixed text
      if (this.uiElement.text) {
        // set value
        text = this.uiElement.text;
        // check if lang option exists
        if (
          this.uiElement.lang &&
          this.config.get("locale") &&
          this.uiElement.lang[this.config.get("locale")]
        ) {
          text = this.uiElement.lang[this.config.get("locale")];
        }
      }

      // key exists
      else if (this.data && this.uiElement.key) {
        // set value
        text = obj.get(this.data, this.uiElement.key);
      }

      // if null then assign default
      if (!text || typeof text == "undefined") {
        if (this.uiElement.default) {
          text = this.uiElement.default;
          try {
            text = eval(this.uiElement.default);
          } catch (ex) {
            console.error(ex);
          }
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
    },
  },
});
</script>
