<template>
  <keep-alive>
    <v-select
      v-if="
        (!uiElement.selectionType || uiElement.selectionType == 'selection') &&
        condition(uiElement)
      "
      v-model="value"
      :items="uiElement.options"
      :class="uiElement.class"
      :style="uiElement.style"
      :filled="uiElement.appearance == 'fill'"
      :solo="uiElement.appearance == 'solo'"
      :outlined="uiElement.appearance == 'outline'"
      :dense="uiElement.dense"
      :rounded="uiElement.rounded"
      :label="uiElement.label"
    >
    </v-select>

    <v-overflow-btn
      v-if="
        uiElement.selectionType == 'overflow' &&
        condition(uiElement)
      "
      v-model="value"
      :items="uiElement.options"
      :item-value="uiElement.optionKey"
      :editable="uiElement.editable"
      :class="uiElement.class"
      :style="uiElement.style"
      :filled="uiElement.appearance == 'fill'"
      :solo="uiElement.appearance == 'solo'"
      :outlined="uiElement.appearance == 'outline'"
      :dense="uiElement.dense"
      :reverse="uiElement.reverse"
      :rounded="uiElement.rounded"
      :segmented="uiElement.segmented"
      :dark="uiElement.dark"
      :label="uiElement.label"      
    ></v-overflow-btn>
  </keep-alive>
</template>

<script>
import Vue from "vue";
import Base from "./Base";
import { debounce } from "debounce";
const obj = require("object-path");
const moment = require("moment");

export default Vue.component("selection", {
  extends: Base,
  data: function () {
    return {
      value: null,
    };
  },
  mounted: function () {
    // changed
    this.changed = debounce(this.changed, 200);

    // set value
    if (this.data && this.uiElement.key) {
      this.value = obj.get(this.data, this.uiElement.key);      
    }

  },
  updated: function () {
    // set value
    if (this.data && this.uiElement.key)
      this.value = obj.get(this.data, this.uiElement.key);
  },
  watch: {
    value: function (curr, old) {
      if (this.data && this.uiElement.key) {
        obj.set(this.data, this.uiElement.key, curr);
      }
      this.changed();
    },
  },
  methods: {
    changed(e) {
      this.event.send({ name: "data" });
      //this.$set(this, 'data', this.data);
      this.$forceUpdate();

      // trigger custom event
      if (this.uiElement.changed) {
        try {
          eval(this.uiElement.changed);
        } catch (ex) {
          console.error(ex);
        }
      }
    },
  },
});
</script>