import Vue from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'

//Vue.config.productionTip = false;

// register components
import ui from "./services/ui.service";

(async () => {
  await ui.registerComponents();

  // init view
  new Vue({
    el: '#app',
    vuetify,
    render: (h) => h(App),
  })
})();
