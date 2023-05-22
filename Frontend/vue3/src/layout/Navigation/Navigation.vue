<template>
  <Toolbar :menu="menu" />
  <div v-if="menu.navigation.length > 0">
    <Drawer v-if="!config.get('nav_type')" :menu="menu" />
    <Bottom v-if="config.get('nav_type') == 'bottom'" :menu="menu" />
  </div>
</template>

<script lang="ts">
// @ts-nocheck

// Components
import Toolbar from "./Toolbar.vue";
import Drawer from "./SideBar/Drawer.vue";
import Bottom from "./Bottom/Bottom.vue";

import { defineComponent } from "vue";
export default defineComponent({
  inject: ["event", "config", "ui", "nav", "auth"],
  components: {
    Toolbar,
    Drawer,
    Bottom,
  },
  data() {
    return {
      menu: {
        navigation: [],
        selected: null,
      },
    };
  },
  created() {
    //
    this.menu.navigation = this.config
      .get("navigation", [])
      .filter((x) => x.type != "hidden");
    // find matching nav
    this.menu.selected = this.nav.find(
      this.config.get("navigation", []),
      this.$route.path
    );
  },
  watch: {
    // react to route changes...
    $route(to, from) {
      //
      this.menu.navigation = this.config.get("navigation", []);

      // make an exception for login screen
      if (to.path == "/login") {
        //
        this.menu.selected = { name: "Login", pages: ["login"], url: "/login" };
        //
        this.event.send({ name: "navigation-changed", data: this.menu });
        //
      } else {
        // find matching nav
        let found = this.nav.find(
          this.config.get("navigation", []),
          this.$route.path
        );
        if (found) {
          this.menu.selected = found;

          //
          this.event.send({ name: "navigation-changed", data: this.menu });
        }
        //
      }
      //
    },
  },
});
</script>
