<template>
  <v-icon
    v-if="icon && condition(uiElement)"
    :large="uiElement.large"
    :small="uiElement.small"
    :class="uiElement.class"
    :style="uiElement.style"
    :icon="icon"
    @click="click($event)"
  />
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  data() {
    return {
      icon: null,
    };
  },
  async created() {
    const { [this.uiElement.icon]: icon } = await import("@mdi/js");
    this.icon = icon;
  },
});
</script>
