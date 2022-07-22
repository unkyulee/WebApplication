

<script>
// services
import event from "./services/event.service";
import rest from "./services/rest.service";
import config from "./services/config.service";
import ui from "./services/ui.service";
import auth from "./services/auth.service";

export default {
  provide: function () {
    return {
      event,
      rest,
      config,
      ui,
      auth,
    };
  },
}
</script>

<template>
  
</template>

<style scoped>
:deep() .v-main__wrap {
  display: flex;
  flex-flow: column;
}

:deep() p {
  margin-bottom: 0 !important;
}
</style>
