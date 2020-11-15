<template>
  <v-app id="app-root">
    <navigation-drawer v-model="drawer" />
    <v-app-bar color="blue" dark clipped-left fixed app>
      <v-app-bar-nav-icon @click.stop="toggleDrawer" />
      <v-toolbar-title>GAS built by Vue CLI v3</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        hello
      </v-container>
    </v-main>
    <v-footer color="blue" dark class="app-footer">
      <span>gas-vue-ts</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'app',
  components: {

  },
  data() {
    return {
      drawer: null as boolean | null,
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    },
  },
})
</script>

<style scoped>
.app-footer {
  justify-content: center;
}
</style>
