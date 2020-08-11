<template>
  <img
  :class="uiElement.class"
    :style="uiElement.style"
    :src="safeEval(uiElement.src)"
    @click="click($event)"
  />
</template>

<script>
import Base from "./Base";
const obj = require("object-path");
const moment = require("moment");

export default {
  extends: Base
};
</script>