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
      <div :key="i" v-if="nav.type == 'item'">
        <a href="#" :class="{'nav-link': true}" v-ripple>{{nav.label}}</a>
      </div>
      <!-- collapse -->
      <v-expansion-panel :key="i" v-if="nav.type == 'collapse'">
        <v-expansion-panel-content>
          <div slot="header">{{nav.label}}</div>
          <a
            href="#"
            v-ripple
            :key="j"
            v-for="(child,j) in nav.children"
            :class="{'nav-link': true}"
          >{{child.label}}</a>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </template>
  </v-navigation-drawer>
</template>

<script>
import User from "../user/User.vue";

export default {
  inject: ["EventService"],
  data: function() {
    return {
      drawer: false,
      title: window.__CONFIG__.title,
      navigations: window.__CONFIG__.navigations
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