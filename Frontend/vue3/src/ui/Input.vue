<template>
  <div :class="uiElement.layoutClass" :style="uiElement.layoutStyle">
    <!-- text area -->
    <v-textarea
      v-if="this.uiElement.inputType == 'textarea'"
      v-model="value"
      :rows="uiElement.rows"
      :placeholder="uiElement.placeholder"
      :class="uiElement.class"
      :style="uiElement.style"
      :dense="uiElement.dense"
      :rounded="uiElement.rounded"
      :append-icon="uiElement.appendIcon"
      :append-outer-icon="uiElement.appendOuterIcon"
      :prepend-icon="uiElement.prependIcon"
      :clear-icon="uiElement.clearIcon"
      :clearable="uiElement.clearable"
      :label="label()"
      :type="uiElement.inputType"
      :auto-grow="uiElement.autoGrow ? uiElement.autoGrow : true"
      :hide-details="safeGet(uiElement, 'hideDetails', true)"
      @click:append="safeEval(uiElement.clickAppend)"
      @click:append-outer="safeEval(uiElement.clickAppendOuter)"
      @click:prepend="safeEval(uiElement.clickPrepend)"
      @click:clear="safeEval(uiElement.clickClear)"
    ></v-textarea>

    <!-- input field -->
    <v-text-field
      v-if="
        !this.uiElement.inputType ||
        this.uiElement.inputType == 'text' ||
        this.uiElement.inputType == 'email' ||
        this.uiElement.inputType == 'number' ||
        this.uiElement.inputType == 'password'
      "
      v-model="value"
      :class="uiElement.class"
      :style="uiElement.style"
      :variant="uiElement.variant"
      :density="uiElement.density"
      :append-icon="uiElement.appendIcon"
      :append-outer-icon="uiElement.appendOuterIcon"
      :append-inner-icon="uiElement.appendInnerIcon"
      :prepend-icon="uiElement.prependIcon"
      :prepend-inner-icon="uiElement.prependInnerIcon"
      :clear-icon="uiElement.clearIcon"
      :clearable="uiElement.clearable"
      :label="label()"
      :type="uiElement.inputType"
      :readonly="uiElement.readonly"
      :hide-details="safeGet(uiElement, 'hideDetails', 'auto')"
      @click:append="safeEval(uiElement.appendIconClick)"
      @click:append-outer="safeEval(uiElement.appendOuterIconClick)"
      @click:prepend="safeEval(uiElement.prependIconClick)"
      @click:prepend-inner="safeEval(uiElement.prependInnerIconClick)"
      @click:clear="safeEval(uiElement.clearIconClick)"
    ></v-text-field>

    <v-checkbox
      v-if="this.uiElement.inputType == 'checkbox'"
      v-model="value"
      :class="uiElement.class"
      :style="uiElement.style"
      :label="label()"
      :color="uiElement.color"
      :hide-details="safeGet(uiElement, 'hideDetails', false)"
    ></v-checkbox>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  inheritAttrs: false,
  data: function () {
    return {
      value: null,
      changedTimeout: null,
    };
  },
  mounted() {
    // set value
    if (this.data && this.uiElement.key)
      this.value = obj.get(this.data, this.uiElement.key);
  },
  updated() {
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
      clearTimeout(this.changedTimeout);
      this.changedTimeout = setTimeout(async () => {
        // trigger custom event
        if (this.uiElement.changed) {
          try {
            eval(this.uiElement.changed);
          } catch (ex) {
            console.error(ex);
          }
        }
      }, 1000);
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
