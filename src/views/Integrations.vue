<template>
    <div class="page integrations">
        <h1>Integrations</h1>
        <p>
            <em>This page is still under construction...</em>
        </p>
        <p>
            Although we offer many products to help folks access Unpaywall data, when it comes down to it we're just one of the users of our own dataset. There are a lot of great integrations from others that can help you get more out of the data than we can. Here's a partial list:
        </p>

        <h2 id="search">Search</h2>
        <ul>
            <li> <a href="https://app.dimensions.ai/discover/publication?and_facet_open_access=True">Dimensions</a> </li>
            <li><a href="https://clarivate.com/wp-content/uploads/2017/10/Clarivate-OA-Impact-Story_Intro-sheet.pdf?elqTrackId=c5abee7048934a3da317e296a3e2a9c8&elqaid=5350&elqat=2">Web of Science</a></li>
        </ul>

        <h2 id="link-resolvers">Library link resolvers</h2>
        <ul>
            <li><a href="https://knowledge.exlibrisgroup.com/SFX/Knowledge_Articles/How_to_enable_oaDOI_service_on_SFX">SFX</a></li>
            <li><a href="https://knowledge.exlibrisgroup.com/360_Services/360_Link/0Product_Documentation/Overview/360_Link_with_IEDL%3A_Open_Access_Lookup_Service_Integration">360 Link,</a></li>
            <li><a href="https://developers.exlibrisgroup.com/blog/Adding-an-oadoi-dot-org-GES-link-to-Primo">Primo</a></li>
            <li>Roll your own: the shortcut link <code>https://unpaywall.org/YOUR_DOI</code> automatically redirects to an open version of <code>YOUR_DOI</code> if we have one; many libraries have added this as a manual target in their own link resolvers.</li>

        </ul>


        <h2 id="other">Other integrations</h2>
        <ul>
            <li>
                <a href="https://cran.r-project.org/web/packages/roadoi/vignettes/intro.html">R client for our API</a>
            </li>
        </ul>

    </div>
</template>

<script>
    export default {
        name: "Integrations",
        metaInfo: {
            title: "Integrations"
        }    }
</script>

<style scoped>

</style>