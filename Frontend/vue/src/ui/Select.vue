<template>
  <md-field :class="uiElement.class" :style="uiElement.style">
    <label :style="uiElement.labelStyle">{{uiElement.label}}</label>
    <md-select v-model="value">
      <md-option
        v-for="(option, index) in uiElement.options"
        :key="index"
        :value="option.value"
      >{{option.label}}</md-option>
    </md-select>
  </md-field>
</template>

<script>
// utilities
import { debounce } from "debounce";
const obj = require("object-path");
const moment = require("moment");

// user imports
import Base from "./Base";

export default {
  extends: Base,
  mounted: function() {
    // changed
    this.changed = debounce(this.changed, 200);
  },
  computed: {
    value: {
      get() {
        this._value = null;

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
          obj.set(this.data, this.uiElement.key, v);
          // if number
          if (v && this.uiElement.inputType == "number")
            obj.set(this.data, this.uiElement.key, parseFloat(v));

          // update
          this.event.send({ name: "data", data: this.data });
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
    }
  }
};
</script>

