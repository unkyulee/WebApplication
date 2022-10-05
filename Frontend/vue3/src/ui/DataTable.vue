<template>
  <div :style="uiElement.layoutStyle" :class="uiElement.layoutClass">
    <DynamicScroller
      :items="rows"
      :min-item-size="50"
      key-field="_id"
      :style="uiElement.style"
      :class="uiElement.class"
    >
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem :item="item" :active="active" :data-index="index">
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
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import * as obj from "object-path";
import * as moment from "moment";

import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
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
      }, 1000);
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
