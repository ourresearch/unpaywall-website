<template>
    <div class="page data-format">


        <h1>Data Format</h1>


        <h2>Overview</h2>
        <p>
            The
            <router-link to="/products/snapshot">database snapshot, </router-link>
            <router-link to="/products/simple-query-tool">Simple Query Tool, </router-link>
            <router-link to="/products/api">REST API,</router-link> and
            <router-link to="/products/data-feed">Data Feed</router-link> products all return JSON-formatted data. For simplicity, that data is organized under the same schema in all cases; that schema is informally described on this page.
        </p>
        <p>
            Regardless of the source, each record returned consists of one <router-link to="#doi-object">DOI Object, </router-link> containing resource metadata. Each DOI Object in turn contains a list of zero or more <router-link to="#oa-location-object">OA Location Objects.</router-link>
        </p>






        <h2 class="anchor" id="doi-object">DOI object</h2>
        <p>The DOI object is more or less a row in our main database...it's everything we know about a given DOI-assigned resource, including metadata about the resource itself, and information about its OA status. It includes a list of zero or more <router-link to="#oa-location-object">OA Location Objects</router-link>, as well as a <code>best_oa_location</code> property that's probably the OA Location you'll want to use.</p>

        <table class="api-responses">

            <!--best_oa_location-->
            <tr>
                <td class="key">
                    <span class="name">best_oa_location</span>
                    <span class="type">Object|null</span>
                </td>
                <td class="contents">
                    The best <router-link to="#oa-location-object">OA Location Object</router-link> we could find for this DOI.
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

            <!--data_standard-->
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

            <!--doi-->
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

            <!--doi_url-->
            <tr>
                <td class="key">
                    <span class="name">doi_url</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    The DOI in hyperlink form.
                </td>
                <td class="notes">
                    This field simply contains <code>"https://doi.org/"</code> prepended to the <code>doi</code> field. It expresses the DOI in its correct format according to <a href="https://www.crossref.org/display-guidelines/">the Crossref DOI display guidelines.</a>
                </td>
            </tr>



            <!--genre-->
            <tr>
                <td class="key">
                    <span class="name">genre</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    The type of resource.
                </td>
                <td class="notes">
                    Currently the <code>genre</code> is identical to the Crossref-reported <a href="https://api.crossref.org/types">type</a> of a given resource. The "journal-article" type is most common, but there are many others.
                </td>
            </tr>

            <!--is_paratext-->
            <tr>
                <td class="key">
                    <span class="name">is_paratext</span>
                    <span class="type">Boolean</span>
                </td>
                <td class="contents">
                    Is the item an ancillary part of a journal, like a table of contents?
                </td>
                <td class="notes">
                    <a href="https://support.unpaywall.org/support/solutions/articles/44001894783">
                    See here for more information on how we determine whether an article is paratext.
                    </a>
                </td>
            </tr>

            <!--is_oa-->
            <tr>
                <td class="key">
                    <span class="name">is_oa</span>
                    <span class="type">Boolean</span>
                </td>
                <td class="contents">
                    Is there an OA copy of this resource.
                </td>
                <td class="notes">
                    Convenience attribute; returns <code>true</code> when <code>best_oa_location</code> is not <code>null</code>.
                </td>
            </tr>

            <!--journal_is_in_doaj-->
            <tr>
                <td class="key">
                    <span class="name">journal_is_in_doaj</span>
                    <span class="type">Boolean</span>
                </td>
                <td class="contents">
                    Is this resource published in a <a href="https://doaj.org/">DOAJ-indexed</a> journal.
                </td>
                <td class="notes">
                    Useful for defining whether a resource is Gold OA (depending on your definition, see also <code>journal_is_oa</code>).
                </td>
            </tr>


            <!--journal_is_oa-->
            <tr>
                <td class="key">
                    <span class="name">journal_is_oa</span>
                    <span class="type">Boolean</span>
                </td>
                <td class="contents">
                    Is this resource published in a completely OA journal.
                </td>
                <td class="notes">
                    Useful for defining whether a resource is Gold OA. Includes any fully-OA journal, regardless of inclusion in DOAJ. This includes journals by all-OA publishers and journals that would otherwise be all Hybrid or Bronze OA.
                    <a href="https://support.unpaywall.org/a/solutions/articles/44001792752-how-do-we-decide-if-a-given-journal-is-fully-oa-">See here for more information on OA journals.</a>
                </td>
            </tr>

            <!--journal_issns-->
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

            <!--journal_issn_l-->
            <tr>
                <td class="key">
                    <span class="name">journal_issn_l</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    A single ISSN for the journal publishing this resource.
                </td>
                <td class="notes">
                    An ISSN-L can be used as a primary key for a journal when more than one ISSN is assigned to it.
                    Resources' <code>journal_issns</code> are mapped to ISSN-Ls using the
                    <a href="https://www.issn.org/understanding-the-issn/assignment-rules/the-issn-l-for-publications-on-multiple-media/">issn.org table</a>, with some manual corrections.
                </td>
            </tr>

            <!--journal_name-->
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


            <!--oa_locations-->
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

            <!--oa_status-->
            <tr>
                <td class="key">
                    <span class="name">oa_status</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    The OA status, or color, of this resource.
                </td>
                <td class="notes">
                    Classifies OA resources by location and license terms as one of:
                        <code>gold</code>,
                        <code>hybrid</code>,
                        <code>bronze</code>,
                        <code>green</code> or
                        <code>closed</code>.
                    <a href="https://support.unpaywall.org/support/solutions/articles/44001777288-what-do-the-types-of-oa-status-green-gold-hybrid-and-bronze-mean-">
                    See here for more information on how we assign an oa_status.
                    </a>
                </td>
            </tr>


            <!--published_date-->
            <tr>
                <td class="key">
                    <span class="name">published_date</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    The date this resource was published.
                </td>
                <td class="notes">
                    As reported by the publishers, who unfortunately have inconsistent definitions of what counts as officially "published." Returned as an <a href="https://xkcd.com/1179/">ISO8601-formatted</a> timestamp, generally with only year-month-day.
                </td>
            </tr>

            <!--publisher-->
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


            <!--title-->
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

            <!--updated-->
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

            <!--year-->
            <tr>
                <td class="key">
                    <span class="name">year</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    The year this resource was published.
                </td>
                <td class="notes">
                    Just the year part of the <code>published_date</code>
                </td>
            </tr>

            <!--z_authors-->
            <tr>
                <td class="key">
                    <span class="name">z_authors</span>
                    <span class="type">List of Crossref <code>Contributor</code> objects</span>
                </td>
                <td class="contents">
                    The authors of this resource.
                </td>
                <td class="notes">
                    These are formatted as a list of Crossref <code>Contributor</code> objects, which are <a href="https://github.com/CrossRef/rest-api-doc/blob/master/api_format.md#contributor"> described in the Crossref API docs here.</a>
                </td>
            </tr>

        </table>





        <h2 class="anchor" id="oa-location-object">OA Location object</h2>
        <p>The OA Location object describes particular place where we found a given OA article. The same article is often available from multiple locations, and there may be differences in format, version, and license depending on the location; the OA Location object describes these key attributes. An OA Location Object is always a Child of a <router-link to="#doi-object">DOI Object.</router-link></p>
        <table class="api-responses">

            <!--evidence-->
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


            <!--host_type-->
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
                            means the this location is served by the article’s publisher (in practice, this usually means it is hosted on the same domain the DOI resolves to).
                        </span>
                        </li>
                        <li>
                            <span class="value"><code>repository</code></span>
                            <span class="notes">
                            means this location is served by an Open Access repository. Preprint servers are considered repositories even if the DOI resolves there.
                        </span>
                        </li>
                    </ul>
                </td>
            </tr>



            <!--is_best-->
            <tr>
                <td class="key">
                    <span class="name">is_best</span>
                    <span class="type">Boolean</span>
                </td>
                <td class="contents">
                    Is this location the <code>best_oa_location</code> for its resource.
                </td>
                <td class="notes">
                    See the DOI object's <code>best_oa_location</code> description for more on how we select which location is "best."
                </td>
            </tr>


            <!--license-->
            <tr>
                <td class="key">
                    <span class="name">license</span>
                    <span class="type">String|Null</span>
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


            <!--pmh_id-->
            <tr>
                <td class="key">
                    <span class="name">pmh_id</span>
                    <span class="type">String|Null</span>
                </td>
                <td class="contents">
                    OAI-PMH endpoint where we found this location.
                </td>
                <td class="notes">
                    This is primarily for internal debugging. It's <code>Null</code> for locations that weren't found using OAI-PMH.
                </td>
            </tr>


            <!--updated-->
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








            <!--url-->
            <tr>
                <td class="key">
                    <span class="name">url</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    The <code>url_for_pdf</code> if there is one; otherwise landing page URL.
                </td>
                <td class="notes">
                    <p>
                        When we can't find a <code>url_for_pdf</code> (or there isn't one), this field uses the <code>url_for_landing_page</code>, which is a useful fallback for some use cases.
                    </p>
                </td>
            </tr>


            <!--url_for_landing_page-->
            <tr>
                <td class="key">
                    <span class="name">url_for_landing_page</span>
                    <span class="type">String</span>
                </td>
                <td class="contents">
                    The URL for a landing page describing this OA copy.
                </td>
                <td class="notes">
                    <p>
                        When the <code>host_type</code> is <code>"publisher"</code> the landing page <em>usually</em> includes HTML fulltext.
                    </p>
                </td>
            </tr>


            <!--url_for_pdf-->
            <tr>
                <td class="key">
                    <span class="name">url_for_pdf</span>
                    <span class="type">String|Null</span>
                </td>
                <td class="contents">
                    The URL with a PDF version of this OA copy.
                </td>
                <td class="notes">
                    <p>
                        Pretty much what it says.
                    </p>
                </td>
            </tr>







            <tr>
                <td class="key">
                    <span class="name">version</span>
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



    </div>






































</template>

<script>
    export default {
        name: "DataFormat",
        metaInfo: {
            title: "Data Format"
        }
    }
</script>

<style scoped lang="scss">
    div.page.data-format {
        table {
            margin-bottom: 80px;
            td {
                padding:10px 20px;
                vertical-align: top;
                p {
                    margin-top: 0;
                }
            }

            td.notes {
                font-size: 14px;
            }
            td.contents {
                min-width:200px;
            }
            td.key {
                span.name {
                    display: block;
                    font-weight: bold;
                }
                span.type {
                    font-size: 12px;
                }
            }
        }

    }



</style>































