<template>
  <Loading v-if="loading" />
  <Content v-if="!loading" />
  <Toast />
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from "vue";

// services
import event from "./services/event.service";
import config from "./services/config.service";
import ui from "./services/ui.service";
import auth from "./services/auth.service";
import rest from "./services/rest.service";
import util from "./services/util.service";

// ui
import Loading from "./Loading.vue";
import Content from "./layout/Content.vue";

export default defineComponent({
  provide: {
    event,
    config,
    ui,
    auth,
    rest,
    util,
  },

  components: {
    Loading,
    Content,
  },

  data() {
    return {
      loading: true,
    };
  },

  // Global Initialization
  created: async function () {
    // subscribe to loading-complete event
    event.subscribe("App", "init", (event) => {
      this.loading = true;
    });

    // subscribe to loading-complete event
    event.subscribe("App", "loading-completed", (event) => {
      this.loading = false;
    });

    // subscribe to snackbar
    event.subscribe("App", "snackbar", (e) => {
      let text = e.text;

      // check if lang option exists
      if (e.lang && config.get("locale") && e.lang[config.get("locale")]) {
        text = e.lang[config.get("locale")];
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
    event.unsubscribe_all("App");
  },
});
</script>

<style scoped>
:deep() .v-main__wrap {
  display: flex;
  flex-flow: column;
}

:deep() p {
  margin-bottom: 0 !important;
}
</style>
