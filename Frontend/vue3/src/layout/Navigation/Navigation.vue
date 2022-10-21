<template>
  <div v-if="menu.navigation.length > 0">
    <Toolbar />
    <Drawer :menu="menu" />
  </div>
</template>

<script lang="ts">
// @ts-nocheck

// Components
import Toolbar from "./Drawer/Toolbar.vue";
import Drawer from "./Drawer/Drawer.vue";

import { defineComponent } from "vue";
export default defineComponent({
  inject: ["event", "config", "ui", "nav"],
  components: {
    Toolbar,
    Drawer,
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
      } else {
        // find matching nav
        this.menu.selected = this.nav.find(
          this.config.get("navigation", []),
          this.$route.path
        );
        //
      }

      //
      this.event.send({ name: "navigation-changed", data: this.menu });
      //
    },
  },
});
</script>
