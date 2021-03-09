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
                    Although the term "paywall" is known to most people as the thing in front of the newspaper article you want to read,
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
                    Yes! We harvest content from <strong>legal</strong> sources including repositories run by universities, governments, and scholarly societies, as well as open content hosted by publishers themselves. We do <em>not</em> harvest from sources of dubious legality like
                    <a href="https://link.springer.com/article/10.1007/s11192-017-2291-4">ResearchGate</a>
                    or <a href="https://answers.library.curtin.edu.au/faq/204046">Sci-Hub.</a> If you ever encounter content indexed by Unpaywall that is posted in violation of copyright, let us know and we'll remove it immediately.
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

<style scoped lang="scss">
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
