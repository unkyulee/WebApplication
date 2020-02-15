<template>
  <md-button
    class="md-raised"
    v-if="condition(uiElement)"
    v-bind:class="uiElement.class"
    v-bind:style="uiElement.style"
    @click="click($event)"
  >{{uiElement.label}}</md-button>
</template>

<script>
import Base from "./Base";
//const obj = require('object-path');

export default {
  extends: Base,
  props: ["uiElement", "data"],
  inject: ["config", "event"],
  methods: {
    condition: function(uiElement) {
      let passed = true;
      if (uiElement.condition) {
        passed = eval(uiElement.condition);
      }
      return passed;
    },
    click: async function(event, item, script) {
      let clickScript = script ? script : this.uiElement.click;
      if (clickScript) {
        try {
          await eval(clickScript);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
};
</script>