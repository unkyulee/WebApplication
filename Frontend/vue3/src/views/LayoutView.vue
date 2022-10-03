<template>
  <v-app>    
    <Navigation />
  </v-app>  
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Components
import Navigation from '../components/Navigation/Navigation.vue';

export default defineComponent({
  components: {
    Navigation,
  },
});
</script>
