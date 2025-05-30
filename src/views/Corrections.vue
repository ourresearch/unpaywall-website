<template>
  <div class="page corrections-page">
    <div class="corrections-container">
      <div class="row no-gutters">
        <!-- Navigation Tabs to the left of all content -->
        <div class="col-3">
          <div class="corrections-nav-tabs vertical-tab-list d-flex flex-column justify-start">
            <div class="vertical-tab-header">
              <v-icon x-small class="mr-2">fa-bug</v-icon>
              Fix Unpaywall Errors
            </div>
            
            <div
              class="vertical-tab-item"
              :class="{ active: $route.path.startsWith('/fix/article') }"
              @click="clearSuccessAndNavigate('/fix/article')"
            >
              <v-icon x-small class="mr-2">fa-file</v-icon>
              Fix an Article
            </div>
            <div
              class="vertical-tab-item"
              :class="{ active: $route.path.startsWith('/fix/journal') }"
              @click="clearSuccessAndNavigate('/fix/journal')"
            >
              <v-icon x-small class="mr-2">fa-book</v-icon>
              Fix a Journal
            </div>
            <div
              class="vertical-tab-item"
              :class="{ active: $route.path.startsWith('/fix/contact') }"
              @click="clearSuccessAndNavigate('/fix/contact')"
            >
              <v-icon x-small class="mr-2">fa-question-circle</v-icon>
              Report Another Error
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="col-7 corrections-content">
          <!-- Back Button -->
           <v-btn class="back-button" v-if="documentData" text x-small color="primary" @click="goBack"><v-icon x-small class="mr-2">fa-arrow-left</v-icon> Back</v-btn>
          
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
            <h3>{{ pageTitles[0] }}</h3>

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
          <v-card v-if="loading && !documentData" :loading="true" class="loading-card"></v-card>
          
          <!-- Cards with Data -->
          <template v-if="!loading || documentData">

            <!-- Step 1: Get Data -->
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
                        :disabled="!doiInput"
                      >Fix Article</v-btn>
                    </div>
                    <!-- Second row: Info button -->
                    <div class="mt-2">
                      <v-btn text large class="info-button text-none pa-0" @click="showDoiInfoDialog = true">
                        <v-icon x-small class="mr-2">fa-info-circle</v-icon>
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
                        :disabled="!issnInput"
                      >Fix Journal</v-btn>
                    </div>
                  </div>
                </template>
                <template v-else-if="$route.path.startsWith('/fix/contact')">
                  <div class="contact-message">
                    <p>
                      <v-icon class="mr-2" small>fa-envelope</v-icon>
                      To report another data error, please submit a ticket to <a href="mailto:support@unpaywall.org">support@unpaywall.org</a>.
                    </p>
                  </div>
                </template>
              </div>
            </v-card>

            <!-- Step 2+ Main Card with Data-->
            <template v-if="documentData">      
              <v-card class="mb-4 mt-2 pa-0">
                
                <div class="pa-6">

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
                  
                  <!-- Subcard for Edit Fields -->
                  <div v-if="currentStep === 'edit_article' || currentStep === 'edit_journal'" class="py-5 subcard">
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

                  <!-- Subcard Action Buttons for Edit (hidden when in review mode) -->
                  <div v-if="(currentStep === 'edit_article' || currentStep === 'edit_journal') && !showReviewStep" class="subcard-actions d-flex mt-5">
                    <!-- DOI Actions -->
                    <template v-if="documentType === 'doi'">
                      <template v-if="documentData.is_oa">
                        <v-btn
                          color="red"
                          dark
                          large
                          class="mr-2 text-none"
                          @click="corrections.action = 'Remove'; corrections.field = 'best_oa_location.url';"
                        >
                          No, it's paywalled
                        </v-btn>
                        <v-btn
                          plain
                          large
                          class="text-none mt-1"
                          @click="openModal('fix_link'); pendingCorrection.action = 'Correct'; pendingCorrection.field = 'best_oa_location.url';"
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
                          @click="openModal('add_link'); pendingCorrection.action = 'Add'; pendingCorrection.field = 'best_oa_location.url';"
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
                          color="red"
                          dark
                          class="text-none"
                          @click="corrections.action = 'Close'; corrections.field = 'is_oa';"
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
                          @click="openModal('add_date'); pendingCorrection.action = 'Open'; pendingCorrection.field = 'is_oa';"
                        >
                          No, this journal is open access
                        </v-btn>
                      </template>
                    </template>
                  </div>

                  <!-- Subcard for Review & Submit (appears below edit fields when in review mode) -->
                  <div v-if="showReviewStep" class="subcard py-5">
                    <div class="inner-header">
                      Your fixes:
                    </div>
                    
                    <ul class="changes-list">
                      <li v-if="documentType === 'doi' && corrections.action === 'Add' && corrections.field === 'best_oa_location.url'">
                        <span class="emoji-icon">✅</span> Added <a :href="locationForm.url" target="_blank">open access link</a>.
                      </li>
                      
                      <li v-if="documentType === 'doi' && corrections.action === 'Remove' && corrections.field === 'best_oa_location.url'">
                        <span class="emoji-icon">❌</span> Reported this article as paywalled.
                      </li>
                      
                      <li v-if="documentType === 'doi' && corrections.action === 'Correct' && corrections.field === 'best_oa_location.url'">
                        <span class="emoji-icon">✅</span> Corrected open access link to <code class="url"> <a :href="locationForm.url" target="_blank">{{ locationForm.url }}  <v-icon x-small>fa-external-link-alt</v-icon></a></code>.
                      </li>
                      
                      <li v-if="documentType === 'journal' && corrections.action === 'Open' && corrections.field === 'is_oa'">
                        <span class="emoji-icon">🟢</span> Reported {{ documentData.display_name }} as open access {{ journalForm.alwaysOA ? 'since its inception' : 'since ' + journalForm.oa_date }}.
                      </li>
                      
                      <li v-if="documentType === 'journal' && corrections.action === 'Close' && corrections.field === 'is_oa'">
                        <span class="emoji-icon">🛑</span> Reported {{ documentData.display_name }} as closed access.
                      </li>
                    </ul>

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

                  <div v-if="showReviewStep" class="subcard-actions d-flex mt-5">
                    <v-btn
                        color="primary"
                        @click="submitCorrection"
                        :disabled="!canSubmit"
                        large
                        class="mr-2"
                      >Submit Fix</v-btn>
                      <v-btn
                        large
                        text
                        @click="resetCorrections"
                        >
                        Undo
                      </v-btn>
                      <div v-if="submitError" class="error--text mt-2">{{ submitError }}</div>             
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
                          :disabled="!journalForm.alwaysOA && !journalFormValid"
                        >
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
              </v-card>

            </template>
          </template>
        </div>
        
        <!-- Right margin -->
        <div class="col-3"></div> 
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
      },
      initialStep: {
        type: String,
        default: null
      }
    },
    data() {
    return {
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
      // Modal states
      modals: {
        add_link: false,
        fix_link: false,
        add_date: false
      },
      // Test data
      testDOIs: [
        { text: 'Gold', value: '10.2221/jcsj.9.70' },
        { text: 'Green', value: '10.1016/j.cell.2007.11.019' },
        { text: 'Hybrid', value: '10.1080/03057925.2025.2483691' },
        { text: 'Bronze', value: '10.2207/qjjws1943.22.275' },
        { text: 'Closed', value: '10.1109/pvsc.1996.564405' }
      ],
      testISSNs: [
        { text: 'Open', value: '2693-8499' },
        { text: 'Closed', value: '1040-8401' }
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
      // Pending correction (used when modals are open)
      pendingCorrection: {
        action: null,
        field: null,
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
      previousStep: null, // Tracks the previous step for breadcrumb navigation
      additionalInfoNeeded: false,
      // UI state
      showDoiInfoDialog: false,
      isAdminMode: 'admin' in this.$route.query,
    }
  },
  computed: {
    currentStep() {
      const path = this.$route.path;
      
      // Check for contact page
      if (path === '/fix/contact') {
        return 'contact';
      }
      
      // Check for article with DOI
      if (path.match(/^\/fix\/article\/[^/]+/)) {
        // If we have modals open, return the modal step
        if (this.modals.add_link) return 'add_link';
        if (this.modals.fix_link) return 'fix_link';
        if (this.modals.add_date) return 'add_date';
        
        return 'edit_article';
      }
      
      // Check for journal with ISSN
      if (path.match(/^\/fix\/journal\/[^/]+/) && path !== '/fix/journal/') {
        // If we have modals open, return the modal step
        if (this.modals.add_date) return 'add_date';
        
        return 'edit_journal';
      }
      
      // Check for journal page
      if (path === '/fix/journal') {
        return 'journal';
      }
      
      // Default to article page
      return 'article';
    },
    showReviewStep() {
      return this.corrections.action && this.corrections.field;
    },
    // Single source of truth for all step information
    stepInfo() {
      return {
        // Initial steps
        'fix': {
          breadcrumb: 'Fix',
          title: 'Fix Unpaywall Errors',
          subtitle: 'Sometimes Unpaywall makes errors. You can fix them here. Corrections will show up in a few days.'
        },
        'article': {
          breadcrumb: 'Fix an Article',
          title: 'Fix an Article',
          subtitle: 'Sometimes Unpaywall makes errors. You can make fixes to articles here. Corrections will show up in a few days.'
        },
        'journal': {
          breadcrumb: 'Fix a Journal',
          title: 'Fix a Journal',
          subtitle: 'Sometimes Unpaywall makes errors. You can make fixes to jounrals here. Corrections will show up in a few days.'
        },
        'contact': {
          breadcrumb: 'Other',
          title: 'Report Another Error',
          subtitle: 'Sometimes Unpaywall makes errors. To report other issues, please contact us.'
        },
        
        // Edit steps
        'edit_article': {
          breadcrumb: 'Article',
          title: 'Fix an Article',
          subtitle: 'Review what Unpaywall currently thinks about this article then fix if needed.'
        },
        'edit_journal': {
          breadcrumb: 'Journal',
          title: 'Fix a Journal',
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
      };
    },
    // Helper method to get breadcrumb info
    breadcrumbs() {
      // For DOI-related steps (edit_article, submit)
      if (this.documentData && this.documentData.doi && 
          (this.currentStep === 'edit_article')) {
        
        // Base breadcrumbs for all DOI-related steps
        const crumbs = [
          { text: 'Fix', value: 'fix' },
          { text: 'Article', value: 'article' },
          { text: this.documentData.doi, value: 'edit_article' }
        ];
        
        // Mark the DOI as disabled/current if we're on edit_article
        crumbs[2].disabled = true;
        
        return crumbs;
      } 
      // For journal-related steps (edit_journal, submit)
      else if (this.documentData && this.documentData.issn_l && 
              (this.currentStep === 'edit_journal')) {
        
        // Base breadcrumbs for all journal-related steps
        const crumbs = [
          { text: 'Fix', value: 'fix' },
          { text: 'Journal', value: 'journal' },
          { text: this.documentData.issn_l, value: 'edit_journal' }
        ];
        
        // Mark the ISSN as disabled/current if we're on edit_journal
        crumbs[2].disabled = true;
        
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
  methods: {
    normalizeDOI(doi) {
      return doi.replace(/^https?:\/\/doi\.org\//i, ''); // Remove any https://doi.org/ prefix
    },
    submitDOI() {
      if (!this.doiInput) {
        this.error = 'Please enter a DOI';
        return;
      }
      
      this.loading = true;
      this.error = null;
      this.loadError = null;
      this.docId = this.normalizeDOI(this.doiInput);
      
      // Navigate to the article edit page
      const path = this.getArticlePath(this.docId);
      this.$router.push(path);
      
      // The actual data loading will happen in the $route watcher
    },
    submitISSN() {
      if (!this.issnInput) {
        this.error = 'Please enter an ISSN';
        return;
      }
      
      this.loading = true;
      this.error = null;
      this.loadError = null;
      this.docId = this.issnInput.trim();
      
      // Navigate to the journal edit page
      const path = this.getJournalPath(this.docId);
      this.$router.push(path);
      
      // The actual data loading will happen in the $route watcher
    },
    loadTestDOI(value) {
      this.doiInput = value;
      this.selectedTestDOI = value;
      this.loading = true;
      this.error = null;
      this.loadError = null;
      
      // Check if we have test data for this DOI
      const testData = testDoiData[value];
      if (testData) {
        // Use test data instead of making an API call
        this.documentData = testData;
        this.documentType = 'doi';
        this.rawApiResponse = testData;
        this.successMessage = null;
        this.resetCorrections();
        this.initialLoading = false;
        this.loading = false;
        
        // Navigate to the article edit page
        const path = this.getArticlePath(value);
        this.$router.push(path);
      } else {
        // No test data, submit normally
        this.submitDOI();
      }
    },
    loadTestISSN(value) {
      this.issnInput = value;
      this.selectedTestISSN = value;
      this.loading = true;
      this.error = null;
      this.loadError = null;
      
      // Check if we have test data for this ISSN
      const testData = testDoiData[value];
      if (testData) {
        // Use test data instead of making an API call
        this.documentData = testData;
        this.documentType = 'journal';
        this.rawApiResponse = testData;
        this.successMessage = null;
        this.resetCorrections();
        this.initialLoading = false;
        this.loading = false;
        
        // Navigate to the journal edit page  
        const path = this.getJournalPath(value);
        this.$router.push(path);
      } else {
        // No test data, submit normally
        this.submitISSN();
      }
    },
    getRandomDOI() {
      this.loading = true;
      this.error = null;
      this.loadError = null; // Clear any previous load errors
      
      axios.get('https://api.openalex.org/works?filter=indexed_in:crossref&sample=1')
        .then(response => {
          // Get the DOI and normalize it (remove https://doi.org/ prefix)
          const doi = response.data.results[0].doi;
          const normalizedDOI = this.normalizeDOI(doi);
          
          // Set the normalized DOI as the input and document type
          this.doiInput = normalizedDOI;
          this.docId = normalizedDOI;
          this.documentType = 'doi';
          
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
          this.$router.push(this.getArticlePath(this.doiInput));
        })
        .catch(err => {
          this.error = `Error fetching random DOI: ${err.message}`;
        })
        .finally(() => {
          this.loading = false
        })
    },
    getRandomJournal() {
      this.loading = true
      this.error = null
      this.loadError = null // Clear any previous load errors
      
      axios.get('https://api.openalex.org/sources?filter=has_issn:true&sample=1')
        .then(response => {
          const issn = response.data.results[0].issn_l
          this.issnInput = issn
          this.docId = issn;
          this.documentType = 'journal'; // Set document type
          
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
          this.$router.push(this.getJournalPath(this.issnInput));
        })
        .catch(err => {
          this.error = `Error loading random journal: ${err.message}`;
        })
        .finally(() => {
          this.loading = false
        })
    },
    getApiUrl() {
      // Construct the API URL based on the document ID
      if (!this.docId) {
        this.loadError = 'Unable to construct API URL: No document ID available';
        return '';
      }
      
      // Use different API endpoints for DOI and journal lookups
      if (this.documentType === 'doi') {
        return `https://api.unpaywall.org/${this.docId}?email=team@ourresearch.org`;
      } else if (this.documentType === 'journal') {
        return `https://api.openalex.org/sources/issn:${this.docId}`;
      } else {
        this.loadError = 'Unable to determine API endpoint: Unknown document type';
        return '';
      }
    },
    getBestOALocationUrl() {
      if (!this.documentData || !this.documentData.best_oa_location) return '';
      return this.documentData.best_oa_location.url || '';
    },
    // Helper methods for URL path construction
    getArticlePath(doi) {
      if (!doi) return '/fix/article';
      return `/fix/article/${doi}`;
    },
    getJournalPath(issn) {
      if (!issn) return '/fix/journal';
      
      return `/fix/journal/${encodeURIComponent(issn)}`;
    },
    navigateTo(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },
    updateUrlState() {
      if (!this.documentData) return;
      
      let path;
      if (this.documentType === 'doi') {
        let doi = this.doiInput;
        path = `/fix/article/${doi}`;
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
      // Clear the pending correction when modal is closed without saving
      this.pendingCorrection.action = null;
      this.pendingCorrection.field = null;
    },
    submitModal(modalName) {
      // Store the modal name as previousStep for breadcrumb navigation
      this.previousStep = modalName;
      
      // Close the modal
      this.modals[modalName] = false;
      
      // Apply the pending correction to the actual corrections object
      if (this.pendingCorrection.action && this.pendingCorrection.field) {
        this.corrections.action = this.pendingCorrection.action;
        this.corrections.field = this.pendingCorrection.field;
      }
      
      // Clear the pending correction
      this.pendingCorrection.action = null;
      this.pendingCorrection.field = null;
      
      // No need to navigate to submit step anymore - the showReviewStep computed property
      // will automatically show the review section based on corrections state
    },
    handleCorrection(action, field) {
      this.pendingCorrection.action = action;
      this.pendingCorrection.field = field;
      
      // Apply the correction
      this.corrections.action = action;
      this.corrections.field = field;
      
      // Open appropriate modal based on action and field
      if (action === 'Add' && field === 'best_oa_location.url') {
        this.openModal('add_link');
      } else if (action === 'Correct' && field === 'best_oa_location.url') {
        this.openModal('fix_link');
      } else if (action === 'Open' && field === 'is_oa') {
        // For journal OA date
        this.openModal('add_date');
      } else {
        // For actions that don't need additional info
        this.additionalInfoNeeded = false;
      }
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
        
        // Reset the form to go back to the initial state
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
      // Clear all form data
      this.doiInput = '';
      this.issnInput = '';
      this.documentData = null;
      this.documentType = null;
      this.rawApiResponse = null;
      this.error = null;
      this.loadError = null;
      this.loading = false;
      this.initialLoading = false;
      this.selectedTestDOI = null;
      this.selectedTestISSN = null;
      this.resetCorrections();
      
      // Reset modal states
      Object.keys(this.modals).forEach(key => {
        this.modals[key] = false;
      });
      
      // Reset pending correction
      if (this.pendingCorrection) {
        this.pendingCorrection.action = null;
        this.pendingCorrection.field = null;
      }
      
      // Navigate to the appropriate base route based on current step
      const path = this.currentStep === 'journal' ? '/fix/journal' : 
                   this.currentStep === 'contact' ? '/fix/contact' : '/fix/article';
      
      // Only navigate if we're not already on that path
      if (this.$route.path !== path) {
        this.$router.push(path).catch(err => {
          // Ignore navigation duplicated errors
          if (err.name !== 'NavigationDuplicated') {
            throw err;
          }
        });
      }
    },
    clearSuccessAndNavigate(path) {
      this.successMessage = null;
      this.$router.push(path).catch(err => {
        // Ignore navigation duplicated errors
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    },
    goBack() {
      // Navigate back based on current step
      if (this.currentStep === 'edit_article') {
        this.$router.push('/fix/article').catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            throw err;
          }
        });
      } else if (this.currentStep === 'edit_journal') {
        this.$router.push('/fix/journal').catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            throw err;
          }
        });
      }
    },
  },
  watch: {
    $route: {
      handler(to, from) {
        // Only skip if we're navigating to the same path
        if (from && to.path === from.path) return;
        
        // Handle navigation to main pages - reset form
        if (to.path === '/fix/article' || to.path === '/fix/journal' || to.path === '/fix/contact') {
          // Only reset form if we're coming from a different path (not on initial load)
          if (from) {
            this.resetForm();
          }
          return;
        }
        
        // Handle DOI routes
        const doiWorkMatch = to.path.match(/^\/fix\/article\/([^/]+)(?:\/([^/]+))?/);
        if (doiWorkMatch) {
          // Compose DOI from prefix/suffix
          let doi = doiWorkMatch[1];
          if (doiWorkMatch[2]) doi += '/' + doiWorkMatch[2];
          
          // Check if we already have this data loaded
          if (this.documentData && this.documentType === 'doi' && this.documentData.doi === doi) {
            return;
          }
          
          // Load the DOI data
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
            this.initialLoading = false;
            this.loading = false;
          } else {
            // No test data, make the API call
            this.loading = true;
            this.error = null;
            this.docId = this.normalizeDOI(doi);
            this.documentType = 'doi'; // Set document type before getting API URL
            
            const apiUrl = this.getApiUrl();
            if (!apiUrl) {
              // If getApiUrl returned empty string, it already set the loadError
              this.loading = false;
              this.initialLoading = false;
              return;
            }
            
            axios.get(apiUrl)
              .then(response => {
                this.documentData = response.data;
                this.documentType = 'doi';
                this.rawApiResponse = response.data;
                this.successMessage = null;
                this.resetCorrections();
              })
              .catch(error => {
                this.loadError = error.response && error.response.data && error.response.data.message 
                  ? error.response.data.message 
                  : 'Error loading article data. Please check the DOI and try again.';
                this.documentData = null;
                this.documentType = null;
              })
              .finally(() => {
                this.loading = false;
                this.initialLoading = false;
              });
          }
          return;
        }
        
        // Handle ISSN routes
        const journalMatch = to.path.match(/^\/fix\/journal\/([^/]+)/);
        if (journalMatch) {
          const issn = journalMatch[1];
          
          // Check if we already have this data loaded
          if (this.documentData && this.documentType === 'journal' && this.documentData.issn_l === issn) {
            return;
          }
          
          // Load the ISSN data
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
            this.initialLoading = false;
            this.loading = false;
          } else {
            // No test data, make the API call
            this.loading = true;
            this.error = null;
            this.docId = issn.trim();
            this.documentType = 'journal'; // Set document type before getting API URL
            
            const apiUrl = this.getApiUrl();
            if (!apiUrl) {
              // If getApiUrl returned empty string, it already set the loadError
              this.loading = false;
              this.initialLoading = false;
              return;
            }
            
            axios.get(apiUrl)
              .then(response => {
                this.documentData = response.data;
                this.documentType = 'journal';
                this.rawApiResponse = response.data;
                this.successMessage = null;
                this.resetCorrections();
              })
              .catch(error => {
                this.loadError = error.response && error.response.data && error.response.data.message 
                  ? error.response.data.message 
                  : 'Error loading journal data. Please check the ISSN and try again.';
                this.documentData = null;
                this.documentType = null;
              })
              .finally(() => {
                this.loading = false;
                this.initialLoading = false;
              });
          }
        }
      },
      immediate: true
    }
  },
  created() {
    // No need to handle initial route setup here anymore
    // The $route watcher will handle it with immediate: true
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
  padding-top: 80px;
}
.corrections-content {
  padding-right: 15px; 
  position: relative;
}
.corrections-nav-tabs {
  padding-top: 0px;
  margin-top: -55px;
}
.corrections-initial-step-card {
  min-height: 140px;
}
.vertical-tab-list {
  display: flex;
  flex-direction: column;
}
.vertical-tab-header {
  padding: 0px 30px 15px 30px;
  margin-right: 70px;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid #ddd;
  margin-bottom: 15px;
}
.vertical-tab-item {
  cursor: pointer;
  padding: 10px 30px 10px 30px;
  margin-right: 70px;
  font-size: 14px;
  color: #333;
  border-top-right-radius: 22px;
  border-bottom-right-radius: 22px;
}
.vertical-tab-item .v-icon,
.vertical-tab-header .v-icon {
  margin-top: -2px;
  width: 12px;
}
.vertical-tab-item.active,
.vertical-tab-item.active:hover {
  background-color: #ddd;
}
.vertical-tab-item:hover {
  background-color: #eee;
}
.corrections-tab-col {
  width: 180px;
  border-radius: none !important;
}
.back-button {
  position: absolute;
  top: -20px;
  left: -10px;
}
h1 {
  text-align: left;
  margin: 0px;
}
.page-subtitle {
  font-size: 15px;
  color: #666;
  margin-top: 0px;
}
.breadcrumbs-container {
  position: absolute;
  top: -30px;
  left: 0;
  width: 100%;
  z-index: 1;
  display: none;
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
  padding: 5px 10px !important;
  letter-spacing: normal !important;
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
.subcard + .subcard {
  border-top: 1px solid #ddd;
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
  padding-left: 0px !important;
  margin: 10px 0px 20px 0px;
  list-style-type: none;
}
.changes-list li {
  font-size: 24px;
}
.emoji-icon {
  margin-right: 5px;
  font-size: 24px;
}
.inner-header {
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