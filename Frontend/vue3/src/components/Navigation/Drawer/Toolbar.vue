<template>
    <v-app-bar app dense flat :dark="toolbar.dark" :color="toolbar.color">
        <!-- -->
        <v-app-bar-nav-icon v-if="showMenu" @click.stop="toggleDrawer()"></v-app-bar-nav-icon>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <User v-if="toolbar.user" :data="data" />
    </v-app-bar>
</template>
  
<script lang='ts'>
// @ts-nocheck

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
                dark: false,
                user: true
            },
        };
    },
    
    mounted: function () {
        // load toolbar theme
        this.title = this.config.get("name", "");
        this.toolbar.dark = this.config.get("theme.toolbar.dark", false);
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
  