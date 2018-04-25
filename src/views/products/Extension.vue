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
                    <p class="button-info"
                       v-show="browserName==='unsupported'">
                        The Unpaywall extension requires Chrome or Firefox.
                    </p>

                    <p class="button-info" v-show="isMobileBrowser">
                        The Unpaywall extension requires a desktop browser.
                    </p>

                </div>

                <div class="cta">
                    <md-button class="install md-primary md-raised" @click="ctaClick">
                        <span class="chrome" v-show="browserName==='chrome' && !isMobileBrowser">
                            Add to Chrome - It's free
                        </span>
                        <span class="firefox" v-show="browserName==='firefox' && !isMobileBrowser">
                            Add to Firefox - It's free
                            <span class="small">via the Firefox web store</span>
                        </span>
                        <span class="fallback" v-show="browserName==='unsupported' || isMobileBrowser">
                            <i class="fa fa-envelope-o"></i>
                            Send yourself a reminder
                        </span>
                    </md-button>

                </div>

                <div class="about-users">
                    <div class="rating">
                        <span class="stars">
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star-half"></i>
                        </span>
                        <span class="light">4.5 star rating on Chrome Web Store</span>
                    </div>
                    <div class="num-users">
                        <span class="num">
                            {{(153097).toLocaleString()}}
                        </span>
                        <span class="light">users on Chrome and Firefox.</span>
                    </div>
                </div>

            </div>

        </div>





        <div class="social-proof">
            <div class="quote">
                <div class="content">
                    "Must-have for anyone who wants to access the research literature."
                </div>
                <div class="attribution">
                    &mdash;Andrew Treloar, <em>Australian National Data Service</em>
                </div>
            </div>

            <div class="logos">
                <img src="~@/assets/logos/nature.png" alt="">
                <img src="~@/assets/logos/techcrunch.png" alt="">
                <img src="~@/assets/logos/science.png" alt="" class="science">
                <img src="~@/assets/logos/boingboing.png" class="boingboing" alt="">
                <img src="~@/assets/logos/chronicle.png" class="chronicle" alt="">
            </div>

        </div>


        <div class="selling-point millions">
            <div class="img">
                <img src="~@/assets/many-articles.png" alt="">
            </div>
            <div class="text">
                <h2>Access millions of research articles, instantly.</h2>
                <p>
                    Unpaywall users read <strong>52%</strong> of research papers for free. Here's how: when you browse to a paywalled paper, we check to see if there's a free copy in our database. If there is, you'll see a green tab on your screen...just click, and read!
                </p>
            </div>
        </div>

        <div class="selling-point legal">
            <div class="text">
                <h2>Legal, fair, and sustainable.</h2>
                <p>
                    We harvest our content from thousands of university and government web servers all over the world. The fulltext articles we find there have been legally uploaded by authors, with permission from publishers.
                </p>
            </div>
            <div class="img">
                <img src="~@/assets/legal.png" alt="">
            </div>
        </div>


        <div class="testimonials">
            <h2>What people say about Unpaywall.</h2>
            <div class="cards">
                <md-card>
                    <md-card-header>
                        <md-avatar>
                            <img src="~@/assets/tom.jpg" alt="Avatar">
                        </md-avatar>

                        <div class="md-title">Tom Mueller</div>
                        <div class="md-subhead">Author</div>
                    </md-card-header>

                    <md-card-content>
                        Yesterday I found Unpaywall, and my life changed.  I've already gotten four publications by clicking on the Mystical Green Padlock...Thank you, from the heart.
                    </md-card-content>
                </md-card>

                <md-card>
                    <md-card-header>
                        <md-avatar>
                            <img src="~@/assets/stacy.jpg" alt="Avatar">
                        </md-avatar>

                        <div class="md-title">Stacy Konkiel</div>
                        <div class="md-subhead">Dir. of Research & Education</div>
                    </md-card-header>

                    <md-card-content>
                        Unpaywall makes it really easy to (legally!) find free versions of journal articles.
                    </md-card-content>
                </md-card>

                <md-card>
                    <md-card-header>
                        <md-avatar>
                            <img src="~@/assets/jon.jpg" alt="Avatar">
                        </md-avatar>

                        <div class="md-title">Jon Tennant</div>
                        <div class="md-subhead">Paleontologist</div>
                    </md-card-header>

                    <md-card-content>
                        Way, way, WAY easier than having to be at a place with institutional access, using a VPN, emailing authors, or using inter-library loan....
                    </md-card-content>
                </md-card>

            </div>



        </div>





    </div>
</template>

