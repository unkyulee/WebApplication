<template>
  <v-progress-circular
    v-if="condition(uiElement) && uiElement.progressType == 'circular'"
    :class="uiElement.class"
    :style="uiElement.style"
    :indeterminate="uiElement.indeterminate"
    :color="uiElement.color"
  ></v-progress-circular>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
});
</script>
