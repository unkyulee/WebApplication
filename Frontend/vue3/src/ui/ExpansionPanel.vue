<template>
  <Accordion
    :multiple="uiElement.multiple"
    :class="uiElement.class"
    :style="uiElement.style"
    :activeIndex="uiElement.activePanel"
  >
    <AccordionTab v-for="(panel, i) in uiElement.panels" :key="i">
      <template #header>
        <div v-html="panel.header.label" :style="uiElement.headerStyle"></div>
      </template>

      <ui-element
        v-for="(ui, index) in panel.screens"
        :key="index"
        :uiElement="ui"
        :data="data"
        :class="ui.layoutClass"
        :style="ui.layoutStyle"
      />
    </AccordionTab>
  </Accordion>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";

import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  data: () => ({
    panel: [],
  }),
  mounted: function () {
    // data refresh
    this.event.subscribe(this._uid, "panel", (event) => {
      this.panel = event.panel;
    });
  },
  destroyed: function () {
    //
    this.event.unsubscribe_all(this._uid);
  },
  watch: {
    panel: function (curr, old) {
      if (this.uiElement.panelChanged) {
        try {
          eval(this.uiElement.panelChanged);
        } catch (ex) {
          console.error(ex, this.uiElement);
        }
      }
    },
  },
});
</script>
