<template>
  <v-text-field
    :type="ui.type"
    :v-model="value"
    :name="ui.key"
    :label="ui.label"
    :prepend-icon="ui.prependIcon"
    :style="ui.style"
    :class="ui.class"
  ></v-text-field>
</template>

<script>
export default {
  props: ["ui", "data"],
  computed: {    
    value: function() {
      let v = null;
      if (this.data && this.ui && this.ui.key && this.data[this.ui.key]) {
        v = this.data[this.ui.key];
      }
      return v;
    }
  }
};
</script>
