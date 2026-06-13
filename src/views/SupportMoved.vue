<template>
  <div class="page support-moved-page">
    <div class="support-moved-container">
      <v-icon class="mb-4" style="font-size: 48px; color: #999;">fa-circle-info</v-icon>
      <h1>Unpaywall support has moved</h1>
      <p class="lead">
        Unpaywall is now part of <a href="https://openalex.org">OpenAlex</a>, and all support —
        including data-quality reports and open-access status corrections — is now handled by the
        OpenAlex support team.
      </p>
      <p class="cta">
        To report an issue or request a fix, email
        <a href="mailto:support@openalex.org">support@openalex.org</a>.
      </p>
      <p class="muted">
        Your message goes into our centralized ticket system, where we review reports both
        individually and in aggregate to improve OpenAlex and Unpaywall data quality.
      </p>
      <md-button class="md-raised md-accent" href="mailto:support@openalex.org">
        Email support@openalex.org
      </md-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SupportMoved'
}
</script>

<style scoped>
.support-moved-container {
  max-width: 640px;
  margin: 5rem auto;
  padding: 0 1.25rem;
  text-align: center;
}
.support-moved-container h1 { font-size: 2rem; margin-bottom: 1.25rem; }
.support-moved-container .lead { font-size: 1.15rem; line-height: 1.6; }
.support-moved-container .cta { font-size: 1.15rem; font-weight: 600; margin: 1.5rem 0; }
.support-moved-container .muted { color: #666; font-size: 0.95rem; margin-bottom: 2rem; }
</style>
