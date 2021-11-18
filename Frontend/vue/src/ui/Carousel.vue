<template>
  <v-carousel
    v-if="condition(uiElement)"
    :style="uiElement.style"
    :class="uiElement.class"
    :height="uiElement.height"
    :cycle="uiElement.cycle"
    :hide-delimiters="uiElement.hideDelimeters"
  >
    <v-carousel-item
      v-for="(slide, i) in uiElement.slides"
      :key="i"
      :src="slide.src"
    >
      <UiElement
        v-if="uiElement.slideTemplate"
        v-bind:key="i"
        v-bind:uiElement="uiElement.slideTemplate"
        v-bind:data="slide"
      />
    </v-carousel-item>
  </v-carousel>
</template>

<script>
import Vue from "vue";
import Base from "./Base";

export default Vue.component("carousel", {
  extends: Base,  
});
</script>
