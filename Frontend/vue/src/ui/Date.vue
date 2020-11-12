<template>
  <keep-alive>
    <!-- date -->
    <v-menu
      v-if="uiElement.dateType == 'date'"
      v-model="menu2"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="date"
          label="Picker without buttons"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="date" @input="menu2 = false"></v-date-picker>
    </v-menu>

    <!-- date-inline -->
    <v-date-picker
      v-if="uiElement.dateType == 'date-inline'"
      v-model="value"
      :no-title="uiElement.noTitle ? uiElement.noTitle : true"
    ></v-date-picker>

    <!-- time picker -->
    <v-menu
      v-if="uiElement.dateType == 'time'"
      ref="menu"
      v-model="menu2"
      :close-on-content-click="false"
      :nudge-right="40"
      :return-value.sync="time"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="time"
          label="Picker in menu"
          prepend-icon="mdi-clock-time-four-outline"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-time-picker
        v-if="time_picker"
        v-model="time"
        full-width
        @click:minute="$refs.menu.save(time)"
      ></v-time-picker>
    </v-menu>
  </keep-alive>
</template>

<script>
import Vue from "vue";

// utilities
import { debounce } from "debounce";
const obj = require("object-path");
const moment = require("moment");

// user imports
import Base from "./Base";

export default Vue.component("date", {
  extends: Base,
  data: function () {
    return {
      time_picker: false,
      value: null,
    };
  },
  mounted: function () {
    // changed
    this.changed = debounce(this.changed, 200);

    // set value
    if (this.data && this.uiElement.key)
      this.value = this.format(obj.get(this.data, this.uiElement.key));
  },
  updated: function () {
    // set value
    if (this.data && this.uiElement.key)
      this.value = this.format(obj.get(this.data, this.uiElement.key));
  },
  watch: {
    value: function (curr, old) {
      console.log(curr, old);
      if (this.data && this.uiElement.key && curr) {
        let oldDate = new Date(obj.get(this.data, this.uiElement.key));
        let newDate = new Date(curr);

        // set YYYY-MM-DD part of the date
        if (
          this.uiElement.dateType == "date-inline" ||
          this.uiElement.dateType == "date"
        ) {
          oldDate.setFullYear(
            newDate.getFullYear(),
            newDate.getMonth(),
            newDate.getDate()
          );
        }

        // set HH:mm part of the date

        obj.set(this.data, this.uiElement.key, oldDate);
        this.$set(this.data, this.uiElement.key, oldDate);
      }
      this.changed();
    },
  },
  methods: {
    format(v) {
      if (v) return moment(v).format("YYYY-MM-DD");
      return null;
    },
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
  },
});
</script>
