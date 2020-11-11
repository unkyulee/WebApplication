<template>
  <keep-alive>

    <!-- text area -->
    <v-textarea
      v-if="
        this.uiElement.inputType == 'textarea' &&
        condition(uiElement)
      "
      v-model="value"
      :rows="uiElement.rows"
      :placeholder="uiElement.placeholder"
      :class="uiElement.class"
      :style="uiElement.style"
      :filled="uiElement.appearance == 'fill'"
      :solo="uiElement.appearance == 'solo'"
      :outlined="uiElement.appearance == 'outline'"
      :dense="uiElement.dense"
      :append-icon="uiElement.appendIcon"
      :append-outer-icon="uiElement.appendOuterIcon"
      :prepend-icon="uiElement.prependIcon"
      :clear-icon="uiElement.clearIcon"
      :clearable="uiElement.clearable"
      :label="uiElement.label"
      :type="uiElement.inputType"
      :auto-grow="uiElement.autoGrow ? uiElement.autoGrow : true"
      @click:append="safeEval(uiElement.clickAppend)"
      @click:append-outer="safeEval(uiElement.clickAppendOuter)"
      @click:prepend="safeEval(uiElement.clickPrepend)"
      @click:clear="safeEval(uiElement.clickClear)"
    ></v-textarea>

    <!-- text field -->
    <v-text-field
      v-if="
        (!this.uiElement.inputType || this.uiElement.inputType == 'text') &&
        condition(uiElement)
      "
      v-model="value"
      :class="uiElement.class"
      :style="uiElement.style"
      :filled="uiElement.appearance == 'fill'"
      :solo="uiElement.appearance == 'solo'"
      :outlined="uiElement.appearance == 'outline'"
      :dense="uiElement.dense"
      :append-icon="uiElement.appendIcon"
      :append-outer-icon="uiElement.appendOuterIcon"
      :prepend-icon="uiElement.prependIcon"
      :clear-icon="uiElement.clearIcon"
      :clearable="uiElement.clearable"
      :label="uiElement.label"
      :type="uiElement.inputType"
      @click:append="safeEval(uiElement.clickAppend)"
      @click:append-outer="safeEval(uiElement.clickAppendOuter)"
      @click:prepend="safeEval(uiElement.clickPrepend)"
      @click:clear="safeEval(uiElement.clickClear)"
    ></v-text-field>

    <v-checkbox
      v-if="
        this.uiElement.inputType == 'checkbox' &&
        condition(uiElement)
      "
      :class="uiElement.class"
      :style="uiElement.style"
      v-model="value"
      :label="uiElement.label"
    ></v-checkbox>

  </keep-alive>
</template>

<script>
import Vue from "vue";

// utilities
import { debounce } from "debounce";
const obj = require("object-path");
const moment = require("moment");

// user imports
import Base from "./Base";

export default Vue.component("input-component", {
  extends: Base,
  data: function () {
    return {
      ready: false,
      value: null,
    };
  },
  mounted: function () {
    // changed
    this.changed = debounce(this.changed, 200);

    // set value
    if (this.data && this.uiElement.key)
      this.value = obj.get(this.data, this.uiElement.key);
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
        this.$set(this.data, this.uiElement.key, curr);
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

    minus() {
      if (!this.value) this.value = 0;
      this.value = this.value - 1;
    },
    plus() {
      if (!this.value) this.value = 0;
      this.value = this.value + 1;
    },
  },
});
</script>
