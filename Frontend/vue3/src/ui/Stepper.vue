<template>
  <Steps :model="steps" :readonly="uiElement.readonly ?? false"> </Steps>
  <ui-element
    v-if="currStep"
    :is="currStep.type"
    :data="data"
    :uiElement="currStep"
    :style="currStep.layoutStyle"
    :class="currStep.layoutClass"
  >
  </ui-element>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  inheritAttrs: false,
  data() {
    return {
      currStep: null,
    };
  },
  mounted() {
    // select the first step
    let first = (this.uiElement.steps ?? [])[0];
    if (first && first.to != this.$route.fullPath) {
      this.$router.push(first.to);
    }
  },
  computed: {
    steps() {
      return this.uiElement.steps ?? [];
    },
  },
  watch: {
    // react to route changes...
    async $route(to, from) {
      // find matching nav
      let selected = (this.uiElement.steps ?? []).find((x) => x.to == to.path);
      if (selected) {
        if ((this.currStep ?? {})._id != selected.uiElementId) {
          // load uiElement
          this.currStep = null;
          let uiElement = await this.ui.get(selected.uiElementId);
          this.currStep = uiElement;
        }
      }
      //
    },
  },
});
</script>
