<template>
  <div></div>
</template>

<script>
import Vue from "vue";
import Base from "./Base";
const obj = require("object-path");
const moment = require("moment");

export default Vue.component("timer", {
  extends: Base,
  timers: {},

  mounted: function() {
    this.timers = {};

    // timer is initialized
    // event handler
    this.event.subscribe("Timer", "timer-create", (event) => {      
      // check if the timer already exists
      if (!this.timers[event.key]) {
        // call immediately
        event.callback.call(this);
        
        // only setup timer for once        
        this.timers[event.key] = setInterval(() => {
          event.callback.call(this);
        }, event.interval);
      }

    });

    this.event.subscribe("Timer", "timer-remove", (event) => {
      if (this.timers[event.key]) {
        clearInterval(event.key);
        delete this.timers[event.key]
      }
    });
  },
  destroyed: function() {
    this.event.unsubscribe_all("Timer");
  },
});
</script>
