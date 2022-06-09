<template>
  <v-badge
    v-if="condition(uiElement)"
    :style="uiElement.style"
    :class="uiElement.class"
    :content="uiElement.badge ? uiElement.badge : null"
    :value="uiElement.badge ? uiElement.badge : null"
    :overlap="uiElement.overlap"
    :left="uiElement.left"
    :bottom="uiElement.bottom"
    :dot="uiElement.dot"
    :icon="uiElement.badgeIcon"
    :color="uiElement.color"
  >
    <v-btn
      :style="uiElement.buttonStyle"
      :class="uiElement.buttonClass"
      :color="uiElement.color"
      :depressed="uiElement.depressed"
      :rounded="uiElement.rounded"
      :plain="uiElement.plain"
      :fab="uiElement.fab"
      :dark="uiElement.dark"
      :small="uiElement.small"
      :text="uiElement.text"
      :icon="uiElement.buttonType == 'icon'"
      @click="click($event, uiElement, data)"
    >
      <v-icon v-if="uiElement.icon" :dark="uiElement.dark">{{
        uiElement.icon
      }}</v-icon>
      {{ label() }}
    </v-btn>
  </v-badge>
</template>

<script>
import Vue from "vue";
import Base from "./Base";
const obj = require("object-path");
const moment = require("moment");

export default Vue.component("button-component", {
  extends: Base,
  methods: {
    label: function () {
      let text = null;

      // fixed text
      if (this.uiElement.label) {
        // set value
        text = this.uiElement.label;
        // check if lang option exists
        if(
          this.uiElement.lang && 
          this.config.get("locale") &&
          this.uiElement.lang[this.config.get("locale")]
        ) {
          text = this.uiElement.lang[this.config.get("locale")]
        }
      }

      return text;
    },
  },
});
</script>