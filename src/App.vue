<template>
  <div id="app" class="">
    <v-app>
      <main-header/>

      <div class="container-wrapper md-layout-row">
        <router-view/>
      </div>
      <main-footer/>

    </v-app>



  </div>





</template>

<script>
  import MainHeader from './components/MainHeader'
  import MainFooter from './components/MainFooter'
  import _ from 'lodash'

  export default {
      name: 'App',
      components: {
          MainHeader,
          MainFooter
      },
      metaInfo: {
        // if no subcomponents specify a metaInfo.title, this title will be used
        title: 'Unpaywall',
        // all titles will be injected into this template
        titleTemplate: '%s | Unpaywall',
          link: [
            { rel: 'favicon', href: 'favicon.png' },
            { rel: 'chrome-webstore-item', href: 'https://chrome.google.com/webstore/detail/iplffkdpngmdjhlpjmppncnlhomiipha' },
          ],

          meta: [

          ]
      }
  }
</script>

<style>
  @import url("https://use.fontawesome.com/releases/v5.0.10/css/all.css");

  /* Screen breakpoints - converted from SCSS variables */
  /* $screen-xsmall: 600px; */
  /* $screen-small: 960px; */

  body {
    background: #fff;
  }
  body code {
    padding: 2px 5px;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 90%;
  }
  body h1 {
    margin-top: 50px;
  }
  body h2 {
    margin-top: 50px;
  }
  body p {
    margin-top: 1em;
    margin-bottom: 1em;
    font-size: 18px;
  }
  body ul {
    margin-left: 2em;
  }
  
  div.page {
    font-size: 18px;
    line-height: 1.5;
    max-width: 800px;
    margin: 0 auto;
    padding-bottom: 100px;
    min-height: 80vh;
  }
  div.page table {
    margin: 20px 0;
    border-top: 1px solid #ddd;
  }
  div.page table td {
    padding: 5px;
    border-bottom: 1px solid #ddd;
  }

  /* hack to make the menu dropdowns match the navbar color (dark) */
  .md-menu-content-container ul.md-list {
    background: rgba(0, 0, 0, .8);
    background: #393939;
    background: #4caf50;
  }
  .md-menu-content-container ul.md-list li a {
    color: #fff !important;
  }
  .md-menu-content-container ul.md-list .router-link-exact-active .md-list-item-content {
    color: #fff !important;
  }

  /* semi-transparent is prettier on the landing page */
  .home .md-menu-content-container ul.md-list {
    background: rgba(0, 0, 0, .66);
  }

  .md-menu-content {
    max-height: inherit;
  }
</style>
