<template>
  <div class="page corrections-page">
    <div class="corrections-container">
      <div class="row no-gutters">
        <!-- Navigation Tabs to the left of all content -->
        <div class="col-3">
          <div class="corrections-nav-tabs vertical-tab-list d-flex flex-column justify-start">
            <div
              class="vertical-tab-item"
              :class="{ active: $route.path.startsWith('/fix/article') }"
              @click="$route.path !== '/fix/article' && $router.push('/fix/article')"
            >
              <v-icon x-small class="mr-2">fa-file</v-icon>
              Fix an Article
            </div>
            <div
              class="vertical-tab-item"
              :class="{ active: $route.path.startsWith('/fix/journal') }"
              @click="$route.path !== '/fix/journal' && $router.push('/fix/journal')"
            >
              <v-icon x-small class="mr-2">fa-book</v-icon>
              Fix a Journal
            </div>
            <div
              class="vertical-tab-item"
              :class="{ active: $route.path.startsWith('/fix/contact') }"
              @click="$route.path !== '/fix/contact' && $router.push('/fix/contact')"
            >
              <v-icon x-small class="mr-2">fa-question-circle</v-icon>
              Other
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="col-7 corrections-content">
          <!-- Breadcrumbs positioned absolutely above the main content -->
          <div v-if="currentStep !== 'article' && currentStep !== 'journal' && documentData" class="breadcrumbs-container">
            <div class="breadcrumbs">
              <span v-for="(item, index) in visibleBreadcrumbs" :key="item.value">
                <span
                  :class="['breadcrumb-step', { active: currentStep === item.value, clickable: !item.disabled }]"
                  @click="!item.disabled ? goToStep(item.value) : null"
                >
                  {{ item.text }}
                </span>
                <span v-if="index < visibleBreadcrumbs.length - 1"> &gt; </span>
              </span>
            </div>
          </div>
          
          <!-- Main content with fixed position -->
          <div class="main-content">
            <h1>{{ pageTitles[0] }}</h1>

            <div class="page-subtitle mb-4">
              <div v-if="successMessage" class="mt-2">
                <v-alert type="success" dense>{{ successMessage }}</v-alert>
              </div>
              <div v-else-if="error || loadError" class="mt-2">
                <v-alert type="error" dense>{{ error || loadError }}</v-alert>
              </div>
              <div v-else-if="pageTitles[1]" class="">
                {{ pageTitles[1] }}
              </div>
            </div>
          </div>

          <!-- Test Controls Card (always visible in admin mode) -->
          <v-card v-if="isAdminMode" class="test-controls-card pa-4">
            <div class="text-body-2 mb-2">Test DOIs</div>
            <v-card-text class="pa-0">
              <v-btn
                block
                small
                class="text-none mb-1"
                @click="getRandomDOI"
              >Random DOI</v-btn>
              
              <div>
                <div class="d-flex flex-column">
                  <v-btn
                    v-for="doi in testDOIs"
                    :key="doi.value"
                    block
                    small
                    class="text-none mb-1"
                    @click="loadTestDOI(doi.value)"
                  >
                    {{ doi.text }} DOI
                  </v-btn>
                </div>
              </div>

              <div class="text-body-2 my-2">Test ISSNs</div>
              <v-btn
                block
                small            
                class="text-none mb-1"
                @click="getRandomJournal"
              >Random Journal</v-btn>

              <div>
                <div class="d-flex flex-column">
                  <v-btn
                    v-for="issn in testISSNs"
                    :key="issn.value"
                    small
                    tonal
                    class="text-none mb-1"
                    @click="loadTestISSN(issn.value)"
                  >
                    {{ issn.text }} ISSN
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
          
          <!-- Loading Card -->
          <v-card v-if="loading && !documentData" class="py-6 text-center loading-card">
            <div class="d-flex flex-column align-center justify-center">
              <v-progress-circular
                indeterminate
                color="primary"
                size="50"
              ></v-progress-circular>
              <div class="mt-3 loading-text">Loading...</div>
            </div>
          </v-card>
          
          <!-- Cards with Data -->
          <template v-if="!loading || documentData">

            <!-- Step 1: Retrieve Document Metadata -->
            <v-card v-if="!documentData" class="corrections-initial-step-card" style="height: 100px;">
              <!-- Input panel -->
              <div class="corrections-input-panel d-flex flex-column justify-center py-6 px-10" style="height: 100%;">
                <template v-if="$route.path.startsWith('/fix/article')">
                  <div class="d-flex flex-column">
                    <!-- First row: Input and Submit button -->
                    <div class="d-flex flex-row align-center">
                      <v-text-field
                        v-model="doiInput"
                        label="Enter DOI"
                        placeholder="10.1016/j.cell.2007.11.019"
                        outlined
                        hide-details
                        @keydown.enter="submitDOI"
                        class="mr-2"
                        style="flex: 1 1 0; min-width: 0;"
                      ></v-text-field>
                      <v-btn
                        class="submit-btn"
                        color="primary"
                        @click="submitDOI"
                      >Fix Article</v-btn>
                    </div>
                    <!-- Second row: Info button -->
                    <div class="mt-2">
                      <v-btn text large class="info-button text-none pa-0" @click="showDoiInfoDialog = true">
                        <v-icon small class="mr-2">fa-info-circle</v-icon>
                        What is a DOI?
                      </v-btn>
                    </div>
                  </div>
                </template>
                <template v-else-if="$route.path.startsWith('/fix/journal')">
                  <div class="d-flex flex-column justify-center">
                    <!-- Input and Submit button -->
                    <div class="d-flex flex-row align-center">
                      <v-text-field
                        v-model="issnInput"
                        label="Enter ISSN"
                        placeholder="1234-5678"
                        outlined
                        hide-details
                        @keydown.enter="submitISSN"
                        class="mr-2"
                        style="flex: 1 1 0; min-width: 0;"
                      ></v-text-field>
                      <v-btn
                        class="submit-btn"
                        color="primary"
                        @click="submitISSN"
                      >Fix Journal</v-btn>
                    </div>
                  </div>
                </template>
                <template v-else-if="$route.path.startsWith('/fix/contact')">
                  <div class="contact-message">
                    <p>
                      <v-icon color="black" class="mr-2">fa-envelope</v-icon>
                      To report another data error, please submit a ticket to <a href="mailto:support@unpaywall.org">support@unpaywall.org</a>.
                    </p>
                  </div>
                </template>
              </div>
            </v-card>


    
      <!-- Step 2+ Main Card with Fixed Header and Subcards -->
      <template v-if="documentData">      
        <!-- Main Card for Step 2+ -->
        <v-card class="mb-4 mt-2 pa-0">
          <!-- Breadcrumbs removed from here and moved above the page title -->
          
          <!-- Card content with padding -->
          <div class="pa-4">

          <div class="mb-4">
            <!-- DOI Display Header -->
            <div v-if="documentType === 'doi'">
              <div class="d-flex justify-space-between align-center">
                <div class="document-title">{{ documentData.title }}</div>
              </div>
              <div class="sublinks subtitle-2 mb-2">
                <a :href="documentData.doi_url" target="_blank">{{ documentData.doi }} <v-icon style="font-size: 11px;">fa-external-link-alt</v-icon></a>
                <span class="mx-3">-</span>
                <a :href="getApiUrl()" target="_blank">API <v-icon style="font-size: 11px;">fa-external-link-alt</v-icon></a>
              </div>
            </div>

            <!-- Journal Display Header -->
            <div v-if="documentType === 'journal'">
              <div class="d-flex justify-space-between align-center">
                <div class="document-title">{{ documentData.display_name }}</div>
              </div>
              <div class="sublinks subtitle-2">
                {{ documentData.issn_l }}
                <span class="mx-3">-</span>
                <a :href="getApiUrl()" target="_blank">API <v-icon style="font-size: 11px;">fa-external-link-alt</v-icon></a>
              </div>
            </div>
            
          </div>
          
          <!-- Subcard for Step 2 (Edit Fields) -->
          <div v-if="currentStep === 'edit_article' || currentStep === 'edit_journal'" class="pa-4 mb-4 subcard">
            <!-- DOI Subcard -->
            <div v-if="documentType === 'doi'">
              <template v-if="documentData.is_oa">
                <div class="mb-1">
                  Unpaywall thinks this work is <span class="status open">free to read</span>
                  <template v-if="getBestOALocationUrl() && documentData.best_oa_location && documentData.best_oa_location.host_type">
                    at {{ documentData.best_oa_location.host_type === 'publisher' ? 'the publisher' : 'a repository' }}:
                  </template>
                </div>
                <code v-if="getBestOALocationUrl()" class="url mb-3">
                  <a :href="getBestOALocationUrl()" target="_blank">{{ getBestOALocationUrl() }} <v-icon x-small>fa-external-link-alt</v-icon></a>
                </code>
              </template>
              <template v-else>
                <div class="mb-2">
                  Unpaywall thinks this work is <span class="status closed">paywalled</span>
                </div>
              </template>
            </div>

            <!-- Journal Subcard -->
            <div v-if="documentType === 'journal'">
              <template v-if="documentData.is_oa">
                <div class="mb-2">
                  Unpaywall thinks this journal is <span class="status open">open access</span>
                </div>
              </template>
              <template v-else>
                <div class="mb-2">
                  Unpaywall thinks this journal is <span class="status closed">closed access</span>
                </div>
              </template>
            </div>
          </div>

          <!-- Subcard Action Buttons -->
          <div v-if="currentStep === 'edit_article' || currentStep === 'edit_journal'" class="subcard-actions d-flex">
            <!-- DOI Actions -->
            <template v-if="documentType === 'doi'">
              <template v-if="documentData.is_oa">
                <v-btn
                  color="red"
                  dark
                  large
                  class="mr-2 text-none"
                  @click="corrections.action = 'Remove'; corrections.field = 'best_oa_location.url'; goToStep('submit')"
                >
                  No, it's paywalled
                </v-btn>
                <v-btn
                  plain
                  large
                  class="text-none mt-1"
                  @click="openModal('fix_link'); corrections.action = 'Correct'; corrections.field = 'best_oa_location.url';"
                >
                  This link is wrong
                </v-btn>
              </template>
              <template v-else>
                <v-btn
                  large
                  color="green"
                  dark
                  class="text-none"
                  @click="openModal('add_link'); corrections.action = 'Add'; corrections.field = 'best_oa_location.url';"
                >
                  No, it's free to read
                </v-btn>
              </template>
            </template>
            <!-- Journal Actions -->
            <template v-if="documentType === 'journal'">
              <template v-if="documentData.is_oa">
                <v-btn
                  large
                  color="red lighten-2"
                  dark
                  class="text-none"
                  @click="corrections.action = 'Close'; corrections.field = 'is_oa'; goToStep('submit')"
                >
                  No, this journal is closed access
                </v-btn>
              </template>
              <template v-else>
                <v-btn
                  large
                  color="green"
                  dark
                  class="text-none"
                  @click="openModal('add_date'); corrections.action = 'Open'; corrections.field = 'is_oa';"
                >
                  No, this journal is open access
                </v-btn>
              </template>
            </template>
          </div>
          
          <!-- Modals for Additional Information -->
          <!-- Add Link Modal -->
          <v-dialog v-model="modals.add_link" max-width="600px">
            <v-card>
              <v-card-title class="headline">{{ stepInfo['add_link'].title }}</v-card-title>
              <v-card-subtitle>{{ stepInfo['add_link'].subtitle }}</v-card-subtitle>
              <v-card-text>
                <v-form ref="locationForm" v-model="locationFormValid">
                  <v-text-field
                    v-model="locationForm.url"
                    :rules="[v => !!v || 'URL is required', urlRule]"
                    outlined
                    dense
                    autofocus
                    hide-details
                    required
                    label="URL where the work is freely available"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" text @click="closeModal('add_link')">
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  @click="submitModal('add_link')"
                  :disabled="!locationFormValid"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          
          <!-- Fix Link Modal -->
          <v-dialog v-model="modals.fix_link" max-width="600px">
            <v-card>
              <v-card-title class="headline">{{ stepInfo['fix_link'].title }}</v-card-title>
              <v-card-subtitle>{{ stepInfo['fix_link'].subtitle }}</v-card-subtitle>
              <v-card-text>
                <v-form ref="locationForm" v-model="locationFormValid">
                  <v-text-field
                    v-model="locationForm.url"
                    :rules="[v => !!v || 'URL is required', urlRule]"
                    outlined
                    dense
                    autofocus
                    hide-details
                    required
                    label="Correct URL for this work"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" text @click="closeModal('fix_link')">
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  @click="submitModal('fix_link')"
                  :disabled="!locationFormValid"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          
          <!-- Add Date Modal -->
          <v-dialog v-model="modals.add_date" max-width="600px">
            <v-card>
              <v-card-title class="headline">{{ stepInfo['add_date'].title }}</v-card-title>
              <v-card-subtitle>{{ stepInfo['add_date'].subtitle }}</v-card-subtitle>
              <v-card-text>
                <v-form ref="journalForm" v-model="journalFormValid">
                  <v-radio-group v-model="journalForm.alwaysOA" class="mt-3">
                    <v-radio :value="false">
                      <template v-slot:label>
                        <div class="d-flex align-center">
                          <v-text-field
                            v-model="journalForm.oa_date"
                            type="number"
                            :rules="[v => journalForm.alwaysOA || !!v || 'Year is required', 
                                    v => journalForm.alwaysOA || /^\d{4}$/.test(v) || 'Year must be 4 digits']"
                            outlined
                            dense
                            hide-details
                            :disabled="journalForm.alwaysOA"
                            style="max-width: 80px;"
                            label="Year"
                          ></v-text-field>
                        </div>
                      </template>
                    </v-radio>
                    <v-radio :value="true" label="This journal has always been open access."></v-radio>
                  </v-radio-group>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" text @click="closeModal('add_date')">
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  @click="submitModal('add_date')"
                  :disabled="!journalFormValid"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Subcard for Step 4 (Review Changes) -->
          <div v-if="currentStep === 'submit'" class="subcard px-1 py-5 mb-4">
            <!-- Review changes left of for now
            <div class="inner-header">Review Changes</div>
            
            <ul class="changes-list">
              <li v-if="documentType === 'doi' && corrections.action === 'Add' && corrections.field === 'best_oa_location.url'">
                <span class="emoji-icon">✅</span> Added an <a :href="locationForm.url" target="_blank">open access link</a> ({{ locationForm.host_type }}).
              </li>
              
              <li v-if="documentType === 'doi' && corrections.action === 'Remove' && corrections.field === 'best_oa_location.url'">
                <span class="emoji-icon">❌</span> Reported a <a :href="getOldValue()" target="_blank">broken open access link</a>.
              </li>
              
              <li v-if="documentType === 'doi' && corrections.action === 'Correct' && corrections.field === 'best_oa_location.url'">
                <span class="emoji-icon">✴️</span> Corrected an open access link to <a :href="locationForm.url" target="_blank">{{ locationForm.url }}</a>.
              </li>
              
              <li v-if="documentType === 'journal' && corrections.action === 'Open' && corrections.field === 'is_oa'">
                <span class="emoji-icon">🟢</span> Reported {{ documentData.display_name }} as open access {{ journalForm.alwaysOA ? 'since its inception' : 'since ' + journalForm.oa_date }}.
              </li>
              
              <li v-if="documentType === 'journal' && corrections.action === 'Close' && corrections.field === 'is_oa'">
                <span class="emoji-icon">🛑</span> Reported {{ documentData.display_name }} as closed access.
              </li>
            </ul>
            -->

            <div class="inner-header">Add your email in case we need to follow up (optional):</div>

            <v-row no-gutters class="mt-1 justify-space-between">
              <v-text-field
                v-model="email"
                placeholder="email@example.com"
                outlined
                hide-details
                dense
                class="mr-2"
                style="max-width: 300px;"
              ></v-text-field>
            </v-row>
          </div>

          <div v-if="currentStep === 'submit'">
            <v-btn
              color="primary"
              @click="submitCorrection"
              :disabled="!canSubmit"
              large
            >Submit Correction</v-btn>
            <div v-if="submitError" class="error--text mt-2">{{ submitError }}</div>
          </div>
          </div>
        </v-card>
      </template>
    </template>
        </div>
        
        <div class="col-3"></div> <!-- Right margin -->
      </div>
    </div>
    
    <!-- DOI Info Dialog -->
    <v-dialog v-model="showDoiInfoDialog" max-width="700">
      <v-card>
        <v-card-title class="headline">What is a DOI?</v-card-title>
        <v-card-text>
          <p>A DOI (Digital Object Identifier) is a unique and persistent identifier used to identify academic, professional, and research content.</p>
          <p>DOIs typically look like this: <code>10.1016/j.cell.2007.11.019</code></p>
          <p>You can find a DOI listed on every landing page in the Unpaywall database.</p>
          <img src="../assets/doi-example.png" class="doi-example"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showDoiInfoDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>    
