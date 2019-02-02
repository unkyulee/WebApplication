<template>
  <div :class="ui.class" :style="ui.style">{{ui.text}}</div>
</template>

<script>
export default {
  props: ["ui", "data"]
};
</script>