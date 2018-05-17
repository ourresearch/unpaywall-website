<template>
    <div class="page product-page simple-query-tool">
        <div class="page-header">
            <h1>Data Feed: Changefiles</h1>
            <div class="api-key" v-if="apiKey">
                Your API key: <span class="val">{{apiKey}}</span>
            </div>
        </div>

        <p>
            <span class="no-key" v-if="!apiKey">
                The Data Feed changefiles show all the changes in the Unpaywall database over time. They are provided for subscribers to the <router-link to="/data-format">Unpaywall Data Feed</router-link>.
            </span>
            <span class="no-key" v-if="apiKey">
                These files show all the changes in the Unpaywall database over time. You have access based on your subscription to the <router-link to="/data-format">Unpaywall Data Feed</router-link>.
            </span>



            A new file is added every Thursday. Files use the same <router-link to="/data-format">schema</router-link> as the <router-link to="/products/api">REST API</router-link> and <router-link to="/products/snapshot">database snapshot.</router-link>
        </p>

        <p>
            This list is also available via a <a href="http://api.unpaywall.org/feed/changefiles?api_key=YOUR_API_KEY">JSON endpoint</a> for programmatic access.
        </p>





        <md-progress-bar v-if="readyState=='loading'" md-mode="indeterminate"></md-progress-bar>

            <md-card v-if="!apiKey">
                <md-card-header>
                    API key required
                </md-card-header>
                <md-card-content>

                    <md-field>
                      <label>Paste your API key here</label>
                      <md-input v-model="newApiKey"></md-input>
                    </md-field>
                    <md-button class="md-raised md-primary" :href="'changefiles?api_key=' + newApiKey">Access changefiles</md-button>
                </md-card-content>

            </md-card>


        <div class="file-list" v-if="changefiles.length > 0">
            <h2>Changefiles</h2>

            <md-list>
                <md-list-item v-for="changefile in changefiles" v-if="changefile.filetype=='jsonl'">

                    <md-avatar>
                            <i class="far fa-file-archive"></i>

                    </md-avatar>



                    <div class="main md-list-item-text">
                        <div class="row">
                            <span class="date">
                                {{ changefile.last_modified | moment("MMMM Do, YYYY")}}
                            </span>
                        </div>
                        <div class="row">
                            {{changefile.lines.toLocaleString()}} lines
                        </div>
                        <div class="row">
                            {{changefile.size.toLocaleString()}} bytes
                        </div>
                    </div>
                    <div class="metadata">
                        <md-button
                                class="md-raised"
                                :disabled="!apiKey"
                                :href="changefile.url">
                            <i class="fas fa-download"></i>
                            Download
                        </md-button>
                    </div>
                </md-list-item>
            </md-list>
        </div>








    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "SimpleQueryTool",
        metaInfo: {
            title: "Simple Query Tool"
        },
        data: () => {
            return {
                readyState:"ready",
                changefiles: [],
                apiKey: "",
                newApiKey: ""
            }
        },
        computed: {
            doisList(){
                return this.dois.split("\n")
            },
            myApiKey(){
                if (this.apiKey){
                    return this.apiKey
                }
                else{
                    return "API_KEY"
                }
            }
        },
        methods: {
            getList(){
                let baseUrl = "https://api.unpaywall.org/feed/changefiles"
                let url = baseUrl + "?api_key=" + this.apiKey

                let that = this

                this.readyState = "loading"
                axios.get(url)
                    .then(function(resp){
                        console.log("success!", resp)
                        that.changefiles = resp.data.list
                        that.readyState = "success"
                    })
                    .catch(function(error){
                        console.log("error :(", error)
                        that.readyState = "error"
                    })
            }
        },
        mounted(){
            this.apiKey = this.$route.query.api_key
            if (this.apiKey){
                this.getList()
            }
        }

    }
</script>

<style scoped lang="scss">
    .page-header {
        h1 {
            margin-bottom: 0;
        }
        margin-bottom: 30px;
        .api-key {
            font-size: 14px;
            .val {
                font-family: "Consolas", "Monaco", monospace;
                font-weight: bold;
            }
        }
    }
    h2 {
        margin: 0;
    }

    .md-card {
        margin: 40px 0;
    }

    li.md-list-item {
        border-bottom: 1px solid #ddd;
        padding: 10px 0;
    }

</style>