<template>
    <div class="container">
        <div class="logo">
            <router-link to="/">
                <img src="../assets/logo.png" alt="">
            </router-link>
        </div>
        <div class="site-nav">
            <div class="desktop md-xsmall-hide">

                <!--  User Guides menu  -->
                <md-menu md-align-trigger>
                    <md-button md-menu-trigger>User guides</md-button>
                    <md-menu-content>
                        <md-menu-item to="/user-guides/enterprise">
                                Enterprise
                        </md-menu-item>
                        <md-menu-item to="/user-guides/research">
                                Research
                        </md-menu-item>
                        <md-menu-item to="/user-guides/libraries">
                                Libraries
                        </md-menu-item>
                    </md-menu-content>
                </md-menu>


                <!-- Products menu -->
                <md-menu md-align-trigger>
                    <md-button md-menu-trigger>Products</md-button>
                    <md-menu-content>
                        <md-menu-item to="/products/snapshot">
                            Database snapshot
                        </md-menu-item>

                        <md-menu-item to="/products/data-feed">
                            Data Feed
                        </md-menu-item>

                        <md-menu-item to="/products/api">
                            REST API
                        </md-menu-item>

                        <md-menu-item to="/products/simple-query-tool">
                            Simple Query Tool
                        </md-menu-item>

                        <md-menu-item to="/products/extension">
                            Chrome/Firefox extension
                        </md-menu-item>
                    </md-menu-content>
                </md-menu>



                <md-button to="/integrations">Integrations</md-button>

                <!--  About menu  -->
                <md-menu md-align-trigger>
                    <md-button md-menu-trigger>About</md-button>
                    <md-menu-content>
                        <md-menu-item to="/data-format">
                                Data format
                        </md-menu-item>
                        <md-menu-item to="/sources">
                                Data sources
                        </md-menu-item>
                        <md-menu-item to="/faq">
                                FAQ
                        </md-menu-item>
                        <md-menu-item to="/terms-and-conditions">
                                Terms and Conditions
                        </md-menu-item>
                        <md-menu-item to="/contact">
                                Contact
                        </md-menu-item>
                    </md-menu-content>
                </md-menu>


            </div>

            <div class="phone">
                phone!
            </div>


        </div>

    </div>


</template>

<script>
    export default {
        name: 'MainHeader'
    }


</script>

<style scoped lang="scss">
    body.home {
        .container {
            background: none;
        }
    }


    .container {
        background: #333;
        height: 88px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 30px;

        div.logo a img {
            max-height: 30px;

        }

        div.site-nav {
            .md-button {
                text-transform: capitalize;
                margin: 0 20px;
                font-size: 14px;
                color: #fff;
            }

        }

    }


</style>