<script lang="ts">
// @ts-nocheck
import { defineComponent } from "vue";
export default defineComponent({
  inject: ["config", "event", "rest", "ui", "auth", "util"],
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

    {
      // load initial script
      if (this.config.get("init")) {
        try {
          await eval(this.config.get("init"));
        } catch (ex) {
          console.error(ex);
          return;
        }
      }
    }

    //
    // LOADING COMPLETED
    //
    this.event.send({ name: "loading-completed" });
  },
});
</script>

<template>
  <div v-if="!splash" class="fullscreen-centered">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
    <div class="message" v-html="message"></div>
    <div class="error" v-html="error"></div>
  </div>
  <div v-if="splash" class="fullscreen-centered">
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

<style>
.fullscreen-centered {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: lightgray;
}

.message {
  margin-top: 8px;
  color: dimgray;
}

.error {
  margin-top: 8px;
  color: crimson;
}
</style>

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
