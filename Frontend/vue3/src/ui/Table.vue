<template>
  <div :style="uiElement.layoutStyle" :class="uiElement.layoutClass">
    <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
    <VirtualScroller
      v-if="!uiElement.tableType || uiElement.tableType == 'virtual'"
      :items="rows"
      :itemSize="parseInt(uiElement?.itemHeight ?? 100)"
      :style="uiElement.style"
      :class="uiElement.class"
    >
      <template v-slot:item="{ item }">
        <div
          :style="uiElement.itemBoxStyle"
          :class="uiElement.itemBoxClass"
          @click="click($event, uiElement, item)"
        >
          <ui-element
            v-for="column in uiElement?.columns ?? []"
            :uiElement="{ ...column }"
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
        v-for="item of rows"
        :style="uiElement.itemBoxStyle"
        :class="uiElement.itemBoxClass"
        @click="click($event, uiElement, item)"
      >
        <ui-element
          v-for="column in uiElement?.columns ?? []"
          :uiElement="column"
          :data="item"
        />
      </div>
    </div>

    <DataTable
      v-if="uiElement.tableType == 'table'"
      responsiveLayout="scroll"
      :style="uiElement.style"
      :class="uiElement.class"
      :value="rows"
    >
      <Column
        v-for="col of uiElement?.columns ?? []"
        :field="col.key"
        :header="col.label"
        :key="col.key"
      >
        <template #body="slotProps">
          <ui-element :uiElement="col" :data="slotProps.data" />
        </template>
      </Column>
    </DataTable>
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
      requestTimeout: null,
    };
  },
  created() {
    // subscribe to refresh
    if (this.uiElement.key) {
      //
      obj.ensureExists(this.data, this.uiElement.key, []);
      obj.set(this.data, `${this.uiElement.key}_total`, 0);

      //
      this.event.subscribe(this.uiElement.key, "refresh", async (event) => {
        if (event.key == this.uiElement.key) await this.requestDownload();
      });
    }

    // download request
    this.requestDownload();
  },
  unmounted() {
    this.event.unsubscribe_all(this.uiElement.key);
  },
  methods: {
    async requestDownload() {
      clearTimeout(this.requestTimeout);
      this.requestTimeout = setTimeout(async () => {
        // load initial configuration
        if (this.uiElement.src) {
          let src = this.uiElement.src;
          try {
            // start loading
            this.loading = true;
            src = await eval(src);
            // start loading
            this.loading = false;
          } catch (ex) {
            //
            console.error(ex);
          }
          if (!src) return;

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
            // start loading
            this.loading = false;
            // download completed
          } catch (ex) {
            console.error(ex);
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
      if (this.uiElement && this.uiElement.key)
        return obj.get(this.data, this.uiElement.key, []);
      return [];
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
