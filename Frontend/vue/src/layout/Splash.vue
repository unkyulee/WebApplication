<template>
  <div :style="style" v-if="show">
    <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
  </div>
</template>

<script>
import Vue from "vue";
import { MdProgress } from "vue-material/dist/components";
Vue.use(MdProgress);

export default {
  inject: ["event"],
  data: function() {
    return {
      show: false,
      style: {
        position: "absolute",
        zIndex: 1000,
        background: "rgba(0,0,0,0.4)",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }
    };
  },
  mounted: async function() {
    // subscribe to splash event
    this.event.subscribe("splash", "splash-show", event => (this.show = true));
    this.event.subscribe("splash", "splash-hide", event => (this.show = false));
  },
  destroyed: function() {
    this.event.unsubscribe_all("splash");
  }
};
</script>