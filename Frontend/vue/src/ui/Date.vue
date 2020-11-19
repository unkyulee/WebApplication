<template>
  <keep-alive>
    <!-- date -->
    <v-menu
      v-if="uiElement.dateType == 'date'"
      :close-on-content-click="true"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="value"
          :label="uiElement.label"
          :class="uiElement.class"
          :style="uiElement.style"
          :filled="uiElement.appearance == 'fill'"
          :solo="uiElement.appearance == 'solo'"
          :outlined="uiElement.appearance == 'outline'"
          :dense="uiElement.dense"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="value"></v-date-picker>
    </v-menu>

    <!-- date-inline -->
    <v-date-picker
      v-if="uiElement.dateType == 'date-inline'"
      v-model="value"
      :full-width="uiElement.fullWidth"
      :no-title="uiElement.noTitle"
      :allowed-dates="allowedDates"
    ></v-date-picker>

    <!-- time picker -->
    <v-menu
      ref="timepickermenu"
      v-model="timepickermenu"
      v-if="uiElement.dateType == 'time'"
      :close-on-content-click="false"
      :nudge-right="40"
      :return-value.sync="value"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="value"
          :label="uiElement.label"
          :class="uiElement.class"
          :style="uiElement.style"
          :filled="uiElement.appearance == 'fill'"
          :solo="uiElement.appearance == 'solo'"
          :outlined="uiElement.appearance == 'outline'"
          :dense="uiElement.dense"
          prepend-icon="mdi-clock-time-four-outline"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-time-picker
        v-if="timepickermenu"
        v-model="value"
        :format="uiElement.format"
        full-width
        @click:minute="$refs.timepickermenu.save(value)"
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
      value: null,
      timepickermenu: null,
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
      if (this.data && this.uiElement.key && curr) {
        // retrieve current data
        let oldDate = new Date(obj.get(this.data, this.uiElement.key));

        // set YYYY-MM-DD part of the date
        if (
          this.uiElement.dateType == "date-inline" ||
          this.uiElement.dateType == "date"
        ) {
          let newDate = new Date(curr);

          oldDate.setFullYear(
            newDate.getFullYear(),
            newDate.getMonth(),
            newDate.getDate()
          );
        }

        // set HH:mm part of the date
        else if (this.uiElement.dateType == "time") {
          let newDate = moment(curr, 'HH:mm a').toDate();

          oldDate.setHours(newDate.getHours());
          oldDate.setMinutes(newDate.getMinutes());
        }

        // update data
        obj.set(this.data, this.uiElement.key, oldDate);
      }
      this.changed();
    },
  },
  methods: {
    format(v) {
      if (v) {
        if (
          this.uiElement.dateType == "date-inline" ||
          this.uiElement.dateType == "date"
        ) {
          return moment(v).format("YYYY-MM-DD");
        } else if (this.uiElement.dateType == "time") {
          return moment(v).format("HH:mm");
        }
      }
      return null;
    },
    changed(e) {
      this.event.send({ name: "data" });

      // trigger custom event
      if (this.uiElement.changed) {
        try {
          eval(this.uiElement.changed);
        } catch (ex) {
          console.error(ex);
        }
      }
    },
    allowedDates(v) {
      if(this.uiElement.allowedDates) {
        return this.uiElement.allowedDates.indexOf(v) > -1
      }
      return true;
    }
  },
});
</script>
