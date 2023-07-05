<template>
  <component
    v-if="ready && condition(uiElement)"
    :is="uiElement.type"
    :data="data"
    :uiElement="uiElement"
    :style="uiElement.layoutStyle"
    :class="uiElement.layoutClass"
    :transitionDelay="uiElement.transitionDelay"
  >
  </component>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import Layout from "./Layout.vue";
import UiElementId from "./UiElementId.vue";

//
import Alert from "./Alert.vue";
import ButtonComponent from "./Button.vue";
import Carousel from "./Carousel.vue";
import Date from "./Date.vue";
import Divider from "./Divider.vue";
import CodeEditor from "./CodeEditor.vue";
import ExpansionPanel from "./ExpansionPanel.vue";
import FileUploadComponent from "./FileUpload.vue";
import FloatingAction from "./FloatingAction.vue";
import Gallery from "./Gallery.vue";
import Icon from "./Icon.vue";
import IframeComponent from "./Iframe.vue";
import Typography from "./Typography.vue";
import ImageLoader from "./Image.vue";
import InputComponent from "./Input.vue";
import ProgressComponent from "./Progress.vue";
import PopupMenu from "./PopupMenu.vue";
import Selection from "./Selection.vue";
import Stepper from "./Stepper.vue";
import TableComponent from "./Table.vue";
import Tabs from "./Tabs.vue";

import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  props: ["uiElement", "data"],
  inject: ["config", "event", "rest", "ui", "auth"],
  components: {
    Layout,
    UiElementId,
    Alert,
    ButtonComponent,
    Carousel,
    CodeEditor,
    Date,
    Divider,
    ExpansionPanel,
    FileUploadComponent,
    FloatingAction,
    Gallery,
    InputComponent,
    Icon,
    IframeComponent,
    ImageLoader,
    ProgressComponent,
    PopupMenu,
    Selection,
    Stepper,
    Tabs,
    Typography,
    TableComponent,
  },
  data() {
    return {
      ready: false,
    };
  },
  async created() {
    // prepare uielement
    this.ready = false;

    // translate type
    this.ui.translate_type(this.uiElement);

    // uiElement ready
    this.ready = true;
  },
});
</script>
