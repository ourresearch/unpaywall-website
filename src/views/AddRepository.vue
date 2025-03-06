<template>
    <div class="page add-repository">
        <div class="header">
            <h1>Submit your repository for indexing</h1>
        </div>






    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "AddRepository",
        data(){
            return {
                repoId: "",
                name: "",
                institutionName: "",
                pmhUrl: "",
                status: {}
            }
        },
        components: {
            axios
        },
        metaInfo(){
            let ret = {
                title: "Repository"
            }
            if (this.repoId){
                ret.title = _.capitalize("Unpaywall repository " + this.repoId )
            }
            return ret
        },
        methods: {
            loadRepo() {
                console.log("loading repo!")
                let url = "https://api.unpaywall.org/repo_pulse/endpoint/" + this.repoId
                axios.get(url)
                    .then(resp => {
                        console.log("got repo back", resp)
                        this.name = resp.data.results.metadata.repository_name
                        this.institutionName = resp.data.results.metadata.institution_name
                        this.pmhUrl = resp.data.results.metadata.pmh_url

                        this.status = resp.data.results.status
                    })

            },
        },
        mounted(){
             this.repoId = this.$route.params.repoId
            this.loadRepo()
        },
        watch: {
            '$route' (to, from){
                this.repoId = to.params.repoId
            }
        }
    }
</script>

<style scoped>

</style>
