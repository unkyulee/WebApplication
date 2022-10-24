<template>
  <div
    v-if="!splash"
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
    <v-alert v-if="error" type="error" style="max-height: 120px; width: 90vw">{{
      error
    }}</v-alert>
  </div>
  <div v-if="splash" :style="splash_style" id="splash">
    <v-img :src="splash" max-width="200px" max-height="200px">
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="error"
          ></v-progress-circular>
        </v-row> </template
    ></v-img>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from "vue";
export default defineComponent({
  inject: ["config", "event", "rest", "ui", "auth", "util", "nav"],
  data() {
    return {
      message: "loading ...",
      error: "",
      splash: false,
      splash_style: {},
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

    // check if embed is passed
    if (this.nav.is_embed()) {
      console.log("embed detected");
      // hide the navigation
      this.config.set("embed", true);
      this.config.set("navigation", []);

      //////////////////
      // STOPS HERE
      //////////////////
      this.event.send({ name: "loading-completed" });
      return;
    }

    // reload nav
    {
      this.message = "loading navigation ...";
      await this.nav.load();
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
        let navigation = this.config.get("navigation", []);
        if (navigation.length > 0) {
          // there is a page to display without login
          //
        } else {
          // there is no page to display without login
          // login is required before entering the app
          this.message = "redirecting to login ...";

          // display login screen
          // update the nav to the login screen
          this.config.set("navigation", [
            { name: "Login", pages: ["login"], url: "/login" },
          ]);
        }
      }
    }

    // Load initial navigation
    {
      this.message = "loading initial page ...";

      //
      let navigation = this.config.get("navigation", []);
      if (navigation.length == 0) {
        // error - NAVIGATION IS EMPTY
        this.error = "NAVIGATION NOT SET";
        return;
      } else {
        let path = this.$route.path;

        if (this.$route.path == "/login" && this.$route.query.r) {
          // exception for login redirect
          path = this.$route.query.r;
        }

        // find matching nav
        let selectedNav = this.nav.find(navigation, path);

        // select the first navigation
        if (!selectedNav) {
          // select the first navigation
          this.$router.push(obj.get(navigation, "0.url"));
        } 
      }
      //
    }

    {
      // load initial script
      if(this.config.get("script.init")) {
        try {
          await eval(this.config.get("script.init"))
        } catch(ex) {
          console.error(ex);
          return;
        }
      }
    }

    {
      // load splash
      if (this.config.get("logo.large.0.url")) {
        this.splash = `${this.config.get("host")}${this.config.get(
          "logo.large.0.url"
        )}&company_id=${this.config.get("_id")}`;
        this.splash_style = {
          ...this.splash_style,
          background: this.config.get("color.primary"),
          width: "100vw",
          height: "100vh",
          display: "flex",
          padding: "24px",
          alignItems: "center",
          justifyContent: "center",
        };
      }
      await this.util.timeout(2000);
    }

    //
    // LOADING COMPLETED
    //
    this.event.send({ name: "loading-completed" });
  },
});
</script>

<style>
@keyframes myAnimation {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    display: none;
    opacity: 0;
  }
}

#splash {
  animation-name: myAnimation;
  animation-duration: 2000ms;
  animation-fill-mode: forwards;
}
</style>
