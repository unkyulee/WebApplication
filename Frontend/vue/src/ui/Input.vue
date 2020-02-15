<template>
  <keep-alive>
    <md-field
      v-if="
        !uiElement.inputType ||
        uiElement.inputType == 'text' ||
        uiElement.inputType == 'number' ||
        uiElement.inputType == 'email' ||
        uiElement.inputType == 'password'"
      v-bind:class="uiElement.class"
      v-bind:style="uiElement.style"
    >
      <label>{{uiElement.label}}</label>
      <md-input v-model="value" v-bind:type="uiElement.inputType"></md-input>
    </md-field>

    <date-pick v-if="uiElement.inputType == 'date-inline'" v-model="value" :hasInputElement="false"></date-pick>
  </keep-alive>
</template>

<script>
import Vue from "vue";
import { MdField } from "vue-material/dist/components";
import "vue-date-pick/dist/vueDatePick.css";
import DatePick from "vue-date-pick";

// utilities
const obj = require("object-path");
import { debounce } from "debounce";

// user imports
import Base from "./Base";

// use MdField
Vue.use(MdField);

export default {
  extends: Base,
  components: { DatePick },
  mounted: function() {
    // changed
    this.changed = debounce(this.changed, 200);
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
            try {
              def = eval(this.uiElement.default);
            } catch (e) {
              //
            }
            obj.set(this.data, this.uiElement.key, def);
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
          this.$set(this.data, this.uiElement.key, v);
          // if number
          if (v && this.uiElement.inputType == "number")
            this.$set(this.data, this.uiElement.key, parseFloat(v));

          // update
          console.log(this.data)
          this.event.send({ name: "data", data: this.data });
        }

        // changed
        this.changed()
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
    }
  }
};
</script>

