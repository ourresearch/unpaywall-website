<template>
    <div class="page product-page simple-query-tool">
        <h1>ISSN-L finder</h1>
        <p>
            Journals each have a unique ID called ISSN. But unfortunately, some journals have more than one ISSN, complicating
            identification. The "linking ISSN" or <a
                href="https://www.dnb.de/EN/Professionell/Services/ISSN/_content/eintrag04_akk2.html">ISSN-L</a> was created <a
                href="https://www.tandfonline.com/doi/abs/10.1080/03615260802669052?journalCode=wser20">solve this problem.</a>
            Using this page, you can submit ISSNs, and determine the ISSN-L that matches that particular ISSN.
        </p>


        <v-row>
            <v-col>
                    <h2>ISSNs</h2>
                    <md-field>
                        <label for="dois-textarea">Paste ISSNs here, one per line</label>
                        <md-textarea id="dois-textarea" v-model="issns">

                        </md-textarea>
                    </md-field>


                    <div>
                        <md-button @click="submit"
                                   :disabled="!issns"
                                   class="md-primary md-raised">
                            Submit issns
                        </md-button>
                    </div>

            </v-col>

            <v-col>
                <h2>ISSN-Ls</h2>
                <div>
                    <div class="issnl" v-for="issnl in results">
                        {{issnl || 'null'}}
                    </div>
                </div>
            </v-col>

        </v-row>








    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "IssnlFinder",
        metaInfo: {
            title: "ISSN-L Finder"
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
                const url = "https://api.unpaywall.org/issn_ls"
                const postData = {issns: this.issnsList}
                let that = this
                console.log("sending this to server:", url, postData)

                axios.post(url, postData)
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
    h2 {
        margin: 0;
    }

</style>