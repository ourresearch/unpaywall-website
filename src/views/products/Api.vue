<template>
    <div class="page product-page api">
        <h1>REST API</h1>

        <div class="intro">

        </div>

        <h2>
            Overview
        </h2>
        <p>
            The REST API gives anyone free, programmatic access to the Unpaywall database.
        </p>
        <p>
            Requests must include your email as a parameter at the end of the URL, like this:
            <code>

                api.unpaywall.org/my/request<strong>?email=YOUR_EMAIL</strong>
            </code>. Please keep requests to 100k daily. If you need faster access, the <router-link to="products/snapshot">database snapshot</router-link> is a great option. Or if you are looking to poll the database to keep up-to-date with changes, check out the <router-link to="products/data-feed">Data Feed.</router-link>
        </p>

        <p>

        </p>

        <p>
            If you're using the API, we recommend you subscribe to the
            <a href="https://groups.google.com/forum/#!forum/unpaywall">mailing list</a> in order
            to stay up-to-date when there are changes or new features.
        </p>



        <h2>Endpoint</h2>
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
                        <a href="https://api.unpaywall.org/v2/10.1038/nature12373?email=test@example.com">https://api.unpaywall.org/v2/10.1038/nature12373?email=test@example.com</a>
                    </td>
                </tr>
            </table>


        </div>



    </div>
</template>



<style scoped>



</style>