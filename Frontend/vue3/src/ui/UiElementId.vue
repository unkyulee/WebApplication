<template>
  <component
    v-if="ready && condition(uiElement)"
    :is="uiElement.type"
    :data="data"
    :uiElement="uiElement"
    :style="uiElement.layoutStyle"
    :class="uiElement.layoutClass"
  >
  </component>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  props: ["uiElement", "data"],
  inject: ["config", "event", "rest", "ui", "auth"],
  data() {
    return {
      ready: false,
    };
  },
  async created() {
    console.log(this.uiElement);

    // prepare uielement
    this.ready = false;

    await this.ui.compile(this.uiElement);

    // translate type
    this.ui.translate_type(this.uiElement);

    // uiElement ready
    this.ready = true;
  },
});
</script>
