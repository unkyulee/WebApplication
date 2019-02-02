<template>
  <div :class="ui.class" :style="ui.style">{{value}}</div>
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