<template>
  <v-navigation-drawer v-model="drawer" v-if="menu">
    <v-list dense nav>
      <v-list-item v-for="(nav, index) in menu.navigations" :key="index" link :to="nav.url" :prepend-icon="nav.icon"
        :title="nav.name">
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang='ts'>
// @ts-nocheck
import { defineComponent } from 'vue';

export default defineComponent({
  inject: ['event', 'config', 'ui'],

  props: ["menu"],

  data: function () {
    return {
      drawer: false      
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
