<template>
    <div class="page product-page extension">
        <div class="top-screen">
            <div class="main-img">
                <img class="screenshot" src="~@/assets/browser-frame.png" alt="">
            </div>

            <div class="main-copy">
                <div class="tagline">
                    <h2 class="above">
                        Read research papers for free.
                    </h2>
                </div>
                <div class="about">
                    <p>
                        Click the green tab and skip the paywall on millions of peer-reviewed journal articles.
                        It's fast, free, and legal.
                    </p>
                    <p class="button-info" ng-show="browser=='unsupported'">
                        Unpaywall requires the desktop edition of Firefox or Chrome.
                    </p>
                </div>

                <div class="cta">
                    <div class="install" ng-click="ctaClick()">
                        <span class="chrome" ng-show="browser=='chrome'">
                            Add to Chrome - It's free
                        </span>
                        <span class="firefox" ng-show="browser=='firefox'">
                            Add to Firefox - It's free
                            <span class="small">via the Firefox web store</span>
                        </span>
                        <span class="fallback" ng-show="browser=='unsupported'">
                            <i class="fa fa-envelope-o"></i>
                            Send myself a reminder to install later
                        </span>
                    </div>

                </div>

                <div class="about-users">
                    <div class="rating">
                        <span class="stars">
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                        </span>
                        <span class="light">Five-star rating on Chrome Web Store</span>
                    </div>
                    <div class="num-users">
                        <span class="num">
                            124,492
                        </span>
                        <span class="light">users on Chrome and Firefox have read millions of articles for free.</span>
                    </div>
                </div>

            </div>

        </div>





    </div>
</template>

<script>
    export default {
        name: "Extension",
        metaInfo: {
            title: "Browser Extension"
        }
    }
</script>

<style scoped lang="scss">
    .page {
        width: 100%;
        max-width: 100%;
    }

    .top-screen {
        display: flex;
        margin-top: 50px;
        /*@media @mobile {*/
          /*margin-top: 0;*/
          /*flex-wrap: wrap;*/
        /*}*/

        .main-img {
            display:flex;
            align-content: center;
            align-items: center;
            min-width: 400px;
            img.screenshot {
                /*max-width: 438px;*/
                /*display:block;*/
              /*width: 100%;*/
              /*height: 100%;*/
            }
        }

        .main-copy {
          font-size: 24px;
          margin: -10px 80px 0 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          /*max-width: 510px;*/
          /*@media @xs {*/
            /*margin: 20px;*/
            /*font-size: 18px;*/
          /*}*/
          div.tagline h2 {
            font-weight: 300;
            font-size: 200%;
            color: #333;
              margin: 0;
            /*@media @xs {*/
              /*font-size: 30px;*/
              /*line-height: 1.3;*/
              /*font-weight: bold;*/
            /*}*/
          }

          div.about {
            margin: 0 0 20px;
            font-size: 70%;
            line-height: 1.5;
            .button-info {
              color: darkred;
              border-left: 3px solid darkred;
              padding-left: 20px;
              max-width:400px;
            }
          }

          .cta {
            .install {
              cursor: pointer;
              display: inline-block;
              font-size: 18px;
              padding: 20px 30px;
              border-radius: 10px;

              color: #fff;
              font-weight: bold;
              transition: all 0.15s ease;
              &:hover {
                transform: scale(1.03125);
              }

              .small {
                font-size: 66%;
                display: block;
                text-align: center;
              }

              /*@media @xs {*/
                /*padding: 14px 20px;*/
                /*font-size: 16px;*/
              /*}*/
            }
          }

          .about-users {
            font-size: 14px;
            color: #777;
            margin-top: 50px;
            padding: 0 0 0 20px;
            /*border-left: 3px solid @baseColor;*/
            line-height: 1.5;
            font-weight: 300;
            .rating {
              .stars {
                font-size: 90%;
                color: #e5c100;
                color: gold;
              }
            }
            .num-users {
              .num {
                font-weight: bold;
                color: #333;
              }
            }
          }
        }




    }

</style>