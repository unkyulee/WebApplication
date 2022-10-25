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
  async created() {
    this.event.subscribe("Content", "data", async (event) => {
      if (event.data) {        
        this.data = { ...event.data };
      }
    });

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
  async mounted() {
    // check embed
    if (this.nav.is_embed()) {
      // get ui
      let uiElementId = obj.get(this.$route, "query.ui");
      if (uiElementId) {
        // load the screen
        this.ready = false; // unload ui
        this.data = {}; // reset data
        this.page = await this.ui.get(uiElementId);
        console.log(`loading embed - ${uiElementId}`);
        this.ready = true; // start mounting ui

        return;
      }
    }

    //
    // check if init data is passed on
    if (this.config.get("data")) {
      this.data = this.config.get("data");
    }

    // load initial ui
    let navigation = this.config.get("navigation", []);
    if (navigation.length > 0) {
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
    }
  },

  destroyed: function () {
    this.event.unsubscribe_all("Content");
  },
});
</script>
