<template>
  <ui-element v-if="ready" :data="data" :uiElement="page"></ui-element>
  <DialogOverlay />
  <Splash />
  <ActionSheet />
  <Timer :data="data" />
  <ConfirmDialog></ConfirmDialog>
</template>

<script lang="ts">
// @ts-nocheck
import * as obj from "object-path";

// ui imports
import UiElement from "../ui/UiElement.vue";
import DialogOverlay from "./Overlay/Dialog.vue";
import Splash from "./Overlay/Splash.vue";
import ActionSheet from "./Overlay/ActionSheet.vue";
import Timer from "./Overlay/Timer.vue";

import { defineComponent } from "vue";
export default defineComponent({
  inject: ["config", "event", "rest", "ui", "auth"],
  components: {
    UiElement,
    DialogOverlay,
    Splash,
    ActionSheet,
    Timer,
  },
  data() {
    return {
      ready: false,
      page: {},
      data: {},
    };
  },
  async created() {
    this.event.subscribe("Content", "data", async (event) => {
      if (event.data) {
        this.data = { ...event.data };
      }
    });
  },
  async mounted() {
    // download page - page is for the root element
    let uiElementId = this.config.get("uiElementIds.0");
    if (uiElementId) {
      this.page = await this.ui.get(uiElementId);
      this.ready = true; // start mounting ui
    }
  },

  unmounted() {
    this.event.unsubscribe_all("Content");
  },
});
</script>
