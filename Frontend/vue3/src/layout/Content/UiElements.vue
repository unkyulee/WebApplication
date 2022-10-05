<template>
  <div
    v-if="condition(uiElement)"
    :class="uiElement.layoutClass"
    :style="uiElement.layoutStyle"
    :id="uiElement.id"
  >
    <ui-element
      v-for="(ui, index) in uiElement.screens"
      v-if="condition(ui)"
      :key="index"
      :is="ui.type"
      :data="data"
      :uiElement="ui"
      :class="ui.layoutClass"
      :style="ui.layoutStyle"
    >
    </ui-element>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import * as obj from "object-path";
import * as moment from "moment";

//
import Base from "../../ui/Base";

//
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  async created() {
    // translate type
    for (let ui of obj.get(this.uiElement, "screens", [])) {
      // compile ui
      await this.ui.compile(ui);

      // translate type
      this.ui.translate_type(ui);

      if (
        ui.type == "typography" ||
        ui.type == "ui-elements" ||
        ui.type == "image-loader"
      ) {
        continue;
      }
      console.log(ui.type);
    }
  },
});
</script>
