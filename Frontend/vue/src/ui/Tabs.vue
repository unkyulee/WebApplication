<template>
  <v-tabs
    v-if="condition(uiElement)"
    :dark="uiElement.dark"
    :background-color="safeGet(uiElement, 'style.backgroundColor')"
    :show-arrows="safeGet(uiElement, 'showArrows', true)"
    :class="uiElement.class"
    :style="uiElement.style"
  >
    <v-tab v-for="(tab, index) in tabs" :key="index" @click="click(tab)">
      <v-icon v-if="tab.icon">{{ tab.icon }}</v-icon>
      {{ tab.name }}
    </v-tab>
  </v-tabs>
</template>

<script>
import Vue from "vue";
import Base from "./Base";
const obj = require("object-path");
const moment = require("moment");

export default Vue.component("tabs", {
  extends: Base,
  methods: {
    click: function (tab) {
      if (this.uiElement.click) {
        eval(this.uiElement.click);
      }
    },
  },
  computed: {
    tabs: {
      get: function () {
        let tabs = [];
        if (this.data && this.uiElement.key) {
          tabs = obj.get(this.data, this.uiElement.key);
        }

        if (typeof this._tabs != "undefined" && !Array.isArray(this._tabs))
          tabs = [tabs];

        return tabs;
      },
      set: function (v) {
        if (this.data && this.uiElement.key) {
          obj.set(this.data, this.uiElement.key, v);
        }
      },
    },
  },
});
</script>