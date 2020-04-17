<template>
  <md-dialog :md-active.sync="showDialog" :style="uiElement.layoutStyle">
    <UiElement
      v-for="(ui, index) in uiElement.screens"
      v-bind:key="index"
      v-bind:uiElement="ui"
      v-bind:data="data"
    />
    <div v-if="uiElement.actions" style="display: flex; flex-flow: row wrap;">
      <UiElement
        v-for="(ui, index) in uiElement.actions"
        v-bind:key="index"
        v-bind:uiElement="ui"
        v-bind:data="data"
      />
    </div>
  </md-dialog>
</template>

<script>

import UiElement from "../ui/UiElement";

//
const obj = require("object-path");
const moment = require("moment");

export default {
  components: {
    UiElement
  },
  inject: ["config", "rest", "event", "ui", "auth"],
  data: function() {
    return {
      showDialog: false,
      uiElement: {},
      data: {}
    };
  },
  mounted: async function() {
    this.event.subscribe("dialog", "open-dialog", async (event) => {
      // reset screen
      this.uiElement = {};

      // download the uiElement
      this.uiElement = await this.ui.get(event.uiElementId);
      this.data = event.data;

      // open dialog
      this.showDialog = true;
    });

    this.event.subscribe("dialog", "close-dialog", event => {
      this.showDialog = false;
    });
  },
  destroyed: function() {
    this.event.unsubscribe_all("dialog");
  },
};
</script>
