<template>
  <div>
    <md-steppers md-vertical v-bind:md-active-step.sync="active" v-bind:md-linear="uiElement.linear">
      <md-step
        v-for="(step, index) in uiElement.steps"
        v-bind:key="index"
        v-bind:id="step.key"
        v-bind:md-done.sync="step.done"
        v-bind:md-label="step.label"
        v-bind:md-description="step.description"
      >
        <UiElement
          v-for="(ui, index) in step.screens"
          v-bind:key="index"
          v-bind:uiElement="ui"
          v-bind:data="data"
        />
      </md-step>
    </md-steppers>
  </div>
</template>

<script>
import Vue from "vue";
import { MdSteppers } from "vue-material/dist/components";
Vue.use(MdSteppers);

import Base from "./Base";

//
const obj = require("object-path");

export default {
  extends: Base,
  props: ["uiElement", "data"],
  data: () => ({
    active: null
  }),
  mounted: function() {
    if (this.uiElement.key) {
      this.event.subscribe(this.uiElement.key, "step-done", event => {
        // search for the step matches the key
        let step = this.uiElement.steps.find(x => x.key == event.key);
        if (step) {
          step.done = event.done;
        }
      });
      this.event.subscribe(this.uiElement.key, "step-to", event => {
        this.active = event.key;
      });
    }
  },
  destroyed: function() {
    if (this.uiElement.key) {
      this.event.unsubscribe_all(this.uiElement.key);
    }
  }
};
</script>