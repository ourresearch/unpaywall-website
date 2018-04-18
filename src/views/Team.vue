<template>
    <div class="page team">
        <h1>Team</h1>

        <p>
            Unpaywall is a project of <a href="http://impactstory.org">Impactstory,</a> a nonprofit building tools to help make scholarly research more open, accessible, and reusable. Impactstory is Heather Piwowar and Jason Priem:
        </p>


        <div class="person first">
            <img src="https://pbs.twimg.com/profile_images/519570521/heather_new_haircut_400x400.jpg" height=100/>

            <div class="text">
                <p><strong>Heather Piwowar</strong> is a cofounder of Impactstory and a leading researcher in research data availability and data reuse. She wrote one of the first papers measuring the <a href="http://www.plosone.org/article/info:doi/10.1371/journal.pone.0000308">citation benefit of publicly available research data</a>, has studied  <a href="http://www.plosone.org/article/info:doi/10.1371/journal.pone.0018657">patterns in  data archiving</a>, <a href="https://peerj.com/preprints/1/">patterns of data reuse</a>, and the <a href="http://researchremix.wordpress.com/2010/10/12/journalpolicyproposal">impact of journal data sharing policies</a>.</p>

                <p>Heather has a bachelor’s and master’s degree from MIT in electrical engineering, 10 years of experience as a software engineer, and a Ph.D. in Biomedical Informatics from the U of Pittsburgh.  She is an <a href="http://www.slideshare.net/hpiwowar">frequent speaker</a> on research data archiving, writes a well-respected <a href="http://researchremix.wordpress.com">research blog</a>, and is active on twitter (<a href="http://twitter.com/researchremix">@researchremix</a>). </p>
            </div>
        </div>

        <div class="person subsequent">
            <img src="https://pbs.twimg.com/profile_images/820790537456226304/Tis8dyhv_400x400.jpg" height=100/>
            <div class="text">
                <p><strong>Jason Priem</strong> is a cofounder of Impactstory and a doctoral student in information science (currently on leave of absence) at the University of North Carolina-Chapel Hill. Since <a href="https://twitter.com/jasonpriem/status/25844968813">coining the term "altmetrics,"</a> he's remained active in the field, organizing the annual <a href="http:altmetrics.org/altmetrics12">altmetrics workshops</a>, giving <a href="http://jasonpriem.org/cv/#invited">invited talks</a>, and publishing <a href="http://jasonpriem.org/cv/#refereed">peer-reviewed altmetrics research.</a></p>

                <p>Jason has contributed to and created several open-source software projects, including <a href="http://www.zotero.org">Zotero</a> and <a href="http://feedvis.com">Feedvis</a>, and has experience and training in art, design, and information visualisation.  Sometimes he writes on a <a href="http://jasonpriem.org/blog">blog</a> and <a href="https://twitter.com/#!/jasonpriem">tweets</a>.</p>
            </div>
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
    .person {
        margin-top: 50px;
    }
    img {
        float:left;
        width: 100px;
        border-radius: 50px;
        margin: 0 20px;
    }

</style>