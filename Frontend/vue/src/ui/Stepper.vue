<template>
  <md-steppers
    md-vertical
    :md-active-step.sync="active"
    :md-linear="uiElement.linear"
    :class="uiElement.class"
    :style="uiElement.style"
  >
    <md-step
      v-for="(step, index) in uiElement.steps"
      :key="index"
      :id="step.key"
      :md-done.sync="step.done"
      :md-label="step.label"
      :md-description="step.description"
      :class="step.class"
      :style="step.style"
    >
      <UiElement v-for="(ui, index) in step.screens" :key="index" :uiElement="ui" :data="data" />
    </md-step>
  </md-steppers>
</template>

<script>
import Vue from "vue";

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