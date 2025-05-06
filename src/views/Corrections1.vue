<template>
  <div class="corrections-tool-container">
    <h1>Submit a Correction to Unpaywall</h1>

    <!-- Getting a Document -->
    <div class="step-section step-1-section my-4 pa-4">
      <h2>Find the document by DOI</h2>
      <div class="doi-input-section">
        <v-text-field
            v-model="doiInput"
            label="Enter DOI"
            outlined
            dense
            hide-details
            class="doi-input-field"
            @keydown.enter="fetchDocumentByDoi"
        ></v-text-field>
        <v-btn color="primary" @click="fetchDocumentByDoi" class="submit-button">Submit</v-btn>
      </div>
      <div class="test-doi-section">
        <v-btn small color="primary" @click="fetchRandomDoi" :loading="isLoadingRandom">Random DOI</v-btn>
        <v-select
            :items="testDois"
            label="Test DOIs"
            outlined
            dense
            hide-details
            item-text="label"
            item-value="doi"
            @change="fetchDocumentByDoi"
            class="test-doi-dropdown"
            v-model="selectedTestDoi"
        ></v-select>
      </div>
       <v-progress-linear
          indeterminate
          color="primary"
          v-if="isLoadingDocument"
          class="mt-4"
      ></v-progress-linear>
      <v-alert v-if="errorMessage" type="error" dense class="mt-4">
        {{ errorMessage }}
      </v-alert>
    </div>

    <!-- Viewing and Correcting Document Fields -->
    <div v-if="originalDocument" class="step-section step-2-section my-4 pa-4">
      <h2>View and correct document</h2>
      <v-card outlined class="document-card">
        <v-card-text>
          <!-- Title and API Link -->
          <div class="title-section d-flex align-start justify-space-between">
            <div class="title-text flex-grow-1 mr-4">{{ getFieldValue(editedDocument, 'title', 'No Title Provided') }}</div>
            <a 
              :href="currentApiUrl || '#'"
              target="_blank" 
              class="api-link text-decoration-none"
              v-if="currentApiUrl"
            >
              API <v-icon x-small>mdi-open-in-new</v-icon>
            </a>
          </div>

          <!-- DOI -->
          <div class="doi-section">
             <a :href="getFieldValue(editedDocument, 'doi_url', '#')" target="_blank">
               {{ getFieldValue(editedDocument, 'doi', 'No DOI Provided') }}
             </a>
          </div>

          <!-- Separator -->
          <v-divider class="field-separator"></v-divider>

          <!-- Other Fields -->
          <div v-for="field in displayFields" :key="field.key" class="field-row">
            <div class="field-label">{{ field.label }}:</div>
            <div class="field-value">
              <!-- Display Input/Select when editing -->
              <template v-if="editingField === field.key">
                <v-text-field
                  v-if="field.editType === 'input'"
                  v-model="editingValue"
                  dense
                  hide-details
                  autofocus
                  class="edit-input"
                  @keydown.enter="saveEdit"
                  @keydown.esc="cancelEdit"
                ></v-text-field>
                <v-select
                  v-else-if="field.editType === 'select'"
                  v-model="editingValue"
                  :items="field.options"
                  dense
                  hide-details
                  autofocus
                  class="edit-select"
                  @change="saveEdit" 
                  @blur="cancelEdit"   
                ></v-select>
              </template>
              <!-- Display formatted value when not editing -->
               <template v-if="editingField !== field.key">
                 <a v-if="field.isUrl && getFieldValue(editedDocument, field.key)" :href="getFieldValue(editedDocument, field.key)" target="_blank">
                   {{ getFieldValue(editedDocument, field.key) }}
                 </a>
                 <span v-else>
                   {{ getFieldValue(editedDocument, field.key, 'None') }}
                 </span>
               </template>
             </div>
             <!-- Action Buttons Area -->
             <div class="action-buttons">
               <!-- State 1: Editing State -->
               <template v-if="editingField === field.key">
                 <v-btn x-small color="primary" @click="saveEdit">Save</v-btn>
                 <v-btn x-small color="grey" @click="cancelEdit" class="ml-2">Cancel</v-btn>
               </template>

               <!-- State 2: Changed State (Undo) -->
               <template v-else-if="hasUserChange(field.key)">
                 <v-btn x-small color="grey" @click="undoChange(field.key)">Undo</v-btn>
               </template>

               <!-- State 3: Initial State (Correction Buttons) -->
               <template v-else>
                 <!-- Specific Edit/Add/Remove Buttons based on field and value -->
                 <template v-if="field.key === 'best_oa_location.url'">
                     <div v-if="!getFieldValue(editedDocument, field.key)">
                       <v-btn x-small color="green" @click="startEditing(field.key, field.editType, field.options)">Add URL</v-btn>
                     </div>
                     <div v-else class="button-stack">
                        <v-btn x-small color="orange" @click="startEditing(field.key, field.editType, field.options)" class="mb-1">Correct URL</v-btn>
                        <v-btn x-small color="red" @click="applyCorrection(field.key, null)">Remove Broken URL</v-btn>
                     </div>
                 </template>

                 <template v-else-if="field.key === 'best_oa_location.license'">
                     <v-btn 
                       x-small 
                       :color="getFieldValue(editedDocument, field.key) ? 'orange' : 'green'" 
                       @click="startEditing(field.key, field.editType, field.options)"
                     >
                       {{ getFieldValue(editedDocument, field.key) ? 'Correct License' : 'Add License' }}
                     </v-btn>
                 </template>

                  <template v-else-if="field.key === 'is_oa'">
                      <v-btn x-small color="orange" @click="applyCorrection(field.key, !getFieldValue(editedDocument, field.key))">
                          Correct to {{ getFieldValue(editedDocument, field.key) ? 'False' : 'True' }}
                      </v-btn>
                  </template>

                   <template v-else-if="field.key === 'oa_status'">
                      <v-btn x-small color="orange" @click="startEditing(field.key, field.editType, field.options)">
                        Correct OA Status
                      </v-btn>
                  </template>

                   <template v-else-if="field.key === 'journal_is_oa'">
                       <v-btn x-small color="orange" @click="applyCorrection(field.key, !getFieldValue(editedDocument, field.key))">
                           Correct to {{ getFieldValue(editedDocument, field.key) ? 'False' : 'True' }}
                       </v-btn>
                   </template>
               </template>
             </div>
           </div>
 
         </v-card-text>
      </v-card>
    </div>

    <!-- Add Required Information / New Location Form -->
    <div v-if="originalDocument && editedDocument && requiresNewLocationForm" class="step-section step-3-section my-4 pa-4">
         <div v-if="additionalInfoMessages.length > 0">
            <v-alert type="info" dense border="left" colored-border elevation="2">
               <strong>Additional Information Needed:</strong>
               <ul>
                   <li v-for="(msg, index) in additionalInfoMessages" :key="index">{{ msg }}</li>
               </ul>
            </v-alert>
        </div>

        <div v-if="Object.keys(dependentChanges).length > 0" class="mb-4">
            <h4 class="subtitle-1">Automatic Changes Made:</h4>
            <p class="caption">Based on your edits, the following fields were automatically updated:</p>
            <v-list dense>
                <v-list-item v-for="(change, key) in dependentChanges" :key="key">
                    <v-list-item-content>
                        <v-list-item-title>{{ formatFieldKey(key) }}</v-list-item-title>
                        <v-list-item-subtitle>
                            Changed from <code class="value-display">{{ formatValue(change.oldValue) }}</code> to <code class="value-display">{{ formatValue(change.newValue) }}</code>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </div>

        <!-- Step 3.4: Add New OA Location Form -->
        <div v-if="requiresNewLocationForm">
          <h4 class="subtitle-1">Add New OA Location Details:</h4>
          <v-form @submit.prevent="addNewLocation">
            <!-- URL (Might be prefilled if adding best_oa_location.url) -->
           <v-text-field
             v-model="newLocation.url"
             label="Location URL"
             required
             :rules="[v => !!v || 'URL is required']"
             outlined
             dense
           ></v-text-field>

            <v-select
              v-model="newLocation.host_type"
              :items="hostTypeOptions"
              label="Host Type"
              required
              :rules="[v => !!v || 'Host type is required']"
              outlined
              dense
            ></v-select>

            <v-select
              v-model="newLocation.version"
              :items="versionOptions"
              label="Version"
              required
              :rules="[v => !!v || 'Version is required']"
              outlined
              dense
            ></v-select>

           <v-select
              v-model="newLocation.license"
              :items="licenseOptionsWithUnknown"
              label="License"
              clearable
              hint="Select 'Unknown' if no license"
              persistent-hint
              outlined
              dense
            ></v-select>

           <!-- Add other necessary fields like is_best? Maybe auto-set? -->
           <!-- TODO: Add other fields as necessary -->

           <v-btn type="submit" color="primary" class="mt-3">Add This Location</v-btn>
         </v-form>
       </div>

        <div v-if="!requiresNewLocationForm && additionalInfoMessages.length === 0" class="mt-2">
            <p>No additional information needed based on your corrections.</p>
        </div>
    </div>

    <!-- Review and Submit -->
    <div v-if="originalDocument && editedDocument && showStep4Section" class="step-section step-4-section my-4 pa-4">
      <h3 class="headline mb-4">Confirm Corrections</h3>

      <!-- Summary Table -->
      <v-simple-table dense class="mb-4 summary-table">
          <template v-slot:default>
              <thead>
                  <tr>
                      <th class="text-left">Field / Action</th>
                      <th class="text-left">Original Value</th>
                      <th class="text-left">New Value</th>
                      <th class="text-left">Type</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-if="changesForTable.length === 0">
                      <td colspan="4">No changes detected.</td>
                  </tr>
                  <tr v-for="(item, index) in changesForTable" :key="index">
                      <td v-if="!item.isLocationChange">{{ item.field }}</td>
                      <td v-if="item.isLocationChange" colspan="3">{{ item.locationSummary }}</td>
                      
                      <td v-if="!item.isLocationChange"><code class="value-display">{{ item.oldValue }}</code></td>
                      <td v-if="!item.isLocationChange"><code class="value-display">{{ item.newValue }}</code></td>
                      
                      <td>
                          <v-chip small :color="item.type === 'Direct Edit' ? 'blue' : 'orange'" outlined>
                              {{ item.type }}
                          </v-chip>
                      </td>
                  </tr>
              </tbody>
          </template>
      </v-simple-table>
      
       <!-- Submission Feedback -->
       <v-alert v-if="submissionSuccess" type="success" dense text>
         Correction submitted successfully!
       </v-alert>
       <v-alert v-if="submissionError" type="error" dense text>
         Error submitting correction: {{ submissionError }}
       </v-alert>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CorrectionsTool',
  data() {
    return {
      doiInput: '',
      selectedTestDoi: null,
      originalDocument: null,
      editedDocument: null, // Will hold the user's edits
      isLoadingDocument: false,
      isLoadingRandom: false,
      errorMessage: null,
      testDois: [
        { label: 'gold', doi: '10.2221/jcsj.9.70' }, // gold
        { label: 'green', doi: '10.1016/j.cell.2007.11.019' }, // green (has repo copy, journal not OA)
        { label: 'hybrid', doi: '10.1080/03057925.2025.2483691' }, // hybrid (needs license correction)
        { label: 'bronze', doi: '10.2207/qjjws1943.22.275' }, // bronze (no license)
        { label: 'closed', doi: '10.1109/pvsc.1996.564405' }, // closed (no OA locations)
      ],
      // State for Step 2 (Editing)
      editingField: null, // e.g., 'best_oa_location.url'
      editingValue: null, // Holds the value while input/select is active
      editingOptions: [], // Holds dropdown options if applicable
      userChanges: {}, // Tracks fields changed by the user { fieldKey: { oldValue: val1, newValue: val2 } }

      // State for Step 3 (Dependencies)
      additionalInfoMessages: [], // Stores messages like 'Please add a URL for green status'
      requiresNewLocationForm: false, // Flag to show the new location form
      dependentChanges: {}, // Tracks changes implied by rules { fieldKey: { oldValue: val1, newValue: val2 } }

      // State for Step 4 (Submission)
      isSubmitting: false,
      submissionSuccess: false,
      submissionError: null,

      newLocation: {
        url: '',
        host_type: null,
        version: null,
        license: null,
        // updated: automatically set?
        // is_best: automatically set? Assume false initially.
        // pdf_url: separate field? Assume url is sufficient for now.
      },
      hostTypeOptions: ['publisher', 'repository'],
      versionOptions: ['publishedVersion', 'submittedVersion', 'acceptedVersion'],
      // Common licenses + null option
      licenseOptions: [
          { text: 'Unknown', value: null },
          'cc0',
          'cc-by',
          'cc-by-sa',
          'cc-by-nd',
          'cc-by-nc',
          'cc-by-nc-sa',
          'cc-by-nc-nd',
          'public-domain-dedication',
          // Add other relevant licenses as needed
      ],
      currentApiUrl: null, // Store the API URL used for the current document
    };
  },
  methods: {
    // Helper to normalize DOI
    normalizeDoi(doi) {
        if (!doi || typeof doi !== 'string') return null;
        // Basic normalization: remove leading/trailing whitespace and potential URL prefixes
        let cleanedDoi = doi.trim().toLowerCase();
        // Remove common URL prefixes
        cleanedDoi = cleanedDoi.replace(/^https?:\/\/(dx\.)?doi\.org\//, '');
        // Basic validation (starts with '10.') - can be enhanced
        if (cleanedDoi.startsWith('10.')) {
            return cleanedDoi;
        }
        return null; // Return null if it doesn't look like a DOI after cleaning
    },
    async fetchDocumentByDoi(doiToFetch) {
      // If called by v-select change event, doiToFetch is the value
      // If called by button click, use doiInput
      // If called by test DOI dropdown, use selectedTestDoi
      const targetDoi = typeof doiToFetch === 'string' ? doiToFetch : this.doiInput;
      const normalizedDoi = this.normalizeDoi(targetDoi);

      if (!normalizedDoi) {
        this.errorMessage = 'Invalid DOI format. Please enter a valid DOI (e.g., 10.1234/example).';
        this.originalDocument = null;
        this.editedDocument = null;
        this.currentApiUrl = null; // Reset API URL
        return;
      }

      this.isLoadingDocument = true;
      this.errorMessage = null;
      this.originalDocument = null;
      this.editedDocument = null;
      // Clear potentially stale test DOI selection if using input field
      if (typeof doiToFetch !== 'string') {
          this.selectedTestDoi = null;
      }

      // Use the temporary API endpoint specified in PRD 1.1 NOTE
      const apiUrl = `https://api.unpaywall.org/${normalizedDoi}?email=team@ourresearch.org`;
      this.currentApiUrl = apiUrl; // Store the successful API URL

      try {
        const response = await axios.get(apiUrl);
        if (response.data) {
          // Basic check for a valid-looking response
          if (response.data.doi && this.normalizeDoi(response.data.doi) === normalizedDoi) {
             this.originalDocument = response.data;
             // Initialize editedDocument as a deep copy for modifications later
             this.editedDocument = JSON.parse(JSON.stringify(response.data));
          } else {
              this.errorMessage = `Could not find document for DOI: ${normalizedDoi}`;
          }
        } else {
          this.errorMessage = `No data returned for DOI: ${normalizedDoi}`;
        }
      } catch (error) {
        console.error('Error fetching DOI:', error);
        let message = `Error fetching document for DOI: ${normalizedDoi}.`;
        // Check if error response exists and has data
        if (error.response && error.response.data && error.response.data.error) {
            message += ` Server said: ${error.response.data.error}`;
        } else if (error.response && error.response.status) {
            message += ` Status code: ${error.response.status}.`;
        } else {
            message += ' Check the console for details.';
        }
        this.errorMessage = message;
        this.currentApiUrl = null; // Reset API URL on error
      } finally {
        this.isLoadingDocument = false;
      }
    },
    async fetchRandomDoi() {
      this.isLoadingRandom = true;
      this.errorMessage = null;
      this.doiInput = ''; // Clear manual input
      this.selectedTestDoi = null;
      this.currentApiUrl = null; // Reset API URL

      // Use the OpenAlex endpoint specified in PRD 1.2
      const randomWorkApiUrl = 'https://api.openalex.org/works?filter=indexed_in:crossref&sample=1';

      try {
        const response = await axios.get(randomWorkApiUrl);
        // Check structure carefully - Vue 2 Babel doesn't support optional chaining
        if (response.data && response.data.results && response.data.results.length > 0 && response.data.results[0].doi) {
          const randomDoi = this.normalizeDoi(response.data.results[0].doi);
          if (randomDoi) {
            this.doiInput = randomDoi; // Pre-fill input for user visibility
            await this.fetchDocumentByDoi(randomDoi); // Fetch the document
          } else {
             this.errorMessage = 'Random work found, but its DOI was invalid.';
          }
        } else {
          this.errorMessage = 'Could not fetch a random work from OpenAlex API.';
        }
      } catch (error) {
        console.error('Error fetching random DOI:', error);
        this.errorMessage = 'Error fetching random DOI. Check the console for details.';
      } finally {
        this.isLoadingRandom = false;
      }
    },
    // Helper to safely get nested properties, avoiding errors for null/undefined paths
    // Needed because Vue 2 + Babel 7 doesn't support optional chaining (?.)
    getFieldValue(obj, path, defaultValue = null) {
      if (!obj || typeof path !== 'string') {
        return defaultValue;
      }
      const keys = path.split('.');
      let current = obj;
      for (let i = 0; i < keys.length; i++) {
        if (current === null || current === undefined) {
          return defaultValue;
        }
        current = current[keys[i]];
      }
      // Return defaultValue if the final value is null or undefined
      return (current === null || current === undefined) ? defaultValue : current;
    },
    // Helper to safely set nested properties. Creates path if it doesn't exist.
    setFieldValue(obj, path, value) {
      if (!obj || typeof path !== 'string') {
        return;
      }
      const keys = path.split('.');
      let current = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (current[key] === null || current[key] === undefined || typeof current[key] !== 'object') {
          // Check if the next key is numeric - implies an array index, which we don't handle here
          // This basic implementation assumes object paths
          if (/^\d+$/.test(keys[i+1])) {
              console.error("setFieldValue doesn't support array indexing yet.");
              return; // Avoid creating array indices as object keys
          }
          current[key] = {}; // Create nested object if it doesn't exist
        }
        current = current[key];
      }
      // Set the final value
      current[keys[keys.length - 1]] = value;
    },
    // Methods for Step 2 (Editing)
    startEditing(fieldKey, editType, options = []) {
        // Ensure we have a deep copy of editedDocument if it hasn't been created yet
        // This prevents modifying originalDocument accidentally before first edit
        if (!this.editedDocument && this.originalDocument) {
            this.editedDocument = JSON.parse(JSON.stringify(this.originalDocument));
        }
        this.editingField = fieldKey;
        this.editingValue = this.getFieldValue(this.editedDocument, fieldKey);
        this.editingOptions = options || []; // Store options for select
        // TODO: Focus the input/select element if possible using $refs
    },

    saveEdit() {
        if (this.editingField) {
            this.applyCorrection(this.editingField, this.editingValue);
            this.cancelEdit(); // Exit editing mode
        }
    },

    cancelEdit() {
        this.editingField = null;
        this.editingValue = null;
        this.editingOptions = [];
    },

    applyCorrection(fieldKey, newValue) {
        const oldValue = this.getFieldValue(this.originalDocument, fieldKey);
        const currentValue = this.getFieldValue(this.editedDocument, fieldKey);

        // Don't record a change if the new value is the same as the current value
        if (newValue === currentValue) {
            // If currently editing, still exit editing mode
            if (this.editingField === fieldKey) {
                this.cancelEdit();
            }
            return;
        }

        // Update the edited document
        this.setFieldValue(this.editedDocument, fieldKey, newValue);

        // Track the change if it differs from the *original* value
        if (newValue !== oldValue) {
             // Use Vue.set to ensure reactivity if nested objects are created/modified
             // Although setFieldValue creates objects, Vue might not track deep changes without Vue.set
             // Note: For simple top-level changes, direct assignment might be okay, but Vue.set is safer.
             // Let's try without Vue.set first, relying on setFieldValue, and add if needed.
            this.userChanges = {
                ...this.userChanges,
                [fieldKey]: { oldValue: oldValue, newValue: newValue }
            };
        } else {
            // If the new value matches the original, remove tracking for this field
            const newChanges = { ...this.userChanges };
            delete newChanges[fieldKey];
            this.userChanges = newChanges;
        }

        // If we were editing this field, exit editing mode
        if (this.editingField === fieldKey) {
             this.cancelEdit();
        }
        this.checkDependencies();
    },

    undoChange(fieldKey) {
        const originalValue = this.getFieldValue(this.originalDocument, fieldKey);
        this.applyCorrection(fieldKey, originalValue); // Apply the original value back
    },

    hasUserChange(fieldKey) {
        return fieldKey in this.userChanges;
    },

    // Methods/Computed for Step 3 (Dependencies)
    // Helper to find the index of the location corresponding to best_oa_location.url
    findBestLocationIndex(locations, bestUrl) {
        if (!locations || !bestUrl) return -1;
        return locations.findIndex(loc => loc && loc.url === bestUrl);
    },

    // Helper to calculate oa_status based on PRD rules
    calculateOaStatus(doc) {
        const journalIsOa = this.getFieldValue(doc, 'journal_is_oa');
        const locations = this.getFieldValue(doc, 'oa_locations') || [];
        const hasPublisherCopy = locations.some(loc => loc && loc.host_type === 'publisher');
        const hasRepositoryCopy = locations.some(loc => loc && loc.host_type === 'repository');
        const bestLocationLicense = this.getFieldValue(doc, 'best_oa_location.license'); // Use best_oa_location.license as proxy, assuming it's kept in sync

        if (journalIsOa && hasPublisherCopy) return 'gold';
        if (!journalIsOa && hasRepositoryCopy) return 'green';
        if (!journalIsOa && hasPublisherCopy && bestLocationLicense) return 'hybrid';
        if (!journalIsOa && hasPublisherCopy && !bestLocationLicense) return 'bronze';
        return 'closed'; // Default if none match (or no locations)
    },

    checkDependencies() {
      console.log("Checking dependencies based on changes:", JSON.parse(JSON.stringify(this.userChanges)));
      this.additionalInfoMessages = [];
      this.requiresNewLocationForm = false;
      let localDependentChanges = {}; // Use local var to collect changes in this run

      // Ensure editedDocument exists and has necessary structures
      if (!this.editedDocument) return;
      if (!this.editedDocument.oa_locations) {
          this.editedDocument.oa_locations = [];
      }
      if (!this.editedDocument.best_oa_location) {
          this.editedDocument.best_oa_location = {};
      }

      // --- Apply PRD 3.2 Rules --- 

      // Make a deep copy to compare against *after* direct user changes are applied
      const docBeforeDependencies = JSON.parse(JSON.stringify(this.editedDocument));

      // Rule: Changes to best_oa_location fields affect corresponding oa_locations item
      const bestOaUrlOriginal = this.getFieldValue(this.originalDocument, 'best_oa_location.url');
      const bestOaUrlCurrent = this.getFieldValue(this.editedDocument, 'best_oa_location.url');
      const bestOaLicenseCurrent = this.getFieldValue(this.editedDocument, 'best_oa_location.license');
      const bestLocationIndex = this.findBestLocationIndex(this.editedDocument.oa_locations, bestOaUrlOriginal);

      // a) If best_oa_location.url was removed:
      if (this.hasUserChange('best_oa_location.url') && bestOaUrlCurrent === null && bestLocationIndex !== -1) {
          console.log(`Dependency: Removing location at index ${bestLocationIndex} due to URL removal.`);
          this.editedDocument.oa_locations.splice(bestLocationIndex, 1);
          // Note: best_oa_location object itself might be stale now, will be recalculated later if needed
      }
      // b) If best_oa_location.url was changed:
      else if (this.hasUserChange('best_oa_location.url') && bestOaUrlCurrent !== null && bestLocationIndex !== -1) {
          console.log(`Dependency: Updating URL in location at index ${bestLocationIndex}.`);
          if (this.editedDocument.oa_locations[bestLocationIndex]) {
              this.editedDocument.oa_locations[bestLocationIndex].url = bestOaUrlCurrent;
          }
      }
      // c) If best_oa_location.url was added:
      else if (this.hasUserChange('best_oa_location.url') && bestOaUrlCurrent !== null && !bestOaUrlOriginal) {
          // Requires adding a new location - flag this for Step 3.4 form
          console.log("Dependency: Adding URL requires new location details.");
          this.additionalInfoMessages.push(`Adding '${bestOaUrlCurrent}' requires details about this new location (host type, version, license).`);
          this.requiresNewLocationForm = true;
          // We cannot add the location yet, need user input
      }

      // d) If best_oa_location.license was changed (add/correct):
      if (this.hasUserChange('best_oa_location.license') && bestLocationIndex !== -1) {
          console.log(`Dependency: Updating license in location at index ${bestLocationIndex}.`);
          if (this.editedDocument.oa_locations[bestLocationIndex]) {
                this.editedDocument.oa_locations[bestLocationIndex].license = bestOaLicenseCurrent;
           }
      }

      // Rule: Changing is_oa
      if (this.hasUserChange('is_oa')) {
          const isOaCurrent = this.getFieldValue(this.editedDocument, 'is_oa');
          if (isOaCurrent === true && (!this.editedDocument.oa_locations || this.editedDocument.oa_locations.length === 0)) {
              console.log("Dependency: is_oa=true requires a location.");
              this.additionalInfoMessages.push("To change 'Is OA' to true, please add a location where the article can be freely accessed.");
              this.requiresNewLocationForm = true;
          } else if (isOaCurrent === false && this.editedDocument.oa_locations && this.editedDocument.oa_locations.length > 0) {
              console.log("Dependency: is_oa=false implies removing all locations.");
              // TODO: Need to track the removed locations for the summary
              this.editedDocument.oa_locations = [];
              // Also clear best_oa_location since its source is gone
              this.editedDocument.best_oa_location = {};
          }
      }

      // --- Recalculate dependent fields based on the *current* state of editedDocument --- 
      const finalLocations = this.getFieldValue(this.editedDocument, 'oa_locations') || [];

      // Recalculate is_oa
      const calculatedIsOa = finalLocations.length > 0;
      this.setFieldValue(this.editedDocument, 'is_oa', calculatedIsOa);

      // Recalculate has_repository_copy
      const calculatedHasRepoCopy = finalLocations.some(loc => loc && loc.host_type === 'repository');
      this.setFieldValue(this.editedDocument, 'has_repository_copy', calculatedHasRepoCopy);

      // Recalculate oa_status
      const calculatedOaStatus = this.calculateOaStatus(this.editedDocument);
      this.setFieldValue(this.editedDocument, 'oa_status', calculatedOaStatus);

      // --- Check for required info based on calculated status ---
      if (calculatedOaStatus === 'green' && !calculatedHasRepoCopy) {
            this.additionalInfoMessages.push("To have OA Status 'green', please add the URL of a repository copy.");
            this.requiresNewLocationForm = true;
      }
      if (calculatedOaStatus === 'hybrid' && !this.getFieldValue(this.editedDocument, 'best_oa_location.license')) {
          this.additionalInfoMessages.push("To have OA Status 'hybrid', please add the license for the best OA location.");
          // Don't require full form, just need license added via Step 2 editing
      }

      // --- Track Dependent Changes --- 
      const fieldsToCheck = ['is_oa', 'has_repository_copy', 'oa_status', 'oa_locations', 'best_oa_location']; // Add more if needed
      fieldsToCheck.forEach(key => {
          const originalDepValue = this.getFieldValue(docBeforeDependencies, key);
          const finalDepValue = this.getFieldValue(this.editedDocument, key);

          // Simple comparison for primitives, deep for objects/arrays
          let changed = false;
          if (typeof originalDepValue !== 'object' || originalDepValue === null) {
              changed = originalDepValue !== finalDepValue;
          } else {
              changed = JSON.stringify(originalDepValue) !== JSON.stringify(finalDepValue);
          }

          // Only track if it changed AND the user didn't change it directly
          if (changed && !this.hasUserChange(key)) {
              console.log(`Recording dependent change for ${key}: ${JSON.stringify(originalDepValue)} -> ${JSON.stringify(finalDepValue)}`);
              localDependentChanges[key] = { oldValue: originalDepValue, newValue: finalDepValue };
          }
      });

      // Update the component's dependentChanges state
      this.dependentChanges = localDependentChanges;

      console.log("Dependency check complete. Needs Info:", this.additionalInfoMessages.length > 0, "Needs Form:", this.requiresNewLocationForm);

      // Prefill the New Location form if it's required
      if (this.requiresNewLocationForm) {
        const bestOaLocation = this.getFieldValue(this.editedDocument, 'best_oa_location');
        if (bestOaLocation) {
          this.newLocation.url = bestOaLocation.url || '';
          this.newLocation.license = bestOaLocation.license === undefined ? null : bestOaLocation.license; // Handle undefined vs null
          this.newLocation.host_type = bestOaLocation.host_type || null;
          this.newLocation.version = bestOaLocation.version || null;
        } else {
           // Reset form if best_oa_location doesn't exist but form is required (shouldn't happen?)
           this.resetNewLocationForm();
        }
      } else {
        // Reset form data if not required to avoid stale data
        this.resetNewLocationForm();
      }
    },

    resetNewLocationForm() {
      this.newLocation = { url: '', host_type: null, version: null, license: null };
    },

    // Methods/Computed for Step 3.4 (Add New Location Form)
    addNewLocation() {
        if (!this.editedDocument) return;
        if (!this.editedDocument.oa_locations) {
            this.editedDocument.oa_locations = [];
        }

        // Basic validation (Vuetify form handles more)
        if (!this.newLocation.url || !this.newLocation.host_type || !this.newLocation.version) {
            this.errorMessage = "Please fill in all required fields for the new location (URL, Host Type, Version)."; // Basic feedback
            return;
        }

        // Create a clean copy of the new location data
        const locationToAdd = JSON.parse(JSON.stringify(this.newLocation));

        // Set default/derived values if needed
        locationToAdd.updated = new Date().toISOString(); // Add timestamp
        locationToAdd.is_best = false; // Assume not best unless explicitly made so later
        locationToAdd.url_for_landing_page = null; // Default
        locationToAdd.url_for_pdf = null; // Default

        console.log("Adding new location:", locationToAdd);
        this.editedDocument.oa_locations.push(locationToAdd);

        // Clear form and flags
        this.resetNewLocationForm();
        this.requiresNewLocationForm = false;
        this.additionalInfoMessages = this.additionalInfoMessages.filter(msg => 
            !msg.includes("add a location") && !msg.includes("requires details about this new location")
        ); // Remove messages satisfied by adding a location
        this.errorMessage = null; // Clear any previous form error

        // Re-run dependency check as adding a location can change things
        this.$nextTick(() => {
            this.checkDependencies();
        });
    },

    formatFieldKey(key) {
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },

    formatValue(value) {
        if (value === null || value === undefined) return 'null';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    },

    formatLocationSummary(location) {
        if (!location) return 'N/A';
        const parts = [
            `URL: ${location.url || 'N/A'}`,
            `Version: ${location.version || 'N/A'}`,
            `License: ${location.license === undefined ? 'N/A' : (location.license === null ? 'Unknown' : location.license)}`,
            `Host Type: ${location.host_type || 'N/A'}`
        ];
        return parts.join(', ');
    },

    submitCorrection() {
        // Prevent submission if already submitting or successful
        if (this.isSubmitting || this.submissionSuccess) {
            return;
        }

        if (!this.editedDocument || (Object.keys(this.userChanges).length === 0 && Object.keys(this.dependentChanges).length === 0)) {
            this.submissionError = "No changes detected to submit.";
            return;
        }

        this.isSubmitting = true;
        this.submissionSuccess = false;
        this.submissionError = null;

        // Prepare the payload
        const submissionPayload = {
            doi: this.originalDocument ? this.originalDocument.doi : this.doiInput,
            // Ensure we send deep copies to prevent accidental modification later
            original_doc: JSON.parse(JSON.stringify(this.originalDocument)),
            edited_doc: JSON.parse(JSON.stringify(this.editedDocument)),
            // Optionally include change summaries if backend wants them structured
            // user_changes: JSON.parse(JSON.stringify(this.userChanges)),
            // dependent_changes: JSON.parse(JSON.stringify(this.dependentChanges))
        };

        console.log("Submitting Correction Payload:", submissionPayload);

        // --- Actual API Call Placeholder --- 
        // Replace this setTimeout with your actual fetch/axios call
        // const apiUrl = '/api/corrections'; // Replace with your actual endpoint
        // fetch(apiUrl, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(submissionPayload)
        // }).then(response => {
        //     if (!response.ok) {
        //         throw new Error(`Submission failed: ${response.statusText}`);
        //     }
        //     return response.json();
        // }).then(data => {
        //     console.log('Submission successful:', data);
        //     this.submissionSuccess = true;
        // }).catch(error => {
        //     console.error('Submission error:', error);
        //     this.submissionError = error.message || 'An unknown error occurred during submission.';
        // }).finally(() => {
        //     this.isSubmitting = false;
        // });
        // -------------------------------------

        // Simulating API call with setTimeout
        setTimeout(() => {
            // Simulate success/failure randomly for testing
            const success = Math.random() > 0.2; // 80% chance of success

            if (success) {
                console.log("Simulated successful submission.");
                this.submissionSuccess = true;
            } else {
                console.error("Simulated submission failure.");
                this.submissionError = "Simulated API error: Failed to save correction.";
            }
            this.isSubmitting = false;
        }, 1500); // Simulate 1.5 second network request
    },

    changesForTable() {
        const tableData = [];
        const processChanges = (changes, type) => {
            for (const key in changes) {
                const change = changes[key];
                if (key === 'oa_locations') {
                    const oldLocations = change.oldValue || [];
                    const newLocations = change.newValue || [];

                    newLocations.forEach(newLoc => {
                        if (!oldLocations.some(oldLoc => oldLoc.url === newLoc.url)) { // Simple URL check
                             tableData.push({
                                isLocationChange: true,
                                locationSummary: `Added Location: ${this.formatLocationSummary(newLoc)}`,
                                type: type
                            });
                        }
                    });
                    oldLocations.forEach(oldLoc => {
                        if (!newLocations.some(newLoc => newLoc.url === oldLoc.url)) { // Simple URL check
                             tableData.push({
                                isLocationChange: true,
                                locationSummary: `Removed Location: ${this.formatLocationSummary(oldLoc)}`,
                                type: type
                            });
                        }
                    });
                } else {
                    tableData.push({
                        field: key,
                        oldValue: this.formatValue(change.oldValue),
                        newValue: this.formatValue(change.newValue),
                        type: type,
                        isLocationChange: false
                    });
                }
            }
        };

        processChanges(this.userChanges, 'Direct Edit');
        processChanges(this.dependentChanges, 'Automatic');

        return tableData;
    }
  },
  computed: {
    // Fields to display in Step 2
    displayFields() {
      return [
        {
          key: 'best_oa_location.url',
          label: 'Best OA URL',
          isUrl: true,
          editType: 'input',
        },
        {
            key: 'best_oa_location.license',
            label: 'Best OA License',
            editType: 'select',
            options: ["cc-by", "cc-by-nc-nd", "cc-by-nc", "cc-by-nc-sa", "publisher-specific-oa", "public-domain", "cc-by-sa", "mit", "cc-by-nd", "gpl-v3", "apache-2-0", "isc", "other-oa", "unknown"]
        },
        {
            key: 'is_oa',
            label: 'Is OA',
            editType: 'boolean' // No input/select needed, direct button action
        },
        {
            key: 'oa_status',
            label: 'OA Status',
            editType: 'select',
            options: ["gold", "green", "hybrid", "bronze", "closed"]
        },
        {
            key: 'journal_is_oa',
            label: 'Journal Is OA',
            editType: 'boolean' // No input/select needed, direct button action
        },
      ];
    },
    showStep4Section() {
      // Show Step 4 only if a document is loaded, there are changes,
      // no additional info is required, and the new location form isn't needed.
      return !!this.editedDocument &&
             !this.isLoadingDocument &&
             (Object.keys(this.userChanges).length > 0 || Object.keys(this.dependentChanges).length > 0) &&
             this.additionalInfoMessages.length === 0 &&
             !this.requiresNewLocationForm;
    },
    licenseOptionsWithUnknown() {
      // Add 'Unknown' option for null value, make it the first option
      return [
        { text: 'Unknown', value: null },
        ...this.licenseOptions.map(license => ({ text: license, value: license }))
      ];
    }
  }
};
</script>

