<template>
  <keep-alive>
    <v-progress-circular
      v-if="uiElement.progressType == 'circular'"
      :class="uiElement.class"
      :style="uiElement.style"
      :indeterminate="uiElement.indeterminate"
      :color="uiElement.color"
    ></v-progress-circular>
  </keep-alive>
</template>

<script>
import Vue from "vue";
import Base from "./Base";

export default Vue.component("progress-component", {
  extends: Base,
});
</script>