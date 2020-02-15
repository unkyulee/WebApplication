<template>
  <div v-bind:style="uiElement.layoutStyle" v-bind:class="uiElement.layoutClass">
    <!-- Simple List -->
    <div
      v-if="uiElement.tableType == 'list'"
      v-bind:style="uiElement.contentLayoutStyle"
      v-bind:class="uiElement.contentLayoutClass"
    >
      <div
        v-for="(row, index) of rows"
        v-bind:key="index"
        v-bind:style="uiElement.itemBoxStyle"
        v-bind:class="uiElement.itemBoxClass"
        @click="click($event, uiElement, row)"
      >
        <UiElement
          v-for="(column, index) in uiElement.columns"
          v-bind:key="index"
          v-bind:uiElement="filterUiElement(column, row)"
          v-bind:data="filterData(column, row)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Base from "./Base";

//
const obj = require("object-path");

export default {
  extends: Base,
  computed: {
    rows: {
      get: function() {
        let rows = [];
        if (this.data && this.uiElement.key) {
          rows = obj.get(this.data, this.uiElement.key);
        }

        if (typeof this._rows != "undefined" && !Array.isArray(this._rows))
          rows = [rows];

        return rows;
      },
      set: function(val) {}
    }
  }
};
</script>