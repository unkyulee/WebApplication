<template>
  <Accordion
    :multiple="uiElement.multiple"
    :class="uiElement.class"
    :style="uiElement.style"
    :activeIndex="uiElement.activePanel"
  >
    <AccordionTab v-for="(panel, i) in uiElement.panels">
      <template #header>
        <div v-html="panel.header.label" :style="uiElement.headerStyle"></div>
      </template>

      <ui-element
        v-for="ui in panel.screens"
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
  mounted() {
    // data refresh
    this.event.subscribe("ExpansionPanel", "panel", (event) => {
      this.panel = event.panel;
    });
  },
  unmounted() {
    //
    this.event.unsubscribe_all("ExpansionPanel");
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
