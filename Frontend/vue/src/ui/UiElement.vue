<template>
  <keep-alive>
    <div
      v-if="uiElement.type == 'layout' && condition(uiElement)"
      :class="uiElement.layoutClass"
      :style="uiElement.layoutStyle"
    >
      <UiElement
        v-for="(ui, index) in uiElement.screens"
        :key="index"
        :uiElement="filterUiElement(ui, data)"
        :data="filterData(ui, data)"
      />
    </div>
    <Typography
      v-if="uiElement.type == 'typography' && condition(uiElement)"
      :uiElement="filterUiElement(uiElement, data)"
      :data="filterData(uiElement, data)"
      :class="uiElement.layoutClass"
      :style="uiElement.layoutStyle"
    />
    <Input
      v-if="uiElement.type == 'input' && condition(uiElement)"
      :uiElement="filterUiElement(uiElement, data)"
      :data="filterData(uiElement, data)"
      :class="uiElement.layoutClass"
      :style="uiElement.layoutStyle"
    />
    <Button
      v-if="uiElement.type == 'button' && condition(uiElement)"
      :uiElement="filterUiElement(uiElement, data)"
      :data="filterData(uiElement, data)"
      :class="uiElement.layoutClass"
      :style="uiElement.layoutStyle"
    />
    <DataTable
      v-if="uiElement.type == 'data-table' && condition(uiElement)"
      :uiElement="filterUiElement(uiElement, data)"
      :data="filterData(uiElement, data)"
      :class="uiElement.layoutClass"
      :style="uiElement.layoutStyle"
    />
    <Stepper
      v-if="uiElement.type == 'stepper' && condition(uiElement)"
      :uiElement="filterUiElement(uiElement, data)"
      :data="filterData(uiElement, data)"
      :class="uiElement.layoutClass"
      :style="uiElement.layoutStyle"
    />
    <Divider
      v-if="uiElement.type == 'divider' && condition(uiElement)"
      :uiElement="filterUiElement(uiElement, data)"
      :data="filterData(uiElement, data)"
      :class="uiElement.layoutClass"
      :style="uiElement.layoutStyle"
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
import Stepper from "./Stepper";
import Divider from "./Divider";

export default Vue.component("UiElement", {
  extends: Base,
  components: {
    Typography,
    Input,
    Button,
    DataTable,
    Stepper,
    Divider
  }
});
</script>