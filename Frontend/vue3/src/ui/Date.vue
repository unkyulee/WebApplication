<template>
  <Datepicker
    v-model="value"
    :flow="uiElement.flow"
    :style="uiElement.style"
    :class="uiElement.class"
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
});
</script>
