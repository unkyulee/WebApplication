<template>
  <v-app>
    <Navigation />

    <v-main>
      <Content />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Components
import Navigation from './Navigation/Navigation.vue';
import Content from './Content/Content.vue';

export default defineComponent({
  components: {
    Navigation,
    Content
  },
});
</script>
