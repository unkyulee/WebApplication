<template>
  <v-app>
    <Navigation v-if="config.get('navigation', []).length > 0" />
    <v-main :style="main_style">
      <Content />
    </v-main>
  </v-app>
</template>

<script lang="ts">
// @ts-nocheck
import Navigation from "./Navigation/Navigation.vue";
import Content from "./Content/Content.vue";

import { defineComponent } from "vue";
export default defineComponent({
  inject: ["event", "config", "ui", "auth", "rest", "nav", "util"],
  components: {
    Navigation,
    Content,
  },
  data() {
    return {
      main_style: {},
    };
  },
  mounted() {
    if (this.config.get("color.background")) {
      this.main_style.background = this.config.get("color.background");
    }
  },
});
</script>

<style scoped>
:deep() .v-main {
  display: flex;
  flex-flow: column;
}
</style>
