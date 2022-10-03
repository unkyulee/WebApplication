<template>
  <v-navigation-drawer v-model="drawer">
    <v-list-item>
      <v-list-item-title>
        {{ title }}
      </v-list-item-title>

      <v-list-item-subtitle>
        {{ sub_title }}
      </v-list-item-subtitle>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item v-for="(nav, index) in navigations" :key="index" link :to="nav.url" :prepend-icon="nav.icon"
        :title="nav.name">
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang='ts'>
// @ts-nocheck
import { defineComponent } from 'vue';
import NavigationBase from "../NavigationBase"

export default defineComponent({
  extends: NavigationBase,

  data: function () {
    return {
      drawer: true,
      selected: [],
    };
  },

  mounted: async function () {
    // subscribe to data-change event
    this.event.subscribe("NavigationDrawer", "toggle-drawer", (event) => {
      this.drawer = !this.drawer;
    });
  },

  destroyed: function () {
    this.event.unsubscribe_all("NavigationDrawer");
  },
})
</script>
