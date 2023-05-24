<template>
  <v-navigation-drawer v-model="drawer" v-if="menu">
    <PanelMenu
      :model="items"
      v-model:expandedKeys="expandedKeys"
      style="width: 100%"
    >
    </PanelMenu>
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
      expandedKeys: {},
    };
  },

  mounted: async function () {
    // subscribe to data-change event
    this.event.subscribe("NavigationDrawer", "toggle-drawer", (event) => {
      this.drawer = !this.drawer;
      if (!this.items) this.items = this.updateMenu();
    });
  },

  unmounted() {
    this.event.unsubscribe_all("NavigationDrawer");
  },

  methods: {
    updateMenu() {
      let _items = [];

      //
      let key = 1;
      for (let nav of this.menu.navigation) {
        if (nav.hidden) continue;

        let menu = {
          key: `_${++key}`,
          label: nav.name,
          icon: nav.icon,
        };

        // un-expand as default
        this.expandedKeys[`_${key}`] = false;

        let sub_key = 1;
        if (nav.children && nav.children.length > 0) {
          menu.items = [];
          for (let child of nav.children) {
            if (child.hidden) continue;

            // expand the parent
            let sub_menu = {
              key: `_${key}_${++sub_key}`,
              label: child.name,
              icon: child.icon,
              to: child.url,
            };
            if (this.menu.selected?.url == child.url) {
              // un-expand as default
              this.expandedKeys[`_${key}`] = true;
            }
            // add sub menu
            menu.items.push(sub_menu);
          }
        } else {
          menu.to = nav.url;
        }

        //
        _items.push(menu);
      }

      return _items;
    },
  },
});
</script>

<style>
.router-link-active-exact {
  font-weight: bold;
}
</style>
