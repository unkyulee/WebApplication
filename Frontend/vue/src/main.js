import Vue from "vue";
import App from "./App.vue";

// import styles
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import "./style.css";

Vue.config.productionTip = false;

// Router plugin
import VueRouter from "vue-router";
Vue.use(VueRouter);

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [{ path: "*", component: App }];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for `routes: routes`
});

// init app
new Vue({
  render: h => h(App),
  router
}).$mount("#app");