<style scoped>
.corrections-tool-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.step-section {
  margin-bottom: 40px; /* Space between steps */
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h1 {
  text-align: left;
  margin-bottom: 30px;
}

body h2 {
  margin-bottom: 20px;
  margin-top: 0px;
  font-size: 1.2em;
  color: #333;
}

.doi-input-section {
  display: flex;
  align-items: stretch; /* Make button same height as input */
  gap: 10px; /* Gap between input and button */
  margin-bottom: 15px;
}

.doi-input-field {
  flex-grow: 1; /* Input field takes available space */
}

.test-doi-section {
    display: flex;
    align-items: center; /* Align button and dropdown vertically */
    gap: 10px; /* Gap between button and dropdown */
}

.test-doi-dropdown {
    width: 200px; /* Fixed width as per PRD */
    flex-shrink: 0; /* Prevent shrinking */
    flex-grow: 0;
}

/* Style adjustments for Vuetify components if needed */
.v-text-field--outlined ::v-deep .v-input__control,
.v-select--outlined ::v-deep .v-input__control {
  min-height: 38px; /* Adjust height if needed */
}

.v-btn {
    text-transform: none; /* Keep button text case as defined */
}

/* Styles for Step 2 Document Card */
.document-card {
    margin-top: 20px;
}

.title-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start; /* Align API link to top of title */
    margin-bottom: 0; /* Remove bottom margin to keep DOI close */
}

