<template>
  <v-icon
    v-if="condition(uiElement)"
    :large="uiElement.large"
    :small="uiElement.small"
    :class="uiElement.class"
    :style="uiElement.style"
    @click="click($event)"
  >
    {{ uiElement.icon }}
  </v-icon>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
});
</script>
