<template>
  <v-btn
    :icon="uiElement.icon"
    :color="uiElement.color"
    :style="uiElement.style"
    :class="uiElement.class"
    :depressed="uiElement.depressed"
    :rounded="uiElement.rounded"
    :plain="uiElement.plain"
    :fab="uiElement.fab"
    :dark="uiElement.dark"
    :small="uiElement.small"
    :text="uiElement.text"
    @click="click($event, uiElement, data)"
  >
    {{ label() }}
    <v-badge
      v-if="uiElement.badge"
      :content="uiElement.badge"
      :color="uiElement.badgeColor"
      :overlap="uiElement.overlap"
      :left="uiElement.left"
      :bottom="uiElement.bottom"
      :dot="uiElement.dot"
      :icon="uiElement.badgeIcon"
    >
      <v-icon v-if="uiElement.icon" :style="uiElement.iconStyle">{{
        uiElement.icon
      }}</v-icon>
    </v-badge>
  </v-btn>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
});
</script>
