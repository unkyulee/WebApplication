<template>
    <v-app-bar density="compact" :color="toolbar.color">
        <!-- App Bar Icon -->
        <template v-slot:prepend>
            <v-app-bar-nav-icon v-if="showMenu" @click.stop="toggleDrawer()"></v-app-bar-nav-icon>
        </template>

        <!-- Title -->
        <v-app-bar-title>{{ title }}</v-app-bar-title>

        <!-- Action Items -->

        <!-- Overflow menu -->
        
    </v-app-bar>
</template>
  
<script lang='ts'>
// @ts-nocheck
import { defineComponent } from 'vue';
import NavigationBase from "../NavigationBase"

export default defineComponent({
    extends: NavigationBase,

    data: function () {
        return {
            showMenu: true,
            toolbar: {
                color: null,
                dark: true,
                user: true
            },
        };
    },

    mounted: function () {
        // load toolbar theme
        this.title = this.config.get("name", "");
        this.toolbar.dark = this.config.get("theme.toolbar.dark", true);
        this.toolbar.color = this.config.get("theme.toolbar.background");

        // subscribe to toolbar-update event
        this.event.subscribe("Toolbar", "toolbar-update", (event) => {
            // load toolbar theme
            this.title = obj.get(event, 'title', this.title);
            this.toolbar.dark = obj.get(event, 'toolbar.dark', this.toolbar.dark);
            this.toolbar.color = obj.get(event, 'toolbar.color', this.toolbar.color);
            this.toolbar.user = obj.get(event, 'toolbar.user', false);
            if (event.showMenu != 'undefined') this.showMenu = event.showMenu;
        });
    },
    destroyed: function () {
        this.event.unsubscribe_all("Toolbar");
    },
    methods: {
        toggleDrawer() {
            this.event.send({ name: "toggle-drawer" });
        },
    },
})
</script>
  