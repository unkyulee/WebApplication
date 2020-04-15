<template>
  <div style="width: 100%; height: 100%;">
    <div style="display: flex; justify-content: center; align-items: center; height: 56px;">
      <span class="md-title" v-if="!logo">{{title}}</span>
      <img class="md-title" v-if="logo" :src="logo" />
    </div>
    <div v-if="data.client" :style="user.layoutStyle">
      <UiElement
        v-for="(ui, index) in user.screens"
        v-bind:key="index"
        v-bind:uiElement="ui"
        v-bind:data="data"
      />
    </div>
    <md-list>
      <div v-for="(nav, index) of navigations" :key="index">
        <md-list-item :to="nav.url" @click="click()">{{nav.name}}</md-list-item>
        <md-divider></md-divider>
      </div>
    </md-list>
    <div v-if="footer" :style="footer.layoutStyle">
      <UiElement
        v-for="(ui, index) in footer.screens"
        v-bind:key="index"
        v-bind:uiElement="ui"
        v-bind:data="data"
      />
    </div>
  </div>
</template>

<script>
import Base from "../ui/Base";

//
const obj = require("object-path");
const moment = require("moment");

export default {
  extends: Base,
  data: function() {
    return {
      navigations: [],
      title: "",
      logo: "",
      buttonStyle: {},
      user: {},
      footer: {}
    };
  },
  mounted: async function() {
    // load navigation
    this.navigations = this.config.get("navigations");

    // load user screens
    this.user = this.config.get("user", {});
    this.footer = this.config.get("footer", {});

    // load title
    this.title = this.config.get("name", " - ");
    let logo = this.config.get("config.logo_toolbar.0.url", "");
    if (logo) this.logo = `${this.config.get("host")}${logo}`;

    // button Style
    this.$set(
      this.buttonStyle,
      "color",
      this.config.get("config.toolbar.color")
    );
  },
  methods: {
    click() {
      this.event.send({ name: "drawer", data: false });
    }
  }
};
</script>

<style scoped>
.md-list {
  width: 320px;
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  border: 1px solid rgba(#000, 0.12);
}
</style>