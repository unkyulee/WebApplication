<template>
  <composer />
</template>

<script>
import Vue from "vue";
import VueMaterial from 'vue-material'
Vue.use(VueMaterial);

// services
import event from "./services/event.service";
import rest from "./services/rest.service";
import config from "./services/config.service";
import ui from "./services/ui.service";

// layout
import Composer from "./layout/Composer.vue";

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
      config,
      ui
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