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
const obj = require('object-path');
export default {
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
  },
  computed: {
    event: function(sender) {
      return {
        send: function(e) {
          _event.send(e.name, e);
        }
      };
    }
  }
};
</script>