<template>
  <keep-alive>
    <div
      v-if="uiElement.type == 'layout'"
      v-bind:class="uiElement.layoutClass"
      v-bind:style="uiElement.layoutStyle"
    >
      <UiElement
        v-for="(ui, index) in uiElement.screens"
        v-bind:key="index"
        v-bind:uiElement="filterUiElement(ui, data)"
        v-bind:data="filterData(ui, data)"
      />
    </div>
    <Typography
      v-if="uiElement.type == 'typography'"
      v-bind:uiElement="filterUiElement(uiElement, data)"
      v-bind:data="filterData(uiElement, data)"
      v-bind:class="uiElement.layoutClass"
      v-bind:style="uiElement.layoutStyle"
    />
    <Input
      v-if="uiElement.type == 'input'"
      v-bind:uiElement="filterUiElement(uiElement, data)"
      v-bind:data="filterData(uiElement, data)"
      v-bind:class="uiElement.layoutClass"
      v-bind:style="uiElement.layoutStyle"
    />
    <Button
      v-if="uiElement.type == 'button'"
      v-bind:uiElement="filterUiElement(uiElement, data)"
      v-bind:data="filterData(uiElement, data)"
      v-bind:class="uiElement.layoutClass"
      v-bind:style="uiElement.layoutStyle"
    />
    <DataTable
      v-if="uiElement.type == 'data-table'"
      v-bind:uiElement="filterUiElement(uiElement, data)"
      v-bind:data="filterData(uiElement, data)"
      v-bind:class="uiElement.layoutClass"
      v-bind:style="uiElement.layoutStyle"
    />
  </keep-alive>
</template>

<script>
import Vue from "vue";
import Base from "./Base";
import Typography from "./Typography";
import Input from "./Input";
import Button from "./Button";
import DataTable from "./DataTable";

export default Vue.component("UiElement", {
  extends: Base,
  components: {
    Typography,
    Input,
    Button,
    DataTable
  },
  props: ["uiElement", "data"]
});
</script>