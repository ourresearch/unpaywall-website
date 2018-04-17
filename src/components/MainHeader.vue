<template>
    <div class="container">
        <div class="logo">
            <router-link to="/">
                <img src="../assets/logo.png" alt="">
            </router-link>
        </div>
        <div class="site-nav">
            <div class="desktop">

                <!--  User Guides menu  -->
                <md-menu md-align-trigger :md-active.sync="allowOpen[0]"
>
                    <md-button md-menu-trigger>
                        User guides
                        <i class="fas fa-sort-down"></i>
                    </md-button>
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
                <md-menu md-align-trigger :md-active.sync="allowOpen[1]">
                    <md-button md-menu-trigger>
                        Products
                        <i class="fas fa-sort-down"></i>
                    </md-button>
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
                <md-menu md-align-trigger :md-active.sync="allowOpen[2]">
                    <md-button md-menu-trigger>
                        About
                        <i class="fas fa-sort-down"></i>
                    </md-button>
                    <md-menu-content>
                        <md-menu-item to="/team">
                                Team
                        </md-menu-item>
                        <md-menu-item to="/faq">
                                FAQ
                        </md-menu-item>
                        <md-menu-item to="/data-format">
                                Data format
                        </md-menu-item>
                        <md-menu-item to="/sources">
                                Data sources
                        </md-menu-item>
                        <md-menu-item to="/contact">
                                Contact
                        </md-menu-item>
                    </md-menu-content>
                </md-menu>


            </div>

            <div class="phone">
                <md-menu md-align-trigger :md-active.sync="allowOpen[3]">
                    <md-button md-menu-trigger>
                        <i class="fas fa-bars"></i>
                    </md-button>
                    <md-menu-content>
                        <md-menu-item to="/user-guides">
                                User Guides
                        </md-menu-item>
                        <md-menu-item to="/products">
                                Products
                        </md-menu-item>
                        <md-menu-item to="/integrations">
                                Integrations
                        </md-menu-item>
                        <md-menu-item to="/about">
                                About
                        </md-menu-item>
                    </md-menu-content>
                </md-menu>
            </div>


        </div>

    </div>


</template>

<script>
    export default {
        name: 'MainHeader',
        data(){
          return {
              allowOpen: [false, false, false, false]
          }
        },
        watch: {

            // This is a hack...the menus are supposed to close themselves
            // when you click them, but they don't do it.
            // So, close programmatically from here
            // when the route changes.
            '$route' (to, from){
                console.log("router changing in header", to)
                this.allowOpen = [false, false, false, false]
            }
        }
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
            max-height: 35px;
        }
        div.site-nav {
            color: #fff;
            .md-button {
                text-transform: capitalize;
                margin: 0 20px;
                font-size: 16px;
                color: #fff;
            }
            .desktop {
                @media (max-width: 960px) {
                    display:none;
                }
            }
            .phone {
                .md-button {
                    font-size: 24px;
                    margin: 0;
                    min-width: auto;
                }
                @media (min-width: 960px) {
                    display:none;
                }
            }
        }

    }


</style>