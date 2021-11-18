<template>
  <v-divider v-if="condition(uiElement)" :class="uiElement.class" :style="uiElement.style"></v-divider>
</template>

<script>
import Vue from "vue";
import Base from "./Base";

export default Vue.component("divider", {
  extends: Base,
});
</script>