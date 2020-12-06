<template>
  <v-snackbar v-model="show">
    {{ text }}
    <template v-slot:action="{ attrs }">
      <v-btn color="pink" text v-if="action" v-bind="attrs" @click="click()">
        {{ action.label }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import Vue from "vue";
import Base from "./Base";
const obj = require("object-path");

export default Vue.component("snackbar", {
  extends: Base,
  data: function () {
    return {
      show: false,
      text: "",
      action: null,
    };
  },
  mounted: function () {
    // subscribe to refresh
    this.event.subscribe(this._uid, "snackbar", (event) => {
      this.text = event.text;
      this.action = event.action;
      this.show = true;
    });
  },
  destroyed: function () {
    this.event.unsubscribe_all(this._uid);
  },
  methods: {
    click() {
      this.show = false;
      if (obj.get(this, "action.click")) {
        try {
          eval(obj.get(this, "action.click"));
        } catch (ex) {
          console.error(ex);
        }
      }
    },
  },
});
</script>