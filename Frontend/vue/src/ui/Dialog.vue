<template>
  <v-dialog
    v-model="showDialog"
    :fullscreen="uiElement.fullscreen ? uiElement.fullscreen : false"
    :width="option.width"
    :max-width="option.maxWidth"
    :height="option.height"
    :max-height="option.maxHeight"
  >
    <div :style="uiElement.layoutStyle">
      <UiElement
        v-for="(ui, index) in uiElement.screens"
        v-bind:key="index"
        v-bind:uiElement="ui"
        v-bind:data="data"
      />
    </div>
  </v-dialog>
</template>

<script>
import Vue from "vue";
import Base from "./Base";
import UiElement from "../ui/UiElement";

//
const obj = require("object-path");
const moment = require("moment");

export default {
  components: {
    UiElement,
  },
  inject: ["config", "rest", "event", "ui", "auth"],
  data: function () {
    return {
      showDialog: false,
      uiElement: {},
      data: {},
      option: {}
    };
  },
  mounted: async function () {
    this.event.subscribe("dialog", "open-dialog", async (event) => {
      // reset screen
      this.uiElement = {};

      // download the uiElement
      this.uiElement = await this.ui.get(event.uiElementId);
      this.data = event.data;
      this.option = obj.get(event, 'option', {});

      // process init
      if(this.uiElement.init) {
        try {
          eval(this.uiElement.init)
        } catch(ex) {
          console.error(this.uiElement.init, ex)
        }
      }

      // open dialog
      this.showDialog = true;

      this.scrollTop();
    });

    this.event.subscribe("dialog", "close-dialog", (event) => {
      this.showDialog = false;
    });
  },
  destroyed: function () {
    this.event.unsubscribe_all("dialog");
  },
  methods: {
    scrollTop() {
      let container = document.getElementsByClassName("v-dialog")[0];
      if (container) {
        let event = new CustomEvent("scroll", {});
        container.pageYOffset = 0;
        setTimeout(() => {
          container.scrollTop = 0;
        }, 200);
        container.dispatchEvent(event);
      }
    },
  },
};
</script>

<style scoped>
/deep/ .v-dialog {
  display: flex;
  flex-flow: column;
}
</style>