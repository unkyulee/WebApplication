<template>
  <div :style="uiElement.layoutStyle" :class="uiElement.layoutClass">
    <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
    <VirtualScroller
      v-if="!uiElement.tableType || uiElement.tableType == 'virtual'"
      :items="rows"
      :itemSize="parseInt(safeGet(uiElement, 'itemHeight', 100))"
      :style="uiElement.style"
      :class="uiElement.class"
    >
      <template v-slot:item="{ item, options }">
        <div
          :style="uiElement.itemBoxStyle"
          :class="uiElement.itemBoxClass"
          @click="click($event, uiElement, item)"
        >
          <ui-element
            v-for="(column, index) in uiElement.columns"
            :key="index"
            :uiElement="column"
            :data="item"
          />
        </div>
      </template>
    </VirtualScroller>

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
        <ui-element
          v-for="(column, index) in uiElement.columns"
          v-bind:key="index"
          v-bind:uiElement="column"
          v-bind:data="item"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  inheritAttrs: false,
  data() {
    return {
      loading: false,
    };
  },
  created: function () {
    // subscribe to refresh
    if (this.uiElement.key) {
      //
      obj.set(this.data, this.uiElement.key, []);
      obj.set(this.data, `${this.uiElement.key}_total`, 0);

      //
      this.event.subscribe(this._uid, "refresh", (event) => {
        if (event.key == this.uiElement.key) this.requestDownload();
      });
    }

    // download request
    this.requestDownload();
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

          let response;
          try {
            // start loading
            this.loading = true;

            // download data
            response = await this.rest.request(src, data, method);
            response = response.data;
            // download completed
          } catch (ex) {
            console.error(ex);
          } finally {
            // stop loading
            this.loading = false;
          }

          // transformed
          let rows = response;
          if (this.uiElement.transform) {
            try {
              rows = eval(this.uiElement.transform);
            } catch (ex) {
              console.error(ex);
            }
          }

          let total = rows.length;
          if (this.uiElement.transformTotal) {
            try {
              total = eval(this.uiElement.transformTotal);
            } catch (ex) {
              console.error(ex);
            }
          }
          obj.set(this.data, `${this.uiElement.key}_total`, total);

          // save to data
          if (this.uiElement.key) {
            obj.set(this.data, this.uiElement.key, rows);
          }
        }
      }, 300);
    },
  },
  computed: {
    rows() {
      return obj.get(this.data, this.uiElement.key, []);
    },
    total() {
      return obj.get(
        this.data,
        `${this.uiElement.key}_total`,
        this.rows.length
      );
    },
  },
});
</script>

<style scoped>
.scroller {
  height: 100%;
}
</style>
