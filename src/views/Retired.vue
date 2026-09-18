<template>
  <div class="page retired-page">
    <div class="retired-container">
      <v-icon class="mb-4" style="font-size: 48px; color: #999;">fa-circle-info</v-icon>
      <h1>{{ meta.title }}</h1>

      <p class="lead">
        {{ meta.lead }} <a :href="meta.link">OpenAlex</a> instead.
      </p>

      <p>
        OpenAlex is the successor to Unpaywall, built by the same team. It has everything Unpaywall
        has: whether a paper is free to read, and where. And it adds much more: search, citation
        counts, authors, journals, and topics.
      </p>

      <p>
        In fact, Unpaywall now runs on the OpenAlex database. Same data, different format.
      </p>

      <p>
        Unpaywall isn't going away, and there are no plans to retire it. But if you want to search
        or browse, use OpenAlex. It's far more powerful, and it's the same data.
      </p>

      <md-button class="md-raised md-accent" :href="meta.link">
        {{ meta.linkText }}
      </md-button>

      <p class="muted">
        <a href="https://help.openalex.org/access/unpaywall/#unpaywall-and-openalex">More about Unpaywall and OpenAlex</a>
      </p>
    </div>
  </div>
</template>

<script>
// Generic "this tool has been retired" notice. Which tool, and where to go
// instead, comes from the route's meta (see router.js). Order of the copy is
// deliberate: what's gone, what to use, why it's safe, and that Unpaywall stays.
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
.retired-container .lead { font-size: 1.25rem; line-height: 1.6; font-weight: 600; }
.retired-container p { line-height: 1.6; margin: 1rem 0; }
.retired-container .muted { color: #666; font-size: 0.95rem; margin-top: 1.5rem; }
</style>
