<template>
  <div id="app" class="container">

    <main-header/>

    <div class="container-wrapper md-layout-row">
      <router-view/>
    </div>
    <main-footer/>


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
        // title: 'Unpaywall Data',
        // all titles will be injected into this template
        titleTemplate: '%s | Unpaywall Data'
      }
  }
</script>

<style lang="scss">
  @import url("https://use.fontawesome.com/releases/v5.0.10/css/all.css");

    $screen-xsmall: 600px;
    $screen-small: 960px;


  body {
    font-size: 16px;
    code {
      padding: 2px 5px;
      border: 1px solid #ddd;
      border-radius: 3px;
      font-size: 90%;
    }
    h1 {
      margin-top: 50px;
    }
    h2 {
      margin-top: 50px;
    }
  }
  div.page {
    line-height: 1.5;
    padding: 10px;
    max-width: 800px;
    margin: 0 auto;
    padding-bottom: 100px;
    table {
      margin: 20px 0;
      border-top: 1px solid #ddd;
      td {
        padding: 5px;
        border-bottom: 1px solid #ddd;
      }
    }

  }

  // hack to make the menu dropdowns match the navbar color (dark)
  .md-menu-content-container ul.md-list {
    background: rgba(0, 0, 0, .8);
    background: #393939;
    li a {
      color: #fff !important;
    }
    .router-link-exact-active .md-list-item-content {
      color: #fff !important;
    }
  }

  // semi-transparent is prettier on the landing page
  .home .md-menu-content-container ul.md-list {
    background: rgba(0, 0, 0, .66);
  }


</style>
