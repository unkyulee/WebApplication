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

<script>
import Vue from "vue";
import Base from "./Base";
const obj = require("object-path");
const moment = require("moment");

export default Vue.component("icon", {
  extends: Base,
});
</script>