<template>
    <div class="page">
        <v-container>
            <h1>Articles</h1>
            <p class="headline">
                Here you can search all 120M of our articles, by title. This page is still under construction.
            </p>
            <div>
                <v-text-field
                        solo
                        placeholder="Search by title"
                        v-model="q"
                        @keydown.enter="search"

                ></v-text-field>
            </div>
            <div class="results-section">
                <div class="search-success" v-if="results.length">
                    <div>
                        <a :href="apiUrl">View this search in the API</a>
                        <v-divider></v-divider>
                        <br><br>
                    </div>
                    <v-row class="result py-4" v-for="result in results" :key="result.doi">
                        <v-col cols="9">
                            <div class="title pl-0">
                                {{result.response.title}}
                            </div>
                            <div class="font-italic">
                                {{result.response.journal_name}}
                            </div>
                            <div>
                                <a
                                        :href="`https://api.unpaywall.org/v2/${result.response.doi}?email=YOUR_EMAIL`"
                                        target="_blank"
                                >
                                    View in API
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
        }),
        computed: {
            filteredSources() {
                return this.sources.slice(0, 100)
            },
            apiUrl(){
                return `https://api.unpaywall.org/v2/search/?query=${this.q}&email=YOUR_EMAIL`
            }
        },
        methods: {
            async search() {
                this.isLoading = true
                const resp = await axios.get(this.apiUrl)
                this.results = resp.data.results
                console.log("search resp!", this.results)
                this.isLoading = false

            },

            submit() {
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
        }
    }
</script>

<style scoped lang="scss">
    div.page {
        max-width: 100% !important;
    }


</style>