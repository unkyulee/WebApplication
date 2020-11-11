<template>
  <v-navigation-drawer app v-model="drawer">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title"> {{ title }} </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item-group
        v-model="selected"
        active-class="deep-purple--text text--accent-4"
      >
        <v-list-item
          v-for="(nav, index) in navigations"
          :key="index"
          link
          :to="nav.url"
        >
          <v-list-item-icon>
            <v-icon>{{ nav.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ nav.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
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
      drawer: false,
      title: "",
      navigations: [],
      selected: [],
    };
  },
  mounted: async function () {
    // subscribe to data-change event
    this.event.subscribe("Navigation", "toggle-drawer", (event) => {
      this.drawer = !this.drawer;
    });

    // load title
    this.title = this.config.get("name", "");
    this.navigations = this.config
      .get("nav", [])
      .filter((x) => x.type != "hidden");
  },
  destroyed: function () {
    this.event.unsubscribe_all("Navigation");
  },
  watch: {
    selected(value) {
      // do not close the drawer when window is big
      if (this.$vuetify.breakpoint.name in { lg: 1, xl: 1 }) return;
      setTimeout(() => {
        this.drawer = false;
      }, 300);
    },
  },
};
</script>
