<template>
  <div
    style="
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      width: 100vw;
      height: 100vh;
      background: lightgray;
    "
  >
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
    <div style="margin-top: 8px; color: dimgray" v-html="message"></div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from "vue";
export default defineComponent({
  inject: ["config", "event", "rest", "ui", "auth"],
  data() {
    return {
      message: "loading ...",
    };
  },

  async mounted() {
    // load date locale
    // init moment locale
    if (this.config.get("locale")) {
      this.message = "initializing date locale ...";
      moment.locale(this.config.get("locale"));
      this.message = `set locale to <b>${this.config.get("locale")}</b>`;
    }

    // check is logged in
    this.message = "checking login ...";
    if (await this.auth.isAuthenticated()) {
      this.message = "login validated";
    } else {
      this.message = "login info not discovered";
    }

    // check if there is any initial script to run
    this.message = "initializing app ...";
    //await this.ui.timeout(1000);

    // load theme
    this.message = "loading theme ...";
    //await this.ui.timeout(1000);

    // load navigation
    this.message = "loading navigation ...";
    //await this.ui.timeout(1000);

    // setting up first navigation
    this.message = "setting up the first page ...";
    //await this.ui.timeout(1000);

    //
    // LOADING COMPLETED
    //
    this.event.send({ name: "loading-completed" });
  },
});
</script>
