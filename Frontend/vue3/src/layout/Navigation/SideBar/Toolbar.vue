<template>
  <v-app-bar density="compact" :color="background" :style="style" :flat="true">
    <!-- App Bar Icon -->
    <template v-slot:prepend>
      <v-btn v-if="menu.selected?.back" icon @click.stop="back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-app-bar-nav-icon
        v-if="!menu.selected?.back"
        @click.stop="toggleDrawer()"
      ></v-app-bar-nav-icon>
    </template>

    <!-- Title -->
    <v-app-bar-title style="display: flex" class="title">
      <img v-if="logo" :src="logo" style="max-height: 38px" />
      <div v-if="!logo">{{ title }}</div>
    </v-app-bar-title>

    <!-- Action Items -->
    <v-spacer></v-spacer>
    <v-menu v-if="isAuthenticated">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          :style="style_account"
          icon="mdi-account"
          size="x-small"
        ></v-btn>
      </template>
      <v-list>
        <v-list-item :value="1" @click="auth.logout()">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Overflow menu -->
  </v-app-bar>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from "vue";

export default defineComponent({
  inject: ["event", "config", "ui", "auth"],

  props: ["menu"],

  data: function () {
    return {
      title: "",
      background: null,
      style: null,
      style_account: null,
      logo: null,
      isAuthenticated: false,
    };
  },

  async mounted() {
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

    this.style_account = {
      color: this.config.get("color.accent_font", ""),
      background: this.config.get("color.accent", ""),
    };

    // user icon
    this.isAuthenticated = await this.auth.isAuthenticated();
  },

  unmounted() {
    this.event.unsubscribe_all("Toolbar");
  },

  methods: {
    toggleDrawer() {
      this.event.send({ name: "toggle-drawer" });
    },
    back() {
      console.log(this.menu.selected);
      this.$router.push(this.menu.selected.back);
    },
  },
});
</script>

<style>
.title {
  font-weight: bold;
}
</style>
