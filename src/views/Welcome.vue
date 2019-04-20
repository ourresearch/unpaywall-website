<template>
    <div class="page welcome">

        <img id="screenshot" src="~@/assets/laptop-screenshot.png" alt="">
        <p>
            Welcome to Unpaywall! When you see the
            <span class="tab-color green">green tab</span>
            beside a research article,
            click it to read the full text. Try this example:
        </p>
        <p class="eg">
            <md-button class="md-raised md-primary" target="_blank" href="https://www.nature.com/nature/journal/v542/n7642/full/nature21360.html">
                Try it now
            </md-button>
        </p>
        <p>
            <!--
            That article will cost you $32 to read on Nature.com...except now that
            you've got Unpaywall, it's free!
            -->

            You'll see our green tab on about half of articles
            (if we can't find fulltext, you'll see a
            <span class="tab-color gray">gray tab</span>

            ). Happy reading!

        </p>




        <p class="ps">
            PS for the Open Access nerds: the Unpaywall tab
            can change colors to indicate Green or Gold OA, too. Enable it in settings.
            You might also enjoy
            <a href="https://peerj.com/preprints/3119v1/">our recent paper</a>
            analyzing trends in OA and the coverage
            of Unpaywall.
        </p>


    </div>
</template>

<script>
    export default {
        name: "welcome",
        metaInfo: {
            title: "Welcome to Unpaywall"
        }
    }
</script>

<style scoped lang="scss">
    .page {
        margin-top: 100px;
    }

    .eg {
        padding: 20px;

        .md-button {
            margin-left: 185px;
            font-size: 20px;
            height: auto;
            padding: 15px 20px;
        }
    }

</style>