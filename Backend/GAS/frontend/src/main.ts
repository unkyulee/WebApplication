import Vue from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'

Vue.config.productionTip = false;

(async () => {
  new Vue({
    el: '#app',
    vuetify,
    render: (h) => h(App),
  }).$mount('#app')
})()
