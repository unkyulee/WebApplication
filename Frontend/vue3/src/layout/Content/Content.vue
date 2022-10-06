<template>
  <ui-element v-if="ready" :data="data" :uiElement="uiElement"></ui-element>
  <DialogOverlay />
  <Splash />
  <ActionSheet />
  <Snackbar />
  <Timer :data="data" />
</template>

<script lang="ts">
// @ts-nocheck
import * as obj from "object-path";

// ui imports
import UiElement from "./UiElement.vue";
import DialogOverlay from "../../ui/Dialog.vue";
import Splash from "../../ui/Splash.vue";
import ActionSheet from "../../ui/ActionSheet.vue";
import Snackbar from "../../ui/Snackbar.vue";
import Timer from "../../ui/Timer.vue";

import { defineComponent } from "vue";
export default defineComponent({
  inject: ["config", "event", "rest", "ui", "auth"],
  components: {
    UiElement,
    DialogOverlay,
    Splash,
    ActionSheet,
    Snackbar,
    Timer,
  },
  data() {
    return {
      ready: false,
      uiElement: {},
      data: {},
    };
  },
  async mounted() {
    // load initial ui
    let nav;
    if (this.$route.path == "/" && this.config.get("nav", []).length > 0) {
      // load from default navigation
      nav = this.config.get("nav.0");
    } else {
      // find matching nav
      nav = this.config.get("nav", []).find((x) => x.url == this.$route.path);
    }
    if (!nav) {
      console.error("navigation loading failed");
      return;
    }

    // download uiElement
    this.uiElement = await this.ui.get(obj.get(nav, "uiElementIds.0"));
    console.log(`loading ui - ${obj.get(this.uiElement, "_id")}`);
    this.ready = true; // start mounting ui

    // listen to navigation-changed event
    this.event.subscribe("Content", "navigation-changed", async (event) => {
      if (obj.get(event, "data.selected")) {
        this.ready = false; // unload ui
        this.data = {}; // reset data
        // download uiElement
        this.uiElement = await this.ui.get(
          obj.get(event, "data.selected.uiElementIds.0")
        );
        console.log(`loading ui - ${obj.get(this.uiElement, "_id")}`);
        this.ready = true; // start mounting ui
      }
    });
  },

  destroyed: function () {
    this.event.unsubscribe_all("Content");
  },
});
</script>
