<template>
  <!-- Simple List -->
  <div
    v-if="uiElement.tableType == 'list'"
    v-bind:style="uiElement.contentLayoutStyle"
    v-bind:class="uiElement.contentLayoutStyle"
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
</template>

<script>
import Vuew from "vue";
import Base from "./Base";

//
const obj = require("object-path");
const moment = require("moment");

export default {
  extends: Base,
  props: ["uiElement", "data"],
  mounted: function() {
    // subscribe to refresh
    if (this.uiElement.key) {
      this.event.subscribe(this.uiElement.key, "refresh", () => {
        this.requestDownload();
      });
    }

    // download request
    this.requestDownload();
  },
  destroyed: function() {
    if (this.uiElement.key) {
      this.event.unsubscribe_all(this.uiElement.key);
    }
  },
  methods: {
    async requestDownload() {
      // load initial configuration
      if (this.uiElement.src) {
        let src = this.uiElement.src;
        try {
          src = eval(src);
        } catch (ex) {
          //
          console.error(ex);
        }
        this.event.send({ name: "splash-show" });
        let response = await this.rest.request(src);
        this.event.send({ name: "splash-hide" });
        response = response.data;
        if (this.uiElement.transform) {
          try {
            response = eval(this.uiElement.transform);
          } catch (ex) {
            console.error(ex);
          }
        }

        this.rows = response;
        this.event.send({ name: "data", data: this.data });
      }
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
  },
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
      set: function(v) {
        if (this.data && this.uiElement.key) {
          obj.set(this.data, this.uiElement.key, v);
        }
      }
    }
  }
};
</script>