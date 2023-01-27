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
          <md-button class="md-raised md-accent main" to="/products/extension">
            Get the extension
          </md-button>
        </div>
      </div>
    </div>

      <div id="learn-more" class="pullquote">
          <div class="text">
              <div class="quote">
                "Unpaywall is transforming Open Science"
              </div>
              <div class="attr">
                  <span class="journal">&mdash;Nature</span>
                  feature article,
                  <a href="https://www.nature.com/articles/d41586-018-05968-3">
                      August 2018
                  </a>
              </div>
          </div>


      </div>

    <div  class="selling-point social-proof">
      <div class="text">
        <h2>Used and trusted by top organizations</h2>
        <p>
          We're integrated into thousands of library systems, search platforms, and other information products worldwide. In fact, if you're involved in scholarly communication, there's a good chance you've already used Unpaywall data.
        </p>
      </div>
      <div class="img logos">
        <img src="../assets/logos/all-logos.png" alt="">


        <!--<div class="img-row">-->
          <!--<img class="logo" src="../assets/logos/bl.png" alt="">-->
          <!--<img class="logo" src="../assets/logos/digital-science.png" alt="">-->
          <!--<img class="logo" src="../assets/logos/harvard.png" alt="">-->
          <!--<img class="logo" src="https://i.imgur.com/sA5dwma.png" alt="">-->
        <!--</div>-->

        <!--<div class="img-row">-->
          <!--<img class="logo" src="../assets/logos/europe-pmc.png" alt="">-->
          <!--<img class="logo" src="../assets/logos/internet-archive.png" alt="">-->
          <!--<img class="logo" src="../assets/logos/merck.png" alt="">-->
          <!--<img class="logo" src="../assets/logos/mit.png" alt="">-->
        <!--</div>-->
        <!--<div class="img-row">-->
          <!--<img class="logo" src="../assets/logos/nlm.png" alt="">-->
          <!--<img class="logo" src="../assets/logos/oclc.png" alt="">-->
          <!--<img class="logo" src="../assets/logos/wos.png" alt="">-->
          <!--<img class="logo" src="https://i.imgur.com/5Hlsp38.png" alt="">-->
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
          Unpaywall is run by OurResearch, a nonprofit dedicated to making scholarship more accessible to everyone. Open is our passion. So it's only natural our source code is open, too.
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
      <p>There are oodles of ways to use Unpaywall's data. Check out one of these guides to learn which are right for you!</p>
      <div class="buttons">
        <md-button to="/user-guides/libraries" class="md-raised md-accent libraries">Libraries</md-button>
        <md-button to="/user-guides/enterprise" class="md-raised md-primary enterprise">Enterprise</md-button>
        <md-button to="/user-guides/research" class="md-raised md-accent research">Research</md-button>
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
      title: "Unpaywall: An open database of 20 million free scholarly articles",
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
          let BenchmarkTs = 1549144226029
          let numOaAtBenchmarkTs = 34707710
          let rateOfNewOaAdded = 10800 // ms it takes a new article to be added


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

  .pullquote {
      font-size: 40px;
      background: #FF706B;
      background: #181F22;
      padding: 70px 20px 30px;
      color: #fff;
      line-height: 1.3;
      .text {
          max-width: 800px;
          margin: 0 auto;
          .attr {
              text-align: right;
              margin-right: 30px;
              margin-top: 10px;
              font-size: 18px;
              font-weight: 300;
              span.journal {
                  font-style: italic;
                  font-weight: bold;
              }
              a {
                color: #fff;

              }
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
      max-width: 425px;
      padding: 30px;

      &.logos {
        padding: 30px 0;
        div.img-row {
          width: 520px;
          text-align: center;
          img.logo {
            max-width: 85px;
            max-height: 70px;
            margin: 15px 13px;
            opacity: .9;
            filter: grayscale(100%);
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


















