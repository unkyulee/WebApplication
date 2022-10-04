<template>
    <component v-if="ready" :is="uiElement.type" :data="data" :uiElement="uiElement" :class="uiElement.layoutClass"
        :style="uiElement.layoutStyle">
    </component>
</template>
  
<script lang="ts">
// @ts-nocheck
import { defineComponent } from 'vue';

import * as obj from "object-path"

export default defineComponent({
    inject: ["config", "event", "ui"],
    components: {
    },
    data() {
        return {
            ready: false,
            uiElement: {},
            data: {}
        };
    },
    async mounted() {
        // load initial ui   
        let nav;
        if (this.$route.path == "/" && config.get("nav", []).length > 0) {
            // load from default navigation
            nav = config.get("nav.0");
        }
        else {
            // find matching nav
            nav = this.config.get("nav", []).find((x) => x.url == this.$route.path);
        }
        if (!nav) {
            console.error("navigation loading failed");
            return;
        }

        // download uiElement
        this.uiElement = await this.ui.get(obj.get(nav, "uiElementIds.0"));

        // listen to navigation-changed event        
        this.event.subscribe("Content", "navigation-changed", async (event) => {
            if (obj.get(event, 'data.selected')) {
                // download uiElement
                this.uiElement = await this.ui.get(obj.get(event, 'data.selected.uiElementIds.0'));                
            }
        });

    },

    destroyed: function () {
        this.event.unsubscribe_all("Content");
    },
});
</script>

