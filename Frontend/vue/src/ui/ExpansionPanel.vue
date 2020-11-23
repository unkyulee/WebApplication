<template>
  <v-expansion-panels :focusable="uiElement.focusable">
    <v-expansion-panel v-for="(panel, i) in uiElement.panels" :key="i">
      <v-expansion-panel-header>{{panel.header.label}}</v-expansion-panel-header>
      <v-expansion-panel-content>
        <UiElement
          v-for="(ui, index) in panel.screens"
          v-bind:key="index"
          v-bind:uiElement="ui"
          v-bind:data="data"
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
});
</script>