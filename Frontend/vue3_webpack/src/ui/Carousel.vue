<template>
  <v-carousel
    v-if="condition(uiElement)"
    :style="uiElement.style"
    :class="uiElement.class"
    :height="uiElement.height"
    :cycle="uiElement.cycle"
    :hide-delimiters="uiElement.hideDelimeters"
  >
    <v-carousel-item v-for="(slide, i) in uiElement.slides" :src="slide.src">
      <UiElement
        v-if="uiElement.slideTemplate"
        :uiElement="uiElement.slideTemplate"
        :data="slide"
      />
    </v-carousel-item>
  </v-carousel>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
});
</script>