.title-text {
    font-size: 1.4em;
    font-weight: 500;
    flex-grow: 1;
    margin-right: 10px; /* Space before API link */
    line-height: 1.3;
}

.api-link {
    font-size: 0.9em;
    white-space: nowrap;
    text-decoration: none;
    color: #1976D2; /* Vuetify primary blue */
}

.api-link .v-icon {
    margin-left: 2px;
}

.doi-section {
    font-size: 0.9em;
    margin-bottom: 10px; /* Space before the first separator */
    color: #555;
}

.doi-section a {
    text-decoration: none;
    color: inherit;
}

.doi-section a:hover {
    text-decoration: underline;
}

.field-separator {
    margin-top: 10px;
    margin-bottom: 10px;
}

.field-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0; /* Vertical padding for rows */
    border-bottom: 1px solid #eee; /* Light line between fields */
    min-height: 36px; /* Ensure consistent row height */
}

.field-row:last-child {
    border-bottom: none; /* No line after the last field */
}

.field-label {
    font-weight: 500;
    margin-right: 15px;
    font-size: 0.95em;
    color: #444;
    flex-shrink: 0; /* Prevent label from shrinking */
}

.field-value {
    flex-grow: 1;
    text-align: left;
    word-break: break-word; /* Allow long values like URLs to wrap */
    font-size: 0.95em;
    color: #333;
}

.field-value a {
    text-decoration: none;
    color: #1976D2;
}

.field-value a:hover {
    text-decoration: underline;
}

.button-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-end; /* Align buttons right in the stack */
}

.action-buttons {
    margin-left: 15px; /* Space between value and buttons */
    flex-shrink: 0; /* Prevent buttons area from shrinking */
    display: flex;
    align-items: center;
}

/* Ensure edit inputs/selects don't overflow */
.edit-input,
.edit-select {
    min-width: 150px; /* Give some base width */
    flex-grow: 1; /* Allow stretching but consider action buttons */
}

.button-stack {
   display: flex;
   flex-direction: column;
   align-items: flex-end; /* Align buttons right in the stack */
}

.value-display {
    background-color: #eee;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.9em;
    word-break: break-all; /* Prevent long values from overflowing */
}
</style>