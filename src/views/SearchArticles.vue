<template>
    <div class="page">
        <v-container>
            <h1 class="pb-0 mb-0">Search Articles <span class="title green--text">beta</span></h1>
            <div class="d-none">
                Search all 120M of our articles, by title.
            </div>
            <div class="mt-4 d-flex">
                <v-text-field
                        solo
                        single-line
                        hide-details
                        placeholder="Search keywords, eg. 'covid-19'"
                        v-model="q"
                        @keydown.enter="search"

                ></v-text-field>
                <v-switch
                        class="ml-12"
                    v-model="showOaOnly"
                    label="Show only free-to-read"
                />


            </div>
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
                            <div class="font-italic">
                                {{result.response.journal_name}}
                            </div>
                            <div>
                                <a
                                        :href="`https://api.unpaywall.org/v2/${result.response.doi}?email=YOUR_EMAIL`"
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
            isLoading: false,
            q: "",
            results: [],
            showOaOnly: true,
        }),
        computed: {
            filteredSources() {
                return this.sources.slice(0, 100)
            },
            apiUrl(){
                return `https://api.unpaywall.org/v2/search/?query=${this.q}&is_oa=${this.showOaOnly}&email=YOUR_EMAIL`
            },
        },
        methods: {
            async search() {
                this.readyState = "loading"
                this.isLoading = true
                const resp = await axios.get(this.apiUrl)
                this.results = resp.data.results
                console.log("search resp!", this.results)
                this.isLoading = false
                this.readyState = "done"

            },

            submit() { // not used now
                let url = "https://api.unpaywall.org/data/sources/" + this.q
                let self = this
                console.log("sending this to server:", this.q)

                this.readyState = "working"
                axios.get(url)
                    .then(function (resp) {
                        console.log("success!", resp)
                        self.sources = resp.data.results
                        self.readyState = "success"
                    })
                    .catch(function (error) {
                        console.log("error :(", error)
                        self.readyState = "error"
                    })
            }
        },
        mounted() {
        },
        watch: {
            showOaOnly: function(to){
                this.results = []
                this.search()
            }
        }
    }
</script>

<style scoped lang="scss">
    div.page {
        max-width: 100% !important;
    }


</style>