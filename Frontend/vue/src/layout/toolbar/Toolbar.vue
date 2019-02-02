<template>
  <v-toolbar color="blue-grey" dark fixed app clipped-right>
    <v-toolbar-side-icon @click.stop="drawerToggle()"></v-toolbar-side-icon>
    <v-toolbar-title>Toolbar</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script>
export default {
  inject: ['EventService'],
  methods: {
    drawerToggle: function() {
      this.EventService.$emit("drawer-toggle");
    }
  }
};
</script>