<template>
    <div v-if="show_navigation">
        <Toolbar />
        <Drawer :menu="menu" />
    </div>
</template>
  
<script lang="ts">
// @ts-nocheck
import { defineComponent } from 'vue';

import * as obj from "object-path"

// Components
import Toolbar from './Drawer/Toolbar.vue';
import Drawer from './Drawer/Drawer.vue';

export default defineComponent({
    inject: ['event', 'config', 'ui'],
    components: {
        Toolbar,
        Drawer,
    },
    data() {
        return {
            show_navigation: false,
            menu: {
                navigations: [],
                selected: null
            },
        };
    },
    mounted: async function () {
        // check if embed is passed
        if (obj.get(this.$route, "query.embed")) {
            // do not show navigation
            this.show_navigation = false;
            return;
        } else {
            // show navigation
            this.show_navigation = true;
        }

        // load navigations
        this.menu.navigations = this.config
            .get("nav", [])
            .filter((x) => x.type != "hidden");

        // selected navigations        
        if (this.$route.path == "/" && config.get("nav", []).length > 0) {
            // select the first navigation
            this.$router.push(config.get("nav.0.url"));
            // update selected navigation
            this.menu.selected = config.get("nav.0");
        }
        else {
            // find matching nav
            this.menu.selected = this.config.get("nav", []).find((x) => x.url == this.$route.path);
        }
        //
        console.log(`set initial navigation: ${this.menu.selected.url}`);
        this.event.send({ name: "navigation-changed", data: this.menu });
    },
    watch: {
        // react to route changes...
        $route(to, from) {
            // find matching nav
            this.menu.selected = this.config.get("nav", []).find((x) => x.url == to.path);
            //
            this.event.send({ name: "navigation-changed", data: this.menu });
        },
    },
});
</script>
  