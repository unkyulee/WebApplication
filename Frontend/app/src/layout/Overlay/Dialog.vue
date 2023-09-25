<template>
  <v-dialog
    v-if="d"
    v-model="showDialog"
    :fullscreen="uiElement.fullscreen ?? false"
    :persistent="uiElement.persistent ?? false"
    :width="option.width"
    :max-width="option.maxWidth"
    :height="option.height"
    :max-height="option.maxHeight"
  >
    <ui-element
      :uiElement="uiElement"
      :data="data"
      :style="uiElement.layoutStyle"
      :class="uiElement.layoutClass"
    />
  </v-dialog>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from "vue";
export default defineComponent({
  inject: ["config", "event", "rest", "ui", "auth"],
  data: function () {
    return {
      showDialog: false,
      d: false,
      uiElement: {},
      data: {},
      option: {},
    };
  },
  async mounted() {
    this.event.subscribe("dialog", "open-dialog", async (event) => {
      // reset screen
      this.uiElement = {};

      // download the uiElement
      this.uiElement = await this.ui.get(event.uiElementId);
      this.data = event.data ?? {};
      this.option = obj.get(event, "option", {});

      // process init
      if (this.uiElement.init) {
        try {
          await eval(this.uiElement.init);
        } catch (ex) {
          console.error(this.uiElement.init, ex);
        }
      }

      // open dialog
      this.showDialog = true;
      this.d = true;
    });

    this.event.subscribe("dialog", "close-dialog", (event) => {
      this.showDialog = false;
      this.d = false;
      this.data = {};
      this.uiElement = {};
    });

    this.event.subscribe("dialog", "data", async (event) => {
      if (event.data) {
        this.data = { ...this.data };
      }
    });
  },
  unmounted() {
    this.event.unsubscribe_all("dialog");
  },
});
</script>

<style scoped>
:deep() .v-dialog {
  display: flex;
  flex-flow: column;
}
</style>
