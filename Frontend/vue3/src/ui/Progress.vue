<template>
  <div :class="uiElement.layoutClass" :style="uiElement.layoutStyle">
    <v-progress-circular
      v-if="uiElement.progressType == 'circular'"
      :class="uiElement.class"
      :style="uiElement.style"
      :indeterminate="uiElement.indeterminate"
      :color="uiElement.color"
    ></v-progress-circular>

    <v-progress-linear
      v-if="uiElement.progressType == 'linear'"
      :class="uiElement.class"
      :style="uiElement.style"
      :indeterminate="uiElement.indeterminate"
      :color="uiElement.color"
    ></v-progress-linear>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  inheritAttrs: false,
  extends: Base,
});
</script>
