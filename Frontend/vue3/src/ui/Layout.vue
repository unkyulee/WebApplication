<template>
  <div v-if="condition(uiElement)" :class="uiElement.layoutClass" :style="uiElement.layoutStyle" :id="uiElement.id">
    <UiElement v-for="(ui, index) in uiElement.screens" :key="index" :uiElement="ui" :data="data" />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import * as obj from "object-path";
import * as moment from "moment";

import Base from "./Base";
import { defineComponent } from 'vue';
export default defineComponent({
  extends: Base,
  mounted() {
    console.log("layout mounted")
  }
});
</script>