<template>
  <v-app-bar app dense flat :dark="toolbar.dark" :color="toolbar.color" >
    <!-- -->
    <v-app-bar-nav-icon @click.stop="toggleDrawer()"></v-app-bar-nav-icon>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
import Base from "../ui/Base";
//
const obj = require("object-path");
const moment = require("moment");

export default {
  extends: Base,
  data: function () {
    return {
      title: "",
      toolbar: {
        color: null,
        dark: false
      }
    };
  },
  mounted: function () {
    // load toolbar theme
    this.title = this.config.get("name", "");
    this.toolbar.dark = this.config.get("theme.toolbar.dark", false);
    this.toolbar.color = this.config.get("theme.toolbar.background");
  },
  methods: {
    toggleDrawer() {
      this.event.send({ name: "toggle-drawer" });
    }
  }
};
</script>