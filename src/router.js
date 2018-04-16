import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'


// top-level pages
import Home from './views/Home'
import About from './views/About'
import DataFormat from './views/DataFormat'
import Integrations from './views/Integrations'
import Sources from './views/Sources'
import Faq from './views/Faq'
import TermsAndConditions from './views/TermsAndConditions'
import Contact from './views/Contact'

// user guides
import UserGuides from './views/UserGuides'


// products
import Api from './views/products/Api'
import Snapshot from './views/products/Snapshot'
import DataFeed from './views/products/DataFeed'
import SimpleQueryTool from './views/products/SimpleQueryTool'
import Extension from './views/products/Extension'

Vue.use(Router)
Vue.use(Meta)



export default new Router({
  mode: "history",
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
        return savedPosition
    }
    else if (to.hash){
      return {
        selector: to.hash,
        offset: { x: 0, y: 10 }
      }
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      component: Home
    },



    // top-level pages

    {
      path: '/about',
      component: About
    },
    {
      path: '/data-format',
      component: DataFormat
    },
    {
      path: '/integrations',
      component: Integrations
    },
    {
      path: '/sources',
      component: Sources
    },
    {
      path: '/faq',
      component: Faq
    },
    {
      path: '/terms-and-conditions',
      component: TermsAndConditions
    },
    {
      path: '/contact',
      component: Contact
    },







    // user guides, they share a route

    {
      path: '/user-guides/:guideName',
      component: UserGuides
    },




    // product pages

    {
      path: '/products/snapshot',
      component: Snapshot
    },
    {
      path: '/products/data-feed',
      component: DataFeed
    },

    {
      path: '/products/api',
      component: Api
    },
    {
      path: '/products/simple-query-tool',
      component: SimpleQueryTool
    },
    {
      path: '/products/extension',
      component: Extension
    },


  ]
})
