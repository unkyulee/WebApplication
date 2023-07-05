<template></template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  data() {
    return {
      menu: null,
    };
  },

  methods: {
    toggle(event) {
      //this.menu.value.toggle(event);
    },
  },
});
</script>
