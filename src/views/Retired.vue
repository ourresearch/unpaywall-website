<template>
  <div class="page retired-page">
    <div class="retired-container">
      <v-icon class="mb-4" style="font-size: 48px; color: #999;">fa-circle-info</v-icon>
      <h1>{{ meta.title }}</h1>
      <p class="lead">
        {{ meta.lead }}
      </p>
      <p class="muted">
        Unpaywall is now part of <a href="https://openalex.org">OpenAlex</a>, which covers the same
        data with more coverage. Unpaywall DOI lookup (<code>api.unpaywall.org/v2/:doi</code>) is unchanged.
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
.retired-container .muted { color: #666; font-size: 0.95rem; margin-bottom: 2rem; }
</style>
