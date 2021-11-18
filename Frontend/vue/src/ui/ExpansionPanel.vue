<template>
  <v-expansion-panels
    v-if="condition(uiElement)"
    :focusable="uiElement.focusable"
    :popout="uiElement.popout"
    :multiple="uiElement.multiple"
    v-model="panel"
  >
    <v-expansion-panel v-for="(panel, i) in uiElement.panels" :key="i">
      <v-expansion-panel-header :style="uiElement.headerStyle">
        <div v-html="panel.header.label"></div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <UiElement
          v-for="(ui, index) in panel.screens"
          :key="index"
          :uiElement="ui"
          :data="data"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import Vue from "vue";
import Base from "./Base";

export default Vue.component("expansion-panel", {
  extends: Base,
  data: () => ({
    panel: [],
  }),
  mounted: function () {
    // data refresh
    this.event.subscribe(this._uid, "panel", (event) => {
      this.panel = event.panel;
    });
  },
  destroyed: function () {
    //
    this.event.unsubscribe_all(this._uid);
  },
  watch: {
    panel: function (curr, old) {
      if (this.uiElement.panelChanged) {
        try {
          eval(this.uiElement.panelChanged);
        } catch (ex) {
          console.error(ex, this.uiElement);
        }
      }
    },
  },
});
</script>