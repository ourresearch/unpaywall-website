import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import VueScrollTo from 'vue-scrollto'
import VueAnalytics from 'vue-analytics'

Vue.use(VueMaterial)
Vue.use(VueScrollTo)
Vue.use(VueAnalytics, {
  id: "UA-23384030-6",
  router
})


Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
