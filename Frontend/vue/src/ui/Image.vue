<template>
  <v-img
    :class="uiElement.class"
    :style="uiElement.style"
    :height="uiElement.height"
    :max-height="uiElement.maxHeight"    
    :width="uiElement.width"
    :max-width="uiElement.maxWidth"
    :contain="uiElement.contain"
    :src="safeEval(uiElement.src)"    
    @click="click($event)"    
  ></v-img>
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