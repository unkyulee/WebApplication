<template>
  <v-layout align-center justify-center>
    <template v-for="(screen, index) in ui.screens">
      <v-btn
        :key="index"
        :color="screen.color"
        :style="screen.style"
        :class="screen.class"
        v-on:click="action(screen.action)"
      >{{screen.label}}</v-btn>
    </template>
  </v-layout>
</template>

<script>
export default {
  props: ["ui", "data"],
  methods: {
    action: function(action) {
      eval(action);
    }
  }
};
</script>
