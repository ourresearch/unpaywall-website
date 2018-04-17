<template>
    <div class="page user-guide">
        <h1>{{ guideName }} user guide</h1>



        <div class="table-of-contents" v-if="!guideName">
            ToC stuff
        </div>

        <div class="enterprise" v-if="guideName=='enterprise'">
            <strong>Enterprise users</strong> should check out our <a href="sla">SLA</a> in order to download and use the Unpaywall
                <a href="dataset">dataset</a> for commercial projects. Once you've done that, we can help you set up a mirror database that allows you to keep an always-current version of Unpaywall's data hosted on your own servers. You can also use the <a href="api">API</a> for any use (commercial or otherwise) for free.
        </div>

        <div class="research" v-if="guideName=='research'">
            <strong>OA researchers</strong> can use Unpaywall to answer research questions about the current and historical state of open access. There are several ways to access the data for research: you can use the
                            <a href="api">open API,</a>
                            <a href="https://cran.r-project.org/web/packages/roadoi/vignettes/intro.html">or the R API wrapper,</a>
                            <a href="check-dois">check a list of DOIs,</a>
                            or
                            <a href="dataset">download the complete dataset.</a> A particularly easy way to get started with research is to use <a href="https://app.dimensions.ai/discover/publication?and_facet_open_access=True">Dimensions</a> or
                            <a href="https://clarivate.com/wp-content/uploads/2017/10/Clarivate-OA-Impact-Story_Intro-sheet.pdf?elqTrackId=c5abee7048934a3da317e296a3e2a9c8&elqaid=5350&elqat=2">Web of Science, </a> which both have Unpaywall data integrated into their databases. That's the approach used by
                            <a href="https://peerj.com/preprints/3520/">this recent paper.</a> You might also check out the
                            <a href="https://peerj.com/preprints/3119v1/">the canonical reference paper</a> for the dataset, which gives a good overview of the data as a whole.
        </div>

        <div class="libraries" v-if="guideName=='libraries'">
            <strong>Librarians:</strong>
            can integrate Unpaywall into their
            <a href="https://knowledge.exlibrisgroup.com/SFX/Knowledge_Articles/How_to_enable_oaDOI_service_on_SFX">SFX,</a>

            <a href="https://knowledge.exlibrisgroup.com/360_Services/360_Link/0Product_Documentation/Overview/360_Link_with_IEDL%3A_Open_Access_Lookup_Service_Integration">360 Link,</a>

            or

            <a href="https://developers.exlibrisgroup.com/blog/Adding-an-oadoi-dot-org-GES-link-to-Primo">Primo</a>

            link resolvers, so library users can read OA copies in cases where there's no subscription access. Over 1000 libraries worldwide are now using this now.

            <strong>Institutional Repository managers</strong>
            can use Unpaywall data to find OA resources that faculty have posted online, without depositing in their IR. These can be automatically ingested, significantly increasing IR coverage without needing to convince faculty to deposit. Repositories of all sizes have used Unpaywall data in this way.  SwePub (national repository of Sweden) added 75,000 new OA records, increasing number of OA records by over 30%, while the smaller
            <a href="https://ir.library.carleton.ca/">the Carleton University IR</a> added 1000 OA records, doubling their fulltext coverage. There are a few good ways to access our data for this use case:
            <a href="dataset">downloading the complete dataset,</a>
            <a href="check-dois">check lists of records by DOI,</a> or
            taking advantage of Unpaywall's integration into the
            <a href="https://app.dimensions.ai/discover/publication?and_facet_open_access=True">Dimensions</a> and
            <a href="https://clarivate.com/wp-content/uploads/2017/10/Clarivate-OA-Impact-Story_Intro-sheet.pdf?elqTrackId=c5abee7048934a3da317e296a3e2a9c8&elqaid=5350&elqat=2">Web of Science.</a>
        </div>


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
                title: "User guides"
            }
            if (this.guideName){
                ret.title = _.capitalize(this.guideName + " user guide")
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