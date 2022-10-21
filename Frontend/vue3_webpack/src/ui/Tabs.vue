<template>
  <v-tabs
    v-if="condition(uiElement)"
    :dark="uiElement.dark"
    :background-color="safeGet(uiElement, 'style.backgroundColor')"
    :show-arrows="safeGet(uiElement, 'showArrows', true)"
    :class="uiElement.class"
    :style="uiElement.style"
  >
    <v-tab v-for="tab in tabs" @click="click(tab)">
      <v-icon v-if="tab.icon">{{ tab.icon }}</v-icon>
      {{ tab.name }}
    </v-tab>
  </v-tabs>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
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
