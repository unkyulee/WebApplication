<template>
  <iframe
    :src="safeEval(uiElement.src)"
    :style="uiElement.style"
    :class="uiElement.class"
  ></iframe>
</template>

<script>
import Vue from "vue";
import Base from "./Base";
const obj = require("object-path");
const moment = require("moment");

export default Vue.component("iframe-view", {
  extends: Base,
});
</script>