<template>
  <div></div>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "../../ui/Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  timers: {},

  mounted: function () {
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
        delete this.timers[event.key];
      }
    });
  },
  unmounted() {
    this.event.unsubscribe_all("Timer");
  },
});
</script>
