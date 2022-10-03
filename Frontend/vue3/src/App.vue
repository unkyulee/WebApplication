<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from 'vue'
import * as moment from "moment"

// services
import event from "./services/event.service";
import config from "./services/config.service";

export default defineComponent({
  provide: {
    event,
    config
  },

  // Global Initialization
  mounted: async function () {
    // init moment locale
    if (config.get("locale")) {
      moment.locale(config.get("locale"));
      console.log(`setting locale to ${config.get("locale")}`)
    }
  },
})
</script>
