import Vue from "vue";

// import styles
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import "./style.css";

Vue.config.productionTip = false;

// Router plugin
import VueRouter from "vue-router";
Vue.use(VueRouter);

import App from "./App";
import Composer from "./layout/Composer";
const routes = [{ path: "*", component: Composer }];
const router = new VueRouter({ routes });

// init app
new Vue({
  render: h => h(App),
  router
}).$mount("#app");
