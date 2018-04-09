import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import Serp from './views/Serp'
import Home from './views/Home'

Vue.use(Router)
Vue.use(Meta)



export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },

    {
      path: '/search/:q',
      name: 'search',
      component: Serp
    }
  ]
})
