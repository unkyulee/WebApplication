<template>
  <div
    v-if="!uiElement.selectionType || uiElement.selectionType == 'select'"
    :class="uiElement.layoutClass"
    :style="uiElement.layoutStyle"
  >
    <v-select
      v-model="value"
      :items="uiElement.options"
      :item-title="uiElement.itemTitle"
      :item-value="uiElement.itemValue"
      :class="uiElement.class"
      :style="uiElement.style"
      :filled="uiElement.appearance == 'fill'"
      :solo="uiElement.appearance == 'solo'"
      :outlined="uiElement.appearance == 'outline'"
      :dense="uiElement.dense"
      :rounded="uiElement.rounded"
      :label="uiElement.label"
    >
    </v-select>
  </div>

  <AutoComplete
    v-if="uiElement.selectionType == 'autocomplete'"
    v-model="value"
    :suggestions="uiElement.options"
    :optionLabel="uiElement.label"
    :field="uiElement.field"
    :placeholder="uiElement.placeholder"
    :minLength="uiElement.minLength"
    :dropdown="safeGet(uiElement, 'dropdown', true)"
    :inputClass="uiElement.class"
    :inputStyle="uiElement.style"
    :class="uiElement.layoutClass"
    :style="uiElement.layoutStyle"
    :panelClass="uiElement.panelClass"
    :panelStyle="uiElement.panelStyle"
    @complete="search($event)"
    @item-select="selected($event)"
  >
    <template #item="slotProps">
      <ui-element
        :uiElement="uiElement.optionTemplate"
        :data="slotProps.item"
      ></ui-element>
    </template>
  </AutoComplete>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  inheritAttrs: false,
  data: function () {
    return {
      value: null,
      searchText: null,
      requestTimeout: null,
    };
  },
  mounted: function () {
    // set value
    if (this.data && this.uiElement.key) {
      this.value = obj.get(this.data, this.uiElement.key);
    }
  },
  updated: function () {
    // set value
    if (this.data && this.uiElement.key)
      this.value = obj.get(this.data, this.uiElement.key);
  },
  watch: {
    value: function (curr, old) {
      if (this.data && this.uiElement.key) {
        obj.set(this.data, this.uiElement.key, curr);
      }
      this.changed();
    },
  },
  methods: {
    changed(e) {
      this.event.send({ name: "data" });
      //this.$set(this, 'data', this.data);
      this.$forceUpdate();

      // trigger custom event
      if (this.uiElement.changed) {
        try {
          eval(this.uiElement.changed);
        } catch (ex) {
          console.error(ex);
        }
      }
    },
    selected($event) {
      if (this.uiElement.selected) {
        try {
          let value = $event.value;
          eval(this.uiElement.selected);
        } catch (ex) {
          console.error(ex);
        }
      }
    },
    search($event) {
      this.searchText = $event.query;
      this.requestDownload();
    },
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

          // save to data
          if (this.uiElement.key) {
            obj.set(this.uiElement, "options", rows);
          }
        }
      }, 1000);
    },
  },
});
</script>
