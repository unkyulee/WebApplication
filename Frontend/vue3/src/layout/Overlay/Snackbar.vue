<template>
  <Toast />
</template>

<script lang="ts">
// @ts-nocheck
import Base from "../../ui/Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  mounted() {
    // subscribe to refresh
    this.event.subscribe(this._uid, "snackbar", (event) => {
      console.log(event);
      let text = event.text;

      // check if lang option exists
      if (
        event.lang &&
        this.config.get("locale") &&
        event.lang[this.config.get("locale")]
      ) {
        text = event.lang[this.config.get("locale")];
      }

      this.$toast.add({
        severity: obj.get(event, "type", "info"),
        summary: obj.get(event, "title", ""),
        detail: text,
        life: obj.get(event, "timeout", 3000),
      });
    });
  },
  unmounted() {
    this.event.unsubscribe_all(this._uid);
  },
});
</script>
