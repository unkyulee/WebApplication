<template>
    <v-app-bar density="compact" color="primary">
        <!-- App Bar Icon -->
        <template v-slot:prepend>
            <v-app-bar-nav-icon @click.stop="toggleDrawer()"></v-app-bar-nav-icon>
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

export default defineComponent({
    inject: ['event', 'config', 'ui'],

    data: function () {
        return {
            title: "",
            background: null,
            color: null,
        };
    },

    mounted: function () {
        // load toolbar theme
        this.title = this.config.get("name", "");
        this.color = this.config.get("theme.toolbar.dark", "");
        this.background = this.config.get("theme.toolbar.background");

        // subscribe to toolbar-update event
        this.event.subscribe("Toolbar", "toolbar-update", (event) => {
            // load toolbar theme
            this.title = obj.get(event, 'title', this.title);
            this.color = obj.get(event, 'toolbar.dark', this.toolbar.dark);
            this.background = obj.get(event, 'toolbar.color', this.toolbar.color);
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
  