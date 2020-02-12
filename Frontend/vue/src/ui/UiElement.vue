<template>
  <keep-alive>
    <Typography
      v-if="uiElement.type == 'typography'"
      v-bind:uiElement="uiElement"
      v-bind:data="data"
      v-bind:class="uiElement.layoutClass"
      v-bind:style="uiElement.layoutStyle"
    />
    <Input
      v-if="uiElement.type == 'input'"
      v-bind:uiElement="uiElement"
      v-bind:data="data"
      v-bind:class="uiElement.layoutClass"
      v-bind:style="uiElement.layoutStyle"
    />
    <Button
      v-if="uiElement.type == 'button'"
      v-bind:uiElement="uiElement"
      v-bind:data="data"
      v-bind:class="uiElement.layoutClass"
      v-bind:style="uiElement.layoutStyle"
    />
  </keep-alive>
</template>

<script>
import Typography from "./Typography";
import Input from "./Input";
import Button from "./Button";

export default {
  components: {
    Typography,
    Input,
    Button
  },
  props: ["uiElement", "data"]
};
</script>