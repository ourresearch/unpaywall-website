<template>
    <div class="page product-page extension">
        <script type="application/javascript" src="https://widget.prefinery.com/widget/v2/tpuegk6r.js" async defer></script>

        <div class="top-screen">

            <div class="main-copy">
                <div class="tagline">
                    <h2 class="above">
                        Subscribe informed.
                    </h2>
                </div>
                <div class="about">
                    <p>
                        Unpaywall Journals is a data dashboard to help you get more value from your serials budget.
                    </p>

                </div>

                <div class="cta">
                    <md-button class="install md-primary md-raised prefinery-form-cta">
                        Join the waitlist
                    </md-button>

                </div>


            </div>

        </div>

        <div class="selling-points">

            <!-- first point -->
            <div class="selling-point">
                <div class="main">
                    <h2>Get Informed</h2>
                    <p>
                        Understand the latest data on open access, read and publish models, and real cost-per-use data in the context of your own serials collection.
                    </p>
                </div>
                <ul class="extra">
                    <li>
                        <h3>Include Open Access</h3>
                        <p>Get journal-level open access details from Unpaywall, the industry leaders in Open Access data.</p>
                    </li>
                    <li>
                        <h3>Connect with APC spending</h3>
                        <p>Automatically determine how much money your institution pays in open access publishing fees to understand your entire spend to publishers.</p>
                    </li>
                    <li>
                        <h3>Anticipate disruptions</h3>
                        <p>Learn how upcoming industry changes such as Plan S, read and publish agreements, and new document delivery pathways will affect your access choices.</p>
                    </li>
                </ul>
            </div>

            <!-- second point -->
            <div class="selling-point">
                <div class="main">
                    <h2>Keep optimizing</h2>
                    <p>
                        Identify cost saving opportunities that work for your institution, given your unique assumptions, usage patterns, and priorities.
                    </p>
                </div>
                <ul class="extra">
                    <li>
                        <h3>Stop paying for free content</h3>
                        <p>Use cost-per-use calculations that exclude content which is available for free through open access or your own backfile.</p>
                    </li>
                    <li>
                        <h3>Look ahead five years</h3>
                        <p>Base your decisions on projections of future usage and availability, rather than how things have been.  Configure model settings to reflect your personal assumptions and risk tolerance.</p>
                    </li>
                    <li>
                        <h3>Customize for your institution's values</h3>
                        <p>Balance your serials budget with your institutions's needs, weighing citations, authorships, and speed of access as best fits your community.</p>
                    </li>
                </ul>
            </div>


            <!-- third point -->
            <div class="selling-point">
                <div class="main">
                    <h2>Stay Organized</h2>
                    <p>
                        Bring prices, COUNTER, open access, citations, authorships, and backfile usage together in one place, so you can integrate, experiment, and share.
                    </p>
                </div>
                <ul class="extra">
                    <li>
                        <h3>Stop juggling spreadsheets</h3>
                        <p>The easy-to-use web interface brings all your data to one place (though you can still export the data if you can't help yourself!).</p>
                    </li>
                    <li>
                        <h3>Save Scenarios</h3>
                        <p>Want to experiment?  Try a few different subscription paths -- maybe one that maximum cost-cutting and another that proposes a read and publish agreement -- and save them as you go so you can come back and compare.</p>
                    </li>
                    <li>
                        <h3>Share with your team</h3>
                        <p>Through our Report View, bring the same data that helped inform your decisions to administration and faculty on your campus as part of your communication strategy.</p>
                    </li>
                </ul>
            </div>
        </div>

        <div class="tell-me-more">
            <h1>Sounds great! Tell me more!</h1>

            <ul>
                <li>
                    <h3>Launching on November 4th, 2019</h3>
                    <p>Sign up to the Our Research newsletter here to be the first to hear when Unpaywall Journals is released.  Then help us spread the word!</p>
                </li>
                <li>
                    <h3>A Partner in Open Infrastructure</h3>
                    <p>Our Research is a US-based non-profit company.  Like everything we do, Unpaywall Journals has open source code, an open data API, and an accessible pricing model.</p>
                </li>
                <li>
                    <h3>Free demo</h3>
                    <p>Unpaywall Journals will include a free demo with a sample university's usage and price data.</p>
                </li>
                <li>
                    <h3>Customization and price</h3>
                    <p>We want all institutions to be able to afford this tool.  To achieve this, we are setting the introductory price at $1000/year (US dollars) -- less than the price of a single APC or subscription.  In return for this, your institution becomes a supporter of Open Infrastructure, a partner in Unpaywall Journals, and will receive an Unpaywall Journals dashboard customized to your institution.  You will be able to upload your own COUNTER stats, subscription history, and price lists.  We'll use this information to customize the usage, open access percentages, citations, authorships, and prices for your university.  If your institution would like to contribute more, we will gladly accept donations -- we are a 501(c)3 tax-exempt charity -- and will use that money to continue making tools and data as openly available as possible.
.</p>
                </li>
                <li>
                    <h3>More questions?</h3>
                    <p>We'd love to answer them! team@ourresearch.org and follow @unpaywall.</p>
                </li>
            </ul>



        </div>

    <div class="cta-bottom">
        <md-button class="install md-primary md-raised prefinery-form-cta">
            Join the waitlist
        </md-button>

    </div>




    </div>
</template>

<script>
    export default {
        name: "Unpaywall Journals",
        metaInfo: {
            title: "Unpaywall Journals"
        },
        data: () => {
            return {
                browserName:"",
                isMobileBrowser: ""
            }
        },
        methods: {
        },
        mounted() {
            let s = document.createElement('script')
            s.setAttribute('src', 'https://widget.prefinery.com/widget/v2/tpuegk6r.js')
            document.head.appendChild(s)
            setTimeout(function(){
            }, 500)





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
        margin: 100px 0 140px;
        @media (max-width: 600px) {
            margin-top: 0;
            flex-wrap: wrap;
        }
        // temp
        justify-content: center;

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

        }
    }

    .selling-points {
        margin: 0 auto;
        max-width: 800px;
        h3 {
            margin: 0;
            padding: 0;
            display: inline;
            font-size: 18px;
            &:after {
                content: ": ";
            }
        }
        p {
            display: inline;
        }
    }


    .tell-me-more {
        margin: 0 auto;
        max-width: 800px;
        h3 {
            margin: 0;
            padding: 0;
            display: inline;
            font-size: 18px;
            &:after {
                content: ": ";
            }
        }
        p {
            display: inline;
        }
    }

    .cta-bottom {
        padding: 100px;
        display: flex;
        justify-content: center;
        button {
            font-size: 18px;
            padding: 10px;
            height: auto;
        }
    }









</style>