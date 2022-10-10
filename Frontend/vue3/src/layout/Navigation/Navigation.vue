<template>
  <div v-if="show_navigation">
    <Toolbar />
    <Drawer :menu="menu" />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from "vue";

import * as obj from "object-path";

// Components
import Toolbar from "./Drawer/Toolbar.vue";
import Drawer from "./Drawer/Drawer.vue";

export default defineComponent({
  inject: ["event", "config", "ui"],
  components: {
    Toolbar,
    Drawer,
  },
  data() {
    return {
      show_navigation: false,
      menu: {
        navigations: [],
        selected: null,
      },
    };
  },
  watch: {
    // react to route changes...
    $route(to, from) {
      //
      this.menu.navigations = this.config
        .get("nav", [])
        .filter((x) => x.type != "hidden");
      // find matching nav
      this.menu.selected = this.config
        .get("nav", [])
        .find((x) => x.url == to.path);
      //
      this.event.send({ name: "navigation-changed", data: this.menu });
    },
  },
});
</script>
