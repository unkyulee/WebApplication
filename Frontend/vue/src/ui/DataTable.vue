<template>
  <!-- Simple List -->
  <div
    v-if="uiElement.tableType == 'list'"
    :style="uiElement.contentLayoutStyle"
    :class="uiElement.contentLayoutStyle"
  >
    <RecycleScroller
      class="scroller"
      :items="rows ? rows : []"
      :item-size="rows ? rows.length : 0"
      key-field="_id"
      v-slot={item}
    >
       <UiElement
        v-for="(column, index) in uiElement.columns"
        v-bind:key="index"
        v-bind:uiElement="filterUiElement(column, item)"
        v-bind:data="filterData(column, item)"
      />
    </RecycleScroller>
    <paginate
      v-if="pageCount > 1"
      :page-count="pageCount"
      :click-handler="changePage"
      :prev-text="'<<'"
      :next-text="'>>'"
      :container-class="'pagination'"
      :page-class="'page-item'"
      :page-link-class="'page-link-item'"
      :prev-class="'prev-item'"
      :prev-link-class="'prev-link-item'"
      :next-class="'next-item'"
      :next-link-class="'next-link-item'"
      :break-view-class="'break-view'"
      :break-view-link-class="'break-view-link'"
    ></paginate>
  </div>
</template>

<script>
import Vue from "vue";
import Base from "./Base";
import Paginate from "vuejs-paginate";
Vue.component("paginate", Paginate);

//
const obj = require("object-path");
const moment = require("moment");

export default {
  extends: Base,
  props: ["uiElement", "data"],
  data: function() {
    return {
      size: 0,
      page: 0,
      total: 0
    };
  },
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

        let method = obj.get(this.uiElement, "method", "get");

        // pagination
        this.size = obj.get(this.uiElement, "size", 10);
        if (!this.page) {
          this.page = obj.get(this.uiElement, "page", 1);
        }
        let data = {
          size: this.size,
          page: this.page
        };

        //
        this.event.send({ name: "splash-show" });
        let response = await this.rest.request(src, data, method);
        this.event.send({ name: "splash-hide" });
        response = response.data;
        if (this.uiElement.transform) {
          try {
            this.rows = eval(this.uiElement.transform);
          } catch (ex) {
            console.error(ex);
          }
        }

        // get total records
        let transformTotal = this.uiElement.transformTotal || "response.total";
        try {
          this.total = parseInt(eval(transformTotal));
        } catch (e) {}
        if (this.total != 0 && !this.total)
          this.total = obj.get(this, "rows", []).length;

        this.event.send({ name: "data", data: this.data });
      }
    },
    async changePage(pageNum) {
      this.page = pageNum;
      await this.requestDownload();
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
    },
    pageCount: {
      get: function() {
        return (
          (this.total == 0 ? 1 : this.total) / (this.size == 0 ? 1 : this.size)
        );
      }
    }
  }
};
</script>