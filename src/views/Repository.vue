<template>
    <div class="page repository">
        <div class="header">
            <div class="name">
                <h1>{{ name }}</h1>
                <h2>{{ institutionName }}</h2>
            </div>
            <div class="url">
                OAH-PMH endpoint: <a :href="pmhUrl">{{pmhUrl}}</a>
            </div>
        </div>





    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "Repository",
        data(){
            return {
                repoId: "",
                name: "",
                institutionName: "",
                pmhUrl: ""
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
                let url = "http://api.unpaywall.org/repo_pulse/endpoint/" + this.repoId
                axios.get(url)
                    .then(resp => {
                        console.log("got repo back", resp)
                        this.name = resp.data.results.metadata.repository_name
                        this.institutionName = resp.data.results.metadata.institution_name
                        this.pmhUrl = resp.data.results.metadata.pmh_url
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

<style scoped lang="scss">
    div.header {
        div.name {
            h1{
                margin-bottom: 0;
            }
            h2{
                margin:0;
                font-weight: normal;

            }
        }
    }

    h1 {
        text-transform: capitalize;
    }

</style>
