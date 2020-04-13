<template>
  <div class="md-toolbar-row">
    <md-button class="md-icon-button" @click="click()" v-if="showDrawer">
      <md-icon>menu</md-icon>
    </md-button>

    <span class="md-title">{{title}}</span>

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
      screens: [],
      showDrawer: false
    };
  },
  mounted: function() {
    // load title
    this.title = this.config.get("name", " - ");
    // load actions
    this.screens = this.config.get("actions", []);
    // load navigations
    this.showDrawer = this.config.get("navigations", []).length > 0;
  },
  methods: {
    click() {
      this.event.send({ name: "drawer", data: true });
    }
  }
};
</script>