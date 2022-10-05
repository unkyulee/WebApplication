<template>
  <component
    v-if="ready && condition(uiElement)"
    :is="uiElement.type"
    :data="data"
    :uiElement="uiElement"
    :class="uiElement.layoutClass"
    :style="uiElement.layoutStyle"
  >
  </component>
</template>

<script lang="ts">
// @ts-nocheck

// implict reference
import * as obj from "object-path";
import * as moment from "moment";

//
import Base from "../../ui/Base";
import UiElements from "./UiElements.vue";
import Typography from "../../ui/Typography.vue";
import ImageLoader from "../../ui/Image.vue";

import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  props: ["uiElement", "data"],
  inject: ["config", "event", "rest", "ui", "auth"],
  components: {
    UiElements,
    Typography,
    ImageLoader,
  },
  data: function () {
    return {
      ready: false,
    };
  },
  async mounted() {
    // prepare uielement
    this.ready = false;

    // translate type
    this.ui.translate_type(this.uiElement);

    // compile ui
    await this.ui.compile(this.uiElement);

    // uiElement ready
    this.ready = true;
  },
});
</script>
