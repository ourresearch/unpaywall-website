import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import Home from './views/Home'
import About from './views/About'
import DataFormat from './views/DataFormat'

import Api from './views/products/Api'

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
      path: '/products/api',
      name: 'api',
      component: Api
    },

    {
      path: '/about',
      name: 'about',
      component: About
    },

    {
      path: '/data-format',
      name: 'data format',
      component: DataFormat
    }
  ]
})
