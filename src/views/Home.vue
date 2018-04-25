<template>
  <div class="home">

    <!--<img src="../assets/logo.png">-->
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->

    <div class="banner">
      <div class="headline">
        An open database of {{(numOa).toLocaleString() }} free scholarly articles.
      </div>

      <div class="subheadline">
        We harvest Open Access content from over 50,000 publishers and repositories, and make it easy to find, track, and use.


      </div>

      <div class="cta">
        <div>
        <div>
          <md-button class="md-raised md-accent main" href="#" v-scroll-to="'#learn-more'">
            Learn more
          </md-button>
        </div>
          <router-link class="secondary" to="/products/extension">
            Get the extension
          </router-link>
        </div>
      </div>
    </div>


    <div id="learn-more" class="selling-point social-proof">
      <div class="text">
        <h2>Used and trusted by top organizations</h2>
        <p>
          We're integrated into thousands of library systems, search platforms, and other information products worldwide. In fact, if you're involved in scholarly communication, there's a good chance you've already used Unpaywall data.

        </p>
      </div>
      <div class="img logos">
        <img src="../assets/all-logos.png" alt="">


        <!--<div class="img-row">-->
          <!--<img class="logo" src="../assets/logos/bl.png" alt="">-->
          <!--<img class="logo" src="../assets/logos/digital-science.png" alt="">-->
          <!--<img class="logo" src="../assets/logos/dartmouth.png" alt="">-->
        <!--</div>-->

        <!--<div class="img-row">-->
          <!--<img class="logo" src="../assets/logos/europe-pmc.png" alt="">-->
          <!--<img class="logo" src="../assets/logos/internet-archive.png" alt="">-->
          <!--<img class="logo" src="../assets/logos/merck.png" alt="">-->
          <!--<img class="logo" src="../assets/logos/mit.png" alt="">-->
        <!--</div>-->
        <!--<div class="img-row">-->
          <!--<img class="logo" src="../assets/logos/nlm.png" alt="">-->
          <!--<img class="logo" src="../assets/logos/rcuk.png" alt="">-->
          <!--<img class="logo" src="../assets/logos/wos.png" alt="">-->
        <!--</div>-->


      </div>
    </div>

    <div class="selling-point open-source">
      <div class="img">
        <img src="../assets/blueprints2.png" alt="">
      </div>
      <div class="text">
        <h2>Open Source and nonprofit</h2>
        <p>
          Unpaywall is run by Impactstory, a nonprofit dedicated to making scholarship more accessible to everyone. Open is our passion. So it's only natural our source code is open, too.
        </p>
      </div>
    </div>


    <div class="selling-point easy-access">
      <div class="text">
        <h2>Easy access for everyone</h2>
        <p>
          We've helped with projects ranging from undergrad class assignments to global enterprise integrations. So no matter what your use case, we've probably got an easy way for you to access our data...after all, access is what this is all about.
        </p>
      </div>

      <div class="img">
        <img src="../assets/aliens.png" alt="">
      </div>
    </div>

    <div class="get-started">
      <h2>Get started</h2>
      <p>There are oodles of ways to access our data. We recommend you get started with one of these user guides:</p>
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
    font-size: 16px;

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
      max-width: 655px;
      padding: 0 30px;
      text-shadow: 0 0 30px #000, 1px 1px 50px #000;
    }

    div.cta {
      padding: 30px;
      div {
        display:inline;
        @media (max-width: 600px) {
          display:block;
        }
      }
      .md-button {
        /*background: rgba(255,255,255, .2);*/
        /*background: rgba(0,0,0, .4);*/
        color: #fff;
        margin:10px 20px 0 0;
        min-width: 150px;
      }
      a.secondary {
        text-shadow: 0 0 30px #000, 1px 1px 50px #000;
        color: #fff;
        text-transform: uppercase;
        padding: 18px 0;
        display: inline-block;
        font-size: 15px;
      }
    }
  }


  .selling-point {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
    h2 {
      font-weight: 300;
      margin-top: 0;
    }
    .text {
      padding: 0 30px;
      max-width: 400px;
    }
    .img {
      max-width: 400px;
      padding: 30px;

      &.logos {
        padding: 30px 0;
        div.img-row {
          width: 420px;
          text-align: center;
          img.logo {
            max-width: 85px;
            max-height: 70px;
            margin: 15px 13px;
            opacity: .9;
          }
        }
      }

    }


    @media (max-width: 600px) {
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
    background: #eee;
    padding: 50px 0 80px;
    h2 {
      margin: 0;
      font-size: 38px;
      font-weight: 300;
    }
    p {
      max-width: 600px;
      margin: 0 auto;
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


















