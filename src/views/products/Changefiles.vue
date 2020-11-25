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



            Files use the same <router-link to="/data-format">schema</router-link> as the <router-link to="/products/api">REST API</router-link> and <router-link to="/products/snapshot">database snapshot.</router-link>
            This list is also available via a <a href="https://api.unpaywall.org/feed/changefiles?api_key=YOUR_API_KEY">JSON endpoint</a> for programmatic access.
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

                    <p>Show changes in last</p>
                    <p>
                    <md-radio class="md-primary" v-model="newApiInterval" value="week">Week</md-radio>
                    <md-radio class="md-primary" v-model="newApiInterval" value="day">Day</md-radio>
                    </p>
                    <md-button class="md-raised md-primary" :href="'changefiles?api_key=' + newApiKey + '&api_interval=' + newApiInterval">Access changefiles</md-button>
                </md-card-content>
            </md-card>

        <div v-if="changefiles.length == 0">
            <p>Each changefile has a timestamp in its filename that tells you the most recent update it contains.</p>
            <ul>
                <li>Weekly: changed_dois_with_versions_YYYY-MM-DDThhmmss_to_<strong>YYYY-MM-DDThhmmss</strong>.jsonl.gz</li>
                <li>Daily: changed_dois_with_versions_<strong>YYYY-MM-DDThhmmss</strong>.jsonl.gz</li>
            </ul>
            <p>You can use the snapshot and changefiles together to keep your copy up to date by following these steps:</p>
            <ol>
                <li>Download and import the current snapshot.</li>
                <li>Download all changefiles, starting with the first file with an update timestamp before that of the snapshot.</li>
                <li>Import each changefile by reading it line by line, overwriting or updating the previous record for that row's DOI.</li>
                <li>Continue to import changefiles as above, as they are released.</li>
            </ol>

            <h2 class="section-header">JSON Endpoint</h2>

            <div class="endpoint" id="get-changefiles">
                <code class="endpoint">GET api.unpaywall.org/feed/changefiles?api_key=YOUR_API_KEY&amp;interval=INTERVAL</code>
                <table class="endpoint">
                    <tr>
                        <td class="k">
                            Description
                        </td>
                        <td class="v">
                            Provides a JSON object containing a list of changefile attributes and URLs.
                        </td>
                    </tr>
                    <tr>
                        <td class="k">
                            Accepts
                        </td>
                        <td class="v">
                            <ul>
                                <li><code class="endpoint">api_key (string, required)</code>: Your API key, issued when you subscribe to the data feed.</li>
                                <li>
                                    <code class="endpoint">interval (string, optional)</code>: Which set of changefiles to list. Options:
                                    <ul>
                                        <li>
                                            <code>"week" (default)</code>: Files produced weekly on Thursdays, containing all records updated in the previous 9 days.
                                            Each file overlaps with the previous week's to account for variability in the time to produce the file
                                            and updates that occur while generating it.
                                        </li>
                                        <li>
                                            <code>"day"</code>: Files produced every day, containing all records updated since the last file was generated.
                                            No overlap is needed because each export stores the <em>updated</em> timestamp of each record, for use by the next export process.
                                        </li>
                                    </ul>
                                </li>
                            </ul>

                            <p>
                                The difference in overlap behavior is an implementation detail that shouldn't affect your import process;
                                each row in a changefile should overwrite the corresponding record in the dataset regardless.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="k">
                            Returns
                        </td>
                        <td class="v">
                            <p>An object containing an array of changefiles:</p>
                            <pre>
{
  "list": [
    {
      "date": string (YYYY-MM-DD),
      "filename": string,
      "filetype": string ("jsonl", or "csv"),
      "last_modified": string (YYYY-MM-DDThh:mm:ss)
      "lines": integer,
      "size": integer,
      "url": string
    },
    …
  ]
}
                            </pre>
                        </td>
                    </tr>
                    <tr>
                        <td class="k">
                            Example
                        </td>
                        <td class="v">
                            <a href="https://api.unpaywall.org/feed/changefiles?api_key=YOUR_API_KEY&interval=day">https://api.unpaywall.org/feed/changefiles?api_key=YOUR_API_KEY&amp;interval=day</a>
                        </td>
                    </tr>
                </table>
            </div>


        </div>

        <div class="file-list" v-if="changefiles.length > 0">
            <h2>Changefiles</h2>

            <md-list>
                <md-list-item :key="changefile.url" v-for="changefile in changefiles" v-if="changefile.filetype=='jsonl'">

                    <md-avatar>
                            <i class="far fa-file-archive"></i>

                    </md-avatar>



                    <div class="main md-list-item-text">
                        <div class="row">
                            <span class="date">
                                {{ changefile.to_date ? changefile.to_date : changefile.date | moment("MMMM Do, YYYY")}}
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
        name: "Changefiles",
        metaInfo: {
            title: "Data Feed changefiles"
        },
        data: () => {
            return {
                readyState:"ready",
                changefiles: [],
                apiKey: "",
                newApiKey: "",
                apiInterval: "",
                newApiInterval: "week"
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
                let url = baseUrl + "?api_key=" + this.apiKey + "&interval=" + this.apiInterval

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
            this.apiInterval = this.$route.query.api_interval
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

    h2.section-header {
        margin-top: 30px;
    }

    .md-card {
        margin: 40px 0;
    }

    li.md-list-item {
        border-bottom: 1px solid #ddd;
        padding: 10px 0;
    }

</style>