<template>
    <div class="page product-page snapshot">
        <h1>Database snapshot</h1>
        <h2>Overview</h2>
        <p>
            The database snapshot is a complete dump of everything we know about every Crossref DOI that exists.
        </p>
        <p>
            The structure is very simple: it's a
            <a href="http://jsonlines.org/">JSON Lines</a> text file, with one line for every Crossref DOI. Each line uses the same <router-link to="/data-format">schema</router-link> as our <router-link to="/products/api">REST API,</router-link> so you can think of it as a real efficient way of calling the API for every Crossref DOI that exists, without the unpleasantness of making 100 million HTTP calls.
        </p>

        <h2>
            Versions
        </h2>
        <p>
            We release a new snapshot about twice a year. If you want more up-to-date data, it works well to pair the snapshot with ongoing diffs, available via our <router-link to="/products/api">Data Feed</router-link> product.
        </p>


        <h2>
            Size
        </h2>
        <p>
            The latest version of the snapshot file is about 16GB (85G unzipped), and contains over 100 million lines.
        </p>

        <h2>
            Download
        </h2>
        <p>
            To complete the download of the full dataset, please <a href="https://goo.gl/forms/AZqaqKEzMcjLGdTT2">fill out this form,</a> which helps us report usage back to our funders, and we'll immediately provide you with a download link.
        </p>


    </div>
    
</template>
<script>
    export default {
        name: "Snapshot",
        metaInfo: {
            title: "Database Snapshot"
        }
    }
</script>

<style scoped>

</style>