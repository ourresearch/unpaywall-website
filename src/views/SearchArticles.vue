<template>
    <div class="page">
        <v-container>
            <h1 class="pb-0 mb-0">Search Articles <span class="title green--text">beta</span></h1>
            <div class="d-none">
                Search all 120M of our articles, by title.
            </div>
            <v-row class="mt-4" align-content="flex-end">
                <v-col cols="8">
                    <v-text-field
                            solo
                            single-line
                            hide-details
                            placeholder="Search keywords, eg. 'parkinson's disease'"
                            v-model="q"
                            @keydown.enter="search"

                    />
                </v-col>
                <v-col cols="4">
                    <div v-if="!qIsDoi">
                        <v-switch
                                class="ml-12"
                            v-model="showOaOnly"
                            label="Show only free-to-read"
                        />
                    </div>
                    <div v-if="qIsDoi" class="">
                        <div class="font-weight-bold">DOI search</div>
                        <div class="body-1">Single article lookup</div>
                    </div>
                </v-col>


            </v-row>
            <div class="results-section">
                <div v-if="readyState==='loading'" class="mt-4">
                    <v-progress-linear indeterminate></v-progress-linear>
                </div>
                <div class="search-success" v-if="readyState==='done'">
                    <div v-if="results.length" class="">
                        <span class="">Showing top {{results.length}} results </span>
                        |
                        <a :href="apiUrl" target="_blank" class=""><i class="fas fa-cog"></i> view in API</a>
                        <v-divider class="mb-12 mt-4"></v-divider>
                    </div>
                    <div v-if="!results.length">No results found</div>
                    <v-row class="result py-4" v-for="result in results" :key="result.doi">
                        <v-col cols="9">
                            <div class="title pl-0 article-title">
                                {{result.response.title | truncate }}
                            </div>
                            <div>
                                <span  class="font-italic">
                                    {{result.response.journal_name}}
                                </span>
                                <span v-if="result.response.year">({{result.response.year}})</span>

                            </div>
                            <div>
                                <a
                                        :href="`https://api.unpaywall.org/v2/${result.response.doi}?email=unpaywall_00@example.com`"
                                        target="_blank"
                                        class="grey--text body-2"
                                >
                                    <i class="fas fa-cog"></i> view in API
                                </a>
                            </div>
                        </v-col>
                        <v-col cols="3" class="text-left font-weight-bold" v-if="result.response.best_oa_location">
                            <a
                                    :href="result.response.best_oa_location.url_for_landing_page"
                                    target="_blank"
                                    v-if="result.response.best_oa_location.url_for_landing_page"
                                    class="mr-3"
                            >
                                [HTML]
                            </a>

                            <span >
                                <a
                                        :href="result.response.best_oa_location.url_for_pdf"
                                        target="_blank"
                                        v-if="result.response.best_oa_location.url_for_pdf"
                                >
                                    [PDF]
                                </a>
                            </span>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </v-container>

    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "SearchArticles",
        metaInfo: {
            title: "Search articles"
        },
        data: () => ({
            sources: [],
            readyState: "ready",
            q: "",
            results: [],
            showOaOnly: true,
        }),
        computed: {
            filteredSources() {
                return this.sources.slice(0, 100)
            },
            qIsDoi(){
                return this.q.indexOf("10.") === 0
            },
            apiUrl(){
                let ret
                if (this.qIsDoi){
                    ret = `https://api.unpaywall.org/v2/${this.q}?email=unpaywall_00@example.com`
                }
                else{
                    ret = `https://api.unpaywall.org/v2/search/?query=${this.q}&email=unpaywall_00@example.com`
                    if (this.showOaOnly) ret += "&is_oa=true"
                }
                return ret
            },
        },
        methods: {
            async search() {
                this.readyState = "loading"
                this.results = []
                try {
                    const resp = await axios.get(this.apiUrl)
                    if (resp.data.results){
                        this.results = resp.data.results
                    }
                    else { // doi search
                        this.results = [{response: resp.data}]
                    }
                    console.log("search resp!", this.results)
                }
                catch(e) {
                    console.log("search error", e)
                    this.results = []
                }
                finally {
                    this.readyState = "done"
                }
            },

        },
        mounted() {
        },
        watch: {
            showOaOnly: function(to){
                this.results = []
                this.search()
            },
            q: function(to){
                // if (this.qIsDoi) {
                //     this.showOaOnly = false
                // }
            }
        }
    }
</script>

<style scoped lang="scss">
    div.page {
        max-width: 100% !important;
    }


</style>