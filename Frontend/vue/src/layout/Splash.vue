<template>
  <v-overlay :absolute="absolute" :opacity="opacity" :value="overlay" z-index=1000>
    <v-progress-circular
      indeterminate
      color="primary"
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
import Vue from "vue";

export default {
  inject: ["event"],
  data: function () {
    return {
      absolute: true,
      opacity: 0.5,
      overlay: false,
    };
  },
  mounted: async function () {
    // subscribe to splash event
    this.event.subscribe(
      "Splash",
      "splash-show",
      (event) => (this.overlay = true)
    );
    this.event.subscribe(
      "Splash",
      "splash-hide",
      (event) => (this.overlay = false)
    );
  },
  destroyed: function () {
    this.event.unsubscribe_all("Splash");
  },
};
</script>