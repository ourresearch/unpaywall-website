<template>
    <div class="page product-page simple-query-tool">
        <h1>Simple Query Tool</h1>
        <p>
            Sometimes you just want to check a few articles to see if they are Open Access, and you don't have the technical background to use <router-link to="/products/api">REST API</router-link> (or you just don't want to fuss with it).
        </p>
        <p>
            To help out in these cases, we build the Simple Query Tool. You just paste in the DOIs for your article, one per line, and we'll email you the results you'd have gotten from the API. Unlike the API or <router-link to="/products/snapshot">database snapshot,</router-link> the query tool returns CSV, to make it easier to integrate results into spreadsheet-based workflows. However, the column names still map to the same schema, <router-link to="/data-format">documented here.</router-link>
        </p>
        <p>
            The Simple Query Tool is currently <a href="http://unpaywall.org/check-dois">hosted on our old website,</a> though it will be moving here presently.
        </p>
    </div>
</template>

<script>
    export default {
        name: "SimpleQueryTool",
        metaInfo: {
            title: "Simple Query Tool"
        }
    }
</script>

<style scoped>

</style>