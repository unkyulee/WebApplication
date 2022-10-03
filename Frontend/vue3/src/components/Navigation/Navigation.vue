<template>
    <v-app>
        <Toolbar />
        <Drawer />
    </v-app>
</template>
  
<script lang="ts">
// @ts-nocheck
import { defineComponent } from 'vue';

// Components
import Toolbar from './Drawer/Toolbar.vue';
import Drawer from './Drawer/Drawer.vue';

export default defineComponent({
    components: {
        Toolbar,
        Drawer,
    },
});
</script>
  