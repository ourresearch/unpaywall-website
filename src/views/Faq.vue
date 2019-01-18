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
                    <a href="https://www.crossref.org/">Crossref</a> (particulary their license info), and
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


                <dt id="identify-green-or-gold">Can Unpaywall Data tell me whether an article is "Green," "Gold," or "Bronze" OA?</dt>
                <dd>We don't include the "OA Color" explicitly in the data schema, because we found that people's definitions of the colors vary pretty widely, and so it was causing confusion. Instead, we include all the data you'll need to decide the color based on your own definitions, whatever they may be. In particular, you'll probably want to look at the  <code>is_oa</code> and <code>journal_is_oa</code> fields of the DOI Object, as well as the <code>license</code> and <code>host_type</code> fields of Location Objects. See the <router-link to="/data-format">schema documentation</router-link> for more details.
                </dd>



                <dt id="oadoi">How is this related to the oaDOI service?</dt>
                <dd>
                    We used to call the browser extension "Unpaywall," and the data source behind it "oaDOI." That got confusing, so now the whole project is just called Unpaywall, including the database, the API, the extension, and everything else.

                </dd>

                <dt id="different-results-from-unpaywall">Why does the Unpaywall extension sometimes give different results from the API or dataset?</dt>
                <dd>
                    The extension occasionally reports "open" when the API doesn't because the extension, in addition to checking our API, also checks the source code of publisher pages themselves as you visit them.
                </dd>


                <dt id="report-bugs">I found a bug</dt>
                <dd>
                    Sorry about that!
                    <a href="mailto:team@impactstory.org">Drop us an email</a> and we'll get it fixed for you.
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
