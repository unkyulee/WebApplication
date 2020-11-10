<template>
  <v-bottom-sheet v-model="showSheet">
    <v-sheet :class="uiElement.layoutClass" :style="uiElement.layoutStyle">
      <UiElement
        v-for="(ui, index) in uiElement.screens"
        v-bind:key="index"
        v-bind:uiElement="ui"
        v-bind:data="data"
      />
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import Vue from "vue";
import Base from "./Base";
import UiElement from "../ui/UiElement";
const obj = require("object-path");
const moment = require("moment");

export default {
  components: {
    UiElement,
  },
  inject: ["config", "rest", "event", "ui", "auth"],
  data: function () {
    return {
      showSheet: false,
      uiElement: {},
      data: {},
      option: {},
    };
  },
  mounted: async function () {
    this.event.subscribe("actionsheet", "open-sheet", async (event) => {
      // reset screen
      this.uiElement = {};

      // download the uiElement
      this.uiElement = await this.ui.get(event.uiElementId);
      this.data = event.data;

      // open sheet
      this.showSheet = true;

    });

    this.event.subscribe("actionsheet", "close-sheet", (event) => {
      this.showSheet = false;
    });
  },
  destroyed: function () {
    this.event.unsubscribe_all("actionsheet");
  }
};
</script>

<style scoped>
/deep/ .v-bottom-sheet {
  display: flex;
  flex-flow: column;
  overflow: auto;
}
</style>
