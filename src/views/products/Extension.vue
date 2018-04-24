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
            /*max-width: 510px;*/
            /*@media @xs {*/
            /*margin: 20px;*/
            /*font-size: 18px;*/
            /*}*/

            @media (max-width: 600px){
                margin: 0;
            }

            div.tagline h2 {
                font-weight: bold;
                font-size: 180%;
                color: #333;
                margin: 0;
                /*@media @xs {*/
                /*font-size: 30px;*/
                /*line-height: 1.3;*/
                /*font-weight: bold;*/
                /*}*/
            }

            div.about {
                margin: 0 0 10px;
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
                    /*cursor: pointer;*/
                    /*display: inline-block;*/
                    /*font-size: 18px;*/
                    /*padding: 20px 30px;*/
                    /*border-radius: 10px;*/

                    /*color: #fff;*/
                    /*font-weight: bold;*/
                    /*transition: all 0.15s ease;*/
                    /*&:hover {*/
                    /*transform: scale(1.03125);*/
                    /*}*/

                    /*.small {*/
                    /*font-size: 66%;*/
                    /*display: block;*/
                    /*text-align: center;*/
                    /*}*/

                    /*@media @xs {*/
                    /*padding: 14px 20px;*/
                    /*font-size: 16px;*/
                    /*}*/
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

</style>