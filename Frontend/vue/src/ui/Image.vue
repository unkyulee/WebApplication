<template>
  <img
    :class="uiElement.class"
    :style="uiElement.style"
    :src="safeEval(uiElement.src)"
    @click="click($event)"
  />
</template>

<script>
import Vue from "vue";
import Base from "./Base";
const obj = require("object-path");
const moment = require("moment");

export default Vue.component("image-loader", {
  extends: Base,
});
</script>