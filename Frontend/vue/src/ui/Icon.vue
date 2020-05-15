<template>
  <i :class="uiElement.class" :style="uiElement.style" @click="click($event)"></i>
</template>

<script>
import Vue from "vue";
import Base from "./Base";
//
const obj = require("object-path");
const moment = require("moment");

export default {
  extends: Base
};
</script>