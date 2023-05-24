<template>
  <div class="bottom_nav">
    <v-tabs stacked>
      <v-tab v-for="item of items" @click="click(item)">
        <v-icon>{{ item.icon }}</v-icon>
        <span v-if="item.name">{{ item.label }}</span>
      </v-tab>
    </v-tabs>
  </div>
</template>

<style scoped>
.bottom_nav {
  background: white;
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
}
</style>

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
    this.items = this.updateMenu();
  },

  methods: {
    click(item) {
      this.$router.push(item.to);
    },
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