</template>


<script>
  import axios from 'axios'
  import testDoiData from '../test-doi-data.json'

  export default {
    name: 'Corrections',
    props: {
      showDoiOnly: {
        type: Boolean,
        default: false
      },
      showJournalOnly: {
        type: Boolean,
        default: false
      },
      initialDoi: {
        type: String,
        default: null
      },
      initialIssn: {
        type: String,
        default: null
      }
  },
  data() {
    return {
      // Modal states
      modals: {
        add_link: false,
        fix_link: false,
        add_date: false
      },
      successMessage: null,
      docId: null, // stores the normalized DOI or ISSN currently being used
      submitError: null,
      // Input fields
      doiInput: '',
      issnInput: '',
      selectedTestDOI: null,
      email: '',
      // Data states
      loading: false,
      initialLoading: false,
      error: null,
      loadError: null,
      documentData: null,
      documentType: null, // 'doi' or 'journal'
      rawApiResponse: null,
      // Test data
      testDOIs: [
        { text: 'Gold', value: '10.2221/jcsj.9.70' },
        { text: 'Green', value: '10.1016/j.cell.2007.11.019' },
        { text: 'Hybrid', value: '10.1080/03057925.2025.2483691' },
        { text: 'Bronze', value: '10.2207/qjjws1943.22.275' },
        { text: 'Closed', value: '10.1109/pvsc.1996.564405' }
      ],
      testISSNs: [
        { text: 'Open', value: 'open_issn' },
        { text: 'Closed', value: 'closed_issn' }
      ],
      selectedTestISSN: null,
      // Correction tracking
      corrections: {
        action: null,
        field: null,
        oldValue: null,
        newValue: null,
        url: '',
        oa_date: null,
      },
      // Forms
      locationForm: {
        url: '',
        host_type: 'publisher'
      },
      locationFormValid: false,
      journalForm: {
        oa_date: new Date().getFullYear().toString(),
        alwaysOA: false
      },
      journalFormValid: false,
      // Flow control
      currentStep: "article", // "article", "journal", "contact", "edit_article", "edit_journal", "add_link", "fix_link", "add_date", "submit",
      previousStep: null, // Tracks the previous step for breadcrumb navigation
      additionalInfoNeeded: false,
      
      // UI state
      showDoiInfoDialog: false,
    }
  },
  computed: {
    isAdminMode() {
      return 'admin' in this.$route.query;
    },
    // Single source of truth for all step information
    stepInfo() {
      return {
        // Initial steps
        'article': {
          breadcrumb: 'Fix',
          title: 'Fix Unpaywall Errors',
          subtitle: 'Sometimes Unpaywall makes errors. You can fix them here. Corrections will show up in a few days.'
        },
        'journal': {
          breadcrumb: 'Fix',
          title: 'Fix Unpaywall Errors',
          subtitle: 'Sometimes Unpaywall makes errors. You can fix them here. Corrections will show up in a few days.'
        },
        'contact': {
          breadcrumb: 'Other',
          title: 'Fix Unpaywall Errors',
          subtitle: 'Sometimes Unpaywall makes errors. You can fix them here. Corrections will show up in a few days.'
        },
        
        // Edit steps
        'edit_article': {
          breadcrumb: 'Article',
          title: 'Fix Article Metadata',
          subtitle: 'Review what Unpaywall currently thinks about this article then fix if needed.'
        },
        'edit_journal': {
          breadcrumb: 'Journal',
          title: 'Fix Journal Metadata',
          subtitle: 'Review what Unpaywall currently thinks about this journal then fix if needed.'
        },
        
        // Additional steps
        'add_link': {
          breadcrumb: 'Add Link',
          title: 'Add Open Access Link',
          subtitle: 'To mark this work as open access, Unpaywall needs a URL where the work is freely available.'
        },
        'fix_link': {
          breadcrumb: 'Fix Link',
          title: 'Fix Open Access Link',
          subtitle: 'Correct the link to the open access version of this work.'
        },
        'add_date': {
          breadcrumb: 'Add Date',
          title: 'Add Journal Open Access Date',
          subtitle: 'To mark this journal as open access, let us know when it became open access.'
        },
        'submit': {
          breadcrumb: 'Submit',
          title: 'Submit Your Fix',
          subtitle: 'Your report will be reviewed by our team and live within a few days.'
        }
      };
    },
    
    // Helper method to get breadcrumb info
    breadcrumbs() {
      // For DOI-related steps (edit_article, submit)
      if (this.documentData && this.documentData.doi && 
          (this.currentStep === 'edit_article' || this.currentStep === 'submit')) {
        
        // Base breadcrumbs for all DOI-related steps
        const crumbs = [
          { text: 'Fix', value: 'article' },
          { text: 'Article', value: 'article' },
          { text: this.documentData.doi, value: 'edit_article' }
        ];
        
        // Add the submit step if we're on it
        if (this.currentStep === 'submit') {
          const stepInfo = this.stepInfo[this.currentStep];
          crumbs.push({ text: stepInfo.breadcrumb, value: this.currentStep, disabled: true });
        } else {
          // Mark the DOI as disabled/current if we're on edit_article
          crumbs[2].disabled = true;
        }
        
        return crumbs;
      } 
      // For journal-related steps (edit_journal, submit)
      else if (this.documentData && this.documentData.issn_l && 
              (this.currentStep === 'edit_journal' || this.currentStep === 'submit')) {
        
        // Base breadcrumbs for all journal-related steps
        const crumbs = [
          { text: 'Fix', value: 'journal' },
          { text: 'Journal', value: 'journal' },
          { text: this.documentData.issn_l, value: 'edit_journal' }
        ];
        
        // Add the submit step if we're on it
        if (this.currentStep === 'submit') {
          const stepInfo = this.stepInfo[this.currentStep];
          crumbs.push({ text: stepInfo.breadcrumb, value: this.currentStep, disabled: true });
        } else {
          // Mark the ISSN as disabled/current if we're on edit_journal
          crumbs[2].disabled = true;
        }
        
        return crumbs;
      } 
      // For initial steps
      else if (this.currentStep === 'article' || this.currentStep === 'journal') {
        return [
          { text: 'Fix', value: this.currentStep }
        ];
      } 
      // For contact page
      else if (this.currentStep === 'contact') {
        return [
          { text: 'Other', value: 'contact' }
        ];
      }
      
      // For other steps, use the stepInfo configuration
      return Object.entries(this.stepInfo).map(([value, info]) => ({
        text: info.breadcrumb,
        value
      }));
    },
    visibleBreadcrumbs() {
      return this.breadcrumbs;
    },
    currentBreadcrumbIndex() {
      const currentStepIndex = this.breadcrumbs.findIndex(b => b.value === this.currentStep);
      return currentStepIndex >= 0 ? currentStepIndex : this.breadcrumbs.length - 1;
    },
    pageTitles() {
      // Get the step info for the current step
      const info = this.stepInfo[this.currentStep] || {
        title: "Fix Unpaywall Errors",
        subtitle: null
      };
      
      return [
        info.title,
        info.subtitle
      ];
    },
    currentStepIndex() {
      return this.breadcrumbs.findIndex(step => step.value === this.currentStep);
    },    
    showOADateRow() {
      return this.documentType === 'journal' && 
             this.corrections.action === 'Open' && 
             this.corrections.field === 'is_oa';
    },    
    canSubmit() {
      // Can submit if we have a correction and all required additional info
      return this.corrections.action && this.corrections.field;
    }
  },
  watch: {
    currentStep() {
      this.error = null;
      this.loadError = null;
    }
  },
  methods: {
    normalizeDOI(doi) {
      // Remove any https://doi.org/ prefix
      return doi.replace(/^https?:\/\/doi\.org\//i, '')
    },
    submitDOI() {
      if (!this.doiInput) {
        this.error = 'Please enter a DOI';
        return;
      }

      this.loading = true;
      this.error = null;
      this.loadError = null;

      const normalizedDOI = this.normalizeDOI(this.doiInput);
      this.docId = normalizedDOI;
      // Check for test data first
      const testData = testDoiData[normalizedDOI];
      if (testData) {
        this.documentData = testData;
        this.documentType = 'doi';
        this.successMessage = null;
        this.currentStep = 'edit_article';
        this.updateUrlState();
        this.loading = false;
        this.initialLoading = false;
        return;
      }

      const apiUrl = `https://api.unpaywall.org/${normalizedDOI}?email=team@ourresearch.org`;
      axios.get(apiUrl)
        .then(resp => {
          if (!resp.data || Object.keys(resp.data).length === 0) {
            this.loadError = 'No data found for this DOI.';
            this.documentData = null;
          } else {
            this.documentData = resp.data;
            this.documentType = 'doi';
            this.successMessage = null;
            this.currentStep = 'edit_article';
            this.updateUrlState();
          }
          this.loading = false;
          this.initialLoading = false;
        })
        .catch(err => {
          if (err.response && err.response.status === 404) {
            this.loadError = 'DOI not found.';
          } else {
            console.log(err);
            this.loadError = `Error loading DOI. Please try again later.`;
          }
          this.loading = false;
          this.initialLoading = false;
        });
    },
    submitISSN() {
      if (!this.issnInput) {
        this.error = 'Please enter an ISSN';
        return;
      }

      this.loading = true;
      this.error = null;

      // Check for test data first
      this.docId = this.issnInput;
      const testData = testDoiData[this.issnInput];
      if (testData) {
        this.documentData = testData;
        this.documentType = 'journal';
        this.rawApiResponse = testData;
        this.successMessage = null;
        this.resetCorrections();
        this.currentStep = 'edit_journal';
        // Keep the journal breadcrumb in the URL
        this.updateUrlState();
        this.loading = false;
        this.initialLoading = false;
        return;
      }

      axios.get(`https://api.openalex.org/sources/issn:${this.issnInput}`)
        .then(response => {
          this.documentData = response.data;
          this.documentType = 'journal';
          this.rawApiResponse = response.data;
          this.successMessage = null;
          this.resetCorrections();
          this.currentStep = 'edit_journal';
          // Keep the journal breadcrumb in the URL
          this.updateUrlState();
        })
        .catch(err => {
          if (err.response && err.response.status === 404) {
            this.error = 'ISSN not found.';
          } else {
            console.log(err);
            this.error = `Error loading journal. Please try again later.`;
          }
        })
        .finally(() => {
          this.loading = false;
          this.initialLoading = false;
        });
    },
    getRandomDOI() {
      this.loading = true;
      this.error = null;
      
      axios.get('https://api.openalex.org/works?filter=indexed_in:crossref&sample=1')
        .then(response => {
          // Get the DOI and normalize it (remove https://doi.org/ prefix)
          const doi = response.data.results[0].doi;
          const normalizedDOI = this.normalizeDOI(doi);
          
          // Set the normalized DOI as the input
          this.doiInput = normalizedDOI;
          
          // Fetch the Unpaywall data
          return axios.get(`https://api.unpaywall.org/${normalizedDOI}?email=team@ourresearch.org`);
        })
        .then(response => {
          // Set the document data to move to step 2
          this.documentData = response.data;
          this.documentType = 'doi';
          this.rawApiResponse = response.data;
          this.successMessage = null;
          this.resetCorrections();
          this.currentStep = 'edit_article';
          this.updateUrlState();
        })
        .catch(err => {
          console.log(err);
          this.error = `Error fetching random DOI.`
        })
        .finally(() => {
          this.loading = false
        })
    },
    getRandomJournal() {
      this.loading = true
      this.error = null
      
      axios.get('https://api.openalex.org/sources?filter=has_issn:true&sample=1')
        .then(response => {
          const issn = response.data.results[0].issn_l
          this.issnInput = issn
          this.docId = issn;
          // Fetch the ISSN data directly instead of calling submitISSN
          return axios.get(`https://api.openalex.org/sources/issn:${issn}`)
        })
        .then(response => {
          // Set the document data to move to step 2
          this.documentData = response.data;
          this.documentType = 'journal';
          this.rawApiResponse = response.data;
          this.successMessage = null;
          this.resetCorrections();
          this.currentStep = 'edit_journal';
          // Keep the journal breadcrumb in the URL
          this.updateUrlState();
        })
        .catch(err => {
          console.log(err);
          this.error = `Error loading random journal. Please try again later.`
        })
        .finally(() => {
          this.loading = false
        })
    },
    loadTestDOI(value) {
      const doiValue = value || this.selectedTestDOI;
      if (!doiValue) return;
      this.loading = true;
      try {
        this.docId = doiValue;
        const testData = testDoiData[doiValue];
        if (testData) {
          this.documentData = testData;
          this.documentType = 'doi';
          this.rawApiResponse = testData;
          this.successMessage = null;
          this.resetCorrections();
          this.currentStep = 'edit_article';
          this.updateUrlState();
        } else {
          this.error = 'Test DOI data not found';
        }
      } catch (err) {
        this.error = `Error loading test DOI: ${err.message}`;
      } finally {
        this.loading = false;
      }
    },
    loadTestISSN(value) {
      const issnValue = value || this.selectedTestISSN;
      if (!issnValue) return;
      this.loading = true;
      try {
        this.docId = issnValue;
        const testData = testDoiData[issnValue];
        if (testData) {
          this.documentData = testData;
          this.documentType = 'journal';
          this.rawApiResponse = testData;
          this.successMessage = null;
          this.resetCorrections();
          this.currentStep = 'edit_journal';
          // Keep the journal breadcrumb in the URL
          this.updateUrlState();
        } else {
          this.error = 'Test ISSN data not found';
        }
      } catch (err) {
        this.error = `Error loading test ISSN: ${err.message}`;
      } finally {
        this.loading = false;
      }
    },
    getApiUrl() {
      if (this.documentType === 'doi' && this.docId) {
        return `https://api.unpaywall.org/${this.docId}?email=team@ourresearch.org`;
      } else if (this.documentType === 'journal' && this.docId) {
        return `https://api.openalex.org/sources/issn:${this.docId}`;
      }
      return '#';
    },
    getBestOALocationUrl() {
      if (!this.documentData) return null;
      if (!this.documentData.best_oa_location) return null;
      return this.documentData.best_oa_location.url;
    },
    updateUrlState() {
      if (!this.documentData) return;
      
      let path;
      if (this.documentType === 'doi') {
        let doi = this.doiInput;
        let doiPrefix = doi;
        let doiSuffix = '';
        const slashIndex = doi.indexOf('/');
        if (slashIndex !== -1) {
          doiPrefix = doi.substring(0, slashIndex);
          doiSuffix = doi.substring(slashIndex + 1);
        }
        path = `/fix/article/${doiPrefix}`;
        if (doiSuffix) path += `/${doiSuffix}`;
      } else if (this.documentType === 'journal') {
        path = `/fix/journal/${this.documentData.issn_l}`;
      }
      
      // Only update if the path is different from current
      if (path && this.$route.path !== path) {
        this.$router.push(path);
      }
    },
    // Modal handling methods
    openModal(modalName) {
      // Reset form data based on modal type
      if (modalName === 'add_link') {
        this.locationForm.url = '';
      } else if (modalName === 'fix_link' && this.documentData.best_oa_location) {
        this.locationForm.url = this.documentData.best_oa_location.url || '';
      } else if (modalName === 'add_date') {
        this.journalForm.oa_date = '';
        this.journalForm.alwaysOA = false;
      }
      
      // Open the modal
      this.modals[modalName] = true;
    },
    closeModal(modalName) {
      this.modals[modalName] = false;
    },
    submitModal(modalName) {
      // Store the modal name as previousStep for breadcrumb navigation
      this.previousStep = modalName;
      
      // Close the modal
      this.modals[modalName] = false;
      
      // Navigate to submit step
      this.goToStep('submit');
    },
    handleCorrection(action, field) {
      this.corrections.action = action;
      this.corrections.field = field;
      // Pre-fill form data if needed
      if (action === 'Correct' && field === 'best_oa_location.url' && this.documentData.best_oa_location) {
        this.locationForm.url = this.documentData.best_oa_location.url
        this.locationForm.host_type = this.documentData.best_oa_location.host_type || 'publisher'
      } else if (action === 'Add' && field === 'best_oa_location.url') {
        this.locationForm.url = ''
        this.locationForm.host_type = 'publisher'
      }
      // Determine which explicit step is needed
      if (this.documentType === 'doi') {
        if (action === 'Add' && field === 'best_oa_location.url') {
          this.additionalInfoNeeded = true;
          this.currentStep = 'add_link';
          return;
        } else if (action === 'Correct' && field === 'best_oa_location.url') {
          this.additionalInfoNeeded = true;
          this.currentStep = 'fix_link';
          return;
        }
      } else if (this.documentType === 'journal') {
        if (action === 'Open' && field === 'is_oa') {
          this.additionalInfoNeeded = true;
          this.currentStep = 'add_date';
          return;
        }
      }
      // If no additional info needed, go straight to review
      this.additionalInfoNeeded = false;
      this.currentStep = 'submit';
    },
    resetCorrections() {
      this.corrections = {
        action: null,
        field: null,
        oldValue: null,
        newValue: null,
        url: '',
        oa_date: null,
      };
      this.additionalInfoNeeded = false;
    },
    getOldValue() {
      if (this.documentType === 'doi') {
        if (this.corrections.field === 'best_oa_location.url') {
          return this.getBestOALocationUrl() || 'None'
        }
      } else if (this.documentType === 'journal') {
        if (this.corrections.field === 'is_oa') {
          return this.documentData.is_oa ? 'True' : 'False'
        }
      }
      return 'N/A'
    },    
    getNewValue() {
      if (this.documentType === 'doi') {
        if (this.corrections.field === 'best_oa_location.url') {
          if (this.corrections.action === 'Add' || this.corrections.action === 'Correct') {
            return this.locationForm.url
          } else if (this.corrections.action === 'Remove') {
            return 'None'
          }
        }
      } else if (this.documentType === 'journal') {
        if (this.corrections.field === 'is_oa') {
          return this.corrections.action === 'Open' ? 'True' : 'False'
        }
      }
      return 'N/A'
    },
    getOldHostType() {
      if (!this.documentData) return 'None'
      if (!this.documentData.best_oa_location) return 'None'
      if (!this.documentData.best_oa_location.host_type) return 'None'
      return this.documentData.best_oa_location.host_type
    },    
    urlRule(value) {
      // Accepts http(s)://, at least one dot, and at least one char after the dot
      const pattern = /^https?:\/\/[^\s]+\.[^\s]+/;
      return pattern.test(value) || 'Enter a valid URL';
    },
    submitCorrection() {
      // const apiEndpoint = "http://localhost:5006/corrections"
      const apiEndpoint = "https://corrections.openalex.org/corrections"
      
      this.submitError = null;
      try {
        const payload = this.generatePostData();
        axios.post(apiEndpoint, payload);
        this.successMessage =
          "Your correction has been received and will be reviewed within a few days. Thank you for your help.";
        this.resetForm();
      } catch (e) {
        const errData = e.response && e.response.data;
        this.submitError = (errData && errData.error) || e.message;
      }
    },    
    generatePostData() {
      // Build payload to match API expectations
      const post = {
        type: this.documentType,
        id: this.documentType === 'doi' ? this.documentData.doi : this.documentData.issn_l,
        email: this.email || null
      }
      if (this.documentType === 'doi') {
        const prev = this.documentData.best_oa_location || {}
        post['New url'] = (this.corrections.action === 'Add' || this.corrections.action === 'Correct')
          ? this.locationForm.url : null
        post['New host_type'] = (this.corrections.action === 'Add' || this.corrections.action === 'Correct')
          ? this.locationForm.host_type : null
        post['Previous url'] = prev.url || null
        post['Previous host_type'] = prev.host_type || null
      } else if (this.documentType === 'journal') {
        post['New is_oa'] = this.corrections.action === 'Open'
        post['New oa_date'] = this.corrections.action === 'Open'
          ? (this.journalForm.alwaysOA ? null : this.journalForm.oa_date)
          : null
        post['Previous is_oa'] = this.documentData.is_oa
        post['Previous oa_date'] = (typeof this.documentData.oa_date !== 'undefined' ? this.documentData.oa_date : null)
      }
      return post;
    },    
    resetForm() {
      this.documentData = null;
      this.documentType = null;
      this.rawApiResponse = null;
      this.resetCorrections();
      this.doiInput = '';
      this.issnInput = '';
      this.selectedTestDOI = null;
      this.currentStep = 'article';
      this.previousStep = null;
      this.loading = false;
      this.initialLoading = false;
      this.additionalInfoNeeded = false;
      if (this.$route.path !== '/fix') {
        this.$router.push('/fix');
      }
    },
    goToStep(step) {
      // Handle navigation to initial steps
      if (step === 'article' || step === 'journal') {
        // When going back to initial step, reset form and update URL
        this.resetForm();
        const path = step === 'article' ? '/fix' : `/fix/${step}`;
        if (this.$route.path !== path) {
          this.$router.push(path);
        }
        return;
      }
      
      // Handle navigation to edit steps with proper parameters
      if (step === 'edit_article' && this.documentData && this.documentData.doi) {
        // Update the current step first to ensure the UI updates correctly
        this.currentStep = 'edit_article';
        
        // Split DOI into prefix and suffix for the URL
        const [prefix, suffix] = this.documentData.doi.split('/');
        if (prefix && suffix) {
          const path = `/fix/article/${encodeURIComponent(prefix)}/${encodeURIComponent(suffix)}`;
          if (this.$route.path !== path) {
            this.$router.push(path);
          }
        }
        return;
      } else if (step === 'edit_journal' && this.documentData && this.documentData.issn_l) {
        // Update the current step first to ensure the UI updates correctly
        this.currentStep = 'edit_journal';
        
        const path = `/fix/journal/${encodeURIComponent(this.documentData.issn_l)}`;
        if (this.$route.path !== path) {
          this.$router.push(path);
        }
        return;
      }
      
      // Set the appropriate edit step based on document type for generic 'edit' step
      if (step === 'edit') {
        step = this.documentType === 'doi' ? 'edit_article' : 'edit_journal';
      }
      
      // Special case: Allow forward navigation from add_link, fix_link, or add_date to submit step
      if (step === 'submit' && 
          (this.currentStep === 'add_link' || this.currentStep === 'fix_link' || this.currentStep === 'add_date')) {
        // Store the previous step for breadcrumb navigation
        this.previousStep = this.currentStep;
        this.currentStep = step;
        return;
      }
      
      if (this.currentStepIndex > this.breadcrumbs.findIndex(s => s.value === step)) {
        // Only allow navigation to previous steps
        this.currentStep = step;
        // Reset state as needed for each step
        if (step === 'article') {
          // When clicking 'Start', reset form and go back to /fix
          this.resetForm();
          if (this.$route.path !== '/fix') {
            this.$router.push('/fix');
          }
        } else if (step === 'edit_article' || step === 'edit_journal') {
          // Keep document data but reset corrections
          this.resetCorrections();
        } else if (step === 'add_link' || step === 'fix_link' || step === 'add_date') {
          // If going back from review to an additional info step, just update step
        }
        // Add more logic here if needed for other steps
      }
    },
    goToJournalStep() {
      this.currentStep = 'journal';
      this.$router.push('/fix/journal');
    },
  },
  watch: {
    // Watch for browser navigation (forward/back)
    $route(to, from) {
      // Handle the contact route
      if (to.path === '/fix/contact') {
        this.currentStep = 'contact';
        return;
      }
      // Only react if the path actually changes
      if (to.path !== from.path) {
        // Reset document data when navigating away from edit pages
        if (to.path === '/fix/article' || to.path === '/fix/journal') {
          this.documentData = null;
          this.documentType = null;
          this.resetCorrections();
        }
        // Example: /fix/article/:prefix/:suffix or /fix/journal/:issn
        const doiWorkMatch = to.path.match(/^\/fix\/article\/([^\/]+)(?:\/([^\/]+))?/);
        const journalMatch = to.path.match(/^\/fix\/journal\/([^\/]+)/);
        const journalPageMatch = to.path === '/fix/journal';
        
        if (to.path === '/fix') {
          // Reset form when navigating to /fix
          this.resetForm();
        } else if (journalPageMatch) {
          // Set current step to journal for /fix/journal
          this.currentStep = 'journal';
          // Clear any previous data
          this.documentData = null;
          this.documentType = null;
        } else if (doiWorkMatch) {
          // Compose DOI from prefix/suffix
          let doi = doiWorkMatch[1];
          if (doiWorkMatch[2]) doi += '/' + doiWorkMatch[2];
          
          // Check if we already have this data loaded (from test data)
          if (this.documentData && this.documentType === 'doi' && this.documentData.doi === doi) {
            // We already have this data loaded, no need to make an API call
            return;
          }
          
          if (doi !== this.doiInput) {
            this.doiInput = doi;
            this.issnInput = '';
            this.initialLoading = true;
            this.loadError = null;
            
            // Check if we have test data for this DOI
            const testData = testDoiData[doi];
            if (testData) {
              // Use test data instead of making an API call
              this.documentData = testData;
              this.documentType = 'doi';
              this.rawApiResponse = testData;
              this.successMessage = null;
              this.resetCorrections();
              this.currentStep = 'edit_article';
              this.initialLoading = false;
              this.loading = false;
            } else {
              // No test data, make the API call
              this.submitDOI();
            }
          }
        } else if (journalMatch) {
          const issn = journalMatch[1];
          
          // Check if we already have this data loaded (from test data)
          if (this.documentData && this.documentType === 'journal' && this.documentData.issn_l === issn) {
            // We already have this data loaded, no need to make an API call
            return;
          }
          
          if (issn !== this.issnInput) {
            this.issnInput = issn;
            this.doiInput = '';
            this.initialLoading = true;
            this.loadError = null;
            
            // Check if we have test data for this ISSN
            const testData = testDoiData[issn];
            if (testData) {
              // Use test data instead of making an API call
              this.documentData = testData;
              this.documentType = 'journal';
              this.rawApiResponse = testData;
              this.successMessage = null;
              this.resetCorrections();
              this.currentStep = 'edit_journal';
              this.initialLoading = false;
              this.loading = false;
            } else {
              // No test data, make the API call
              this.submitISSN();
            }
          }
        } else if (to.path === '/fix') {
          // Reset form if navigated to /fix root
          this.resetForm();
        }
      }
    },
    initialDoi: {
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.doiInput = newVal;
          this.initialLoading = true;
          this.loadError = null;
          this.submitDOI();
        }
      },
      immediate: true
    },
    initialIssn: {
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.issnInput = newVal;
          this.initialLoading = true;
          this.loadError = null;
          this.submitISSN();
        }
      },
      immediate: true
    }
  },
  created() {
    // Handle direct loading of pages
    if (this.$route.path === '/fix/journal') {
      this.currentStep = 'journal';
    } else if (this.$route.path === '/fix/article') {
      this.currentStep = 'article';
    }
  }
}
</script>


