<template>
  <v-app>
    <v-main>
      <home-component></home-component>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
//
import obj from "object-path";
import moment from "moment";

// services
import data from "./services/data.service";

export default Vue.extend({
  name: "app",
  provide: function () {
    return {
      data,
    };
  },
  data() {
    return {
      uiElementId: null,
    };
  },
  mounted: async function () {
    // load app config and setup the title
    const app = await data.get("App");
    document.title = obj.get(app, "0.title", "");

    // load navigation
    const nav = await data.get("Navigation");

    // load the screen
    this.uiElementId = obj.get(nav, '0.uiElementIds.0');
  }
});
</script>

