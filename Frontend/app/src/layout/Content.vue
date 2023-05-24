<template>
  <ui-element v-if="ready" :data="data" :uiElement="page"></ui-element>
  <div
    v-if="config.get('nav_type') == 'bottom'"
    style="margin-bottom: 72px"
  ></div>
  <DialogOverlay />
  <Splash />
  <ActionSheet />
  <Toast />
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
  inject: ["config", "event", "rest", "ui", "auth", "nav"],
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

    // listen to navigation-changed event
    this.event.subscribe("Content", "navigation-changed", async (event) => {
      if (obj.get(event, "data.selected")) {
        this.ready = false; // unload ui
        this.data = {}; // reset data

        let selected = obj.get(event, "data.selected");
        console.log(selected);
        if (selected.login_ask && !this.auth.user().uid) {
          // ask login
          this.auth.login();
          return;
        }

        // download uiElement
        this.page = await this.ui.page(obj.get(event, "data.selected.pages.0"));
        console.log(
          `loading page - ${obj.get(event, "data.selected.pages.0")}`
        );
        this.ready = true; // start mounting ui
      }
    });

    // subscribe to snackbar
    this.event.subscribe("Content", "snackbar", (event) => {
      let text = event.text;

      // check if lang option exists
      if (
        event.lang &&
        this.config.get("locale") &&
        event.lang[this.config.get("locale")]
      ) {
        text = event.lang[this.config.get("locale")];
      }

      this.$toast.add({
        severity: obj.get(event, "type", "info"),
        summary: obj.get(event, "title", ""),
        detail: text,
        life: obj.get(event, "timeout", 3000),
      });
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
        if (selected.login_ask && !this.auth.user().uid) {
          // ask login
          this.auth.login();
          return;
        }

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

  unmounted() {
    this.event.unsubscribe_all("Content");
  },
});
</script>
