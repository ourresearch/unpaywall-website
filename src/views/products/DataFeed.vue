<template>
    <div class="page product-page data-feed">
        <h1>Data Feed</h1>
        <p>
            Our dataset changes every day, for a number of reasons:
        </p>
            <ul>
                <li>New articles are published.</li>
                <li>Authors self-archive new OA copies to repositories for existing articles.</li>
                <li>Articles become OA as embargoes expire.</li>
                <li>Publisher-hosted "Bronze OA" articles (free-to-read but without an open license) are moved from OA to toll-access.</li>
            </ul>

        <p>
            For many use-cases, especially in enterprise contexts, it's important to stay up-to-date with these changes. The <router-link to="/products/snapshot">snapshot</router-link> is a poor fit for this, since it's only updated a few times a year. Likewise, the <router-link to="/products/api">API</router-link> works poorly for this since it takes many months to scroll through the whole of DOI-space polling for changes.
        </p>

        <p>
            So, we built the Data Feed to address this issue. Subscribers to the feed get password-protected access to a server where we post weekly changefiles to the database. These changefiles use the same <router-link to="/data-format">data format</router-link> as the API and snapshot, and contain a row for every record that has changed in any way in the previous week. We provide both a <router-link to="/products/data-feed/changefiles">web interface</router-link> and
            <a href="https://api.unpaywall.org/feed/changefiles?api_key=YOUR_API_KEY">JSON endpoint</a> for accessing changefiles.
        </p>
        <p>
            The Data Feed is unique among our products in that it costs money. This is because it's more expensive to run than our other products; harvesting everything once is pretty cheap, but doing it in an ongoing way is not. In due time we'd like to have a transparent pricing structure for these, but for now we are handling it on a more custom basis, as we learn more about the market. As a nonprofit, our goal isn't to get rich off this, but rather to give everyone a fair deal while ensuring a sustainable model that keeps Unpaywall a working resource for the long haul.
        </p>
        <p>
            If you're interested in the Data Feed, please <a href="mailto:team@ourresearch.org">drop us a line</a> and let us know the size of your organization and your intended use of the data, and we'll get right back to you with a quote. We look forward to hearing from you!
        </p>

    </div>
</template>

<script>
    export default {
        name: "DataFeed",
        metaInfo: {
            title: "Data Feed"
        }
    }
</script>

<style scoped>

</style>