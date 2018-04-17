<template>
  <div class="home">

    <!--<img src="../assets/logo.png">-->
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->

    <div class="banner">
      <div class="headline">
        What could you build with {{(numOa).toLocaleString() }} Open Access articles?
      </div>

      <div class="subheadline">
        Find out using our free, comprehensive index of OA papers harvested from over 50,000 publishers and repositories.


      </div>

      <div class="cta">
        <md-button class="md-raised md-accent" href="#" v-scroll-to="'#learn-more'">
          Learn more
        </md-button>
      </div>
    </div>


    <div id="learn-more" class="selling-point social-proof">
      <div class="text">
        <h2 class="md-display-1">Trusted by top institutions</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel ornare orci. Nam congue sollicitudin nibh. Nulla ac sollicitudin mi. Pellentesque libero metus, interdum sed dolor in, tincidunt interdum urna.
        </p>
      </div>
      <div class="img">
        <img src="../assets/all-logos.png" alt="">


        <!--<img src="../assets/logos/bl.png" alt="">-->
        <!--<img src="../assets/logos/europe-pmc.png" alt="">-->
        <!--<img src="../assets/logos/internet-archive.png" alt="">-->
        <!--<img src="../assets/logos/merck.png" alt="">-->
        <!--<img src="../assets/logos/mit.png" alt="">-->
        <!--<img src="../assets/logos/nlm.png" alt="">-->
        <!--<img src="../assets/logos/rcuk.png" alt="">-->
        <!--<img src="../assets/logos/wos.png" alt="">-->


      </div>
    </div>

    <div class="selling-point open-source">
      <div class="img">
        <img src="../assets/blueprints2.png" alt="">
      </div>
      <div class="text">
        <h2 class="md-display-1">Open Source and nonprofit</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel ornare orci. Nam congue sollicitudin nibh. Nulla ac sollicitudin mi. Pellentesque libero metus, interdum sed dolor in, tincidunt interdum urna. Cras vehicula eget lacus ac bibendum. Nulla tristique sodales lorem, consectetur luctus mi laoreet pharetra.
        </p>
      </div>
    </div>


    <div class="selling-point easy-access">
      <div class="text">
        <h2 class="md-display-1">Easy access for anyone</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel ornare orci. Nam congue sollicitudin nibh. Nulla ac sollicitudin mi. Pellentesque libero metus, interdum sed dolor in, tincidunt interdum urna. Cras vehicula eget lacus ac bibendum. Nulla tristique sodales lorem, consectetur luctus mi laoreet pharetra.
        </p>
      </div>

      <div class="img">
        <img src="../assets/aliens.png" alt="">
      </div>
    </div>

    <div class="get-started">
      <h2 class="md-display-2">Get started</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
      <div class="buttons">
        <md-button to="/user-guides/enterprise" class="md-raised md-primary enterprise">Enterprise</md-button>
        <md-button to="/user-guides/research" class="md-raised md-accent research">Research</md-button>
        <md-button to="/user-guides/libraries" class="md-raised md-accent libraries">Libraries</md-button>
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
    background-color: #111;
    background-size: cover;
    background-position: 50% 50%;
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    text-align: left;

    div.headline {
      font-size: 40px;
      @media (max-width: 600px) {
        font-size: 30px;
      }
      color: #fff;
      font-weight: bold;
      line-height: 1.3;
      padding: 30px;
      max-width: 800px;
      text-shadow: 1px 1px 50px #000;


    }
    div.subheadline {
      font-size: 20px;
      /*@media (max-width: 600px) {*/
        /*font-size: 30px;*/
      /*}      */
      color: #fff;
      max-width: 600px;
      padding: 0 30px;
      text-shadow: 0 0 30px #000, 1px 1px 50px #000;
    }

    div.cta {
      padding: 30px;
    }
  }


  .selling-point {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
    .text {
      padding: 0 30px;
      max-width: 400px;
    }
    .img {
      max-width: 400px;
      padding: 30px;
    }


    @media (max-width: 600px) {
      background: red;
      flex-wrap: wrap;
    }

    &.social-proof {
      background: #fff;
    }
    &.open-source {
      background: #eee;
    }
    &.easy-access {
      background: #fff;
    }


  }



  .get-started {
    text-align: center;
    margin: 80px 0;
    h2 {
      margin-bottom: 0;
    }
    .buttons {
      margin-top: 20px;
      a {
        font-size: 25px;
        padding: 15px 30px;
        height: auto;
        margin: 10px 20px;
        &.enterprise {
          background: #E98535 !important;
        }
        &.research {
          background: #499841 !important;
        }
        &.libraries {
          background: #255C9B !important;
        }
      }
    }
  }




</style>


















