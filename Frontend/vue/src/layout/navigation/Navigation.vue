<template>
  <v-navigation-drawer v-model="drawer" absolute temporary app>
    <div class="header">
      <h3>{{title}}</h3>
    </div>
    <!-- user profile button -->
    <user></user>
    <!-- navigations -->
    <template v-for="(nav,i) in navigations">
      <!-- single item -->
      <router-link
        :to="nav.url"
        :key="i"
        :class="{'nav-link': true, 'active': isPageMatch(nav.url)}"
        v-if="nav.type == 'item'"
        v-ripple
      >{{nav.label}}</router-link>

      <!-- collapse -->
      <v-expansion-panel :key="i" v-if="nav.type == 'collapse'">
        <v-expansion-panel-content>
          <div slot="header">{{nav.label}}</div>
          <router-link
            v-for="(child,j) in nav.children"
            :key="j"
            :to="child.url"
            v-ripple
            :class="{'nav-link': true, 'active': isPageMatch(child.url)}"
          >{{child.label}}</router-link>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </template>
  </v-navigation-drawer>
</template>

<script>
import User from "../user/User.vue";

export default {
  inject: ["EventService", "ConfigService"],
  data: function() {
    return {
      drawer: false,
      title: this.ConfigService.get("title"),
      navigations: this.ConfigService.get("navigations"),
      currUrl: ''
    };
  },
  components: {
    User
  },
  mounted: function() {
    // listen to drawer-toggle event
    this.EventService.$on("drawer-toggle", this.drawerClickHandler);
  },
  destroyed: function() {
    // stop listen to drawer-toggle event
    this.EventService.$off("drawer-toggle", this.drawerClickHandler);
  },
  methods: {
    drawerClickHandler: function() {
      this.drawer = !this.drawer;
    },
    isPageMatch: function(url) {
      // see if the url matches
      if(this.currUrl && this.currUrl.startsWith(url))
        return true
      return false
    }
  },
  watch: {
    '$route' (to) {
     // save the current url
      this.currUrl = to.path
    }
  }
};
</script>

<style scoped>
.v-navigation-drawer {
  background: #7386d5;
  color: #fff;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
}

.header {
  padding: 20px;
  background: #6d7fcc;
}

.nav-link {
  text-decoration: none !important;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 24px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  color: black;
  background: white;
}

.active {
  color: white;
  background-color: #039be5;
}
</style>