<script>
    export default {
        name: "Extension",
        metaInfo: {
            title: "Browser Extension"
        },
        data: () => {
            return {
                browserName:"",
                isMobileBrowser: ""
            }
        },
        methods: {
            ctaClick(){
                console.log("clicked to install the extension")

                // can't install it, so let the users email themselves a reminder.
                if (this.browserName === 'unsupported' || this.isMobileBrowser) {
                    let emailSubject = "Check out Unpaywall"
                    let emailBody = "Just a small reminder to myself: check out the Unpaywall extension at http://unpaywall.org/products/extension"
                    let emailUrl = "mailto:?subject=" + encodeURI(emailSubject) + "&body=" + encodeURI(emailBody)
                    window.location = emailUrl
                }

                // install for firefox. 
                else if (this.browserName === 'firefox') {
                    console.log("Install for Firefox")
                    this.$ga.event("Clicked Install", "firefox")
                    window.location = "https://addons.mozilla.org/en-US/firefox/addon/unpaywall/"
                }

                // install for chrome
                else if (this.browserName === 'chrome') {
                    console.log("Install for Chrome")
                    this.$ga.event("Clicked Install", "chrome")
                    let webstoreUrl = "https://chrome.google.com/webstore/detail/unpaywall/iplffkdpngmdjhlpjmppncnlhomiipha"

                    // inline install does not work in fullscreen mode.
                    if( window.outerHeight === screen.height) {
                        console.log("full screen! opening web store")
                        window.location = webstoreUrl
                    }

                    chrome.webstore.install(
                        undefined,
                        function(msg){
                            console.log("inline install success.")
                            this.$ga.event("Installed", "chrome")
                        },
                        function(msg) {
                            window.location = webstoreUrl
                            this.$ga.event("Install cancelled", "chrome")
                            console.log("inline install failure. redirecting to webstore. ", msg)
                        }
                    )

                }
            }
        },
        mounted() {
            let ua = navigator.userAgent
            this.isMobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)

            if (ua.indexOf("Firefox") > -1) {
                this.browserName = "firefox"
            }

            // chrome works on desktop only
            else if (ua.indexOf("Chrome") > -1) {
                this.browserName = "chrome"
            }

            else {
                this.browserName = "unsupported"
            }



        }
    }
</script>

<style scoped lang="scss">
    .page {
        width: 100%;
        max-width: 100%;
        padding-bottom: 0;
    }

    .top-screen {
        display: flex;
        margin-top: 50px;
        @media (max-width: 600px) {
            margin-top: 0;
            flex-wrap: wrap;
        }

        .main-img {
            display:flex;
            align-content: center;
            align-items: center;
            min-width: 400px;
            @media (max-width: 600px){
                min-width: 0;
            }

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

            @media (max-width: 600px){
                margin: 0;
            }

            div.tagline h2 {
                font-weight: bold;
                font-size: 180%;
                color: #333;
                margin: 0;
                padding: 0;
                /*@media @xs {*/
                /*font-size: 30px;*/
                /*line-height: 1.3;*/
                /*font-weight: bold;*/
                /*}*/
            }

            div.about p {
                margin: 5px 0 35px;
                font-size: 85%;
                line-height: 1.5;
                max-width: 666px;
                .button-info {
                    color: darkred;
                    border-left: 3px solid darkred;
                    padding-left: 20px;
                    max-width:400px;
                    font-size: 16px;
                }
            }

            .cta {
                .install {
                    line-height: 1.5;
                    height: auto;
                    padding: 10px;
                    font-size: 18px;
                    .small {
                        display:none;
                        font-size: 80%;
                        text-transform: lowercase;
                    }
                }
            }

            .about-users {
                font-size: 16px;
                color: #999;
                margin-top: 30px;
                line-height: 1.9;
                font-weight: 300;
                .rating {
                    .stars {
                        margin-right: 3px;
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







    div.social-proof {
        margin-top: 50px;
        background: #fafafa;
        text-align: center;
        padding: 70px 0;
        .quote {
            padding: 20px;
            .content {
                font-weight: bold;
                font-size: 34px;
            }
            .attribution {
                font-size: 14px;
                color: #999;
                margin-top: 10px;
            }
        }
        .logos {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;

            img {
                height: 23px;
                margin: 50px 50px;
                opacity: .2;
                &.boingboing {
                    height: 25px;
                }
                &.science {
                    height: 27px;
                }
                &.chronicle {
                    height: 30px;
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
            font-weight: bold;
            margin-top: 0;
            letter-spacing: 0;
        }
        .text {
            padding: 0 30px;
            max-width: 600px;
        }
        .img {
            max-width: 300px;
            padding: 30px;
        }


        @media (max-width: 600px) {
            flex-wrap: wrap;
        }

        &.legal {
            background: #fafafa;
        }

    }


    .testimonials {
        text-align: center;
        margin-top: 50px;
        padding: 20px 0 70px 0;
        /*background: #fafafa;*/
        h2 {
            font-size: 34px;
        }

        .md-card {
            max-width: 320px;
            margin: 20px 10px;
            text-align: left;
            display: inline-block;
            vertical-align: top;
            min-height: 220px;
            * {
                font-size: 16px !important;
            }
          }
    }

</style>