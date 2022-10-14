<template>
  <div v-if="show_navigation">
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
  inject: ["event", "config", "ui"],
  components: {
    Toolbar,
    Drawer,
  },
  data() {
    return {
      show_navigation: true,
      menu: {
        navigation: [],
        selected: null,
      },
    };
  },
  mounted() {
    // initialize navigation
    //
    this.menu.navigation = this.config
      .get("navigation", [])
      .filter((x) => x.type != "hidden");
    // find matching nav
    this.menu.selected = this.config
      .get("navigation", [])
      .find((x) => x.url == this.$route.path);
    //
  },
  watch: {
    // react to route changes...
    $route(to, from) {
      //
      this.menu.navigation = this.config
        .get("navigation", [])
        .filter((x) => x.type != "hidden");
      // find matching nav
      this.menu.selected = this.config
        .get("navigation", [])
        .find((x) => x.url == to.path);
      //
      this.event.send({ name: "navigation-changed", data: this.menu });
    },
  },
});
</script>
