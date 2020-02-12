<template>
  <composer />
</template>

<script>
// services
import event from "./services/event.service";
import rest from "./services/rest.service";
import config from "./services/config.service";

// composer
import Composer from "./composer/Composer.vue";

export default {
  components: {
    Composer
  },
  provide: function() {
    return {
      event,
      rest,
      config
    };
  }
};
</script>