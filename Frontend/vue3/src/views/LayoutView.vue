<template>
  <v-app>    
    <Navigation />
    <Content />
  </v-app>  
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Components
import Navigation from '../components/Navigation/Navigation.vue';
import Content from '../components/Content/Content.vue';

export default defineComponent({
  components: {
    Navigation,
    Content
  },
});
</script>
