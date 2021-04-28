<template>
  <keep-alive>
    <div
      v-if="uiElement.tableType == 'list'"
      :style="uiElement.style"
      :class="uiElement.class"
    >
      <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
      <div
        v-for="(item, index) of rows"
        :key="index"
        :style="uiElement.itemBoxStyle"
        :class="uiElement.itemBoxClass"
        @click="click($event, uiElement, item)"
      >
        <UiElement
          v-for="(column, index) in uiElement.columns"
          v-bind:key="index"
          v-bind:uiElement="column"
          v-bind:data="item"
        />
      </div>
    </div>

    <v-virtual-scroll
      v-if="!uiElement.tableType || uiElement.tableType == 'virtual'"
      :items="rows"
      :item-height="safeGet(uiElement, 'itemHeight', 50)"
      :style="uiElement.style"
      :class="uiElement.class"
      :height="height"
      width="100%"
    >
      <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
      <template v-slot:default="{ item }">
        <div
          :style="uiElement.itemBoxStyle"
          :class="uiElement.itemBoxClass"
          @click="click($event, uiElement, item)"
        >
          <UiElement
            v-for="(column, index) in uiElement.columns"
            v-bind:key="index"
            v-bind:uiElement="column"
            v-bind:data="item"
          />
        </div>
      </template>
    </v-virtual-scroll>
  </keep-alive>
</template>

<script>
import Vue from "vue";
import Base from "./Base";
const obj = require("object-path");
const moment = require("moment");

export default Vue.component("data-table", {
  extends: Base,
  props: ["uiElement", "data"],
  data: function () {
    return {
      rows: [],
      height: 1000,
      requestTimeout: null,
      loading: true,
    };
  },
  mounted: function () {    
    // subscribe to refresh
    if (this.uiElement.key) {
      this.event.subscribe(this.uiElement.key, "refresh", (event) => {
        if (event.key == this.uiElement.key) this.requestDownload();
      });
    }

    // download request
    this.requestDownload();
  },
  destroyed: function () {
    if (this.uiElement.key) {
      this.event.unsubscribe_all(this.uiElement.key);
    }
  },
  methods: {
    async requestDownload() {
      clearTimeout(this.requestTimeout);
      this.requestTimeout = setTimeout(async () => {
        // load initial configuration
        if (this.uiElement.src) {
          let src = this.uiElement.src;
          try {
            src = eval(src);
          } catch (ex) {
            //
            console.error(ex);
          }

          let method = obj.get(this.uiElement, "method", "get");

          // pagination
          this.size = obj.get(this.uiElement, "size", 10);
          if (!this.page) {
            this.page = obj.get(this.uiElement, "page", 1);
          }
          let data = {
            size: this.size,
            page: this.page,
          };

          // start loading
          this.loading = true;

          let response = await this.rest.request(src, data, method);
          response = response.data;

          // stop loading
          this.loading = false;

          if (this.uiElement.transform) {
            try {
              this.rows = eval(this.uiElement.transform);
            } catch (ex) {
              console.error(ex);
            }
          } else {
            this.rows = response;
          }
        } else {
          // retrieve rows from the key
          if (this.uiElement.key) {
            this.rows = obj.get(this.data, this.uiElement.key, []);
          }
        }
      }, 1000);
    },
  },
  watch: {
    rows: function (newRows, oldRows) {
      if (this.data && this.uiElement.key)
        obj.set(this.data, this.uiElement.key, newRows);
      this.event.send({ name: "data" });
    },
  },
});
</script>