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

        <div class="harvest-status">
            <h2>Harvest status</h2>
            <table>
                <tr>
                    <td>
                        Check Identity status
                    </td>
                    <td>
                        {{ status.check0_identify_status }}
                    </td>
                </tr>
                <tr>
                    <td>
                        Check Query status
                    </td>
                    <td>
                        {{ status.check1_query_status }}
                    </td>
                </tr>
                <tr>
                    <td>
                        Last harvested on
                    </td>
                    <td>
                        {{ status.last_harvest }}
                    </td>
                </tr>
            </table>
        </div>

        <div class="content">
            <h2>Content</h2>


            <h3>Content by record</h3>
            <table>
                <tr>
                    <td>
                        Number of PMH records
                    </td>
                    <td>
                        {{ status.num_pmh_records }}
                    </td>
                </tr>
                <tr>
                    <td>
                        Number of PMH records that match a DOI
                    </td>
                    <td>
                        {{ status.num_pmh_records_matching_dois }}
                    </td>
                </tr>
                <tr>
                    <td>
                        Number of PMH records with full text that match a DOI
                    </td>
                    <td>
                        {{ status.num_pmh_records_matching_dois_with_fulltext }}
                    </td>
                </tr>
            </table>
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
                let url = "http://api.unpaywall.org/repo_pulse/endpoint/" + this.repoId
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

    table {
        td {
            max-width: 300px;
        }
    }

</style>
