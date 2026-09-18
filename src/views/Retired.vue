<template>
  <div class="page retired-page">
    <div class="retired-container">
      <v-icon class="mb-4" style="font-size: 48px; color: #999;">fa-circle-info</v-icon>
      <h1>{{ meta.title }}</h1>
      <p class="lead">
        {{ meta.lead }}
      </p>
      <p class="relationship">
        Unpaywall is made by the OpenAlex team, and the two share one database. Everything Unpaywall
        knows about an article's open access comes from the same OpenAlex index, gathered from the same
        journals and repositories; Unpaywall simply shows it in the classic Unpaywall format. Unpaywall's
        DOI lookup, browser extension and Simple Query Tool are staying. For searching and browsing,
        OpenAlex does much more, and the open-access data you see there is exactly what Unpaywall would
        have shown you.
      </p>
      <p class="muted">
        <a href="https://help.openalex.org/access/unpaywall-and-openalex/">Read how Unpaywall and OpenAlex fit together</a>,
        including what was retired and the OpenAlex equivalent of each.
      </p>
      <md-button class="md-raised md-accent" :href="meta.link">
        {{ meta.linkText }}
      </md-button>
    </div>
  </div>
</template>

<script>
// Generic "this tool has been retired" notice. Which tool, and where to go
// instead, comes from the route's meta (see router.js).
export default {
  name: 'Retired',
  computed: {
    meta() { return this.$route.meta || {} }
  },
  metaInfo() {
    return { title: this.meta.title || 'Retired' }
  }
}
</script>

<style scoped>
.retired-container {
  max-width: 640px;
  margin: 5rem auto;
  padding: 0 1.25rem;
  text-align: center;
}
.retired-container h1 { font-size: 2rem; margin-bottom: 1.25rem; }
.retired-container .lead { font-size: 1.15rem; line-height: 1.6; }
.retired-container .relationship { text-align: left; line-height: 1.6; margin: 1.5rem 0; }
.retired-container .muted { color: #666; font-size: 0.95rem; margin-bottom: 2rem; }
</style>
