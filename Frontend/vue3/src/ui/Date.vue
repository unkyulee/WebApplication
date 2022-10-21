<template>
  <Datepicker
    v-model="value"
    :flow="uiElement.flow"
    :style="uiElement.style"
    :class="uiElement.class"
    :inline="safeGet(uiElement, 'inline', false)"
    :locale="safeGet(uiElement, 'locale', config.get('locale'))"
    :selectText="uiElement.selectText"
    :enableTimePicker="safeGet(uiElement, 'enableTimePicker', true)"
    :autoApply="safeGet(uiElement, 'autoApply', false)"
    :minDate="uiElement.minDate"
    :maxDate="uiElement.maxDate"
    :disabledDates="safeGet(uiElement, 'disabledDates', [])"
    :highlight="safeGet(uiElement, 'highlight', [])"
    :monthChangeOnScroll="safeGet(uiElement, 'monthChangeOnScroll', true)"
    @update:modelValue="changed"
  />
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  data() {
    return {
      value: null,
    };
  },
  created() {
    // set value
    if (this.data && this.uiElement.key)
      this.value = obj.get(this.data, this.uiElement.key);
  },
  watch: {
    value: function (curr, old) {
      if (this.data && this.uiElement.key) {
        obj.set(this.data, this.uiElement.key, curr);
      }
    },
  },
  methods: {
    changed() {
      if (this.uiElement.changed) {
        try {
          eval(this.uiElement.changed);
        } catch {}
      }
    },
  },
});
</script>
