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

//
import * as moment from "moment";

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
  },
  mounted: function() {
    // init moment locale
    if (config.get("locale")) {
      moment.locale(config.get("locale"));
    }
  }
};
</script>