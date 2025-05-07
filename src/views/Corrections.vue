<template>
  <div class="page corrections">
    <h1>Unpaywall Corrections</h1>

    <!-- Test Controls Card (positioned absolutely) -->
    <v-card v-if="!documentData" class="test-controls-card pa-4 light-grey">
      <div class="text-body-2 mb-2">Test Controls</div>
      <v-card-text class="pa-0">
        <v-btn
          block
          small
          color="primary"
          class="mb-4"
          @click="getRandomDOI"
          :loading="loading"
          :disabled="loading"
        >Random DOI</v-btn>
        
        <v-select
          v-model="selectedTestDOI"
          label="Test DOIs"
          class="mb-4"
          :items="testDOIs"
          outlined
          dense
          hide-details
          @change="loadTestDOI"
          :disabled="loading"
          style="background-color: white;"
        ></v-select>
        
        <v-btn
          block
          small
          color="primary"
          @click="getRandomJournal"
          :loading="loading"
          :disabled="loading"
          class="mb-4"
        >Random ISSN</v-btn>
        
        <v-select
          v-model="selectedTestISSN"
          label="Test ISSNs"
          :items="testISSNs"
          outlined
          dense
          hide-details
          @change="loadTestISSN"
          :disabled="loading"
          style="background-color: white;"
        ></v-select>
      </v-card-text>
    </v-card>

    <!-- Step 1: Retrieve Document Metadata -->
    <v-card v-if="!documentData" class="pa-6 light-grey">
      <v-row v-if="!documentData">
        <v-col cols="6">
          <!-- DOI Section -->
          <v-card outlined class="pa-8 main-card">
            <v-row><div class="correct-label">Correct a DOI</div></v-row>
            <v-row>
              <v-text-field
                v-model="doiInput"
                label="Enter DOI"
                placeholder="10.1234/example"
                outlined
                hide-details
                dense
              ></v-text-field>
              <v-btn
                color="primary"
                @click="submitDOI"
                :loading="loading"
                :disabled="loading"
                class="ml-1 submit-btn"
              >Submit</v-btn>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="6">
          <!-- Journal Section -->
          <v-card outlined class="pa-8 main-card">
            <v-row><div class="correct-label">Correct a Journal</div></v-row>
            <v-row>
              <v-text-field
                v-model="issnInput"
                label="Enter ISSN"
                placeholder="1234-5678"
                outlined
                hide-details
                dense
              ></v-text-field>
              <v-btn
                color="primary"
                @click="submitISSN"
                :loading="loading"
                :disabled="loading"
                class="ml-1 submit-btn"
              >Submit</v-btn>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- Error Alert -->
    <v-alert
      v-if="error"
      type="error"
      dismissible
      @input="error = null"
    >
      {{ error }}
    </v-alert>

    <!-- Step 2+ Main Card with Fixed Header and Subcards -->
    <div v-if="documentData">      
      <!-- Main Card for Step 2+ -->
      <v-card class="pa-4 mb-4 light-grey">
        <!-- Fixed Header Area -->
        <div class="mb-4">
          <!-- DOI Display Header -->
          <div v-if="documentType === 'doi'">
            <div class="d-flex justify-space-between">
              <h2>{{ documentData.title }}</h2>
              <v-btn
                small
                icon
                color="primary"
                :href="getApiUrl()"
                target="_blank"
              >API
              </v-btn>
            </div>
            
            <div class="subtitle-2 mb-3">
              <a :href="documentData.doi_url" target="_blank">{{ documentData.doi }}</a>
              
              <v-chip
                :color="documentData.is_oa ? 'green' : 'red'"
                text-color="white"
                small
                class="ml-2"
              >
                {{ documentData.is_oa ? 'Open Access' : 'Closed Access' }}
              </v-chip>  
            </div>
          </div>

          <!-- Journal Display Header -->
          <div v-if="documentType === 'journal'">
            <div class="d-flex justify-space-between">
              <h2>{{ documentData.display_name }}</h2>
              <v-btn
                small
                icon
                color="primary"
                :href="getApiUrl()"
                target="_blank"
              >API
              </v-btn>
            </div>
            
            <div class="subtitle-1 mb-3">
              {{ documentData.issn_l }}
              
              <v-chip
                :color="documentData.is_oa ? 'green' : 'red'"
                text-color="white"
                small
                class="ml-2"
              >
                {{ documentData.is_oa ? 'Open Access' : 'Closed Access' }}
              </v-chip>
            </div>
          </div>
          
        </div>
        
        <!-- Subcard for Step 2 (Edit Fields) -->
        <v-card v-if="!showAdditionalForm && !showReviewSection && !showSubmissionPreview" flat outlined class="pa-4 mb-4">
          <!-- DOI Edit Options -->
          <div v-if="documentType === 'doi'">
            <div class="subtitle-1 d-flex align-center">
              <span>Open Access Link:</span>
              <v-btn
                v-if="!getBestOALocationUrl()"
                small
                color="green"
                dark
                class="ml-2"
                @click="handleCorrection('Add', 'best_oa_location.url')"
              >
                Add URL
              </v-btn>
              <v-icon v-if="corrections.action === 'Add' && corrections.field === 'best_oa_location.url'" color="green" class="ml-2">mdi-check</v-icon>
            </div>
            
            <div v-if="getBestOALocationUrl()" class="mb-2">
              <a :href="getBestOALocationUrl()" target="_blank">{{ getBestOALocationUrl() }}</a>
            </div>
            
            <div v-if="getBestOALocationUrl()" class="mt-2">
              <v-btn
                small
                color="red"
                dark
                class="mr-2"
                @click="handleCorrection('Remove', 'best_oa_location.url')"
              >
                Report Bad URL
              </v-btn>
              <v-icon v-if="corrections.action === 'Remove' && corrections.field === 'best_oa_location.url'" color="red" class="ml-1">mdi-check</v-icon>

              <v-btn
                small
                color="orange"
                dark
                @click="handleCorrection('Correct', 'best_oa_location.url')"
              >
                Correct URL
              </v-btn>
              <v-icon v-if="corrections.action === 'Correct' && corrections.field === 'best_oa_location.url'" color="orange" class="ml-1 mr-2">mdi-check</v-icon>
            </div>
          </div>

          <!-- Journal Edit Options -->
          <div v-if="documentType === 'journal'">
            <div class="d-flex align-center">
              <v-btn
                small
                :color="documentData.is_oa ? 'red' : 'green'"
                dark
                @click="handleCorrection(documentData.is_oa ? 'Close' : 'Open', 'is_oa')"
              >
                {{ documentData.is_oa ? 'Report Closed' : 'Report Open Access' }}
              </v-btn>
              <v-icon v-if="corrections.action && corrections.field === 'is_oa'" :color="documentData.is_oa ? 'red' : 'green'" class="ml-2">mdi-check</v-icon>
            </div>
          </div>
        </v-card>
        
        <!-- Subcard for Step 3 (Additional Information) -->
        <v-card v-if="showAdditionalForm" flat outlined class="pa-4 mb-4">
          <!-- DOI Location Form -->
          <div v-if="documentType === 'doi' && (corrections.action === 'Add' || corrections.action === 'Correct') && corrections.field === 'best_oa_location.url'">
            <div class="inner-header">{{ corrections.action === 'Add' ? 'New Open Access Link' : 'Correct Open Access Link' }}</div>
            <p v-if="corrections.action === 'Add'" class="subtitle-1">Please provide details for location where this article can be freely found online.</p>
            
            <v-form ref="locationForm" v-model="locationFormValid">
              <v-text-field
                v-model="locationForm.url"
                label="URL"
                :rules="[v => !!v || 'URL is required', urlRule]"
                outlined
                dense
                hide-details
                required
              ></v-text-field>
              
              <div class="d-flex justify-space-between align-center mt-2">
                <v-radio-group v-model="locationForm.host_type" row dense hide-details class="radio-group">
                  <v-radio label="Publisher" value="publisher"></v-radio>
                  <v-radio label="Repository" value="repository"></v-radio>
                </v-radio-group>
                
                <v-btn
                  color="primary"
                  @click="moveToReviewStep"
                  :disabled="!locationFormValid"
                >
                  Save
                </v-btn>
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
              
              <div class="text-right">
                <v-btn
                  color="primary"
                  @click="moveToReviewStep"
                  :disabled="!journalFormValid"
                >
                  Save
                </v-btn>
              </div>
            </v-form>
          </div>
        </v-card>

        <!-- Subcard for Step 4 (Review Changes) -->
        <v-card v-if="showReviewSection" flat outlined class="pa-4 mb-4">
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
          
          <div class="email-label mt-6">Add your email in case we need to follow up (optional:)</div>

          <v-row no-gutters class="mt-1 justify-space-between">
            <v-text-field
              v-model="email"
              placeholder="email@example.com"
              outlined
              hide-details
              dense
              class="mr-2"
              style="max-width: 260px;"
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
        </div>

        <!-- Subcard for Step 5 (Submission Preview) -->
        <v-card v-if="showSubmissionPreview" flat outlined class="pa-4 mb-4">
          <h3>Correction Submission Preview</h3>
          <div class="subtitle-2 mt-2">The following JSON POST would be sent to the API:</div>
          
          <div class="pa-4 mt-2 grey lighten-4">
            <pre>{{ generatePatchJSON() }}</pre>
          </div>
        </v-card>
      </v-card>
      <!-- Back Button -->
      <v-btn color="primary" small text class="" @click="resetForm">
        ← Start Over
      </v-btn>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import testDoiData from '../test-doi-data.json'

