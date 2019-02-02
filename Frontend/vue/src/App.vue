<template>
  <v-app>    
    <Layout></Layout>
  </v-app>
</template>

<script>
import Layout from './layout/Layout.vue'
import { EventService } from './services/event.service.js';
import AuthService from './services/auth.service.js'
import RestService from './services/rest.service.js'

export default {
  components: {
    Layout
  },
  provide: function() {
    return {
      EventService: EventService
      , AuthService: AuthService
      , RestService: RestService
    }
  }
};
</script>