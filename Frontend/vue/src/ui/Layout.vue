<template>
  <div
    v-if="condition(uiElement)"
    :class="uiElement.layoutClass"
    :style="uiElement.layoutStyle"
  >
    <UiElement
      v-for="(ui, index) in uiElement.screens"
      :key="index"
      :uiElement="ui"
      :data="data"
    />
  </div>
</template>

<script>
import Vue from "vue";
import Base from "./Base";
const obj = require("object-path");
const moment = require("moment");

export default Vue.component("layout", {
  extends: Base,
});
</script>