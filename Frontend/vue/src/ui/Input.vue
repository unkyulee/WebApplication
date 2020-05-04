<template>
  <keep-alive>
    <!-- Material Input -->
    <md-field
      v-if="
        !uiElement.inputType ||
        uiElement.inputType == 'text' ||
        uiElement.inputType == 'number' ||
        uiElement.inputType == 'email' ||
        uiElement.inputType == 'password'"
      :class="uiElement.class"
      :style="uiElement.style"
    >
      <label :style="uiElement.labelStyle">{{uiElement.label}}</label>
      <md-input v-model="value" :type="uiElement.inputType" @keyup="keyup" :id="uiElement.key"></md-input>
    </md-field>

    <!-- Textarea -->
    <md-field v-if="uiElement.inputType == 'textarea'" v-model="value">
      <label>{{uiElement.label}}</label>
      <md-textarea
        v-model="value"
        :md-autogrow="uiElement.autogrow"
        :rows="uiElement.rows"
        :class="uiElement.class"
        :style="uiElement.style"
      ></md-textarea>
    </md-field>

    <!-- Date Inline -->
    <date-pick
      v-if="uiElement.inputType == 'date-inline'"
      v-model="value"
      :hasInputElement="false"
      :weekdays="weekdays"
      :months="months"
      :isDateDisabled="isDateDisabled"
    ></date-pick>

    <!-- Date -->
    <datetime
      v-if="uiElement.inputType == 'datetime'"
      type="datetime"
      v-model="value"
      :class="uiElement.class"
      :input-style="uiElement.style"
      :placeholder="uiElement.label"
    ></datetime>

    <!-- Checkbox -->
    <md-checkbox
      v-model="value"
      :class="uiElement.class"
      :input-style="uiElement.style"
    >{{uiElement.label}}</md-checkbox>
  </keep-alive>
</template>

<script>
import Vue from "vue";
import { MdField } from "vue-material/dist/components";
// date picker
import DatePick from "vue-date-pick";
import "vue-date-pick/dist/vueDatePick.css";

// date time picker
import { Datetime } from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
Vue.use(Datetime);

// utilities
import { debounce } from "debounce";
const obj = require("object-path");
const moment = require("moment");

// user imports
import Base from "./Base";

// use MdField
Vue.use(MdField);

export default {
  extends: Base,
  components: { DatePick, Datetime },
  mounted: function() {
    // changed
    this.changed = debounce(this.changed, 200);

    // get locale
    this.locale = this.config.get("locale");

    if (
      this.uiElement.inputType == "date" ||
      this.uiElement.inputType == "date-inline"
    ) {
      // initialize the weekdays
      for (let i = 0; i < 7; i++)
        this.weekdays.push(
          moment()
            .startOf("week")
            .add(i, "days")
            .format("ddd")
        );

      // initialize the months
      for (let i = 0; i < 12; i++)
        this.months.push(
          moment()
            .startOf("year")
            .add(i, "months")
            .format("MMMM")
        );
    }
  },
  data: function() {
    return {
      locale: "",
      weekdays: [],
      months: []
    };
  },
  computed: {
    value: {
      get() {
        this._value = null;

        // do not set value if it is password
        if (this.uiElement.inputType == "password") return;

        if (this.data && this.uiElement.key) {
          // if null then assign default
          if (typeof obj.get(this.data, this.uiElement.key) == "undefined") {
            let def = this.uiElement.default;
            if (def) {
              try {
                def = eval(this.uiElement.default);
              } catch (e) {
                //
              }
              obj.set(this.data, this.uiElement.key, def);
            }
          }

          // set value
          this._value = obj.get(this.data, this.uiElement.key);
        }

        // Transform
        if (this.uiElement.transform) {
          try {
            this._value = eval(this.uiElement.transform);
          } catch (e) {
            //
          }
        }

        // if number
        if (this._value && this.uiElement.inputType == "number")
          this._value = parseFloat(this._value);

        return this._value;
      },
      set(v) {
        if (this.data && this.uiElement.key) {
          obj.set(this.data, this.uiElement.key, v);
          // if number
          if (v && this.uiElement.inputType == "number")
            obj.set(this.data, this.uiElement.key, parseFloat(v));
        }

        // changed
        this.changed();
      }
    }
  },
  methods: {
    changed(e) {
      if (this.uiElement.changed) {
        try {
          eval(this.uiElement.changed);
        } catch (ex) {
          console.error(ex);
        }
      }
    },
    isDateDisabled(date) {
      if (
        this.uiElement.available_dates &&
        this.uiElement.available_dates.find
      ) {
        let result = this.uiElement.available_dates.find(
          x =>
            moment(x).format("YYYY-MM-DD") == moment(date).format("YYYY-MM-DD")
        );
        return !result;
      }
    },
    keyup(e) {
      if (this.uiElement.keyup) {
        try {
          eval(this.uiElement.keyup);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
};
</script>

