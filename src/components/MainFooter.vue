<template>
    <div class="site-footer md-layout md-gutter">
        <div class="col md-layout-item md-size-20 md-xsmall-size-100 products">
            <h3>Products & integrations</h3>
            <a href="https://unsub.org/">Unsub</a>
            <router-link to="/products/extension">Chrome/Firefox extension</router-link>
            <router-link to="/products/snapshot">Database snapshot</router-link>
            <router-link to="/products/data-feed">Data Feed</router-link>
            <router-link to="/products/api">REST API</router-link>
            <router-link to="/products/simple-query-tool">Simple Query Tool</router-link>
            <router-link to="/integrations#link-resolvers">Library link resolver integration</router-link>
            <router-link to="/articles">Search articles</router-link>
        </div>

        <div class="col md-layout-item md-xsmall-size-100 user-guides">
            <h3>Get Started</h3>
            <router-link to="/user-guides/libraries">Libraries</router-link>
            <router-link to="/user-guides/enterprise">Enterprise</router-link>
            <router-link to="/user-guides/research">Research</router-link>
        </div>

        <div class="col md-layout-item md-size-20 md-xsmall-size-100 about">
            <h3>About</h3>
            <router-link to="/team">Team</router-link>
            <router-link to="/faq">FAQ</router-link>
            <router-link to="/data-format">Data format guide</router-link>
            <router-link to="/sources">Data sources</router-link>
            <router-link to="/legal/terms-of-service">Terms of Service</router-link>
            <router-link to="/legal/privacy">Privacy policy</router-link>
            <router-link to="/contact">Contact</router-link>
             <a href="mailto:support@unpaywall.org">Report bug</a>
        </div>
        <div class="col md-layout-item md-xsmall-size-100 spacer"></div>
        <div class="col md-layout-item md-xsmall-size-100 made-by">
            <div class="social">
                <a href="https://twitter.com/unpaywall">
                    <i class="fab fa-twitter"></i>
                </a>
                <a href="https://github.com/ourresearch/oadoi">
                    <i class="fab fa-github"></i>
                </a>
                <a href="mailto:team@ourresearch.org">
                    <i class="far fa-envelope"></i>
                </a>
            </div>
            <div class="made-with-love">
                Made with <i class="far fa-heart"></i> at <a href="https://ourresearch.org">OurResearch.</a>

            </div>


        </div>

    </div>
</template>

<script>
    export default {
        name: "MainFooter"
    }
</script>

<style scoped lang="scss">
    .site-footer {
        background: #333;
        display: flex;
        padding: 0 50px 50px 50px;
        font-size: 14px;

        .col {
            color: #fff;
            margin-top: 50px;
            &.made-by {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                a {
                    display: inline;
                    padding: 0;
                }
                div.social {
                    font-size: 24px;

                    a {
                        margin: 0 20px 0 0;
                    }
                }
                div.made-with-love {
                    font-size: 12px;
                }
            }
            h3 {
                color: #fff;
                margin: 0 0 10px 0;
            }
            a {
                display: block;
                padding: 3px 0;
                color: #fff;
            }
        }


    }


</style>