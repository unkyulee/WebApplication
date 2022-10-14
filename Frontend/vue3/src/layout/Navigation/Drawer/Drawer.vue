<template>
  <v-navigation-drawer v-model="drawer" v-if="menu">
    <PanelMenu :model="items" style="width: 100%" />
  </v-navigation-drawer>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from "vue";

export default defineComponent({
  inject: ["event", "config", "ui"],

  props: ["menu"],

  data: function () {
    return {
      drawer: false,
      items: null,
    };
  },

  mounted: async function () {
    // subscribe to data-change event
    this.event.subscribe("NavigationDrawer", "toggle-drawer", (event) => {
      this.drawer = !this.drawer;
      if (!this.items) this.items = this.updateMenu();
    });
  },

  destroyed: function () {
    this.event.unsubscribe_all("NavigationDrawer");
  },

  methods: {
    updateMenu() {
      let _items = [];

      for (let nav of this.menu.navigation) {
        if (nav.hidden) continue;

        let menu = {
          label: nav.name,
          icon: nav.icon,
        };
        if (nav.children && nav.children.length > 0) {
          menu.items = this.children(nav);
        } else {
          menu.to = nav.url;
        }

        _items.push(menu);
      }

      return _items;
    },
    children(parent) {
      let _items = [];
      if (parent && parent.children && parent.children.length > 0) {
        for (let child of parent.children) {
          _items.push({
            label: child.name,
            icon: child.icon,
            to: child.url,
          });
        }
      }
      return _items;
    },
  },
});
</script>
