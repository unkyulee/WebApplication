<template>
  <div :style="uiElement.layoutStyle" :class="uiElement.layoutClass">
    <v-btn
      :icon="uiElement.icon"
      :color="uiElement.color"
      :style="uiElement.buttonStyle"
      :class="uiElement.buttonClass"
      :depressed="uiElement.depressed"
      :rounded="uiElement.rounded"
      :plain="uiElement.plain"
      :fab="uiElement.fab"
      :dark="uiElement.dark"
      :small="uiElement.small"
      :text="uiElement.text"
      @click="click($event, uiElement, data)"
    >
      <v-icon v-if="uiElement.icon" :color="uiElement.dark ? 'white' : ''">{{
        uiElement.icon
      }}</v-icon>
      {{ label() }}
      <v-badge
        v-if="uiElement.badge"
        :content="uiElement.badge"
        :color="uiElement.color"
        :overlap="uiElement.overlap"
        :left="uiElement.left"
        :bottom="uiElement.bottom"
        :dot="uiElement.dot"
        :icon="uiElement.badgeIcon"
        :style="uiElement.style"
        :class="uiElement.class"
      >
      </v-badge>
    </v-btn>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import * as obj from "object-path";
import * as moment from "moment";

import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
});
</script>
