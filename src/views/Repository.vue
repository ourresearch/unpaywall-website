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
                        Normally harvested daily.  Last harvested on
                    </td>
                    <td>
                        {{ status.last_harvest }}
                    </td>
                </tr>
            </table>
        </div>

        <div class="content">
            <h2>Content</h2>


            <table>
                <tr>
                    <td>
                        Number of OAI-PMH records with a unique title
                    </td>
                    <td>
                        {{ status.num_pmh_records }}
                    </td><td>
                        <a :href="'https://api.unpaywall.org/repo_pulse/endpoint/' + endpointId + '/pmh/recent'">(recent)</a>
                    </td>
                </tr>

                <tr>
                    <td>
                        Number of OAI-PMH records that match a DOI
                    </td>
                    <td>
                        {{ status.num_pmh_records_matching_dois }}
                    </td>
                </tr>
                <tr>
                    <td>
                        <div>
                            Number of OAI-PMH records that match a published article DOI and have full text available,
                            by <a href="https://support.unpaywall.org/support/solutions/articles/44000708792-paper-version-definitions">version.</a>
                        </div>




                    </td>
                    <td>
                        {{ status.num_pmh_records_matching_dois_with_fulltext }}
                    </td>
                </tr>
                <tr class="sub">
                    <td class="sub-label">
                        publishedVersion
                    </td>
                    <td>
                        {{ versions.publishedVersion }}
                    </td><td>
                        <a :href="'https://api.unpaywall.org/repo_pulse/endpoint/' + endpointId + '/pmh/recent?version=publishedVersion'">(recent)</a>
                    </td>
                </tr>
                <tr class="sub">
                    <td class="sub-label">
                        acceptedVersion
                    </td>
                    <td>
                        {{ versions.acceptedVersion }}
                    </td><td>
                        <a :href="'https://api.unpaywall.org/repo_pulse/endpoint/' + endpointId + '/pmh/recent?version=acceptedVersion'">(recent)</a>
                    </td>
                </tr>
                <tr class="sub">
                    <td class="sub-label">
                        submittedVersion
                    </td>
                    <td>
                        {{ versions.submittedVersion }}
                    </td><td>
                        <a :href="'https://api.unpaywall.org/repo_pulse/endpoint/' + endpointId + '/pmh/recent?version=submittedVersion'">(recent)</a>
                    </td>
                </tr>
            </table>
        </div>


            <div class="actions">
                <md-button class="md-raised md-primary" href="mailto:heather@impactstory.org?subject=Unpaywall repository indexing problem">
                    <i class="fa fa-envelope"></i>
                    Report problem
                </md-button>
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
                endpointId: "",
                status: {},
                versions: {}
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
                        this.endpointId = resp.data.results.metadata.endpoint_id

                        this.status = resp.data.results.status
                        this.versions = resp.data.results.by_version_distinct_pmh_records_matching_dois
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

        .actions {
            a {
                margin-left: 0px;
            }
        }
    }



    table {
        td {
            max-width: 300px;
        }
        tr.sub {
            font-size: 66%;
            td.sub-label {
                padding-left: 30px;
            }
        }
    }

</style>
