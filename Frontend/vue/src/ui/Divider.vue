<template>
  <md-divider :class="uiElement.class" :style="uiElement.style" />
</template>

<script>
import Vue from "vue";
import { MdDivider } from "vue-material/dist/components";

import Base from "./Base";

Vue.use(MdDivider);

export default {
  extends: Base
};
</script>