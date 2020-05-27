<template>
  <div class="md-toolbar-row">
    <md-button class="md-icon-button" @click="click()" v-if="showDrawer && type != 'sub'">
      <md-icon :style="buttonStyle">menu</md-icon>
    </md-button>
    <md-button class="md-icon-button" @click="back()" v-if="type == 'sub'">
      <md-icon :style="buttonStyle">arrow_back</md-icon>
    </md-button>

    <span v-if="!logo" style="font-size: initial">{{title}}</span>

    <img v-if="logo" :src="logo" />
    <div style="flex-grow: 1"></div>

    <UiElement
      v-for="(ui, index) in screens"
      v-bind:key="index"
      v-bind:uiElement="ui"
      v-bind:data="data"
    />
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
      title: "",
      logo: "",
      type: "",
      buttonStyle: {},
      screens: [],
      showDrawer: false
    };
  },
  mounted: function() {
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

    // load actions
    this.screens = this.config.get("actions", []);
    for (let screen of this.screens) {
      this.$set(screen, "iconStyle", this.buttonStyle);
    }

    // load navigations
    this.showDrawer = this.config.get("navigations", []).length > 0;
  },
  methods: {
    click() {
      this.event.send({ name: "drawer", data: true });
    },
    back() {
      this.$router.go(-1);
    }
  },
  watch: {
    // react to route changes...
    async $route(to, from) {
      // find matching nav
      let nav = this.config.get("navigations", []).find(x => x.url == to.path);
      if (nav) {
        this.$set(this, 'type', nav.type);
      }
    }
  }
};
</script>