<template>
    <div class="page article-info">
        <h1>Article information</h1>

    </div>
</template>


<script>
    import axios from 'axios'

    export default {
        name: "ArticleInfo",
        metaInfo: {
            title: "Article information"
        },
        data: () => {
            return {
                readyState:"ready",
                issns: "",
                results: [],
            }
        },
        computed: {
            issnsList(){
                return this.issns.split("\n")
            }
        },
        methods: {
            submit(){
                const urlBase = "https://api.unpaywall.org/issn_ls?issns="
                const url = urlBase + this.issnsList.join()
                let that = this
                console.log("sending this to server:", url)

                axios.get(url)
                    .then(function(resp){
                        console.log("success!", resp)
                        that.readyState = "success"
                        that.results = resp.data.issn_ls
                    })
                    .catch(function(error){
                        console.log("error :(", error)
                        that.results = []
                        that.readyState = "error"
                    })
            }
        }

    }
</script>

<style scoped>

</style>