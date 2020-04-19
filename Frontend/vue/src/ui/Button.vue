<template>
  <div>
    <md-badge v-if="uiElement.badge" :md-content="uiElement.badge"></md-badge>
    <md-button
      v-if="condition(uiElement)"
      :class="uiElement.class"
      :style="uiElement.style"
      :disabled="uiElement.disabled?safeEval(uiElement.disabled):false"
      @click="click($event)"
      :id="uiElement.key"
    >
      <md-icon v-if="uiElement.icon" :style="uiElement.iconStyle">{{uiElement.icon}}</md-icon>
      {{uiElement.label}}
    </md-button>
  </div>
</template>

<script>
import Vue from "vue";
import { MdButton } from "vue-material/dist/components";
Vue.use(MdButton);

import Base from "./Base";

//
const obj = require("object-path");
const moment = require("moment");

export default {
  extends: Base
};
</script>