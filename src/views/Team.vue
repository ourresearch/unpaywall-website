<template>
    <div class="page team">
        <h1>Team</h1>

        <div class="row first">
            <div class="img">
                <img class="team" src="https://i.imgur.com/sLJKr2Y.jpg" alt="">

            </div>
            <div class="text mt-12">
                <p>
                    Unpaywall is a project of <a href="https://ourresearch.org">OurResearch,</a> a nonprofit building tools to help make scholarly research more open, connected, and reusable. That's us in the picture (clockwise from top): <strong>Richard Orr</strong> (<a href="https://twitter.com/unpaywall_dev">Twitter</a>), <strong>Heather Piwowar</strong> (<a href="https://docs.google.com/document/d/1S7aKmG_l3wJxAc4lb5gJYMwNVDnAT7HlQWcaXADwA1s/edit?usp=sharing">bio, </a>
                    <a href="https://scholar.google.com/citations?user=1YLq0XMAAAAJ&hl=en">publications, </a>
                    <a href="https://twitter.com/researchremix">Twitter</a>), and

                    <strong>Jason Priem</strong> (<a href="https://docs.google.com/document/d/1SkUuOYrpfUF-LC7aC1sBa_phG-_qN-f3hkL9fMooTm4/edit?usp=sharing">bio, </a>
                    <a href="https://scholar.google.com/citations?user=w32jC0YAAAAJ&hl=en">publications, </a>
                    <a href="https://twitter.com/jasonpriem">Twitter</a>).

                </p>

                <p>You can learn more about how Unpaywall started in this <em>Nature</em> article, <a href="https://www.nature.com/articles/d41586-018-05968-3">"How Unpaywall is transforming open science."</a>
                </p>

            </div>

        </div>
        <div class="row second">
                <p>
                    If you'd like to get in touch, we'd love to hear from you! To report a bug, please email us at <a href="mailto:support@unpaywall.org">support@unpaywall.org;</a> for everything else, drop us a line at <a href="mailto:team@ourresearch.org">team@ourresearch.org</a>
                </p>
        </div>




    </div>
</template>

<script>
    export default {
        name: "Team",
        metaInfo: {
            title: "Team"
        }
    }
</script>

<style scoped>
    .row {
        display: flex;
        margin: 10px;
    }
    
    @media (max-width: 600px) {
        .row {
            flex-wrap: wrap;
        }
    }
    
    .row div.img {
        margin-right: 20px;
    }
    
    .row div.img img {
        min-width: 400px;
    }
    
    .row div.text p {
        margin-top: 0;
    }
</style>