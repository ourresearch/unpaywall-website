<template>
    <div class="page product-page simple-query-tool">
        <h1>Data Feed: Changefiles</h1>
        <p>
            This is a list of changes in the Unpaywall database, provided for subscribers to the Unpaywall Data Feed. A new file is added every Thursday. Files use the same <router-link to="/data-format">schema</router-link> as the <router-link to="/products/api">REST API</router-link> and <router-link to="/products/snapshot">database snapshot.</router-link>
        </p>

        <p>
            This list is also available via a <a href="http://api.unpaywall.org/feed/changefiles?api_key=YOUR_API_KEY">JSON endpoint</a> for programmatic access.
        </p>

        <p>

            You'll need an API key to download these files. More information is available on the <router-link to="/products/data-feed">Unpaywall Data Feed</router-link> page.
        </p>




        <md-progress-bar v-if="changefiles.length==0" md-mode="indeterminate"></md-progress-bar>
        <div v-if="changefiles.length > 0">
            <md-card>
                <md-card-content>
                    <md-field>
                      <label>Paste your API key here to enable download</label>
                      <md-input v-model="apiKey"></md-input>
                    </md-field>
                </md-card-content>

            </md-card>



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
                                :href="changefile.url.replace('YOUR_API_KEY', myApiKey)">
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
                readyState:"loading",
                changefiles: [],
                apiKey: ""
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
                let url = "https://api.unpaywall.org/feed/changefiles"
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
            this.getList()
        }

    }
</script>

<style scoped>
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