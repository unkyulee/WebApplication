import Vue from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import Loading from './Loading.vue'

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: (h) => h(Loading),
}).$mount('#loading');

(async () => {
  new Vue({
    el: '#app',
    vuetify,
    render: (h) => h(App),
  }).$mount('#app')
})()
