<template>
    <div class="page product-page simple-query-tool">
        <h1>Simple Query Tool</h1>
        <p>
            If you want to check a few articles to see if they are Open Access and don't want to mess with the <router-link to="/products/api">REST API,</router-link> you're in the right place. You can check up to 1,000 DOIs at once using this tool.
        </p>
        <p>
            We'll run the list through our API for you and give you a report on the Open Access status of each DOI (note: this tool caches API response, so you may see slight differences between data here and in the API for recently-changed articles). In a few minutes, you'll get an email with the results, as up to three attachments:
        </p>
        <ul>
            <li>A CSV file that lets you easily import results into a spreadsheet like Excel.</li>
            <li>A <a href="http://jsonlines.org/">JSON Lines</a> file that shows what you'd get if you called our API once for each DOI.</li>
            <li>An Excel spreadsheet.</li>
        </ul>
        <p>
             Don't forget to check the <router-link to="/data-format">schema documentation,</router-link> which includes definitions that will help you interpret the the result files.
        </p>
        <p>
            The result files will include one row per normalized DOI. DOI normalization includes conversion to lowercase and removal of whitespace and other extra characters. The report for
        </p>
        <pre>
            doi:10.1038/nature21360
            10.1038/nature21360
            10.1038/Nature21360
        </pre>
        <p>
            will have a single row with the DOI 10.1038/nature21360. If you have fewer result rows than input rows, check the DOI list for duplicates.
        </p>


        <!-- READY STATE -->
        <div class="io input" v-show="readyState=='ready'">
                <h2>Submit DOIs</h2>
                <md-field>
                    <label for="dois-textarea">Paste DOIs here, one per line</label>
                    <md-textarea id="dois-textarea" v-model="dois">

                    </md-textarea>
                </md-field>

                <h2>Select Result Formats</h2>
                <md-checkbox class="md-primary" v-model="formats" value="csv">CSV</md-checkbox>
                <md-checkbox class="md-primary" v-model="formats" value="jsonl">JSONL</md-checkbox>
                <md-checkbox class="md-primary" v-model="formats" value="xlsx">Excel (.xlsx)</md-checkbox>

                <md-field>
                    <label for="email-input">Your email</label>
                    <md-input v-model="email" id="email-input"></md-input>
                </md-field>

                <div>
                    <md-button @click="submit"
                               :disabled="!email || !dois || formats.length == 0"
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
                    <a href="mailto:support@unpaywall.org">support@unpaywall.org</a> and we'll work to get the problem fixed.
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
                email: "",
                formats: ["csv", "jsonl"]
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
                    email: this.email,
                    formats: this.formats
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