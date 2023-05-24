<template>
  <iframe
    v-if="condition(uiElement)"
    :src="safeEval(uiElement.src)"
    :style="uiElement.style"
    :class="uiElement.class"
  ></iframe>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
});
</script>
