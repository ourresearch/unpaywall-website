<template>
    <div class="page sources">
        <h1>Data sources</h1>
        <p>
            Unpaywall finds OA content in many ways, including using data from open indexes like <a
                href="https://www.crossref.org/">Crossref</a> and <a href="https://doaj.org/">DOAJ</a> where it exists. However, the majority of our OA content comes from independently monitoring over 50,000 unique online content hosting locations, including Gold OA journals, Hybrid journals, institutional repositories, and disciplinary repositories.
        </p>

        <p>
            If you'd like to add your repository or journal to our list of sources, that's great! You can submit your repository for indexing via
            <a href="https://goo.gl/forms/HBOMqdSFOHEeFOwj1">
                this form,
            </a> and submit your journal <a href="mailto:bugs@unpaywall.org">via email.</a>
        </p>

        <p>
            If you'd like to find a particular source, use the form below or
            <a href="https://api.oadoi.org/data/sources.csv">download the complete sources list as CSV.</a>
        </p>

        <div class="search-thing">

            <md-card>
                <md-card-header>
                    <h2>
                        Search sources
                    </h2>
                </md-card-header>
                <md-card-content>
                    <md-field>
                      <label>Search repositories and journals by name or URL</label>
                      <md-input v-model="q" @keyup.enter="submit"></md-input>
                    </md-field>
                    <md-button @click="submit"
                               :disabled="!q"
                               v-show="readyState=='ready' || readyState=='success'"
                               class="md-raised md-primary ready-state-ready">
                        <span class="ready" v-show="readyState=='ready'">Search sources</span>
                        <span class="ready" v-show="readyState=='success'">Search again</span>
                    </md-button>
                    <div class="ready-state-working" v-show="readyState=='working'">
                        <md-progress-spinner
                                :md-diameter="35"
                                md-mode="indeterminate">

                        </md-progress-spinner>
                    </div>
                    <div class="results ready-state-success" v-show="readyState=='success'">
                        <h2>
                            {{ sources.length }} results
                        </h2>

                        <div class="result" v-for="source in filteredSources">
                            <div class="name">
                                <a :href="source.home_page">
                                    {{ source.repository_name }}
                                </a>
                            </div>
                            <div class="host">
                                {{ source.institution_name }}
                            </div>
                        </div>

                        <div class="not-shown" v-show="sources.length > 100">
                            {{ sources.length - 100 }} additional results matching <em>"{{ q }}"</em> are not shown. You may want to try a more precise search term.
                        </div>

                    </div>
                </md-card-content>
            </md-card>







        </div>
        
        
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "Sources",
        metaInfo: {
            title: "Data sources"
        },
        data: () => ({
            sources: [],
            readyState: "ready",
            q: ""
        }),
        computed: {
            filteredSources(){
                return this.sources.slice(0,100)
            }
        },
        methods: {
            submit(){
                let url = "https://api.unpaywall.org/data/sources/" + this.q
                let self = this
                console.log("sending this to server:", this.q)

                this.readyState = "working"
                axios.get(url)
                    .then(function(resp){
                        console.log("success!", resp)
                        self.sources = resp.data.results
                        self.readyState = "success"
                    })
                    .catch(function(error){
                        console.log("error :(", error)
                        self.readyState = "error"
                    })
            }
        },
        mounted(){
        }
    }
</script>

<style scoped lang="scss">

    .md-card {
        .md-card-header {
            h2 {
                margin: 0;
            }
        }
    }

    .md-field {
        .md-input {
            font-size: 22px;
            height: 40px;
        }
    }

    .result {
        margin: 15px 0;
        .host {
            font-size: 12px;
        }
    }

    .not-shown {
        font-weight: bold;
        padding-top: 30px;
    }

</style>