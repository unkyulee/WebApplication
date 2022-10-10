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

// implict reference
import * as obj from "object-path";
import * as moment from "moment";

//
import Base from "../../ui/Base";
import UiElements from "./UiElements.vue";
import Typography from "../../ui/Typography.vue";
import ImageLoader from "../../ui/Image.vue";
import ButtonComponent from "../../ui/Button.vue";
import InputComponent from "../../ui/Input.vue";
import Selection from "../../ui/Selection.vue";
import DataTable from "../../ui/DataTable.vue";
import Divider from "../../ui/Divider.vue";
import Carousel from "../../ui/Carousel.vue";
import Date from "../../ui/Date.vue";
import ExpansionPanel from "../../ui/ExpansionPanel.vue";
import Icon from "../../ui/Icon.vue";
import IframeComponent from "../../ui/Iframe.vue";
import ProgressComponent from "../../ui/Progress.vue";
import Tabs from "../../ui/Tabs.vue";
import Timer from "../../ui/Timer.vue";
import Gallery from "../../ui/Gallery.vue";
import Alert from "../../ui/Alert.vue";

import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  props: ["uiElement", "data"],
  inject: ["config", "event", "rest", "ui", "auth"],
  components: {
    UiElements,
    Typography,
    ImageLoader,
    ButtonComponent,
    Selection,
    DataTable,
    InputComponent,
    Divider,
    Carousel,
    Date,
    ExpansionPanel,
    Icon,
    IframeComponent,
    ProgressComponent,
    Tabs,
    Timer,
    Gallery,
    Alert,
  },
  data: function () {
    return {
      ready: false,
    };
  },
  async mounted() {
    // prepare uielement
    this.ready = false;

    // compile ui
    await this.ui.compile(this.uiElement);

    // translate type
    this.ui.translate_type(this.uiElement);

    // uiElement ready
    this.ready = true;
  },
});
</script>
