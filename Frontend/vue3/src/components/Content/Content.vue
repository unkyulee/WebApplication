<template>
    <v-main>
        <v-container fluid>
            <v-row dense>
                <v-col v-for="n in 8" :key="n" cols="3">
                    <v-sheet color="grey-lighten-2" height="96"></v-sheet>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>
  
<script lang="ts">
// @ts-nocheck
import { defineComponent } from 'vue';

export default defineComponent({
    components: {
    },
});
</script>
  