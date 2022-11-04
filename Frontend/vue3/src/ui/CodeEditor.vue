<template>
  <MonacoEditor
    :style="uiElement.style"
    :theme="uiElement.theme || 'vs-dark'"
    :language="uiElement.language || 'json'"
    :options="uiElement.options"
    @change="onChange"
    v-model:value="value"
  ></MonacoEditor>
</template>

<script lang="ts">
// @ts-nocheck
import MonacoEditor from "monaco-editor-vue3";

import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  data() {
    return {
      value: "",
    };
  },
  components: {
    MonacoEditor,
  },
  mounted() {
    // get value
    if (this.data && typeof this.uiElement.key != "undefined") {
      // retrieve value
      let value = obj.get(this.data, this.uiElement.key);

      // go through transform
      if (this.uiElement.transform) {
        try {
          eval(this.uiElement.transform);
        } catch (ex) {
          console.error(ex);
        }
      }
      // set value
      this.value = value;
    }
  },
  methods: {
    onChange(value) {
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
