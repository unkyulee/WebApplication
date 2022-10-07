<template>
  <Galleria
    :value="uiElement.images"
    :showItemNavigators="safeGet(uiElement, 'showItemNavigators', true)"
    :showThumbnails="safeGet(uiElement, 'showThumbnails', true)"
    :style="uiElement.style"
    :class="uiElement.class"
  >
    <template #item="slotProps">
      <v-img
        :class="uiElement.imageClass"
        :style="uiElement.imageStyle"
        :height="uiElement.height"
        :max-height="uiElement.maxHeight"
        :width="uiElement.width"
        :max-width="uiElement.maxWidth"
        :contain="uiElement.contain"
        :src="slotProps.item.src"
        :cover="safeGet(uiElement, 'cover', true)"
        lazy-src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
        @click="click($event)"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="error"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </template>
  </Galleria>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
});
</script>
