<template>
  <v-app id="scrollable">
    <Navigation />
    <Toolbar />

    <!-- Sizes your content based upon application components -->
    <v-main :style="style">
      <UiElement :uiElement="uiElement" :data="data" />
      <Dialog />
      <Splash />
      <ActionSheet />
      <Snackbar />
    </v-main>
  </v-app>
</template>

<script>
import Vue from "vue";
//
const obj = require("object-path");
const moment = require("moment");

// services
import event from "./services/event.service";
import rest from "./services/rest.service";
import config from "./services/config.service";
import ui from "./services/ui.service";
import auth from "./services/auth.service";

// layout
import Navigation from "./layout/Navigation";
import Toolbar from "./layout/Toolbar";
import UiElement from "./ui/UiElement";
import Dialog from "./ui/Dialog";
import Splash from "./layout/Splash";
import ActionSheet from "./ui/ActionSheet";
import Snackbar from "./ui/Snackbar";

export default {
  components: {
    Toolbar,
    Navigation,
    Splash,
    UiElement,
    Dialog,
    ActionSheet,
    Snackbar
  },
  provide: function () {
    return {
      event,
      rest,
      config,
      ui,
      auth,
    };
  },
  data: function () {
    return {
      data: {},
      uiElement: {},
      style: {
        display: "flex",
        flexFlow: "column",
      },
    };
  },
  mounted: async function () {
    // init moment locale
    if (config.get("locale")) moment.locale(config.get("locale"));

    // set background
    this.style.background = config.get("theme.desktop.background");

    // load first navigation
    this.init();
  },
  destroyed: function () {
    event.unsubscribe_all("App");
  },
  watch: {
    // react to route changes...
    async $route(to, from) {
      await this.load(to.path);

      let container = document.getElementById("scrollable");
      let event = new CustomEvent("scroll", {});
      container.pageYOffset = 0;
      setTimeout(() => {
        container.scrollTop = 0;
      }, 200);
      container.dispatchEvent(event);
    },
  },
  methods: {
    init: async function () {
      // load the first navigation
      if (this.$route.path == "/" && config.get("nav", []).length > 0) {
        this.$router.push(config.get("nav.0.url"));
      }
      // other-wise load the selected navigation
      else {
        await this.load(this.$route.path);
      }
    },
    load: async function (url) {
      // find matching nav
      let nav = config.get("nav", []).find((x) => x.url == url);
      // when navigation changes load the ui element
      if (nav) {
        event.send({ name: "splash-show" });

        // load the screen
        this.uiElement = {}; // reset the screen before loading
        this.uiElement = await ui.get(obj.get(nav, "uiElementIds.0"));

        //
        event.send({ name: "splash-hide" });
      }
    },
  },
};
</script>

<style scoped>
/deep/ .v-main__wrap {
  display: flex;
  flex-flow: column;
}

/deep/ p {
  margin-bottom: 0 !important;
}
</style>