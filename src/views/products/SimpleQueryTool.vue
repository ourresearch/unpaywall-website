<template>
    <div class="page product-page simple-query-tool">
        <h1>Simple Query Tool</h1>
        <p>
            If you want to check a few articles to see if they are Open Access and don't want to mess with the <router-link to="/products/api">REST API,</router-link> you're in the right place. You can check up to 1,000 DOIs at once using this tool.
        </p>
        <p>
            We'll run the list through our API for you and give you a report on the Open Access status of each DOI. In a few minutes, you'll get an email with the results, as two attachments:
        </p>
        <ul>
            <li>A CSV file that lets you easily import results into a spreadsheet like Excel.</li>
            <li>A <a href="http://jsonlines.org/">JSON Lines</a> file that shows what you'd get if you called our API once for each DOI.</li>
        </ul>
        <p>
             Don't forget to check the <router-link to="/data-format">schema documentation,</router-link> which includes definitions that will help you interpret the the result files.
        </p>




        <!-- READY STATE -->
        <div class="io input" v-show="readyState=='ready'">
                <h2>Submit DOIs</h2>
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
        </div>

        <!-- WORKING.... -->
        <div class="io working" v-show="readyState=='working'">
                <h2>Submitting your DOIs now...</h2>
                <md-progress-bar md-mode="indeterminate"></md-progress-bar>
        </div>


        <!-- SUCCESS! -->
        <div class="io success" v-show="readyState=='success'">
            <h2>Success!</h2>
            <p>
                Your DOIs have been submitted. In a few minutes, you'll get an email
                from us with an attached spreadsheet showing the results. Keep an eye on your spam folder, since automated emails can often be flagged as spam.
            </p>
        </div>


        <!-- ERROR! -->
        <div class="io error" v-show="readyState=='error'">
                <h2>Sorry, there was a problem!</h2>
                <p>
                    Looks like we're having trouble processing your request. There may have been a problem with either the DOIs or the email you entered. Please email us at
                    <a href="mailto:team@impactstory.org">team@impactstory.org</a> and we'll work to get the problem fixed.
                </p>
        </div>







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