<template>
  <v-app-bar density="compact" :color="background" :style="style" :flat="true">
    <!-- App Bar Icon -->
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click.stop="toggleDrawer()"></v-app-bar-nav-icon>
    </template>

    <!-- Title -->
    <v-app-bar-title>
      <v-img v-if="logo" :src="logo" :max-height="50" :max-width="120"> </v-img>
      <div v-if="!logo">{{ title }}</div>
    </v-app-bar-title>

    <!-- Action Items -->

    <!-- Overflow menu -->
  </v-app-bar>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from "vue";

export default defineComponent({
  inject: ["event", "config", "ui"],

  data: function () {
    return {
      title: "",
      background: null,
      style: null,
      logo: null,
    };
  },

  mounted: function () {
    // load toolbar theme
    this.title = this.config.get("title", "");
    this.background = this.config.get("color.primary");

    // load toolbar logo
    if (this.config.get("logo.toolbar.0.url")) {
      this.logo = `${this.config.get("host")}${this.config.get(
        "logo.toolbar.0.url"
      )}&company_id=${this.config.get("_id")}`;
    }

    this.style = {
      color: this.config.get("color.font", ""),
    };
  },

  methods: {
    toggleDrawer() {
      this.event.send({ name: "toggle-drawer" });
    },
  },
});
</script>
