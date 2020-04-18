<template>
  <md-app>
    <md-app-toolbar :style="toolbarStyle">
      <Toolbar :data="data" />
    </md-app-toolbar>
    <md-app-drawer :md-active.sync="showDrawer">
      <Navigation :data="data" />
    </md-app-drawer>
    <md-app-content :style="style">
      <div :class="uiElement.layoutClass" :style="uiElement.layoutStyle">
        <UiElement
          v-for="(ui, index) in uiElement.screens"
          :key="index"
          :uiElement="ui"
          :data="data"
        />
      </div>
      <Dialog />
      <Splash />
    </md-app-content>
  </md-app>
</template>

<script>
import Toolbar from "./Toolbar";
import Navigation from "./Navigation";
import UiElement from "../ui/UiElement";
import Splash from "./Splash.vue";
import Dialog from "./Dialog.vue";

//
const obj = require("object-path");
const moment = require("moment");

export default {
  components: {
    Toolbar,
    Navigation,
    UiElement,
    Splash,
    Dialog
  },
  inject: ["config", "rest", "event", "ui", "auth"],
  data: function() {
    return {
      showDrawer: false,
      style: {},
      toolbarStyle: {},
      uiElement: {},
      data: {},
      dialog: {}
    };
  },
  mounted: async function() {
    // background color
    this.$set(this.style, "background", this.config.get("config.background"));

    // toolbar
    this.toolbarStyle = this.config.get("config.toolbar");

    // subscribe to data-change event
    this.event.subscribe("composer", "data", event => {
      this.data = Object.assign({}, this.data, event.data);
    });

    // subscribe to data-change event
    this.event.subscribe("composer", "drawer", event => {
      this.showDrawer = event.data;
    });

    // load client
    this.auth.isAuthenticated();
    this.data.client = this.auth.client;

    // load the first navigation
    if (
      this.$route.path == "/" &&
      this.config.get("navigations", []).length > 0
    ) {
      this.$router.push(this.config.get("navigations.0.url"));
    }
    // other-wise load the selected navigation
    else {
      await this.load(this.$route.path);
    }
  },
  destroyed: function() {
    this.event.unsubscribe_all("composer");
  },
  watch: {
    // react to route changes...
    async $route(to, from) {
      await this.load(to.path);
    }
  },
  methods: {
    load: async function(url) {
      // find matching nav
      let nav = this.config.get("navigations", []).find(x => x.url == url);

      // when navigation changes load the ui element
      if (nav) {
        // check if the nav requires login
        if (nav.login) {
          // check if login
          if (!this.auth.isAuthenticated()) {
            // go to login screen
            this.$router.push({ path: "login", query: { next: url } });
            return;
          }
        }
        // load the screen
        this.event.send({ name: "splash-show" });
        this.uiElement = {};
        this.uiElement = await this.ui.get(obj.get(nav, "uiElementIds.0"));
        this.uiElement = this.filterUiElement(this.uiElement, this.data);
        this.event.send({ name: "splash-hide" });
      }
    },
    filterUiElement(uiElement, data) {
      if (uiElement.filterUiElement) {
        try {
          eval(uiElement.filterUiElement);
        } catch (ex) {
          console.error(ex);
        }
      }
      return uiElement;
    },
    filterData(uiElement, data) {
      if (uiElement.filterData) {
        try {
          eval(uiElement.filterData);
        } catch (ex) {
          console.error(ex);
        }
      }
      return data;
    }
  }
};
</script>

<style>
.md-app {
  height: 100%;
}

.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}

.md-app-toolbar {
  position: sticky;
}

.md-content {
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: column;
  height: 100%;
}
</style>