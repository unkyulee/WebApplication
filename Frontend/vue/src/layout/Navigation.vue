<template>
  <md-list>
    <md-list-item v-for="(nav, index) of navigations" :key="index" :to="nav.url" @click="click()">{{nav.name}}</md-list-item>
  </md-list>
</template>

<script>
import Base from "../ui/Base";

//
const obj = require("object-path");
const moment = require("moment");

export default {
  extends: Base,
  data: function() {
    return {
      navigations: []
    };
  },
  mounted: async function() {
    // load navigation
    this.navigations = this.config.get("navigations");
  },
  methods: {
    click() {
      this.event.send({ name: "drawer", data: false });
    }
  }
};
</script>

<style scoped>
.md-list {
  width: 320px;
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  border: 1px solid rgba(#000, 0.12);
}
</style>