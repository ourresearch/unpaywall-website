<template>
    <div class="page data-format">


        <h1>Data Format</h1>
        <div class="intro">
            The
            <router-link to="products/snapshot">database snapshot,</router-link>
            <router-link to="products/api">REST API,</router-link> and
            <router-link to="products/data-feed">Data Feed,</router-link> products all return data in in JSON and all use the same schema. Here's the documentation for that schema.
        </div>






















        <!-------------------------------------------------------------------------

        RESPONSE OBJECTS

        --------------------------------------------------------------------------->

        <h2 class="anchor"  id="response-objects">Response objects</h2>
        <p>The API returns three different types of response objects. Really two, since more users won't ever need the API Status object, which just defines the root of the API. The OA Location object describes a place we found an OA copy of an article. There are one or more of these associated with DOI object, which describes a given DOI-assigned resource.</p>


        <h3 class="anchor" id="api-status-object">API Status object</h3>
        <table class="api-responses">
            <tr>
                <td class="key">
                    <span class="name">documentation_url</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    Where you can find documentation for this version.
                </td>
                <td class="notes">
                </td>
            </tr>
            <tr>
                <td class="key">
                    <span class="name">msg</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    Relevant messages.
                </td>
                <td class="notes">
                </td>
            </tr>
            <tr>
                <td class="key">
                    <span class="name">version</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    Version string.
                </td>
                <td class="notes">
                    Example: <code>2.0.1</code>
                </td>
            </tr>
        </table>






        <h3 class="anchor" id="oa-location-object">OA Location object</h3>
        <p>The OA Location object describes particular location where we found a given OA article. The same article is often available from multiple locations. There may be differences in format, version, and license from one location to another, even if it's the same article in all cases.</p>
        <table class="api-responses">
            <tr>
                <td class="key">
                    <span class="name">evidence</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    How we found this OA location.
                </td>
                <td class="notes">
                    <p>
                        Used for debugging. Don’t depend on the exact contents of this for anything, because values are subject to change without warning. Example values:

                    </p>
                    <ul>
                        <li>
                            <span class="value"><code>oa journal (via journal title in doaj)</code></span>
                            <span class="notes">
                            We found the name of the journal that publishes this article in the DOAJ database.
                        </span>
                        </li>
                        <li>
                            <span class="value"><code>oa repository (via pmcid lookup)</code></span>
                            <span class="notes">
                            We found this article in an index of PubMed Central articles.
                        </span>
                        </li>
                    </ul>
                </td>
            </tr>


            <tr>
                <td class="key">
                    <span class="name">host_type</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    The type of host that serves this OA location.
                </td>
                <td class="notes">
                    <p>
                        There are two possible values:
                    </p>
                    <ul>
                        <li>
                            <span class="value"><code>publisher</code></span>
                            <span class="notes">
                            means the this location is served by the article’s publisher (in practice, this means it is hosted on the same domain the DOI resolves to).
                        </span>
                        </li>
                        <li>
                            <span class="value"><code>repository</code></span>
                            <span class="notes">
                            means this location is served by an Open Access repository.
                        </span>
                        </li>
                    </ul>
                </td>
            </tr>


            <tr>
                <td class="key">
                    <span class="name">license</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    The license under which this copy is published.
                </td>
                <td class="notes">
                    <p>We return several types of licenses:</p>
                    <ul>
                        <li>
                            Creative Commons licenses are uniformly abbreviated and lowercased. Example: <code>cc-by-nc</code>
                        </li>
                        <li>
                            Publisher-specific licenses are normalized using this format: <code>acs-specific: authorchoice/editors choice usage agreement</code>
                        </li>
                        <li>
                            When we have evidence that an OA license of <em>some</em> kind was used, but it’s not reported directly on the webpage at this location, this field returns <code>implied-oa</code>
                        </li>
                    </ul>
                </td>
            </tr>


            <tr>
                <td class="key">
                    <span class="name">updated</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    Time when the data for this location was last updated.
                </td>
                <td class="notes">
                    Returned as an <a href="https://xkcd.com/1179/">ISO8601-formatted</a> timestamp. Example: <code>2017-08-17T23:43:27.753663</code>
                </td>
            </tr>








            <tr>
                <td class="key">
                    <span class="name">url</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    The URL where you can find this OA copy.
                </td>
                <td class="notes">
                    <p>
                        Although this URL points to fulltext of <em>some</em> kind, there is (for now) no format normalization...it could be PDF, HTML, or even Word or TeX.
                    </p>
                </td>
            </tr>







            <tr>
                <td class="key">
                    <span class="name">versions</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    The content version accessible at this location.
                </td>
                <td class="notes">
                    <p>
                        We use the <a href="https://wiki.surfnet.nl/display/DRIVERguidelines/DRIVER-VERSION+Mappings">DRIVER Guidelines v2.0 VERSION standard</a> to define  versions of a given article; see those docs for complete definitions of terms. Here's the basic idea, though, for the three version types we support:
                    </p>
                    <ul>
                        <li><code>submittedVersion</code> is not yet peer-reviewed.</li>
                        <li><code>acceptedVersion</code> is peer-reviewed, but lacks publisher-specific formatting.</li>
                        <li><code>publishedVersion</code> is the version of record.</li>
                    </ul>
                </td>
            </tr>



        </table>








        <h3 class="anchor" id="doi-object">DOI object</h3>
        <p>The DOI object describes a given DOI-assigned resource. It contains metadata about the resource itself, as well as information about its OA status.</p>

        <table class="api-responses">

            <tr>
                <td class="key">
                    <span class="name">best_oa_location</span>
                    <span class="type">Object|null</span>
                </td>
                <td class="contents">
                    The best <a href="#oa-location-object">OA Location</a> object we could find for this DOI.
                </td>
                <td class="notes">
                    <p>
                        The "best" location is determined using an algorithm that prioritizes publisher-hosted content first (eg Hybrid or Gold), then prioritizes versions closer to the version of record (<code>PublishedVersion</code> over <code>AcceptedVersion</code>), then more authoritative repositories (PubMed Central over CiteSeerX).
                    </p>
                    <p>
                        Returns <code>null</code> if we couldn't find any OA Locations.
                    </p>
                </td>
            </tr>

            <tr>
                <td class="key">
                    <span class="name">data_standard</span>
                    <span class="type">Integer</span>
                </td>
                <td class="contents">
                    Indicates the data collection approaches used for this resource.
                </td>
                <td class="notes">
                    <p>Possible values</p>
                    <ul>
                        <li>
                            <span class="value"><code>1</code></span>
                            <span class="notes">
                            First-generation hybrid detection. Uses only data from the Crossref API to determine hybrid status. Does a good job for Elsevier articles and a few other publishers, but most publishers are not checked for hybrid.
                        </span>
                        </li>
                        <li>
                            <span class="value"><code>2</code></span>
                            <span class="notes">
                            Second-generation hybrid detection. Uses additional sources, checks all publishers for hybrid. Gets about 10x as much hybrid. <code>data_standard==2</code> is the version used in the paper we wrote about the dataset.
                        </span>
                        </li>
                    </ul>
                </td>
            </tr>

            <tr>
                <td class="key">
                    <span class="name">doi</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    The DOI of this resource.
                </td>
                <td class="notes">
                    This is always lowercase.
                </td>
            </tr>

            <tr>
                <td class="key">
                    <span class="name">is_oa</span>
                    <span class="type">Boolean</span>
                </td>
                <td class="contents">
                    <code>True</code> if there is an OA copy of this resource.
                </td>
                <td class="notes">
                    Convenience attribute; returns <code>true</code> when <code>best_oa_location</code> is not <code>null</code>.
                </td>
            </tr>

            <tr>
                <td class="key">
                    <span class="name">journal_is_oa</span>
                    <span class="type">Boolean</span>
                </td>
                <td class="contents">
                    Is this resource published in a completely OA journal
                </td>
                <td class="notes">
                    Useful for most definitions of Gold OA. Currently this is based entirely on inclusion in the <a
                        href="http://doaj.org">DOAJ,</a> but eventually may use additional ways of identifying all-OA journals.
                </td>
            </tr>

            <tr>
                <td class="key">
                    <span class="name">journal_issns</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    Any ISSNs assigned to the journal publishing this resource.
                </td>
                <td class="notes">
                    Separate ISSNs are sometimes assigned to print and electronic versions of the same journal. If there are multiple ISSNs, they are separated by commas. Example: <code>1232-1203,1532-6203</code>
                </td>
            </tr>

            <tr>
                <td class="key">
                    <span class="name">journal_name</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    The name of the journal publishing this resource.
                </td>
                <td class="notes">
                    The same journal may have multiple name strings (eg, "J. Foo", "Journal of Foo", "JOURNAL OF FOO", etc). These have not been fully normalized within our database, so use with care.
                </td>
            </tr>

            <tr>
                <td class="key">
                    <span class="name">oa_locations</span>
                    <span class="type">List</span>
                </td>
                <td class="contents">
                    List of all the <a href="#oa-location-object">OA Location</a> objects associated with this resource.
                </td>
                <td class="notes">
                    This list is unnecessary for the vast majority of use-cases, since you probably just want the <code>best_oa_location</code>. It's included primarily for research purposes.
                </td>
            </tr>

            <tr>
                <td class="key">
                    <span class="name">publisher</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    The name of this resource's publisher.
                </td>
                <td class="notes">
                    Keep in mind that publisher name strings change over time, particularly as publishers are acquired or split up.
                </td>
            </tr>

            <tr>
                <td class="key">
                    <span class="name">title</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    The title of this resource.
                </td>
                <td class="notes">
                    It's the title. Pretty straightforward.
                </td>
            </tr>

            <tr>
                <td class="key">
                    <span class="name">updated</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    Time when the data for this resource was last updated.
                </td>
                <td class="notes">
                    Returned as an <a href="https://xkcd.com/1179/">ISO8601-formatted</a> timestamp. Example: <code>2017-08-17T23:43:27.753663</code>
                </td>
            </tr>


        </table>



    </div>






































</template>

<script>
    export default {
        name: "DataForma"
    }
</script>

<style scoped>

</style>