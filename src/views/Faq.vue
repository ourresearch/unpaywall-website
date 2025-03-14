<template>
    <div class="page faq">
        <h1>Frequently Asked Questions</h1>
        <dl>


                <!--<dt id="how-often-finds-fulltext">How often does Unpaywall find full text?</dt>-->
                <!--<dd>-->
                    <!--Overall, Unpaywall users find fulltext for 47% of articles. You may get different results,-->
                    <!--depending on the age and topic of the articles you're reading. There's more information-->
                    <!--on how we found these numbers in-->
                    <!--<a href="https://peerj.com/articles/4375/">this paper.</a>-->

                    <!--This success rate will improve as we tweak our algorithm and as-->
                    <!--mandatory open access requirements take effect in the-->
                    <!--<a href="http://scholcomm.columbia.edu/open-access/public-access-mandates-for-federally-funded-research/">US, </a>-->
                    <!--<a href="http://www.rcuk.ac.uk/research/openaccess/">UK, </a>-->
                    <!--<a href="http://www.sciencemag.org/news/2016/05/dramatic-statement-european-leaders-call-immediate-open-access-all-scientific-papers/">Europe,</a>-->
                    <!--and elsewhere.-->
                <!--</dd>-->

                <dt id="what-does-unpaywall-find">What articles can Unpaywall find?</dt>
                    Unpaywall finds the kind of articles you'd see in peer-reviewed scholarly journals like <em><a href="https://science.sciencemag.org/">Science</a></em> or <em><a href="https://journals.plos.org/plosone/">PLOS One</a></em>,
                    plus pre-publication versions of similar work from preprint repositories like <em><a href="https://arxiv.org/">arXiv</a></em>.
                    Specifically, it looks for articles with a kind of identifier called a <a href="https://www.doi.org/">DOI</a>.
                    Although the best-known type of paywall is the kind in front of a newspaper or magazine article you want to read,
                    Unpaywall doesn't help with sites like nytimes.com or washingtonpost.com.
                <dd>

                </dd>


                <dt id="how-do-you-find-articles">How do you find all these fulltext articles?</dt>
                <dd>
                    We harvest content directly from
                    <router-link to="/sources">
                        over 50,000 journals and open-access repositories
                    </router-link>
                    from all over the world.

                    We also use great open data from
                    <a href="https://www.ncbi.nlm.nih.gov/pmc/">PubMed Central</a>,
                    <a href="https://doaj.org/">the DOAJ</a>,
                    <a href="https://www.crossref.org/">Crossref</a> (particularly their license info), and
                    <a href="https://www.datacite.org/">DataCite.</a>
                </dd>


                <dt id="legal">Is Unpaywall legal?</dt>
                <dd>
                    Yes! We harvest content from <strong>legal</strong> sources including repositories run by universities, governments, and scholarly societies, as well as open content hosted by publishers themselves. If you ever encounter content indexed by Unpaywall that is posted in violation of copyright, let us know and we'll remove it immediately.
                </dd>


                <dt id="get-indexed">How can I make sure content from my open repository appears in Unpaywall?</dt>
                <dd>
                    Good question! We made a <router-link to="/sources">page about that here.</router-link>
                </dd>





                <dt id="oadoi">How is this related to the oaDOI service?</dt>
                <dd>
                    We used to call the browser extension "Unpaywall," and the data source behind it "oaDOI." That got confusing, so now the whole project is just called Unpaywall, including the database, the API, the extension, and everything else.

                </dd>

                <dt id="different-results-from-unpaywall">Why does the Unpaywall extension sometimes give different results from the API or dataset?</dt>
                <dd>
                        The extension occasionally reports "open" when the API doesn't because the extension, in addition to checking our API, also checks the source code of publisher pages themselves as you visit them. You can read
                    <a href="https://impactstory.freshdesk.com/a/solutions/articles/44001781069-why-does-the-unpaywall-plugin-say-this-paywalled-article-is-open-access-">more about that here.</a>
                </dd>


                <dt id="report-bugs">I found a bug.</dt>
                <dd>
                    Sorry about that!
                    <a href="mailto:support@unpaywall.org">Drop us an email</a> and we'll get it fixed for you.
                </dd>


                <dt id="found-article">I found an open access article that isn't in Unpaywall.</dt>
                <dd>
                    Great! If it's hosted by the publisher, we can almost certainly add it. If it's somewhere else, like a faculty page or a personal website, it may be trickier.
                    These sites are difficult to include accurately since they don't provide their data in a structured way like institutional repositories do.
                    Let us know at <a href="mailto:support@unpaywall.org">support@unpaywall.org</a> and we'll see what we can do.
                </dd>


                <dt id="run-on-click">Can I make Unpaywall run <em>only</em> when I click a button, instead of automatically?</dt>
                <dd>
                    Yep! In Chrome, click the settings button (it looks like a vertical ellipsis) at the top right of your window. Then click <code>More tools</code> and then <code>Extensions</code>. Find the Unpaywall extension, and click <code>Details.</code> Under <code>Site Access,</code> select <code>On click.</code> Done! Now Unpaywall will not run unless you click the Unpaywall icon in your Chrome toolbar.
                </dd>

                <dt id="extension-privacy">What data does the extension collect?</dt>
                <dd>
                    <p>Our full privacy policy is here: <router-link to="/legal/privacy">http://unpaywall.org/legal/privacy</router-link>. In plainer, more practical terms, here is what the extension does:</p>
                    <p>
                        When you load a new webpage, the Unpaywall extension scans the text of that page looking for a <a href="https://library.uic.edu/help/article/1966/what-is-a-doi-and-how-do-i-use-them-in-citations">DOI</a> (a short unique identifier key used by scholarly articles—it’s like a URL for academic papers).
                        If it finds one, we send that DOI over the internet to our <a href="https://unpaywall.org/products/api">API</a> in order to retrieve our best Open Access location for the article.
                    </p>

                    <p>
                        This is the only time Unpaywall connects to a remote server. The information sent is:
                        <ul>
                            <li>The DOI, which is needed to look up article information.</li>
                            <li>
                                The <a href="https://en.wikipedia.org/wiki/IP_address">IP address</a> of your computer, which is needed for all internet requests (This part is not unique to Unpaywall. Your browser sends your IP address to every server it connects to
                                and every webpage you visit. You can hide your IP address by using a <a href="https://en.wikipedia.org/wiki/Virtual_private_network">VPN</a>).
                            </li>
                        </ul>
                    </p>

                    <p>
                        Unpaywall does not send your name, email address, or any other content of the pages you browse to our server (except the DOI). Unpaywall does not know or have access to your name or email address.
                    </p>
                    <p>
                        Records of individual requests are not shared with third parties. They are stored as part of our server logs, which we use for debugging and load analysis. Our server logging system vendor is <a href="https://www.papertrail.com/">Papertrail</a>.
                        Aggregated data, stripped of all personal information, may be shared with third parties or published as part of statistical research on Open Access trends and usage.
                        For example, we might make a blog post saying “Unpaywall delivers Open Access articles in 50% of user requests.”
                    </p>

                    <p>Unpaywall uses <a href="https://en.wikipedia.org/wiki/Web_storage">local storage</a> to save user settings.</p>

                    <p>Unpaywall's source code is hosted on <a href="https://github.com/ourresearch/unpaywall-extension">github.com</a>.</p>
                </dd>

                <dt id="knowledge-base-faq">My question isn't answered here.</dt>
                <dd>
                    Try the <a href="https://support.unpaywall.org/a/solutions/categories/44000260577/folders/44000384007">advanced FAQs</a>, especially if you're a user of the API or data snapshot.
                    If that doesn't help, ask away at <a href="https://support.unpaywall.org">support.unpaywall.org</a> or <a href="mailto:support@unpaywall.org">support@unpaywall.org</a>.
                </dd>
            </dl>
    </div>
</template>

<script>
    export default {
        name: "Faq",
        metaInfo: {
            title: "FAQ"
        }
    }
</script>

<style scoped>
    code {
        font-size: 80%;
    }

    dt {
        margin: 40px 0 0;
        font-size: 20px;
        font-weight: bold;
    }
    dd {
        padding: 0;
        margin: 0;
    }
</style>
