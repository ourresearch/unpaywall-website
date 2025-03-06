<template>
    <div class="page product-page simple-query-tool">
        <h1>Simple Query Tool</h1>
        <p>
            If you want to check a few articles to see if they are Open Access and don't want to mess with the <router-link to="/products/api">REST API,</router-link> you're in the right place. You can check up to 1,000 DOIs at once using this tool.
        </p>
        <p>
            We'll run the list through our API for you and give you a report on the Open Access status of each DOI (note: this tool caches API response, so you may see slight differences between data here and in the API for recently-changed articles). The results will be automatically downloaded to your computer in two formats:
        </p>
        <ul>
            <li>A CSV file that lets you easily import results into a spreadsheet like Excel.</li>
            <li>A <a href="http://jsonlines.org/">JSON Lines</a> file that shows what you'd get if you called our API once for each DOI.</li>
        </ul>
        <p>
             Don't forget to check the <router-link to="/data-format">schema documentation,</router-link> which includes definitions that will help you interpret the result files.
        </p>




        <!-- READY STATE -->
        <div class="io input" v-show="readyState=='ready'">
                <h2>Submit DOIs</h2>
                <md-field>
                    <label for="dois-textarea">Paste DOIs here, one per line</label>
                    <md-textarea id="dois-textarea" v-model="dois">

                    </md-textarea>
                </md-field>

                <div>
                    <md-button @click="submit"
                               :disabled="!dois"
                               class="md-primary md-raised">
                        Download Results
                    </md-button>
                </div>
        </div>

        <!-- WORKING.... -->
        <div class="io working" v-show="readyState=='working'">
                <h2>Creating download...</h2>
                <md-progress-bar md-mode="indeterminate"></md-progress-bar>
        </div>


        <!-- SUCCESS! -->
        <div class="io success" v-show="readyState=='success'">
            <h2>Download Complete!</h2>
            <p>
                Your results have been downloaded to your computer in CSV and JSON formats.
                You can now open these files to view the Open Access status of your DOIs.
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
                dois: ""
            }
        },
        computed: {
            doisList(){
                return this.dois.split("\n").filter(doi => doi.trim() !== "")
            }
        },
        methods: {
            downloadFile(data, filename, type) {
                const blob = new Blob([data], { type: type })
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', filename)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            },
            submit(){
                let url = "https://unpaywall-simple-query-tool-c76bcdcacd9a.herokuapp.com/v2/dois"
                let that = this
                let postData = {
                    dois: this.doisList
                }
                console.log("sending this to server:", postData)

                if (this.doisList.length === 0) {
                    return
                }

                this.readyState = "working"
                axios.post(url, postData, { responseType: 'arraybuffer' })
                    .then(function(resp){
                        console.log("success!", resp)
                        
                        // Convert the arraybuffer to a Blob
                        const data = resp.data
                        
                        // Download both files
                        const timestamp = new Date().toISOString().replace(/[:T.]/g, '-').substring(0, 19)
                        that.downloadFile(data, `unpaywall-results-${timestamp}.csv`, 'text/csv')
                        
                        // Get the JSON data from the same endpoint with different format
                        return axios.post(url, postData, { 
                            responseType: 'arraybuffer',
                            params: { format: 'jsonl' }
                        })
                    })
                    .then(function(resp){
                        const timestamp = new Date().toISOString().replace(/[:T.]/g, '-').substring(0, 19)
                        that.downloadFile(resp.data, `unpaywall-results-${timestamp}.jsonl`, 'application/json')
                        that.readyState = "success"
                        
                        // Reset to ready state after 3 seconds
                        setTimeout(() => {
                            that.readyState = "ready"
                        }, 3000)
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