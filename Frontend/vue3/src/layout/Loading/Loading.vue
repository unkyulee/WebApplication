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
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
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
      error: "",
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

    // reload nav
    {
      this.message = "reset navigation ...";
      this.config.set("navigations", this.config.get("nav"));
    }

    // check if the app requires login
    if (this.config.get("login.enabled")) {
      // check is logged in
      this.message = "checking login ...";
      if (await this.auth.isAuthenticated()) {
        this.message = "login validated";
      } else {
        this.message = "login info not discovered";
        // check if the navigation contains any public entry
        let navigations = this.config.get("navigations", []);
        if (navigations.find((x) => x.public == true)) {
          // there is a page to display without login
        } else {
          // there is no page to display without login
          // login is required before entering the app
          this.message = "redirecting to login ...";

          // display login screen
          // update the nav to the login screen
          this.config.set("navigations", [
            { name: "Login", pageId: "login", url: "/" },
          ]);
        }
      }
    }

    // Load initial navigation
    {
      this.message = "loading initial page ...";

      //
      let navigations = this.config.get("navigations", []);
      if (navigations.length == 0) {
        // error - NAVIGATION IS EMPTY
        this.data.error = "NAVIGATION NOT SET";
        return;
      } else {
        // find matching nav
        let selectedMenu = navigations.find((x) => x.url == this.$route.path);

        // select the first navigation
        if (selectedMenu) {
          this.$router.push(selectedMenu.url);
        } else {
          // select the first navigation
          this.$router.push(obj.get(navigations, "0.url"));
        }
      }

      //
    }

    /*
// check if embed is passed
        if (obj.get(this.$route, "query.embed")) {
            // do not show navigation
            this.show_navigation = false;
            return;
        } else {
            // show navigation
            this.show_navigation = true;
        }

        // load navigations
        this.menu.navigations = this.config
            .get("nav", [])
            .filter((x) => x.type != "hidden");

        // selected navigations
        if (this.$route.path == "/" && this.config.get("nav", []).length > 0) {
            // select the first navigation
            this.$router.push(this.config.get("nav.0.url"));
            // update selected navigation
            this.menu.selected = this.config.get("nav.0");
        }
        else {
            // find matching nav
            this.menu.selected = this.config.get("nav", []).find((x) => x.url == this.$route.path);
        }
        //
        console.log(`set initial navigation: ${this.menu.selected.url}`);
        this.event.send({ name: "navigation-changed", data: this.menu });
    */

    //
    // LOADING COMPLETED
    //
    this.event.send({ name: "loading-completed" });
  },
});
</script>
