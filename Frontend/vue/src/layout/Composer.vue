<template>
  <md-app>
    <md-app-toolbar>
      <Toolbar />
    </md-app-toolbar>
    <md-app-drawer :md-active.sync="showDrawer">
      <Navigation />
    </md-app-drawer>
    <md-app-content v-bind:class="uiElement.layoutClass" v-bind:style="uiElement.layoutStyle">
      <UiElement
        v-for="(ui, index) in uiElement.screens"
        v-bind:key="index"
        v-bind:uiElement="ui"
        v-bind:data="data"
      />
    </md-app-content>
    <Splash />
  </md-app>
</template>

<script>
import Toolbar from "./Toolbar";
import Navigation from "./Navigation";
import UiElement from "../ui/UiElement";
import Splash from "./Splash.vue";

//
const obj = require("object-path");
const moment = require("moment");

export default {
  components: {
    Toolbar,
    Navigation,
    UiElement,
    Splash
  },
  inject: ["config", "rest", "event", "ui"],
  data: function() {
    return {
      showDrawer: false,
      style: {},
      uiElement: {},
      data: {}
    };
  },
  mounted: async function() {
    // subscribe to data-change event
    this.event.subscribe("composer", "data", event => {
      this.data = Object.assign({}, this.data, event.data);
    });

    // subscribe to data-change event
    this.event.subscribe("composer", "drawer", event => {
      this.showDrawer = event.data;
    });

    // load the first navigation
    if (
      this.$route.path == "/" &&
      this.config.get("navigations", []).length > 0
    ) {
      this.$router.push(this.config.get("navigations.0.url"));
    }
    // other-wise load the selected navigation
    else {
      await this.load(this.$route.path)
    }
  },
  destroyed: function() {
    this.event.unsubscribe_all("composer");
  },
  watch: {
    // react to route changes...
    async $route(to, from) {
      await this.load(to.url);
    }
  },
  methods: {
    load: async function(url) {
      // find matching nav
      let nav = this.config.get("navigations", []).find(x => x.url == url);
      // when navigation changes load the ui element
      if (nav) {
        this.event.send({name: 'splash-show'});
        this.uiElement = await this.ui.get(
          obj.get(nav, "uiElementIds.0")
        );
        this.event.send({name: 'splash-hide'});
      }
    }
  }
};
</script>

<style scoped>
.md-app {
  height: 100%;
}

.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}
</style>