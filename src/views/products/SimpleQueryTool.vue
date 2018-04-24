<template>
    <div class="page product-page simple-query-tool">
        <h1>Simple Query Tool</h1>
        <p>
            If you want to check a few articles to see if they are Open Access and don't want to mess with the <router-link to="/products/api">REST API,</router-link> you're in the right place.
        </p>
        <p>
            Paste the DOIs for your articles below, and we'll email you the results you'd have gotten from the API. Unlike the API or <router-link to="/products/snapshot">database snapshot,</router-link> the query tool returns CSV, to make it easier to integrate results into spreadsheet-based workflows. However, the column names still map to the same schema, <router-link to="/data-format">documented here.</router-link> You can check up to 10,000 DOIs at once using this tool.
        </p>



        <!-- READY STATE -->
        <md-card class="io input" v-show="readyState=='ready'">
            <md-card-header>
                <h2>Submit DOIs</h2>
            </md-card-header>
            <md-card-content>
                <md-field>
                    <label for="dois-textarea">Paste DOIs here, one per line</label>
                    <md-textarea id="dois-textarea" v-model="dois">

                    </md-textarea>
                </md-field>

                <md-field>
                    <label for="email-input">Your email</label>
                    <md-input v-model="email" id="email-input"></md-input>
                </md-field>

                <div>
                    <md-button @click="submit"
                               :disabled="!email || !dois"
                               class="md-primary md-raised">
                        Submit your DOIs
                    </md-button>
                </div>
            </md-card-content>
        </md-card>

        <!-- WORKING.... -->
        <md-card class="io working" v-show="readyState=='working'">
            <md-card-header>
                <h2>Submitting your DOIs now...</h2>
            </md-card-header>
            <md-card-content>
                <md-progress-bar md-mode="indeterminate"></md-progress-bar>
            </md-card-content>
        </md-card>


        <!-- SUCCESS! -->
        <md-card class="io success" v-show="readyState=='success'">
            <md-card-header>
                <h2>Success!</h2>
            </md-card-header>
            <md-card-content>
                <p>
                    Your DOIs have been submitted. In a few minutes, you'll get an email
                    from us with an attached spreadsheet showing the results. Keep an eye on your spam folder, since automated emails can often be flagged as spam.
                </p>
            </md-card-content>
        </md-card>


        <!-- ERROR! -->
        <md-card class="io error" v-show="readyState=='error'">
            <md-card-header>
                <h2>Sorry, there was a problem!</h2>
            </md-card-header>
            <md-card-content>
                <p>
                    Looks like we're having trouble processing your request. There may have been a problem with either the DOIs or the email you entered. Please email us at
                    <a href="mailto:team@impactstory.org">team@impactstory.org</a> and we'll work to get the problem fixed.
                </p>
            </md-card-content>
        </md-card>







    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "SimpleQueryTool",
        metaInfo: {
            title: "Simple Query Tool"
        },
        data: () => {
            return {
                readyState:"ready",
                dois: "",
                email: ""
            }
        },
        computed: {
            doisList(){
                return this.dois.split("\n")
            }
        },
        methods: {
            submit(){
                let url = "https://api.unpaywall.org/v2/dois"
                let that = this
                let postData = {
                    dois: this.doisList,
                    email: this.email
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
            }
        }

    }
</script>

<style scoped>
    h2 {
        margin: 0;
    }

</style>