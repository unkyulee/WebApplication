import Vue from "vue";
import "./style.css";
Vue.config.productionTip = false;

// Vuetify
import vuetify from './plugins/vuetify' // path to vuetify export

// Router plugin
import VueRouter from "vue-router";
Vue.use(VueRouter);

import App from "./App";
const routes = [{ path: "*", component: App }];
const router = new VueRouter({ routes });

// init app
new Vue({
  render: h => h(App),
  vuetify,
  router
}).$mount("#app");
