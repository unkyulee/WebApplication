<template>
  <Sidebar
    v-model:visible="showSheet"
    :position="safeGet(uiElement, 'position', 'bottom')"
    :dismissable="safeGet(uiElement, 'dismissable', true)"
    :showCloseIcon="safeGet(uiElement, 'showCloseIcon', true)"
    :class="uiElement.layoutClass"
    :style="uiElement.layoutStyle"
  >
    <ui-element
      v-for="(ui, index) in uiElement.screens"
      :uiElement="ui"
      :data="data"
      :class="ui.layoutClass"
      :style="ui.layoutStyle"
    />
  </Sidebar>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "../../ui/Base";
import { defineComponent } from "vue";
export default defineComponent({
  inject: ["config", "event", "rest", "ui", "auth"],
  data: function () {
    return {
      showSheet: false,
      uiElement: {},
      data: {},
      option: {},
    };
  },
  mounted: async function () {
    this.event.subscribe("actionsheet", "open-sheet", async (event) => {
      // reset screen
      this.uiElement = {};

      // download the uiElement
      this.uiElement = await this.ui.get(event.uiElementId);
      this.data = event.data;

      // open sheet
      this.showSheet = true;
    });

    this.event.subscribe("actionsheet", "close-sheet", (event) => {
      this.showSheet = false;
    });
  },
  destroyed: function () {
    this.event.unsubscribe_all("actionsheet");
  },
  methods: {
    ...Base.methods,
  },
});
</script>
