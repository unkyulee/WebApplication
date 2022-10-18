<template>
  <ui-element v-if="ready" :data="data" :uiElement="page"></ui-element>
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
  inject: ["config", "event", "rest", "ui", "auth", "nav"],
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
      page: {},
      data: {},
    };
  },
  async mounted() {
    // load initial ui
    let navigation = this.config.get("navigation", []);

    // find matching nav
    let selected = this.nav.find(navigation, this.$route.path);
    if (selected) {
      // download page - page is for the root element
      this.page = await this.ui.page(obj.get(selected, "pages.0"));
      console.log(`loading page - ${obj.get(selected, "pages.0")}`);
      this.ready = true; // start mounting ui
    } else {
      //
      console.error("selected nav not found");
    }

    // listen to navigation-changed event
    this.event.subscribe("Content", "navigation-changed", async (event) => {
      if (obj.get(event, "data.selected")) {
        this.ready = false; // unload ui
        this.data = {}; // reset data
        // download uiElement
        this.page = await this.ui.page(obj.get(event, "data.selected.pages.0"));
        console.log(
          `loading page - ${obj.get(event, "data.selected.pages.0")}`
        );
        this.ready = true; // start mounting ui
      }
    });
  },

  destroyed: function () {
    this.event.unsubscribe_all("Content");
  },
});
</script>
