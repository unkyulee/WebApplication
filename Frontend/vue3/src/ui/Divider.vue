<template>
  <div :class="uiElement.layoutClass" :style="uiElement.layoutStyle">
    <v-divider :class="uiElement.class" :style="uiElement.style"></v-divider>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import * as obj from "object-path";
import * as moment from "moment";

import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
});
</script>
