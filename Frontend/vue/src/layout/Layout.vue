<template>
  <login v-if="!authenticated"></login>
  <div v-else-if="authenticated">
    <toolbar />
    <navigation />
    <composer />
  </div>
</template>

<script>
import Toolbar from "./toolbar/Toolbar.vue";
import Navigation from "./navigation/Navigation.vue";
import Login from "./login/Login.vue";
import Composer from "./composer/Composer.vue";

export default {
  inject: [
    "AuthService",
     "EventService"
     ],
  components: {
    Toolbar,
    Navigation,
    Login,
    Composer
  },
  mounted: function() {
    // listen to drawer-toggle event
    this.EventService.$on("authenticated", this.onAuthenticated);
    this.EventService.$on("logout", this.onAuthenticated);
  },
  destroyed: function() {
    // stop listen to drawer-toggle event
    this.EventService.$off("authenticated", this.onAuthenticated);
    this.EventService.$off("logout", this.onAuthenticated);
  },
  data: function() {
    return {
      authenticated: this.AuthService.isAuthenticated()
    };
  },
  methods: {
    onAuthenticated: function() {      
      this.authenticated = this.AuthService.isAuthenticated()              
    }
  }
};
</script>