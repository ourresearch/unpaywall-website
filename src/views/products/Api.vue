<template>
    <div class="page product-page api">
        <h1>REST API</h1>

        <div class="intro">
          <p class="notice">
            <strong>September 2026:</strong> the title-search endpoint (<code>/v2/search</code>) has been
            retired. DOI lookup (<code>/v2/:doi</code>) is unchanged. Unpaywall and OpenAlex share one
            database, and <a href="https://api.openalex.org/works?search=cell%20thermometry">OpenAlex search</a>
            returns the same open-access data plus much more.
            <a href="https://help.openalex.org/access/unpaywall-and-openalex/">How Unpaywall and OpenAlex fit together, and how to migrate.</a>
          </p>
        </div>

        <h2>
            Overview
        </h2>
        <p>
            The REST API gives anyone free, programmatic access to the Unpaywall database.
        </p>


        <p>
            If you're using the API, we recommend you subscribe to the
            <a href="https://groups.google.com/forum/#!forum/unpaywall">mailing list</a> in order
            to stay up-to-date when there are changes or new features.
        </p>



        <h2>Schema</h2>
        <p>
            The API response uses the same <router-link to="/data-format">shared schema</router-link> as the
            <router-link to="/products/snapshot">database snapshot</router-link> and
            <router-link to="/products/data-feed">Data Feed.</router-link>

        </p>

        <h2>Authentication</h2>
                <p>
            Requests must include your email as a parameter at the end of the URL, like this:
            <code>

                api.unpaywall.org/my/request<strong>?email=YOUR_EMAIL</strong>
            </code>.

        </p>

        <h2>Rate limits</h2>
        <p>
            Please limit use to 100,000 calls per day. If you need faster access, you'll be better served by downloading the entire <router-link to="/products/snapshot">database snapshot</router-link> for local access.
        </p>


        <h2>Versions</h2>
        <p>
            The current version of the API is Version 2, and this is the only version supported. Version updates are announced on the <a href="https://groups.google.com/forum/#!forum/unpaywall">mailing list.</a>
        </p>

        <h2>Alternatives</h2>
        <p>Depending on your use case, there are often easier ways to access the data than using the API. You can learn more about these in our brief Get Stated pages:</p>
        <ul>
            <li><router-link to="/user-guides/libraries">Get started: Library</router-link></li>
            <li><router-link to="/user-guides/enterprise">Get started: Enterprise</router-link></li>
            <li><router-link to="/user-guides/research">Get started: Research</router-link></li>
        </ul>

        <h2>Endpoints</h2>
        <div class="endpoint" id="get-doi">
            <code class="endpoint">GET /v2/:doi</code>
            <table class="endpoint">
                <tr>
                    <td class="k">
                        Description
                    </td>
                    <td class="v">
                        Gets OA status and bibliographic info for an given DOI-assigned resource.
                    </td>
                </tr>
                <tr>
                    <td class="k">
                        Accepts
                    </td>
                    <td class="v">
                        A valid DOI.
                    </td>
                </tr>
                <tr>
                    <td class="k">
                        Returns
                    </td>
                    <td class="v">
                        <router-link to="/data-format">DOI Object</router-link>
                    </td>
                </tr>
                <tr>
                    <td class="k">
                        Example
                    </td>
                    <td class="v">
                        <a href="https://api.unpaywall.org/v2/10.1038/nature12373?email=unpaywall_01@example.com">https://api.unpaywall.org/v2/10.1038/nature12373?email=YOUR_EMAIL</a>
                    </td>
                </tr>
            </table>
        </div>

      <div class="endpoint" id="title-search">
        <code class="endpoint">GET /v2/search?query=:your_query</code>
        <p class="retired">
          <strong>Retired 18 September 2026.</strong> This endpoint now returns <code>410 Gone</code>.
          The same search, over the same data, is
          <a href="https://api.openalex.org/works?search=cell%20thermometry">https://api.openalex.org/works?search=cell%20thermometry</a>.
          Field-by-field migration notes:
          <a href="https://help.openalex.org/access/unpaywall-and-openalex/#migrating-a-title-search">Migrating a title search</a>.
        </p>
      </div>


    </div>
</template>

<script>
    export default {
        name: "Api",
        metaInfo: {
            title: "REST API"
        }
    }
</script>


<style scoped lang="scss">




</style>
