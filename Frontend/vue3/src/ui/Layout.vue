<template>
  <div
    v-if="ready && condition(uiElement)"
    :class="uiElement.layoutClass"
    :style="uiElement.layoutStyle"
    :id="uiElement.id"
  >
    <ui-element
      v-for="ui in uiElement.screens"
      v-if="condition(ui)"
      :is="ui.type"
      :data="data"
      :uiElement="ui"
      :style="ui.layoutStyle"
      :class="ui.layoutClass"
    >
    </ui-element>
  </div>
</template>

<script lang="ts">
// @ts-nocheck

//
import Base from "./Base";

//
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  data: function () {
    return {
      ready: false,
    };
  },
  async created() {
    this.ready = false;

    // translate type
    for (let ui of obj.get(this.uiElement, "screens", [])) {
      await this.ui.compile(ui);

      // translate type
      this.ui.translate_type(ui);
    }

    this.ready = true;
  },
});
</script>
