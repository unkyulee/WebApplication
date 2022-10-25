<template>
  <Galleria :value="images">
    <template #item="slotProps">
      <img
        :src="src(slotProps.item)"
        :alt="slotProps.item.alt"
        :style="uiElement.imageStyle"
      />
    </template>
    <template #thumbnail="slotProps">
      <img
        :src="src(slotProps.item)"
        :alt="slotProps.item.alt"
        :style="uiElement.thumbnailStyle"
      />
    </template>
  </Galleria>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  methods: {
    src(item) {
      let _src;
      try {
        _src = eval(this.uiElement.src);
      } catch (ex) {
        console.error(ex, item.src);
      }
      return _src;
    },
  },
  computed: {
    images() {
      return obj.get(this.data, this.uiElement.key);
    },
  },
});
</script>