<style scoped>
.corrections-page {
  max-width: none !important;
  width: 100%;
  min-height: 80vh;
  padding-bottom: 100px;
}
.corrections-container {
  position: relative;
  width: 100%;
  padding-top: 60px;
}
.corrections-content {
  padding-right: 15px; /* Add some padding for better readability */
  position: relative; /* For absolute positioning of breadcrumbs */
}
.corrections-nav-tabs {
  padding-top: 10px;
}
.corrections-initial-step-card {
  min-height: 140px;
}
.vertical-tab-list {
  display: flex;
  flex-direction: column;
}
.vertical-tab-item {
  cursor: pointer;
  padding: 10px 30px 10px 30px;
  margin-right: 70px;
  font-size: 16px;
  color: #333;
  border-top-right-radius: 22px;
  border-bottom-right-radius: 22px;
}
.vertical-tab-item .v-icon {
  margin-top: -2px;
}
.vertical-tab-item.active {
  background-color: #ddd;
}
.corrections-tab-col {
  width: 180px;
  border-radius: none !important;
}
h1 {
  text-align: left;
  margin: 0px;
}
.page-subtitle {
  font-size: 15px;
  color: #666;
  margin-top: -6px;
}
.breadcrumbs-container {
  position: absolute;
  top: -30px;
  left: 0;
  width: 100%;
  z-index: 1;
}
.breadcrumbs {
  color: #777;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}
.breadcrumb-step {
  cursor: pointer;
}
.breadcrumb-step.active {
  color: #777;
  font-weight: 500;
}
.breadcrumb-step.clickable {
  color: #1976D2; /* Vuetify primary blue */
}
.breadcrumb-step.clickable:hover {
  text-decoration: underline;
}
.correct-label {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
}
.submit-btn {
  height: 56px !important;
}
.v-btn.info-button {
  padding: 0 10px !important;
}
.divider {
  height: 1px;
  margin: 30px -24px;
  background-color: #ccc;
}
.v-card.light-grey {
  background-color: #edf0ed;
}
.document-title {
  font-size: 20px;
}
.sublinks, .sublinks * {
  color: #999 !important;
}
.sublinks .v-icon {
  margin-top: -3px;
  font-size: 9px;
}
.subcard {
  font-size: 14px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.status {
  font-weight: bold;
  font-size: 34px;
  display: block;
}
.status.open {
  color: green;
}
.status.closed {
  color: red;
} 
.url * {
  font-size: 14px;
  color: #362cf9 !important;
}
.url .v-icon {
  margin-top: -3px;
  font-size: 9px;
}
.changes-list {
  padding-left: 10px !important;
  margin: 10px 0px 20px 10px;
  list-style-type: none;
}
.changes-list li {
  font-size: 14px;
}
.emoji-icon {
  margin-right: 5px;
  font-size: 16px;
}
.inner-header {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
}
.radio-group .v-label {
  font-size: 14px !important;
} 
.radio-group.v-input--selection-controls {
  margin-top: 0px !important;
}
.email-label {
  font-size: 12px;
}
.main-content {
  position: relative;
}
img.doi-example {
  border: 1px solid #ccc;
  border-radius: 6px;
  display: block;
}
.loading-card {
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.loading-text {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}
.test-controls-card {
  position: fixed;
  right: 20px;
  top: 100px;
  width: 200px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #ddd;
}
h2 {
  margin: 5px 0;
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>