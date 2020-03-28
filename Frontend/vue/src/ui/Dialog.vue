<template>
  <md-dialog :md-active.sync="showDialog">
    <UiElement
      v-for="(ui, index) in uiElement.screens"
      v-bind:key="index"
      v-bind:uiElement="ui"
      v-bind:data="data"
    />
    <md-dialog-actions v-if="uiElement.actions">
      <UiElement
        v-for="(ui, index) in uiElement.actions"
        v-bind:key="index"
        v-bind:uiElement="ui"
        v-bind:data="data"
      />
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import Base from "./Base";

//
const obj = require("object-path");
const moment = require("moment");

export default {
  extends: Base,
  data: () => {
    return {
      showDialog: false
    };
  },
  mounted: async function() {
    // download the uiElement
    this.uiElement.screens = [await this.ui.get(this.uiElement.uiElementId)];

    this.event.subscribe(this.uiElement.key, "open-dialog", event => {
      if (event.key == this.uiElement.key) this.showDialog = true;
    });

    this.event.subscribe(this.uiElement.key, "close-dialog", event => {
      if (event.key == this.uiElement.key) this.showDialog = false;
    });
  }
};
</script>
