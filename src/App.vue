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

    // phones
    $screen-xs-max: 576px;


  body {
    font-size: 16px;
  }


  #nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
