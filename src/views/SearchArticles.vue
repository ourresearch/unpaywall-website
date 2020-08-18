<template>
    <v-container>
        <h1>Articles</h1>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
    </v-container>
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

<style scoped>

</style>