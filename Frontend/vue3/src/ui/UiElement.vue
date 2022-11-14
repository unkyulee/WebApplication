<template>
  <component
    v-if="ready && condition(uiElement)"
    :is="uiElement.type"
    :data="data"
    :uiElement="uiElement"
    :style="uiElement.layoutStyle"
    :class="uiElement.layoutClass"
  >
  </component>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import Layout from "./Layout.vue";
import Typography from "./Typography.vue";
import ImageLoader from "./Image.vue";
import ButtonComponent from "./Button.vue";
import InputComponent from "./Input.vue";
import Selection from "./Selection.vue";
import TableComponent from "./Table.vue";
import Divider from "./Divider.vue";
import Carousel from "./Carousel.vue";
import Date from "./Date.vue";
import ExpansionPanel from "./ExpansionPanel.vue";
import Icon from "./Icon.vue";
import IframeComponent from "./Iframe.vue";
import ProgressComponent from "./Progress.vue";
import Tabs from "./Tabs.vue";
import Gallery from "./Gallery.vue";
import Alert from "./Alert.vue";
import CodeEditor from "./CodeEditor.vue";
import FileUploadComponent from "./FileUpload.vue";

import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  props: ["uiElement", "data"],
  inject: ["config", "event", "rest", "ui", "auth"],
  components: {
    Layout,
    Typography,
    ImageLoader,
    ButtonComponent,
    Selection,
    TableComponent,
    InputComponent,
    Divider,
    Carousel,
    Date,
    ExpansionPanel,
    Icon,
    IframeComponent,
    ProgressComponent,
    Tabs,
    Gallery,
    Alert,
    CodeEditor,
    FileUploadComponent,
  },
  data: function () {
    return {
      ready: false,
    };
  },
  created() {
    // prepare uielement
    this.ready = false;

    (async () => {
      // compile ui
      await this.ui.compile(this.uiElement);

      // translate type
      this.ui.translate_type(this.uiElement);

      // uiElement ready
      this.ready = true;
    })();
  },
});
</script>
