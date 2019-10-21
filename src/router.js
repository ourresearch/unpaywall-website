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
import Contact from './views/Contact'
import Team from './views/Team'
import Welcome from './views/Welcome'
import Outreach from './views/Outreach'

// user guides
import UserGuides from './views/UserGuides'


// products
import Products from './views/Products'
import Api from './views/products/Api'
import Snapshot from './views/products/Snapshot'
import DataFeed from './views/products/DataFeed'
import Changefiles from './views/products/Changefiles'
import SimpleQueryTool from './views/products/SimpleQueryTool'
import Extension from './views/products/Extension'
import UnpaywallJournals from './views/products/UnpaywallJournals'


// legal
import Privacy from './views/legal/Privacy'
import TermsOfService from './views/legal/TermsOfService'

// other
import Repository from './views/Repository'
import AddRepository from './views/AddRepository'


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
      path: '/contact',
      component: Contact
    },
    {
      path: '/team',
      component: Team
    },
    {
      path: '/welcome',
      component: Welcome
    },
    {
      path: '/outreach',
      component: Outreach
    },







    // user guides, they share a route

    {
      path: '/user-guides/:guideName?',
      component: UserGuides
    },




    // product pages

    {
      path: '/products',
      component: Products
    },
    {
      path: '/products/snapshot',
      component: Snapshot
    },
    {
      path: '/products/data-feed',
      component: DataFeed
    },
    {
      path: '/products/data-feed/changefiles',
      component: Changefiles
    },
    {
      path: '/sla', // legacy URL
      redirect: '/products/data-feed'
    },

    {
      path: '/products/api',
      component: Api
    },
    {
      path: '/api/v2', // legacy URL
      redirect: '/products/api'
    },
    {
      path: '/api', // legacy URL
      redirect: '/products/api'
    },
    {
      path: '/products/simple-query-tool',
      component: SimpleQueryTool
    },
    {
      path: '/products/extension',
      component: Extension
    },
    {
      path: '/journals',
      component: UnpaywallJournals
    },




    // legal pages

    {
      path: '/legal/privacy',
      component: Privacy
    },
    {
      path: '/legal/terms-of-service',
      component: TermsOfService
    },


    // redirect for old URLs to old site
    {
      path: '/data', // legacy URL
      redirect: '/'
    },







    // other pages

    {
      path: '/sources/repository/:repoId?',
      component: Repository
    },
    {
      path: '/sources/repositories/add',
      component: AddRepository
    }


  ]
})

