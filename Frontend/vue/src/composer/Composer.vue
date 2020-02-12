<template>
  <keep-alive>
    <UiElement
      v-for="(ui, index) in uiElement.screens"
      v-bind:key="index"
      v-bind:uiElement="ui"
      v-bind:data="data"
    />
  </keep-alive>
</template>

<script>
import UiElement from "../ui/UiElement";

export default {
  components: {
    UiElement
  },
  inject: ["config", "rest"],
  data: function() {
		return {
			style: {},
			uiElement: {},
			data: {},
		};
  },
  mounted: async function() {
    // load initial configuration
    let url = `${this.config.get("host")}${this.config.get("url")}/ui.element?uiElementId=${this.config.get('uiElementId')}`;
    let response = await this.rest.request(url);
    // save the uiElement
    this.uiElement = response.data;
  }
};
</script>