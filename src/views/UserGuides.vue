<template>
    <div class="page user-guide">
        <h1>Get started: {{ guideName }}</h1>


        <div v-if="0">
            <p>
                The Unpaywall database has a very simple structure: we have one record for every article with a Crossref DOI (that's about 95 million records all told). We harvest from <router-link to="/sources">lots of sources</router-link> to find Open Access content, and then we match it to these DOIs using content fingerprints. So, for any given DOI, we know about any OA versions that exist anywhere (at least that's the idea).
            </p>
            <p>We support a variety of products to help folks access these 95 million records in different ways; all of these are free to use, except the <router-link to="/products/data-feed">Data Feed.</router-link> We also support a number of <router-link to="/integrations">integrations,</router-link> where other organizations have built useful tools on top of our dataset.
            </p>
        </div>



        <div class="table-of-contents" v-if="!guideName">
            <ul>
                <li><router-link to="/user-guides/enterprise">Get started: Enterprise</router-link></li>
                <li><router-link to="/user-guides/research">Get started: Research</router-link></li>
                <li><router-link to="/user-guides/libraries">Get started: Libraries</router-link></li>
            </ul>
        </div>

        <div class="enterprise" v-if="guideName=='enterprise'">
            <p>
                Most of our enterprise users end up using the <router-link to="/products/data-feed">Data Feed</router-link> in order to keep their data up to date, and that's a good first stop. Other tools that are popular with enterprise users include:
            </p>
                    <ul>
            <li><router-link to="/products/snapshot">Database snapshot</router-link></li>
                <li><router-link to="/products/api">REST API</router-link></li>
                <li><router-link to="/products/simple-query-tool">Simple Query Tool</router-link></li>

        </ul>

        </div>







        <div class="research" v-if="guideName=='research'">
            <p>
                OA researchers can use Unpaywall to answer research questions about the current and historical state of open access.
            </p>
            <p>
                There are several popular ways  to access the data for research: you can use the
                                <router-link to="/products/api">REST API, </router-link>
                                <a href="https://cran.r-project.org/web/packages/roadoi/vignettes/intro.html"> the R API wrapper, </a>
                                <router-link to="/products/simple-query-tool">the Simple Query Tool, </router-link>
                                or
                                <router-link to="/products/snapshot">download the whole dataset.</router-link>

            </p>
            <p>


                A particularly easy way to get started with research is to use <a href="https://app.dimensions.ai/discover/publication?and_facet_open_access=True">Dimensions</a>,
                <a href="https://blog.ourresearch.org/elsevier-data-feed/">Scopus,</a> or
                                <a href="https://clarivate.com/wp-content/uploads/2017/10/Clarivate-OA-Impact-Story_Intro-sheet.pdf?elqTrackId=c5abee7048934a3da317e296a3e2a9c8&elqaid=5350&elqat=2">Web of Science, </a> which all have Unpaywall data integrated into their databases. That's the approach used by
                                <a href="https://peerj.com/preprints/3520/">this recent paper.</a> You might also check out the
                                <a href="https://peerj.com/preprints/3119v1/">the canonical reference paper</a> for the dataset, which gives a good overview of the data as a whole.

            </p>
        </div>

        <div class="libraries" v-if="guideName=='libraries'">

            <p>
                Our premier tool for libraries is the Unsub dashboard (formerly called Unpaywall Journals). It mashes up journal-level OA data with your institution's citation patterns and COUNTER download info, then builds a comprehensive model to forecast how cancellation or subscription decisions will affect library costs and fulfillment--letting you confidently made decisions about your Big Deals and individual subscriptions. We were named "Most Impactful New Product" at the 2019 Charleston Conference, and hundreds of libraries are already users.
            </p>
            <p>
                <a href="https://unsub.org">Check out Unsub!</a>
            </p>

            <p>
                Librarians can also integrate Unpaywall into their
                <a href="https://knowledge.exlibrisgroup.com/SFX/Knowledge_Articles/How_to_enable_oaDOI_service_on_SFX">SFX,</a>

                <a href="https://knowledge.exlibrisgroup.com/360_Services/360_Link/0Product_Documentation/Overview/360_Link_with_IEDL%3A_Open_Access_Lookup_Service_Integration">360 Link,</a>

                or

                <a href="https://developers.exlibrisgroup.com/blog/Adding-an-oadoi-dot-org-GES-link-to-Primo">Primo</a>

                link resolvers, so library users can read OA copies in cases where there's no subscription access. Over 1000 libraries worldwide are using this now.
            </p>

            <h3>Institutional Repository managers</h3>
            <p>
                IR managers can use Unpaywall data to find OA resources that faculty have posted online, without depositing in their IR. These can be automatically ingested, significantly increasing IR coverage without needing to convince faculty to deposit. Repositories of all sizes have used Unpaywall data in this way.  SwePub (national repository of Sweden) added 75,000 new OA records, increasing number of OA records by over 30%, while the smaller
                <a href="https://ir.library.carleton.ca/">the Carleton University IR</a> added 1000 OA records, doubling their fulltext coverage. There are a few good ways to access our data for this use case:
                <router-link to="/products/snapshot">download the whole dataset, </router-link>
                <router-link to="/products/simple-query-tool">check lists of records by DOI,</router-link> or
                taking advantage of Unpaywall's integration into
                <a href="https://app.dimensions.ai/discover/publication?and_facet_open_access=True">Dimensions,</a> 
                <a href="https://clarivate.com/wp-content/uploads/2017/10/Clarivate-OA-Impact-Story_Intro-sheet.pdf?elqTrackId=c5abee7048934a3da317e296a3e2a9c8&elqaid=5350&elqat=2">Web of Science,</a> and
                <a href="https://blog.ourresearch.org/elsevier-data-feed/">Scopus.</a>
            </p>


        </div>

        <p class="construction">
            Of course, this is just a very quick overview...if you have any questions, or want to use Unpaywall in a way that's not described here, please <a href="mailto:team@ourresearch.org">drop us a line</a> and we'll be happy to help!
        </p>


    </div>
</template>

<script>
    export default {
        name: "UserGuides",
        data(){
            return {
                guideName: ""
            }
        },
        metaInfo(){
            let ret = {
                title: "Get started"
            }
            if (this.guideName){
                ret.title = _.capitalize("Get started: " + this.guideName)
            }
            return ret
        },
        mounted(){
             this.guideName = this.$route.params.guideName
        },
        watch: {
            '$route' (to, from){
                this.guideName = to.params.guideName
            }
        }
    }
</script>

<style scoped>

    h1 {
        text-transform: capitalize;
    }

</style>
