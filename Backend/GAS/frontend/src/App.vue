<template>
  <v-app>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
//
import obj from "object-path";
import moment from "moment";

// services
import data from "./services/data.service";
//import event from "./services/event.service";
//import config from "./services/config.service";
//import ui from "./services/ui.service";
//import auth from "./services/auth.service";

export default Vue.extend({
  name: "app",
  components: {},
  provide: function () {
    return {
      data,
      //event,
      //config,
      //ui,
      //auth,
    };
  },
  data() {
    return {
      drawer: null as boolean | null,
    };
  },
  mounted: async function() {
    // load app config and setup the title
    const app = await data.get('App');
    document.title = obj.get(app, '0.title', '');
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
});
</script>

<style scoped>
/deep/ .v-main__wrap {
  display: flex;
  flex-flow: column;
}

/deep/ p {
  margin-bottom: 0 !important;
}
</style>
