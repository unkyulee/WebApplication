<template>
  <v-btn v-if="show" :style="style" fab x-small @click="click">
    <v-icon>mdi-account-circle</v-icon>
  </v-btn>
</template>

<script>
import Vue from "vue";

export default {
  inject: ["event", "config", "auth"],
  data: function () {
    return {
      style: {},
      show: false,
    };
  },
  mounted: function () {
    // check if client module is loaded
    if (this.config.get("features", []).indexOf("client") > 0) {
      //
      this.show = true;
      this.style.background = this.config.get("theme.toolbar.background");
      this.style.opacity = 0.7;

      // initialize this.data.client
      this.auth.isAuthenticated();

      this.event.subscribe("User", "profile", (event) => (this.click()));
    }
  },
  destroyed: function () {
    this.event.unsubscribe_all("User");
  },
  methods: {
    click: function () {
      // check if login
      let uiElementId;
      if (this.auth.isAuthenticated()) {
        // show profile page
        let nav = this.config.get("nav", []).find((x) => x.id == "profile");
        if (nav) uiElementId = nav.uiElementIds[0];
      } else {
        // show login page
        let nav = this.config.get("nav", []).find((x) => x.id == "login");
        if (nav) uiElementId = nav.uiElementIds[0];
      }

      // open dialog
      if (uiElementId) {
        this.event.send({
          name: "open-dialog",
          uiElementId,
          data: this.auth.client,
          option: {
            maxWidth: "800px",
          },
        });
      }
    },
  },
};
</script>