<template>
    <div class="site-footer">
        <div class="col products">
            <h3>Products & integrations</h3>
            <router-link to="products/database-snapshot">Database snapshot</router-link>
            <router-link to="products/data-feed">Data Feed</router-link>
            <router-link to="products/api">REST API</router-link>
            <router-link to="products/web-interface">Web query form</router-link>
            <router-link to="products/extension">Chrome/Firefox extension</router-link>
            <router-link to="integrations#search">Web of Science integration</router-link>
            <router-link to="integrations#search">Dimensions integration</router-link>
            <router-link to="integrations#link-resolvers">Library link resolver integration</router-link>
        </div>

        <div class="col user-guides">
            <h3>User guides</h3>
            <router-link to="user-guides/enterprise">Enterprise</router-link>
            <router-link to="user-guides/libraries">Libraries</router-link>
            <router-link to="user-guides/research">Research</router-link>
        </div>

        <div class="col user-guides">
            <h3>About</h3>
            <router-link to="data-format">Data format guide</router-link>
            <router-link to="data-sources">Data sources</router-link>
            <router-link to="faq">FAQ</router-link>
            <router-link to="terms">Terms and Conditions</router-link>
            <a href="mailto:team@impactstory.org">Contact</a>
        </div>
        <div class="col spacer"></div>
        <div class="col made-by">
            <div class="social">
                <a href="https://twitter.com/unpaywall_data">
                    <i class="fab fa-twitter"></i>
                </a>
                <a href="https://twitter.com/unpaywall_data">
                    <i class="fab fa-github"></i>
                </a>
                <a href="https://twitter.com/unpaywall_data">
                    <i class="far fa-envelope"></i>
                </a>
            </div>
            <div class="made-with-love">
                Made with <i class="far fa-heart"></i> at <a href="http://impactstory.org">Impactstory.</a>

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
        padding: 50px;

        .col {
            margin: 20px 50px;
            color: #fff;
            &.spacer {
                flex-grow:2;
            }
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
                padding: 3px;
                color: #fff;
            }
        }


    }


</style>