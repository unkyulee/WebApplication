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
    <Chips
      v-if="uiElement.type == 'chips' && condition(uiElement)"
      :uiElement="filterUiElement(uiElement, data)"
      :data="filterData(uiElement, data)"
      :class="uiElement.layoutClass"
      :style="uiElement.layoutStyle"
    />
    <Dialog
      v-if="uiElement.type == 'dialog' && condition(uiElement)"
      :uiElement="filterUiElement(uiElement, data)"
      :data="filterData(uiElement, data)"
      :class="uiElement.layoutClass"
      :style="uiElement.layoutStyle"
    />
    <Select
      v-if="uiElement.type == 'selection' && condition(uiElement)"
      :uiElement="filterUiElement(uiElement, data)"
      :data="filterData(uiElement, data)"
      :class="uiElement.layoutClass"
      :style="uiElement.layoutStyle"
    />
  </keep-alive>
</template>

<script>
import Vue from "vue";
const obj = require("object-path");
const moment = require("moment");

import Base from "./Base";
import Typography from "./Typography";
import Input from "./Input";
import Button from "./Button";
import DataTable from "./DataTable";
import Stepper from "./Stepper";
import Divider from "./Divider";
import Chips from "./Chips";
import Dialog from "./Dialog";
import Select from "./Select";

export default Vue.component("UiElement", {
  props: ["uiElement", "data"],
  inject: ["config", "event", "rest", "ui"],
  components: {
    Typography,
    Input,
    Button,
    DataTable,
    Stepper,
    Divider,
    Chips,
    Dialog,
    Select
  },
  mounted: function() {
    if (
      this.uiElement &&
      this.uiElement.type == 'layout' &&
      this.uiElement.init
    ) {
      try {
        eval(this.uiElement.init);
      } catch (ex) {
        console.error(ex);
      }
    }
  },
  methods: {
    condition: function(uiElement) {
      let passed = true;
      if (uiElement.condition) {
        passed = eval(uiElement.condition);
      }
      return passed;
    },
    filterUiElement(uiElement, data) {
      if (uiElement.filterUiElement) {
        try {
          eval(uiElement.filterUiElement);
        } catch (ex) {
          console.error(ex);
        }
      }
      return uiElement;
    },
    filterData(uiElement, data) {
      if (uiElement.filterData) {
        try {
          eval(uiElement.filterData);
        } catch (ex) {
          console.error(ex);
        }
      }
      return data;
    }
  }
});
</script>