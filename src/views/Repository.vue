<template>
    <div class="page repository">
        <div class="header">
            <div class="name">
                <h1>{{ name }}</h1>
                <h2>{{ institutionName }}</h2>
            </div>
            <div class="url">
                OAI-PMH endpoint: <a :href="pmhUrl + '?verb=Identify'">{{pmhUrl}}</a>
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
                        Last harvested content from
                    </td>
                    <td>
                        {{ status.last_harvest }}
                    </td>
                </tr>
            </table>
        </div>


        <div v-if="!status.num_pmh_records" class="content">
            We haven't harvested any content for this repository yet.  Please check back in a few days.
        </div>

        <div v-else class="content">

            <h2>Content</h2>


            <table>
                <tr>
                    <td>
                        Number of OAI-PMH records with a unique title
                    </td>
                    <td>
                        {{ status.num_pmh_records }}
                    </td><td>
                        <a :href="'https://api.unpaywall.org/repo_pulse/endpoint/' + endpointId + '/pmh/recent'">sample</a>
                    </td>
                </tr>

                <tr>
                    <td>
                        <div>
                            Number that match a published article DOI and have full text freely available,
                            by <a href="https://support.unpaywall.org/support/solutions/articles/44000708792-paper-version-definitions">version.</a>
                        </div>

                    </td>
                    <td>
                        {{ status.num_pmh_records_matching_dois_with_fulltext }}
                    </td>
                    <td><!-- no sample--></td>
                </tr>
                <tr class="sub">
                    <td class="sub-label">
                        publishedVersion
                    </td>
                    <td>
                        {{ versions.publishedVersion }}
                    </td><td>
                        <a :href="'https://api.unpaywall.org/repo_pulse/endpoint/' + endpointId + '/pmh/recent?version=publishedVersion'">sample</a>
                    </td>
                </tr>
                <tr class="sub">
                    <td class="sub-label">
                        acceptedVersion
                    </td>
                    <td>
                        {{ versions.acceptedVersion }}
                    </td><td>
                        <a :href="'https://api.unpaywall.org/repo_pulse/endpoint/' + endpointId + '/pmh/recent?version=acceptedVersion'">sample</a>
                    </td>
                </tr>
                <tr class="sub">
                    <td class="sub-label">
                        submittedVersion
                    </td>
                    <td>
                        {{ versions.submittedVersion }}
                    </td><td>
                        <a :href="'https://api.unpaywall.org/repo_pulse/endpoint/' + endpointId + '/pmh/recent?version=submittedVersion'">sample</a>
                    </td>
                </tr>
            </table>
        </div>


    <div class="actions">
        <md-button class="md-raised md-primary" :href="'mailto:support@unpaywall.org?subject=Unpaywall repository indexing problem for endpoint '+endpointId">
            <i class="fa fa-envelope"></i>
            Report problem
        </md-button>
    </div>

    <div class="io input" v-show="readyState=='ready'">
        <h2>Request OA Location Details</h2>
        <p>
            Get the details on all <a href="https://unpaywall.org/data-format#oa-location-object">OA Locations</a> from this repository.
        </p>
        <md-field>
            <label for="email-input">Your email</label>
            <md-input v-model="email" id="email-input"></md-input>
        </md-field>

        <div>
            <md-button @click="request_report"
                :disabled="!email"
                class="md-primary md-raised">
                Request Report
            </md-button>
        </div>
    </div>

    <!-- WORKING.... -->
    <div class="io working" v-show="readyState=='working'">
        <h2>Submitting request...</h2>
        <md-progress-bar md-mode="indeterminate"></md-progress-bar>
    </div>


    <!-- SUCCESS! -->
    <div class="io success" v-show="readyState=='success'">
        <h2>Success!</h2>
        <p>
            Your request has been submitted. In a few minutes, you'll get an email
            from us with an attached spreadsheet showing the results.
            Keep an eye on your spam folder, since automated emails can often be flagged as spam.
        </p>
    </div>


    <!-- ERROR! -->
    <div class="io error" v-show="readyState=='error'">
        <h2>Sorry, there was a problem!</h2>
        <p>
            Looks like we're having trouble processing your request. Please try again, or email us at
            <a href="mailto:support@unpaywall.org">support@unpaywall.org</a> and we'll work to get the problem fixed.
        </p>
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
                versions: {},
                readyState: "ready",
                email: "",
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
            request_report(){
                let url = "https://unpaywall.org/repo_pulse/endpoint/" + this.endpointId + "/request_oa_locations"
                let that = this
                let postData = {
                    email: this.email,
                }
                console.log("sending this to server:", postData)

                this.readyState = "working"
                axios.post(url, postData)
                    .then(function(resp){
                        console.log("success!", resp)
                        that.readyState = "success"
                    })
                    .catch(function(error){
                        console.log("error :(", error)
                        that.readyState = "error"
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
