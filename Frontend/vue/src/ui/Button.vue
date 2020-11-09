<template>
  <v-badge content="" value="" color="green" overlap>
    <v-btn
      :style="uiElement.style"
      :class="uiElement.class"
      :color="uiElement.color"
      :depressed="uiElement.depressed"
      :icon="uiElement.buttonType == 'icon'"
      @click="click($event, uiElement, data)"
      >
      <v-icon v-if="uiElement.icon">{{uiElement.icon}}</v-icon>
      {{ uiElement.label }}
    </v-btn>
  </v-badge>
</template>

<script>
import Vue from "vue";
import Base from "./Base";
const obj = require("object-path");
const moment = require("moment");

export default Vue.component("button-component", {
  extends: Base,
});
</script>