<template>
  <div v-bind:class="uiElement.layoutClass" v-bind:style="uiElement.layoutStyle">
    <UiElement
      v-for="(ui, index) in uiElement.screens"
      v-bind:key="index"
      v-bind:uiElement="ui"
      v-bind:data="data"
    />
  </div>
</template>

<script>
import UiElement from "../ui/UiElement";

export default {
  components: {
    UiElement
  },
  inject: ["config", "rest", "event", "ui"],
  data: function() {
    return {
      style: {},
      uiElement: {},
      data: {}
    };
  },
  mounted: async function() {
    // subscribe to data-change event
    this.event.subscribe("composer", "data", event => {
      this.data = { ...event.data };
    });

    // load initial screen
    this.uiElement = await this.ui.get(this.config.get("uiElementId"));
  },
  destroyed: function() {
    this.event.unsubscribe_all("composer");
  }
};
</script>