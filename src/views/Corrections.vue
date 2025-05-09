<template>
  <div class="page corrections">
    <h1>Fix Unpaywall Errors</h1>

    <div class="page-subtitle">
      <div v-if="successMessage" class="mt-4">
        <v-alert type="success" dense>{{ successMessage }}</v-alert>
      </div>
      <div v-else-if="!documentData">Sometimes, Unpaywall makes errors. You can fix them here. Corrections will show up in a few days.</div>
    </div> 

    <!-- Loading Card -->
    <v-card v-if="(loading || initialLoading) && !documentData" class="pa-6 light-grey text-center">
      <v-card-text>
        <v-progress-linear
          indeterminate
          color="primary"
        ></v-progress-linear>
      </v-card-text>
    </v-card>

    <!-- Cards with Data -->
    <template v-else>
      <!-- Test Controls Card (positioned absolutely) -->
      <v-card v-if="!documentData" class="test-controls-card pa-4">
        <div class="text-body-2 mb-2">Test DOIs</div>
        <v-card-text class="pa-0">
          <v-btn
            block
            small
            color="primary"
            class="mb-2"
            @click="getRandomDOI"
          >Random DOI</v-btn>
          
          <div>
            <div class="d-flex flex-column">
              <v-btn
                v-for="doi in testDOIs"
                :key="doi.value"
                block
                small
                color="primary"
                class="mb-2 text-none"
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
            color="primary"
            @click="getRandomJournal"
            class="mb-2"
          >Random ISSN</v-btn>

          <div>
            <div class="d-flex flex-column">
              <v-btn
                v-for="issn in testISSNs"
                :key="issn.value"
                block
                small
                color="primary"
                class="mb-2 text-none"
                @click="loadTestISSN(issn.value)"
              >
                {{ issn.text }} ISSN
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Step 1: Retrieve Document Metadata -->
      <v-card v-if="loadError" class="pa-6 light-grey error text-center">
        <div>{{ loadError }}</div>
        <v-btn color="primary" @click="retryLoad">Retry</v-btn>
        <v-btn text @click="resetForm">Start Over</v-btn>
      </v-card>

      <v-card v-else-if="!documentData" class="pa-6 light-grey">
        <v-row>
          <v-col v-if="!showJournalOnly" :cols="showDoiOnly ? 12 : 6">
            <!-- DOI Section -->
            <v-card outlined class="pa-8 main-card">
              <v-row><div class="correct-label">Fix a DOI</div></v-row>
              <v-row>
                <v-text-field
                  v-model="doiInput"
                  label="Enter DOI"
                  placeholder="10.1016/j.cell.2007.11.019"
                  outlined
                  dense
                  hide-details
                  class="mr-2"
                ></v-text-field>
                <v-btn
                  color="primary"
                  @click="submitDOI"
                >Submit</v-btn>
              </v-row>
            </v-card>
          </v-col>
        
          <v-col v-if="!showDoiOnly" :cols="showJournalOnly ? 12 : 6">
            <!-- Journal Section -->
            <v-card outlined class="pa-8 main-card">
              <v-row><div class="correct-label">Fix a Journal</div></v-row>
              <v-row>
                <v-text-field
                  v-model="issnInput"
                  label="Enter ISSN"
                  placeholder="1234-5678"
                  outlined
                  dense
                  hide-details
                  class="mr-2"
                ></v-text-field>
                <v-btn
                  color="primary"
                  @click="submitISSN"
                >Submit</v-btn>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="primary"
          class="mt-8"
        ></v-progress-linear>
      </v-card>
      <!-- Step 2+ Main Card with Fixed Header and Subcards -->
      <template v-if="documentData">      
        <!-- Main Card for Step 2+ -->
        <v-card class="pa-4 mb-4 light-grey">

          <div class="mb-4">
            <!-- DOI Display Header -->
            <div v-if="documentType === 'doi'">
              <div class="d-flex justify-space-between align-center">
                <div class="document-title">{{ documentData.title }}</div>
              </div>
              <div class="subtitle-2 mb-2">
                <a :href="documentData.doi_url" target="_blank">{{ documentData.doi }}</a>
                <span class="mx-1" style="color: #999;">|</span>
                <a :href="getApiUrl()" target="_blank">API</a>
              </div>
            </div>

            <!-- Journal Display Header -->
            <div v-if="documentType === 'journal'">
              <div class="d-flex justify-space-between align-center">
                <div class="document-title">{{ documentData.display_name }}</div>
              </div>
              <div class="subtitle-2">
                {{ documentData.issn_l }}
                <span class="mx-1" style="color: #999;">|</span>
                <a :href="getApiUrl()" target="_blank">API</a>
              </div>

            </div>
            
          </div>
          
          <!-- Subcard for Step 2 (Edit Fields) -->
          <v-card v-if="!showAdditionalForm && !showReviewSection && !showSubmissionPreview" flat outlined class="pa-4 mb-4">
            <!-- DOI Subcard -->
            <div v-if="documentType === 'doi'">
              <template v-if="documentData.is_oa">
                <div class="mb-1">
                  Unpaywall thinks this work is <span class="status open">free to read</span>
                  <template v-if="getBestOALocationUrl() && documentData.best_oa_location && documentData.best_oa_location.host_type">
                    at {{ documentData.best_oa_location.host_type === 'publisher' ? 'the publisher' : 'a repository' }}:
                  </template>
                </div>
                <div v-if="getBestOALocationUrl()" class="url mb-3">
                  <a :href="getBestOALocationUrl()" target="_blank">{{ getBestOALocationUrl() }}</a>
                </div>
              </template>
              <template v-else>
                <div class="mb-2">
                  Unpaywall thinks this work is <span class="status closed">paywalled</span>.
                </div>
              </template>
            </div>

            <!-- Journal Subcard -->
            <div v-if="documentType === 'journal'">
              <template v-if="documentData.is_oa">
                <div class="mb-2">
                  Unpaywall thinks this journal is <span class="status open">open access</span>.
                </div>
              </template>
              <template v-else>
                <div class="mb-2">
                  Unpaywall thinks this journal is <span class="status closed">closed access</span>.
                </div>
              </template>
            </div>
          </v-card>

          <!-- Subcard Action Buttons -->
          <div v-if="!showAdditionalForm && !showReviewSection && !showSubmissionPreview" class="subcard-actions d-flex flex-column align-end">
            <!-- DOI Actions -->
            <template v-if="documentType === 'doi'">
              <template v-if="documentData.is_oa">
                <v-btn
                  small
                  color="red lighten-2"
                  dark
                  class="mr-2 text-none"
                  @click="handleCorrection('Remove', 'best_oa_location.url')"
                >
                  No, this link is paywalled
                </v-btn>
                <v-btn
                  small
                  plain
                  class="text-none mt-1"
                  @click="handleCorrection('Correct', 'best_oa_location.url')"
                >
                  Yes, but this link is wrong
                </v-btn>
              </template>
              <template v-else>
                <v-btn
                  small
                  color="green lighten-2"
                  dark
                  class="text-none"
                  @click="handleCorrection('Add', 'best_oa_location.url')"
                >
                  No, it's free to read
                </v-btn>
              </template>
            </template>
            <!-- Journal Actions -->
            <template v-if="documentType === 'journal'">
              <template v-if="documentData.is_oa">
                <v-btn
                  small
                  color="red lighten-2"
                  dark
                  class="text-none"
                  @click="handleCorrection('Close', 'is_oa')"
                >
                  No, this journal is closed access
                </v-btn>
              </template>
              <template v-else>
                <v-btn
                  small
                  color="green lighten-2"
                  dark
                  class="text-none"
                  @click="handleCorrection('Open', 'is_oa')"
                >
                  No, this journal is open access
                </v-btn>
              </template>
            </template>
          </div>
          
          <!-- Subcard for Step 3 (Additional Information) -->
          <v-card v-if="showAdditionalForm" flat outlined class="pa-4 mb-4">
            <!-- DOI Location Form -->
            <div v-if="documentType === 'doi' && (corrections.action === 'Add' || corrections.action === 'Correct') && corrections.field === 'best_oa_location.url'">
              <div class="inner-header">{{ corrections.action === 'Add' ? 'What URL gives free access to this work?' : "What's the correct link for this work?" }}</div>
              
              <v-form ref="locationForm" v-model="locationFormValid">
                <v-text-field
                  v-model="locationForm.url"
                  :rules="[v => !!v || 'URL is required', urlRule]"
                  outlined
                  dense
                  autofocus
                  hide-details
                  required
                ></v-text-field>
                
                <div class="d-flex justify-space-between align-center mt-2">
                  <v-radio-group v-model="locationForm.host_type" row dense hide-details class="radio-group">
                    <v-radio label="Publisher" value="publisher"></v-radio>
                    <v-radio label="Repository" value="repository"></v-radio>
                  </v-radio-group>
                </div>
              </v-form>
            </div>

            <!-- Journal Open Access Status Form -->
            <div v-if="documentType === 'journal' && corrections.action === 'Open' && corrections.field === 'is_oa'">
              <div class="inner-header">In what year did this journal become open access?</div>
              
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
                        ></v-text-field>
                      </div>
                    </template>
                  </v-radio>
                  <v-radio :value="true" label="This journal has always been open access."></v-radio>
                </v-radio-group>
                
              </v-form>
            </div>
          </v-card>
          <div v-if="showAdditionalForm" class="text-right">
            <v-btn
              v-if="documentType === 'doi' && (corrections.action === 'Add' || corrections.action === 'Correct') && corrections.field === 'best_oa_location.url'"
              color="primary"
              @click="moveToReviewStep"
              :disabled="!locationFormValid"
            >
              Save
            </v-btn>
            <v-btn
              v-if="documentType === 'journal' && corrections.action === 'Open' && corrections.field === 'is_oa'"
              color="primary"
              @click="moveToReviewStep"
              :disabled="!journalFormValid"
            >
              Save
            </v-btn>
          </div>

          <!-- Subcard for Step 4 (Review Changes) -->
          <v-card v-if="showReviewSection" flat outlined class="pa-4 mb-4">
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

            <div class="inner-header">Optionally add your email in case we need to follow up:</div>

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
          </v-card>

          <div v-if="showReviewSection" class="text-right">
            <v-btn
              color="primary"
              @click="submitCorrection"
              :disabled="!canSubmit"
              class="submit-btn"
            >Submit Correction</v-btn>
            <div v-if="submitError" class="error--text mt-2">{{ submitError }}</div>
          </div>

        </v-card>
        <!-- Back Button -->
        <v-btn color="primary" small text class="" @click="resetForm">
          ← Start Over
        </v-btn>
      </template>
    </template>
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
      successMessage: null,
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
        newValue: null
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
      currentStep: 1,
      showSubmissionPreview: false,
      forceShowReviewSection: false
    }
  },
  computed: {
    showAdditionalForm() {
      // Never show the additional form if we're forcing the review section
      if (this.forceShowReviewSection) return false;
      
      // Show additional form if we have a correction that requires more info
      if (!this.corrections.action || !this.corrections.field) return false;
      
      if (this.documentType === 'doi') {
        return (this.corrections.action === 'Add' || this.corrections.action === 'Correct') && 
               this.corrections.field === 'best_oa_location.url';
      } else if (this.documentType === 'journal') {
        return this.corrections.action === 'Open' && this.corrections.field === 'is_oa';
      }
      
      return false
    },
    showReviewSection() {
      // Never show review section if additional form is showing
      if (this.showAdditionalForm) return false;
      
      // If the force flag is set, show the review section
      if (this.forceShowReviewSection) return true;
      
      // Show review section if we have a correction and any required additional info
      if (!this.corrections.action || !this.corrections.field) return false;
      
      // If no additional form is needed, show review immediately
      return true;
    },
    showHostTypeRow() {
      return this.documentType === 'doi' && 
             (this.corrections.action === 'Add' || this.corrections.action === 'Correct') && 
             this.corrections.field === 'best_oa_location.url';
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
    updateUrlState() {
      if (!this.documentData) return;
      
      let path;
      if (this.documentType === 'doi') {
        let doi = this.documentData.doi;
        let doiPrefix = doi;
        let doiSuffix = '';
        const slashIndex = doi.indexOf('/');
        if (slashIndex !== -1) {
          doiPrefix = doi.substring(0, slashIndex);
          doiSuffix = doi.substring(slashIndex + 1);
        }
        path = `/fix/work/${doiPrefix}`;
        if (doiSuffix) path += `/${doiSuffix}`;
      } else if (this.documentType === 'journal') {
        path = `/fix/journal/${this.documentData.issn_l}`;
      }
      
      // Only update if the path is different from current
      if (path && this.$route.path !== path) {
        this.$router.push(path);
      }
    },
    normalizeDOI(doi) {
      // Remove any https://doi.org/ prefix
      return doi.replace(/^https?:\/\/doi\.org\//i, '')
    },
    submitDOI() {
      if (!this.doiInput) {
        this.error = 'Please enter a DOI'
        return
      }
      
      this.loading = true
      this.error = null
      this.loadError = null
      
      const normalizedDOI = this.normalizeDOI(this.doiInput)
      const apiUrl = `https://api.openalex.org/unpaywall/${normalizedDOI}`
      axios.get(apiUrl)
        .then(resp => {
          if (!resp.data || Object.keys(resp.data).length === 0) {
            this.loadError = 'No data found for this DOI.';
            this.documentData = null;
          } else {
            this.documentData = resp.data;
            this.documentType = 'doi';
            this.successMessage = null;
          }
          this.loading = false
          this.initialLoading = false
        })
    },    
    submitISSN() {
      if (!this.issnInput) {
        this.error = 'Please enter an ISSN'
        return
      }
      
      this.loading = true
      this.error = null
      
      axios.get(`https://api.openalex.org/sources/issn:${this.issnInput}`)
        .then(response => {
          this.documentData = response.data;
          this.documentType = 'journal';
          this.rawApiResponse = response.data;
          this.successMessage = null;
          this.resetCorrections();
          this.updateUrlState();
        })
        .catch(err => {
          this.error = `Error fetching Journal: ${err.message}`;
        })
        .finally(() => {
          this.loading = false;
          this.initialLoading = false;
        })
    },
    getRandomDOI() {
      this.loading = true;
      this.error = null;
      
      axios.get('https://api.openalex.org/works?filter=indexed_in:crossref&sample=1')
        .then(response => {
          const doi = response.data.results[0].doi;
          this.doiInput = doi;
          const normalizedDOI = this.normalizeDOI(doi);
          return axios.get(`https://api.openalex.org/unpaywall/${normalizedDOI}`);
        })
        .then(response => {
          // Set the document data to move to step 2
          this.documentData = response.data;
          this.documentType = 'doi';
          this.rawApiResponse = response.data;
          this.successMessage = null;
          this.resetCorrections();
          this.updateUrlState();
        })
        .catch(err => {
          this.error = `Error fetching random DOI: ${err.message}`
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
          this.updateUrlState();
        })
        .catch(err => {
          this.error = `Error fetching random journal: ${err.message}`
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
        const testData = testDoiData[doiValue];
        if (testData) {
          this.documentData = testData;
          this.documentType = 'doi';
          this.rawApiResponse = testData;
          this.successMessage = null;
          this.resetCorrections();
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
        const testData = testDoiData[issnValue];
        if (testData) {
          this.documentData = testData;
          this.documentType = 'journal';
          this.rawApiResponse = testData;
          this.successMessage = null;
          this.resetCorrections();
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
      if (this.documentType === 'doi') {
        return `https://api.openalex.org/unpaywall/${this.documentData.doi}`;
      } else if (this.documentType === 'journal') {
        return `https://api.openalex.org/sources/issn:${this.documentData.issn_l}`;
      }
      return '#';
    },    
    getBestOALocationUrl() {
      if (!this.documentData) return null;
      if (!this.documentData.best_oa_location) return null;
      return this.documentData.best_oa_location.url;
    },
    handleCorrection(action, field) {
      this.resetCorrections();
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
    },
    resetCorrections() {
      this.corrections = {
        action: null,
        field: null,
        newValue: null
      }
      this.showSubmissionPreview = false
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
      // const apiHost = "http://localhost:5006/corrections"
      const apiHost = "https://corrections.openalex.org/corrections"
      
      this.submitError = null;
      try {
        const payload = this.generatePostData();
        axios.post(apiHost, payload);
        this.successMessage =
          "Your correction has been received and will be reviewed within a few days. Thank you for your help.";
        this.resetForm();
      } catch (e) {
        // Avoid optional chaining for compatibility
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
    moveToReviewStep() {
      // This method is called when the user clicks the Save button in step 3
      // Simply set a flag to show the review section instead of the form
      this.forceShowReviewSection = true
    },
    resetForm() {
      this.documentData = null;
      this.documentType = null;
      this.rawApiResponse = null;
      this.resetCorrections();
      this.doiInput = '';
      this.issnInput = '';
      this.selectedTestDOI = null;
      this.forceShowReviewSection = false;
      this.loading = false;
      this.initialLoading = false;
      if (this.$route.path !== '/fix') {
        this.$router.push('/fix');
      }
    }
  },
  watch: {
    // Watch for browser navigation (forward/back)
    $route(to, from) {
      // Only react if the path actually changes
      if (to.path !== from.path) {
        // Example: /fix/work/:prefix/:suffix or /fix/journal/:issn
        const doiWorkMatch = to.path.match(/^\/fix\/work\/([^\/]+)(?:\/([^\/]+))?/);
        const journalMatch = to.path.match(/^\/fix\/journal\/([^\/]+)/);
        if (doiWorkMatch) {
          // Compose DOI from prefix/suffix
          let doi = doiWorkMatch[1];
          if (doiWorkMatch[2]) doi += '/' + doiWorkMatch[2];
          if (doi !== this.doiInput) {
            this.doiInput = doi;
            this.issnInput = '';
            this.initialLoading = true;
            this.loadError = null;
            this.submitDOI();
          }
        } else if (journalMatch) {
          const issn = journalMatch[1];
          if (issn !== this.issnInput) {
            this.issnInput = issn;
            this.doiInput = '';
            this.initialLoading = true;
            this.loadError = null;
            this.submitISSN();
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
}
</script>


<style scoped>
.correct-label {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
}
.submit-btn {
  height: 40px !important;
}
.corrections {
  max-width: 800px;
  margin: 0 auto;
}
.v-card.light-grey {
  background-color: #edf0ed;
}
.document-title {
  font-size: 18px;
  font-weight: 500;
}
.status {
  font-weight: bold;
  font-size: 20px;
}
.status.open {
  color: green;
}
.status.closed {
  color: red;
} 
.url {
  font-size: 16px;
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
.test-controls-card {
  position: absolute;
  left: -220px;
  top: -30px;
  width: 150px;
  z-index: 1;
}
h1 {
  text-align: left;
  margin-bottom: 0px;
}
.page-subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 25px;
}
.page.corrections {
  position: relative;
}
h2 {
  margin: 5px 0;
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>