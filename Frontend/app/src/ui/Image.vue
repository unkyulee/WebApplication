<template>
  <v-img
    :class="uiElement.class"
    :style="uiElement.style"
    :height="uiElement.height"
    :max-height="uiElement.maxHeight"
    :width="uiElement.width"
    :max-width="uiElement.maxWidth"
    :src="image"
    :cover="safeGet(uiElement, 'cover', false)"
    lazy-src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
    @click="click($event)"
  >
    <template v-slot:placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular
          indeterminate
          color="blue-lighten-3"
        ></v-progress-circular>
      </v-row>
    </template>
  </v-img>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  data() {
    return {
      refreshKey: 0,
      src: "",
      // ...
    };
  },
  async created() {
    if (this.uiElement.srcType == "firebase") {
      if (this.uiElement.key) {
        let path = obj.get(this.data, this.uiElement.key, "");
        if (path) {
          let src = await this.storage.url(path);
          this.src = `"${src}"`;
        }
      }
    } else {
      this.src = this.uiElement.src;
    }

    // in order to trigger async changes to be applied in computed
    this.refreshKey = new Date().getTime();
  },
  computed: {
    image() {
      //
      this.refreshKey;
      return this.safeEval(this.src);
    },
  },
});
</script>
