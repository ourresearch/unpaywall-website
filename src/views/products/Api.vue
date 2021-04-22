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
                        <a href="https://api.unpaywall.org/v2/10.1038/nature12373?email=unpaywall_00@example.com">https://api.unpaywall.org/v2/10.1038/nature12373?email=YOUR_EMAIL</a>
                    </td>
                </tr>
            </table>
        </div>

      <div class="endpoint" id="title-search">
        <code class="endpoint">GET /v2/search?query=:your_query[&amp;is_oa=boolean][&amp;page=integer]</code>
        <p>Usage notes and additional examples are available in the <a
            href="https://support.unpaywall.org/a/solutions/articles/44001977396">Unpaywall FAQ</a>.</p>
        <p>This endpoint can be accessed through our
          <router-link to="/articles">Article Search</router-link>
          tool.
        </p>
        <table class="endpoint">
          <tr>
            <td class="k">
              Description
            </td>
            <td class="v">
              Provides the full <code><a href="#get-doi">GET /v2/:doi</a></code> responses for articles whose
              titles match your query. 50 results are returned per request and the <code>page</code> argument
              requests pages after the first.
            </td>
          </tr>
          <tr>
            <td class="k">
              Accepts
            </td>
            <td class="v">
              <ul>
                <li>
                  <code>query</code>:
                  The text to search for. Search terms are separated by whitespace and are AND-ed together by default.
                  The title must contain all search terms to be matched. This behavior can be modified by:
                  <ul>
                    <li><strong>&quot;quoted text&quot;</strong> : words inside quotation marks must appear as a phrase
                      to match
                    </li>
                    <li><strong>OR</strong> : replaces the default AND between words, making a match on either word</li>
                    <li><strong>-</strong> : negation, only titles not containing this term will match</li>
                  </ul>
                </li>
                <li>
                  <code>is_oa</code>: (Optional) A boolean value indicating whether the returned records should be Open
                  Access or not.
                  <ul>
                    <li><strong>true</strong>: filter the results to OA articles</li>
                    <li><strong>false</strong>: filter the results to non-OA articles</li>
                    <li>null/unspecified: return the most relevant results regardless of OA status</li>
                  </ul>
                </li>
                <li>
                  <code>page</code>: (Optional) An integer indicating which page of results should be returned.
                  <ul>
                    <li>1/unspecified: return results 1 to 50</li>
                    <li>2: return results 51 to 100</li>
                    <li>etc.</li>
                  </ul>
                </li>

              </ul>
            </td>
          </tr>
          <tr>
            <td class="k">
              Returns
            </td>
            <td class="v">
              An array of results sorted by the strength of the query match. Each result consists of:
              <ul>
                <li><code>response</code>: the full
                  <router-link to="/data-format">DOI Object</router-link>
                  for this match
                </li>
                <li><code>score</code>: the numeric score used to rank the results</li>
                <li>
                  <code>snippet</code>: An HTML-formatted string showing how the title matched the query.
                  For example:
                  <pre>&quot;Single-&lt;b&gt;cell&lt;/b&gt; photoacoustic &lt;b&gt;thermometry&lt;/b&gt;&quot;</pre>
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <td class="k">
              Example
            </td>
            <td class="v">
              <a href="https://api.unpaywall.org/v2/search?query=cell%20thermometry&is_oa=true&email=unpaywall_00@example.com">https://api.unpaywall.org/v2/search?query=cell%20thermometry&is_oa=true&email=YOUR_EMAIL</a>
            </td>
          </tr>
        </table>
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
