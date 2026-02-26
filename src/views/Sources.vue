<template>
    <div class="page sources">
        <h1>Data sources</h1>
        <p>
            Unpaywall finds OA content in many ways, including using data from open indexes like <a
                href="https://www.crossref.org/">Crossref</a> and <a href="https://doaj.org/">DOAJ</a> where it exists. However, the majority of our OA content comes from independently monitoring over 50,000 unique online content hosting locations, including Gold OA journals, Hybrid journals, institutional repositories, and disciplinary repositories.
        </p>

        <p>
            If you'd like to add your repository or to our list of sources, that's great! You can submit your repository for indexing via
            <a href="https://goo.gl/forms/HBOMqdSFOHEeFOwj1"> this form</a>.
        </p>

        <p>
            If you'd like to find a particular source, you can search using the <a href="https://openalex.org/sources?page=1&filter=type:repository">OpenAlex website</a>. Unpaywall's repository data comes from OpenAlex, so if it's in OpenAlex, it's in Unpaywall and vice versa. You can also <a href="https://api.oadoi.org/data/sources.csv">download the complete sources list as CSV.</a>
        </p>
        
        
    </div>
</template>

<script>
    export default {
        name: "Sources",
        metaInfo: {
            title: "Data sources"
        },
    }
</script>