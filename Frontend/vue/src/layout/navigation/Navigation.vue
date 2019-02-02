<template>
  <v-navigation-drawer v-model="drawer" absolute temporary app>
    <div class="header">
      <h3>Bootstrap Sidebar</h3>
    </div>
    <user></user>
    <v-expansion-panel>
      <v-expansion-panel-content v-for="(item,i) in 5" :key="i">
        <div slot="header">Item</div>
        <v-card>
          <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-navigation-drawer>
</template>

<script>
import User from "../user/User.vue";

export default {
  inject: ["EventService"],
  data: function() {
    return {
      drawer: false
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
</style>