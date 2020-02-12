<template>
  <md-field
    v-if="condition(uiElement)"
    v-bind:class="uiElement.class"
    v-bind:style="uiElement.style"
  >
    <label>{{uiElement.label}}</label>
    <md-input v-model="value" v-bind:type="uiElement.inputType"></md-input>
  </md-field>
</template>

<script>
export default {
  props: ["uiElement", "data"],
  computed: {
    value: {
      get() {
        let value = null;

        // do not set value if it is password
        if (this.uiElement.inputType == "password") return;

        if (this.data && this.uiElement.key) {
          // if null then assign default
          if (typeof obj.get(this.data, this.uiElement.key) == "undefined") {
            let def = this.uiElement.default;
            try {
              def = eval(this.uiElement.default);
            } catch (e) {}
            obj.set(this.data, this.uiElement.key, def);
          }

          // set value
          value = obj.get(this.data, this.uiElement.key);
        }

        // Transform
        if (this.uiElement.transform) {
          try {
            value = eval(this.uiElement.transform);
          } catch (e) {}
        }

        // if number
        if (value && this.uiElement.inputType == "number")
          value = parseFloat(value);

        return value;
      },
      set(v) {
        if (this.data && this.uiElement.key) {
          obj.set(this.data, this.uiElement.key, v);
          // if number
          if (v && this.uiElement.inputType == "number")
            obj.set(this.data, this.uiElement.key, parseFloat(v));
        }
      }
    }
  },
  methods: {
    condition: function(uiElement) {
      let passed = true;
      if (uiElement.condition) {
        passed = eval(uiElement.condition);
      }
      return passed;
    }
  }
};
</script>

