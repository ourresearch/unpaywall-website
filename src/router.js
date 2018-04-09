import Vue from 'vue'
import Router from 'vue-router'
import Serp from './views/Serp'

Vue.use(Router)



export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      redirect: "/search"
      // name: 'home',
      // component: Home
    },

    {
      path: '/search/:q',
      name: 'search',
      component: Serp
    }
  ]
})
