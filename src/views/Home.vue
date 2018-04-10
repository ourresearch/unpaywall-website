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
          let rateOfNewOaAdded = 3000


          let msSinceBenchmarkTs = this.now - BenchmarkTs
          let newOaAddedSinceBenchmarkTs = msSinceBenchmarkTs / rateOfNewOaAdded

          let totalOaNow = numOaAtBenchmarkTs + newOaAddedSinceBenchmarkTs
          return Math.floor(totalOaNow)

      }
  }
}
</script>


<style scoped lang="scss">
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


</style>
