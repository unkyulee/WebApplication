<template>  
  <v-navigation-drawer app v-model="drawer">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title"> {{ title }} </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item-group v-model="selected" active-class="deep-purple--text text--accent-4">
        <v-list-item v-for="(nav, index) in navigations" :key="index" link :to="nav.url">
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
