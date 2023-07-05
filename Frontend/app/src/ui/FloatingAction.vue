<template>
  <SpeedDial
    :model="uiElement.items"
    :direction="uiElement.direction"
    :style="uiElement.style"
    :class="uiElement.class"
    :buttonClass="uiElement.buttonClass"
    :tooltipOptions="uiElement.tooltipOptions"
    :showIcon="uiElement.showIcon"
    :hideIcon="uiElement.hideIcon"
  />
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
});
</script>
