<template>
  <v-img
    :class="uiElement.class"
    :style="uiElement.style"
    :height="uiElement.height"
    :max-height="uiElement.maxHeight"
    :width="uiElement.width"
    :max-width="uiElement.maxWidth"
    :contain="uiElement.contain"
    :src="safeEval(uiElement.src)"
    :cover="safeGet(uiElement, 'cover', true)"
    lazy-src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
    @click="click($event)"
  >
    <template v-slot:placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular indeterminate color="error"></v-progress-circular>
      </v-row>
    </template>
  </v-img>
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
