
// from https://github.com/vuetifyjs/vue-cli-plugin-vuetify/issues/3
import '@babel/polyfill'
import _ from 'lodash';

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import VueScrollTo from 'vue-scrollto'
import VueAnalytics from 'vue-analytics'
import VueMoment from 'vue-moment'
import vuetify from './plugins/vuetify';

Vue.use(VueMaterial)
Vue.use(VueScrollTo)
Vue.use(VueAnalytics, {
  id: "UA-23384030-6",
  router
})
Vue.use(VueMoment);

Vue.filter('truncate', function (value) {
  if (!value) return ''
  value = value.toString()
  return _.truncate(value, {length: 300})
})



Vue.config.productionTip = false
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
