<template>
  <div class="home">

    <!--<img src="../assets/logo.png">-->
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->

    <div class="banner">
      <div class="headline">
        An open database of
        <span class="number">
          {{(numOa).toLocaleString() }}
        </span>
        free fulltext scholarly articles.
      </div>

      <!--<div class="subheadline">-->
        <!--The Unpaywall database is the most comprehensive list of free-to-read scholarly papers,-->
        <!--and it's available for use in your projects.-->
      <!--</div>-->

      <div class="cta">
        <md-button class="md-raised md-accent">Learn more</md-button>
      </div>
    </div>


    <div class="social-proof">
      <div class="text">
        <h2 class="md-display-1">Trusted by thousands of institutions worldwide.</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel ornare orci. Nam congue sollicitudin nibh. Nulla ac sollicitudin mi. Pellentesque libero metus, interdum sed dolor in, tincidunt interdum urna. Cras vehicula eget lacus ac bibendum. Nulla tristique sodales lorem, consectetur luctus mi laoreet pharetra.
        </p>
      </div>
      <div class="img">
        <img src="../assets/logos/bl.png" alt="">
        <img src="../assets/logos/europe-pmc.png" alt="">
        <img src="../assets/logos/internet-archive.png" alt="">
        <img src="../assets/logos/merck.png" alt="">
        <img src="../assets/logos/mit.png" alt="">
        <img src="../assets/logos/nlm.png" alt="">
        <img src="../assets/logos/rcuk.png" alt="">
        <img src="../assets/logos/wiley.png" alt="">
        <img src="../assets/logos/wos.png" alt="">

      </div>
    </div>

    <div class="open-source">
      <div class="img">
        <img src="../assets/unicorn.png" alt="">
      </div>
      <div class="text">
        <h2 class="md-display-1">Open Source and nonprofit</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel ornare orci. Nam congue sollicitudin nibh. Nulla ac sollicitudin mi. Pellentesque libero metus, interdum sed dolor in, tincidunt interdum urna. Cras vehicula eget lacus ac bibendum. Nulla tristique sodales lorem, consectetur luctus mi laoreet pharetra.
        </p>
      </div>
    </div>


  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  metaInfo: {
      title: "Unpaywall Data",
      titleTemplate: null,
      bodyAttrs: {
          "class": "home"
      }
  },
  data: () =>  ({
    now: Date.now()
  }),
  created() {
      let that = this
      this.$options.interval = setInterval(function(){
          that.now = Date.now()
      }, 500)

  },
  destroyed() {
    clearInterval(this.$options.interval)
  },

  computed: {
      numOa(){
          let BenchmarkTs = 1523379020302
          let numOaAtBenchmarkTs = 15983601
          let rateOfNewOaAdded = 2000


          let msSinceBenchmarkTs = this.now - BenchmarkTs
          let newOaAddedSinceBenchmarkTs = msSinceBenchmarkTs / rateOfNewOaAdded

          let totalOaNow = numOaAtBenchmarkTs + newOaAddedSinceBenchmarkTs
          return Math.floor(totalOaNow)

      }
  }
}
</script>


<style scoped lang="scss">
  .home {
    margin-top: -88px;
    line-height: 1.5;
    letter-spacing: 0.05em;

  }

  div.banner {
    background: url("../assets/stars.jpg") no-repeat;
    background-size: cover;
    background-position: bottom;
    height: 700px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    text-align: left;

    div.headline {
      color: #fff;
      font-weight: bold;
      font-size: 40px;
      line-height: 1.3;
      padding: 30px;
      max-width: 800px;
    }
    div.cta {
      padding: 30px;
    }
  }

  .social-proof {
    background: #fff;
    padding: 50px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      max-width: 400px;
      padding: 10px;

    }
    .img {
      max-width: 700px;
      padding: 10px;

      text-align: left;
      img {
        max-height: 80px;
        max-width: 120px;
        margin: 15px;
        opacity: .8;
      }
    }
  }

  .open-source {
    background: #fafafa;
    padding: 50px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      max-width: 400px;
      padding: 30px;
    }
    .img {
      padding: 30px;
      img {
        max-height: 400px;
      }
    }
  }




</style>


