export default {
  name: 'Corrections',
  data() {
    return {
      // Input fields
      doiInput: '',
      issnInput: '',
      selectedTestDOI: null,
      email: '',
      // Data states
      loading: false,
      error: null,
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
      if (this.forceShowReviewSection) return false
      
      // Show additional form if we have a correction that requires more info
      if (!this.corrections.action || !this.corrections.field) return false
      
      if (this.documentType === 'doi') {
        return (this.corrections.action === 'Add' || this.corrections.action === 'Correct') && 
               this.corrections.field === 'best_oa_location.url'
      } else if (this.documentType === 'journal') {
        return this.corrections.action === 'Open' && this.corrections.field === 'is_oa'
      }
      
      return false
    },
    showReviewSection() {
      // Never show review section if additional form is showing
      if (this.showAdditionalForm) return false
      
      // If the force flag is set, show the review section
      if (this.forceShowReviewSection) return true
      
      // Show review section if we have a correction and any required additional info
      if (!this.corrections.action || !this.corrections.field) return false
      
      // If no additional form is needed, show review immediately
      return true
    },
    showHostTypeRow() {
      return this.documentType === 'doi' && 
             (this.corrections.action === 'Add' || this.corrections.action === 'Correct') && 
             this.corrections.field === 'best_oa_location.url'
    },    
    showOADateRow() {
      return this.documentType === 'journal' && 
             this.corrections.action === 'Open' && 
             this.corrections.field === 'is_oa'
    },    
    canSubmit() {
      // Can submit if we have a correction and all required additional info
      return this.corrections.action && this.corrections.field
    }
  },
  
  methods: {
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
      
      const normalizedDOI = this.normalizeDOI(this.doiInput)
      axios.get(`https://api.openalex.org/unpaywall/${normalizedDOI}`)
        .then(response => {
          this.documentData = response.data
          this.documentType = 'doi'
          this.rawApiResponse = response.data
          this.resetCorrections()
        })
        .catch(err => {
          this.error = `Error fetching DOI: ${err.message}`
        })
        .finally(() => {
          this.loading = false
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
          this.documentData = response.data
          this.documentType = 'journal'
          this.rawApiResponse = response.data
          this.resetCorrections()
        })
        .catch(err => {
          this.error = `Error fetching Journal: ${err.message}`
        })
        .finally(() => {
          this.loading = false
        })
    },
    getRandomDOI() {
      this.loading = true
      this.error = null
      
      axios.get('https://api.openalex.org/works?filter=indexed_in:crossref&sample=1')
        .then(response => {
          const doi = response.data.results[0].doi
          this.doiInput = doi
          
          // Get the normalized DOI
          const normalizedDOI = this.normalizeDOI(doi)
          
          // Fetch the DOI data directly instead of calling submitDOI
          return axios.get(`https://api.openalex.org/unpaywall/${normalizedDOI}`)
        })
        .then(response => {
          // Set the document data to move to step 2
          this.documentData = response.data
          this.documentType = 'doi'
          this.rawApiResponse = response.data
          this.resetCorrections()
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
          this.documentData = response.data
          this.documentType = 'journal'
          this.rawApiResponse = response.data
          this.resetCorrections()
        })
        .catch(err => {
          this.error = `Error fetching random journal: ${err.message}`
        })
        .finally(() => {
          this.loading = false
        })
    },
    loadTestDOI() {
      if (!this.selectedTestDOI) return
      
      // For development purposes, load from test data
      this.loading = true
      
      try {
        const testData = testDoiData[this.selectedTestDOI]
        if (testData) {
          this.documentData = testData
          this.documentType = 'doi'
          this.rawApiResponse = testData
          this.resetCorrections()
        } else {
          this.error = 'Test DOI data not found'
        }
      } catch (err) {
        this.error = `Error loading test DOI: ${err.message}`
      } finally {
        this.loading = false
      }
    },
    
    loadTestISSN() {
      if (!this.selectedTestISSN) return
      
      // For development purposes, load from test data
      this.loading = true
      
      try {
        const testData = testDoiData[this.selectedTestISSN]
        if (testData) {
          this.documentData = testData
          this.documentType = 'journal'
          this.rawApiResponse = testData
          this.resetCorrections()
        } else {
          this.error = 'Test ISSN data not found'
        }
      } catch (err) {
        this.error = `Error loading test ISSN: ${err.message}`
      } finally {
        this.loading = false
      }
    },    
    getApiUrl() {
      if (this.documentType === 'doi') {
        return `https://api.openalex.org/unpaywall/${this.documentData.doi}`
      } else if (this.documentType === 'journal') {
        return `https://api.openalex.org/sources/issn:${this.documentData.issn_l}`
      }
      return '#'
    },    
    getBestOALocationUrl() {
      if (!this.documentData) return null
      if (!this.documentData.best_oa_location) return null
      return this.documentData.best_oa_location.url
    },
    handleCorrection(action, field) {
      // Reset any previous corrections
      this.resetCorrections()
      
      // Set the new correction
      this.corrections.action = action
      this.corrections.field = field
      
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
      const pattern = /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?#].*)?$/
      return pattern.test(value) || 'Enter a valid URL'
    },
    submitCorrection() {
      // In a real implementation, this would send data to the API
      // For now, just show the preview
      this.showSubmissionPreview = true
    },    
    generatePatchJSON() {
      const patch = {
        type: this.documentType,
        email: this.email || null
      }
      
      if (this.documentType === 'doi') {
        // Add the DOI as the id
        patch.id = this.documentData.doi
        
        if (this.corrections.field === 'best_oa_location.url') {
          if (this.corrections.action === 'Add' || this.corrections.action === 'Correct') {
            patch.best_oa_location = {
              url: this.locationForm.url,
              host_type: this.locationForm.host_type
            }
          } else if (this.corrections.action === 'Remove') {
            patch.best_oa_location = null
          }
        }
      } else if (this.documentType === 'journal') {
        // Add the ISSN_L as the id
        patch.id = this.documentData.issn_l
        
        if (this.corrections.field === 'is_oa') {
          patch.is_oa = this.corrections.action === 'Open'
          
          if (this.corrections.action === 'Open') {
            // If the journal has always been open access, set oa_date to null
            // Otherwise, use the specified year
            patch.oa_date = this.journalForm.alwaysOA ? null : this.journalForm.oa_date
          }
        }
      }
      
      return JSON.stringify(patch, null, 2)
    },    
    moveToReviewStep() {
      // This method is called when the user clicks the Save button in step 3
      // Simply set a flag to show the review section instead of the form
      this.forceShowReviewSection = true
    },
    resetForm() {
      this.documentData = null
      this.documentType = null
      this.rawApiResponse = null
      this.resetCorrections()
      this.doiInput = ''
      this.issnInput = ''
      this.selectedTestDOI = null
      this.email = ''
      this.forceShowReviewSection = false
    }
  }
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
  top: 0px;
  width: 170px;
  z-index: 1;
}
h1 {
  text-align: left;
  margin-bottom: 20px;
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