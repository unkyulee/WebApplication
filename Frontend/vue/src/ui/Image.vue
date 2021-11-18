<template>
  <v-img
    v-if="condition(uiElement)"
    :class="uiElement.class"
    :style="uiElement.style"
    :height="uiElement.height"
    :max-height="uiElement.maxHeight"
    :width="uiElement.width"
    :max-width="uiElement.maxWidth"
    :contain="uiElement.contain"
    :src="safeEval(uiElement.src)"
    lazy-src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
    @click="click($event)"
  >
    <template v-slot:placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular indeterminate color="error"></v-progress-circular>
      </v-row> </template
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