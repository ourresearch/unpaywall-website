<template>
  <v-container style="max-width: 800px; min-height: 60vh;" class="mb-10">
    <h1>Submit a Correction to Unpaywall</h1>
    
    <!-- Step 1: DOI Input -->
    <v-card class="mt-1 pa-8">
      <v-row>
        <v-text-field
          v-model="doiInput"
          label="Enter a DOI"
          outlined
          dense
          hide-details
          class="mr-2"
          @keyup.enter="submitDoi"
        />
        <v-btn color="primary" @click="submitDoi" :disabled="loading">Submit</v-btn>
      </v-row>
      <v-row class="mt-6">
        <v-btn color="primary" @click="fetchRandomDoi" :disabled="loading">Random DOI</v-btn>
        <v-select
          :items="testDois"
          label="Test DOIs"
          v-model="selectedTestDoi"
          @change="submitDoiFromTest"
          outlined
          dense
          x-small
          class="ml-2"
          style="width: 100px;"
          hide-details
        />
      </v-row>
      <v-progress-linear indeterminate v-if="loading" class="mt-8"/>
      <v-alert type="error" v-if="error" class="mt-4">{{ error }}</v-alert>
    </v-card>
    
    <!-- Step 2: Display Metadata & Edit Fields -->
    <v-card v-if="metadata" class="mt-4 pa-4">
      <!-- Title -->
      <v-list-item two-line class="align-start">
        <v-list-item-content>
          <v-list-item-title class="text-h5 wrap-text">{{ displayTitle }}</v-list-item-title>
          <v-list-item-subtitle>
            <a :href="displayDoiUrl" target="_blank">{{ displayDoi }}</a>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action class="d-flex align-start">
          <v-btn text :href="apiUrl" target="_blank">
            API <i class="fa fa-external-link" aria-hidden="true"></i>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      
      <v-divider class="my-2"></v-divider>
      
      <!-- Other Fields -->
      <v-list dense>
        <!-- Best OA Location URL -->
        <v-list-item class="doi-field">
          <v-list-item-content>
            <v-list-item-title>
              <strong>Best OA Location URL: </strong>
              <span class="wrap-text">
                <a
                v-if="getProp(metadata, 'best_oa_location.url')"
                :href="getProp(metadata, 'best_oa_location.url')"
                target="_blank"
                >
                {{ getProp(metadata, 'best_oa_location.url') }}
              </a>
              <span v-else>None</span>
            </span>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action style="flex-direction: column; align-items: flex-end;">
          <span v-if="!getProp(metadata, 'best_oa_location.url')" class="d-flex align-center">
            <v-btn x-small color="green" @click="addUrl" class="white--text">Add URL</v-btn>
            <span v-if="activeCorrectionAction === 'addUrl'" class="ml-1" style="font-size: large; color: green;">✔️</span>
          </span>
          <template v-else>
            <span class="d-flex align-center mb-1">
              <v-btn x-small color="orange" @click="correctUrl" class="white--text">Correct URL</v-btn>
              <span v-if="activeCorrectionAction === 'correctUrl'" class="ml-1" style="font-size: large; color: green;">✔️</span>
            </span>
            <span class="d-flex align-center">
              <v-btn x-small color="red" @click="removeUrl" class="white--text">Remove Broken URL</v-btn>
              <span v-if="activeCorrectionAction === 'removeUrl'" class="ml-1" style="font-size: large; color: green;">✔️</span>
            </span>
          </template>
        </v-list-item-action>
      </v-list-item>
      
      <!-- Is OA -->
      <v-list-item class="doi-field">
        <v-list-item-content>
          <v-list-item-title>
            <strong>Is OA: </strong>
            <v-chip x-small :color="displayIsOa ? 'success' : 'error'">{{ displayIsOa }}</v-chip>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <span class="d-flex align-center">
            <v-btn x-small color="orange" @click="correctIsOa(!displayIsOa)" class="white--text">
              {{ displayIsOa ? 'Change to False' : 'Change to True' }}
            </v-btn>
            <span v-if="activeCorrectionAction === (displayIsOa ? 'correctIsOaFalse' : 'correctIsOaTrue')" class="ml-1" style="font-size: large; color: green;">✔️</span>
          </span>
        </v-list-item-action>
      </v-list-item>
      
      <!-- Journal Is OA -->
      <v-list-item class="doi-field">
        <v-list-item-content>
          <v-list-item-title>
            <strong>Journal Is OA: </strong>
            <v-chip x-small :color="displayJournalIsOa ? 'success' : 'error'">{{ displayJournalIsOa }}</v-chip>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <span class="d-flex align-center">
            <v-btn x-small color="orange" @click="correctJournalIsOa(!displayJournalIsOa)" class="white--text">
              {{ displayJournalIsOa ? 'Change to False' : 'Change to True' }}
            </v-btn>
            <span v-if="activeCorrectionAction === (displayJournalIsOa ? 'correctJournalIsOaFalse' : 'correctJournalIsOaTrue')" class="ml-1" style="font-size: large; color: green;">✔️</span>
          </span>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    
  </v-card>
  
  <!-- Step 3: Gather Additional Information -->
  <v-card v-if="shouldShowLocationForm" class="mt-4 pa-4 transition-swing" key="step3">
    <v-card-title>{{ locationFormTitle }}</v-card-title>
    <v-card-subtitle v-if="locationFormSubtitle">{{ locationFormSubtitle }}</v-card-subtitle>
    <v-card-text>
      <v-form ref="locationForm">
        <v-text-field
          v-model="locationFormData.url"
          label="URL"
          :rules="[v => !!v || 'URL is required', v => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v) || 'URL must be valid']"
          required
        />
        <v-select
          v-model="locationFormData.host_type"
          :items="hostTypes"
          label="Host Type"
          :rules="[v => !!v || 'Host type is required']"
          required
        />
        <v-select
          v-model="locationFormData.version"
          :items="versions"
          label="Version"
          :rules="[v => !!v || 'Version is required']"
          required
        />
        <v-select
          v-model="locationFormData.license"
          :items="licenseTypes"
          label="License"
          :rules="[v => !!v || 'License is required']"
          required  
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="cancelLocationForm">Cancel</v-btn>
      <v-btn color="primary" @click="submitLocationForm">Submit</v-btn>
    </v-card-actions>
  </v-card>
  
  <!-- Step 4: Review Changes -->
  <v-card v-if="allChanges.length > 0" class="mt-4 pa-4 transition-swing" key="step4">
    <v-card-title>Review Proposed Changes</v-card-title>
    <v-card-text>
      <v-simple-table dense class="review-table mb-2">
        <thead>
          <tr>
            <th>Type</th>
            <th>Field</th>
            <th>New Value</th>
            <th>Old Value</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(change, idx) in userChanges">
            <tr :key="`user-change-${idx}`">
              <td>{{ change.type }}</td>
              <td><code>{{ change.field }}</code></td>
              <td v-html="formatValueForTable(change.newValue, change.field)"></td>
              <td v-html="formatValueForTable(change.oldValue, change.field)"></td>
            </tr>
          </template>
          <template v-if="derivedChanges.length > 0">
            <tr>
              <td :colspan="4" class="font-weight-bold text-left pt-6 pb-2">Derived Changes</td>
            </tr>
            <template v-for="(change, idx) in derivedChanges">
              <tr :key="`derived-change-${idx}`">
                <td>{{ change.type }}</td>
                <td><code>{{ change.field }}</code></td>
                <td v-html="formatValueForTable(change.oldValue, change.field)"></td>
                <td v-html="formatValueForTable(change.newValue, change.field)"></td>
              </tr>
            </template>
          </template>
        </tbody>
      </v-simple-table>
    </v-card-text>
  </v-card>
  
  <!-- Step 5: Submit Corrections (PATCH Preview) -->
  <v-card v-if="allChanges.length > 0" class="mt-4 pa-4 transition-swing" key="step5">
    <v-card-title>Correction Preview</v-card-title>
    <v-card-text>
      <pre class="pa-3 grey lighten-3 rounded"><code>{{ formattedPatchObject }}</code></pre>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="success" disabled>Submit to API (Not Implemented)</v-btn>
    </v-card-actions>
  </v-card>
  
</v-container>
</template>

<script>
import axios from 'axios';
import testDoiData from '../test-doi-data.json'; // Import the test data

function cloneDeep(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    return null;
  }
}

function isEqual(obj1, obj2) {
  try {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  } catch (e) {
    return false;
  }
}

export default {
  name: 'Corrections',
  data() {
    return {
      doiInput: '',
      selectedTestDoi: null,
      testDois: [
        { text: 'Gold: 10.2221/jcsj.9.70', value: '10.2221/jcsj.9.70' },
        { text: 'Green: 10.1016/j.cell.2007.11.019', value: '10.1016/j.cell.2007.11.019' },
        { text: 'Hybrid: 10.1080/03057925.2025.2483691', value: '10.1080/03057925.2025.2483691' },
        { text: 'Bronze: 10.2207/qjjws1943.22.275', value: '10.2207/qjjws1943.22.275' },
        { text: 'Closed: 10.1109/pvsc.1996.564405', value: '10.1109/pvsc.1996.564405' },
      ],
      metadata: null,
      loading: false,
      error: null,
      userChanges: [], // Stores user-initiated changes { field, oldValue, newValue, locationData? }
      shouldShowLocationForm: false, // Step 3 visibility
      currentChangeContext: null, // Track which button press triggered the form
      locationFormData: { // Step 3 Form Data
        url: '',
        host_type: null,
        version: null,
        license: null,
      },
      hostTypes: ['publisher', 'repository'], // Make constants available in template via data
      versions: ['publishedVersion', 'acceptedVersion', 'submittedVersion'],
      licenseTypes: [
      'unknown', 'cc-by', 'cc-by-nc-nd', 'cc-by-nc', 'cc-by-nc-sa',
      'publisher-specific-oa', 'public-domain', 'cc-by-sa', 'mit',
      'cc-by-nd', 'gpl-v3', 'apache-2-0', 'isc', 'other-oa'
      ],
      activeCorrectionAction: null, // Dev: Track which button is active
    };
  },
  computed: {
    displayTitle() {
      return this.metadata && this.metadata.title ? this.metadata.title : 'No Title Found';
    },
    displayDoi() {
      return this.metadata && this.metadata.doi ? this.metadata.doi : 'No DOI Found';
    },
    displayDoiUrl() {
      return this.metadata && this.metadata.doi_url ? this.metadata.doi_url : '#';
    },
    displayBestOaUrl() {
      return this.metadata && this.metadata.best_oa_location && this.metadata.best_oa_location.url
      ? this.metadata.best_oa_location.url
      : null;
    },
    displayIsOa() {
      return this.metadata && typeof this.metadata.is_oa === 'boolean' ? this.metadata.is_oa : null;
    },
    displayJournalIsOa() {
      return this.metadata && typeof this.metadata.journal_is_oa === 'boolean' ? this.metadata.journal_is_oa : null;
    },
    apiUrl() {
      const doi = this.displayDoi;
      return doi !== 'No DOI Found' ? `https://api.openalex.org/unpaywall/${doi}` : '#';
    },
    locationFormTitle() {
      if (this.activeCorrectionAction === 'correctUrl') {
        return 'Correct Location Details';
      } else if (this.activeCorrectionAction === 'addUrl' || this.activeCorrectionAction === 'correctIsOaTrue') {
        return 'Add Location Details';
      }
      return 'Location Details'; // Default fallback
    },
    locationFormSubtitle() {
      if (this.activeCorrectionAction === 'correctUrl') {
        return null; // No subtitle for correcting
      } else if (this.activeCorrectionAction === 'addUrl' || this.activeCorrectionAction === 'correctIsOaTrue') {
        return 'Please provide details for location where this article can be freely found online.';
      }
      return null; // Default fallback
    },
    derivedChanges() {
      if (!this.metadata) return [];
      const derived = [];
      const originalMetadata = this.metadata;
      const originalBestOa = this.getProp(originalMetadata, 'best_oa_location');
      const originalOaLocations = this.getProp(originalMetadata, 'oa_locations', []);

      this.userChanges.forEach(change => {
        // Remove URL
        if (change.type === 'Remove' && change.field === 'best_oa_location.url') {
          if (originalBestOa && originalBestOa.url === change.oldValue) {
            derived.push({
              type: 'Remove Location',
              field: 'best_oa_location',
              oldValue: originalBestOa,
              newValue: null
            });
          }
          if (originalOaLocations && originalOaLocations.length > 0) {
            const removedLoc = originalOaLocations.find(loc => loc && loc.url === change.oldValue);
            if (removedLoc) {
              derived.push({
                type: 'Remove Location',
                field: 'oa_locations',
                oldValue: removedLoc,
                newValue: null
              });
            }
          }
        }
        // is_oa set to false
        if (change.type === 'Update' && change.field === 'is_oa' && change.newValue === false) {
          if (originalBestOa) {
            derived.push({
              type: 'Remove Location',
              field: 'best_oa_location',
              oldValue: originalBestOa,
              newValue: null
            });
          }
          if (originalOaLocations && originalOaLocations.length > 0) {
            originalOaLocations.forEach(loc => {
              derived.push({
                type: 'Remove Location',
                field: 'oa_locations',
                oldValue: loc,
                newValue: null
              });
            });
          }
        }
      });
      // No deduplication needed for new table format
      return derived;
    },
    allChanges() {
      return [...this.userChanges, ...this.derivedChanges];
    },
    formattedPatchObject() {
      if (!this.metadata || this.allChanges.length === 0) {
        return null;
      }

      const originalDoc = this.metadata;
      const newDoc = cloneDeep(originalDoc);

      const { finalOaLocations, finalBestOaLocation, finalIsOa } = this.calculateNewLocationState(
        originalDoc,
        this.userChanges,
        this.derivedChanges
      );

      this.setProp(newDoc, 'oa_locations', finalOaLocations);
      this.setProp(newDoc, 'best_oa_location', finalBestOaLocation);
      this.setProp(newDoc, 'is_oa', finalIsOa);

      this.applyDirectFieldChanges(newDoc, this.allChanges);

      return this.buildPatchObject(originalDoc, newDoc);
    },
  },
  methods: {
    normalizeDoi(doi) {
      if (!doi) return null;
      let normalized = doi.replace(/^https?:\/\/doi\.org\//, '');
      return normalized.startsWith('10.') ? normalized : null;
    },
    submitDoi() {
      const normalized = this.normalizeDoi(this.doiInput);
      if (normalized) {
        this.fetchMetadata(normalized);
      } else {
        this.error = 'Invalid DOI format. Please enter a valid DOI (e.g., 10.1234/example).';
        this.metadata = null;
      }
    },
    submitDoiFromTest() {
      if (this.selectedTestDoi) {
        this.doiInput = this.selectedTestDoi;
        this.fetchMetadata(this.selectedTestDoi);
      }
    },
    fetchRandomDoi() {
      this.loading = true;
      this.error = null;
      this.metadata = null;
      axios.get('https://api.openalex.org/works?filter=indexed_in:crossref&sample=1')
      .then(response => {
        if (response.data && response.data.results && response.data.results.length > 0) {
          const randomDoi = this.normalizeDoi(response.data.results[0].doi);
          if (randomDoi) {
            this.doiInput = randomDoi;
            this.fetchMetadata(randomDoi);
          } else {
            this.error = 'Failed to get a valid random DOI from OpenAlex.';
            this.loading = false;
          }
        } else {
          this.error = 'Failed to fetch random DOI from OpenAlex.';
          this.loading = false;
        }
      })
      .catch(err => {
        this.error = `Error fetching random DOI: ${err.message}`;
        this.loading = false;
      });
    },
    fetchMetadata(doi) {
      const normalizedDoi = this.normalizeDoi(doi);

      if (testDoiData[normalizedDoi]) {
        this.loading = true;
        this.error = null;
        this.metadata = null;
        this.userChanges = [];

        setTimeout(() => {
          this.metadata = cloneDeep(testDoiData[normalizedDoi]);
          this.resetCorrections();
          this.loading = false;
        }, 100);
        return;
      }

      this.loading = true;
      this.error = null;
      this.metadata = null;
      this.userChanges = [];
      const apiUrl = `https://api.openalex.org/unpaywall/${normalizedDoi}`;

      axios.get(apiUrl)
      .then(response => {
        this.metadata = response.data;
        this.loading = false;
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          this.error = `DOI not found: ${doi}`;
        } else {
          this.error = `Error fetching metadata for ${doi}: ${err.message}`;
        }
        this.metadata = null;
        this.loading = false;
      });
    },
    addUrl() {
      this.resetCorrections();
      this.currentChangeContext = { action: 'add', field: 'best_oa_location.url' };
      this.shouldShowLocationForm = true;
      this.activeCorrectionAction = 'addUrl';
    },
    correctUrl() {
      this.resetCorrections();
      const bestLocation = this.getProp(this.metadata, 'best_oa_location');
      if (bestLocation) {
        this.locationFormData = {
          url: bestLocation.url || '',
          host_type: bestLocation.host_type || null,
          version: bestLocation.version || null,
          license: bestLocation.license || null,
        };
      } else {
        this.resetLocationForm();
      }
      this.currentChangeContext = {
        action: 'correct',
        field: 'best_oa_location.url',
        oldValue: bestLocation ? bestLocation.url : null
      };
      this.shouldShowLocationForm = true;
      this.activeCorrectionAction = 'correctUrl';
    },
    removeUrl() {
      this.resetCorrections();
      const urlToRemove = this.getProp(this.metadata, 'best_oa_location.url');
      if (urlToRemove) {
        this.userChanges.push({
          type: 'Remove',
          field: 'best_oa_location.url',
          oldValue: urlToRemove,
          newValue: null
        });
      }
      this.activeCorrectionAction = 'removeUrl';
    },
    correctIsOa(newValue) {
      this.resetCorrections();
      const oldValue = this.getProp(this.metadata, 'is_oa');
      this.userChanges.push({
        type: (oldValue === null || oldValue === undefined) ? 'Add' : 'Update',
        field: 'is_oa',
        oldValue: oldValue,
        newValue: newValue
      });
      this.activeCorrectionAction = newValue ? 'correctIsOaTrue' : 'correctIsOaFalse';

      if (newValue && !this.getProp(this.metadata, 'best_oa_location.url')) {
        this.currentChangeContext = { action: 'add', field: 'is_oa' };
        this.resetLocationForm();
        this.shouldShowLocationForm = true;
      } else {
        this.shouldShowLocationForm = false;
      }
    },
    correctJournalIsOa(newValue) {
      this.resetCorrections();
      const oldValue = this.getProp(this.metadata, 'journal_is_oa');
      this.userChanges.push({
        type: (oldValue === null || oldValue === undefined) ? 'Add' : 'Update',
        field: 'journal_is_oa',
        oldValue: oldValue,
        newValue: newValue
      });
      this.activeCorrectionAction = newValue ? 'correctJournalIsOaTrue' : 'correctJournalIsOaFalse';
    },
    resetCorrections() {
      this.userChanges = [];
      this.shouldShowLocationForm = false;
      this.locationFormData = {
        url: '',
        host_type: null,
        version: null,
        license: null,
      };
      this.activeCorrectionAction = null;
    },
    submitLocationForm() {
      if (this.$refs.locationForm.validate() && this.currentChangeContext) {
        // For add/correct location, treat as Add Location or Update Location
        let type = 'Add Location';
        let field = 'oa_locations';
        let oldValue = null;
        let newValue = { ...this.locationFormData };
        if (this.currentChangeContext.action === 'correct') {
          type = 'Update Location';
          // Find the old value from metadata
          const existingLocs = this.getProp(this.metadata, 'oa_locations', []);
          oldValue = existingLocs.find(loc => loc && loc.url === newValue.url) || null;
        }
        this.userChanges.push({
          type,
          field,
          oldValue,
          newValue
        });
        this.shouldShowLocationForm = false;
        this.currentChangeContext = null;
        this.resetLocationForm();
      } else {
        // Keep error log
      }
    },
    cancelLocationForm() {
      this.shouldShowLocationForm = false;
      this.currentChangeContext = null;
      this.resetLocationForm();
    },
    resetLocationForm() {
      if (this.$refs.locationForm) {
        this.$refs.locationForm.reset();
        this.$refs.locationForm.resetValidation();
      }
      this.locationFormData = {
        url: '',
        host_type: null,
        version: null,
        license: null,
      };
    },
    getDisplayValue(field) {
      const value = this.getProp(this.metadata, field);
      if (value === null || value === undefined) return 'None';
      if (typeof value === 'boolean') return value ? 'True' : 'False';
      return value;
    },
    getProp(obj, path, defaultValue = null) {
      const keys = path.split('.');
      let current = obj;
      for (const key of keys) {
        if (current === null || current === undefined || typeof current !== 'object') {
          return defaultValue;
        }
        current = current[key];
      }
      return (current === null || current === undefined) ? defaultValue : current;
    },
    setProp(obj, path, value) {
      const keys = path.split('.');
      let current = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // Create nested objects if they don't exist
        if (current[key] === undefined || current[key] === null || typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key];
      }
      // Set the value on the final nested object
      if (current && typeof current === 'object') {
          current[keys[keys.length - 1]] = value;
      } else {
          // Handle cases where the path is invalid or leads to a non-object before the final key
      }
    },
    formatLocationObject(location) {
      if (!location) return '';
      const details = [
        `URL: ${location.url}`,
        `Host: ${location.host_type}`,
        `Version: ${location.version}`,
        `License: ${location.license}`
      ].join(', ');
      return `<pre style="margin-left: 20px; background-color: #f5f5f5; padding: 5px; border-radius: 4px;">${details}</pre>`;
    },
    // Not used anymore: replaced by table format
    formatChangeForDisplay(change) {
      return '';
    },

    formatValueForTable(value, field) {
      // If this is a location object, format as a location block
      if (field === 'best_oa_location' || field === 'oa_locations' || (value && typeof value === 'object' && value.url && value.host_type)) {
        return this.formatLocationBlock(value);
      }
      // For booleans, show True/False
      if (typeof value === 'boolean') {
        return value ? 'True' : 'False';
      }
      // For null/undefined
      if (value === null || value === undefined) {
        return '<span class="grey--text">None</span>';
      }
      // For other types, show as code
      return `<code>${this.escapeHtml(String(value))}</code>`;
    },

    // Format a location block with only the location form fields and 150px width
    formatLocationBlock(location) {
      if (!location || typeof location !== 'object') return '';
      const fields = ['url', 'host_type', 'version', 'license'];
      let html = '<div class="location-block">';
      fields.forEach(field => {
        if (location[field]) {
          html += `<div><strong>${field.replace('_', ' ')}:</strong> ${this.escapeHtml(location[field])}</div>`;
        }
      });
      html += '</div>';
      return html;
    },

    escapeHtml(str) {
      return String(str).replace(/[&<>"]/g, function(s) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]);
      });
    },
    applyRemoveUrlRule(change, originalBestOa, derived) {
      if (change.action === 'remove' && change.field === 'best_oa_location.url') {
        if (originalBestOa && originalBestOa.url === change.oldValue) {
          derived.push({
            field: 'best_oa_location',
            oldValue: cloneDeep(originalBestOa),
            newValue: null,
            derived: true
          });
        }
      }
    },
    applySetIsOaFalseRule(change, originalBestOa, originalOaLocations, derived) {
      if (change.action === 'correct' && change.field === 'is_oa' && change.newValue === false) {
        if (originalBestOa) {
          derived.push({
            field: 'best_oa_location',
            oldValue: cloneDeep(originalBestOa),
            newValue: null,
            derived: true
          });
        }
        if (originalOaLocations && originalOaLocations.length > 0) {
          derived.push({
            field: 'oa_locations',
            oldValue: cloneDeep(originalOaLocations),
            newValue: [],
            derived: true
          });
        }
      }
    },
    calculateNewLocationState(originalDoc, userChanges, derivedChanges) {
      let currentOaLocations = cloneDeep(this.getProp(originalDoc, 'oa_locations', []));
      let bestOaLocationCandidate = cloneDeep(this.getProp(originalDoc, 'best_oa_location'));
      const originalBestOaUrl = bestOaLocationCandidate ? bestOaLocationCandidate.url : null;

      userChanges.forEach(change => {
        if (change.locationData) {
          const newLocationDetails = {
            url: change.locationData.url,
            host_type: change.locationData.host_type,
            version: change.locationData.version,
            license: change.locationData.license,
            is_oa: true,
          };

          if (change.action === 'add' || (change.action === 'correct' && change.field === 'is_oa' && change.newValue === true)) {
            if (!currentOaLocations.some(loc => loc && loc.url === newLocationDetails.url)) {
              currentOaLocations.push(newLocationDetails);
            }
            bestOaLocationCandidate = newLocationDetails;
          } else if (change.action === 'correct' && change.field === 'best_oa_location.url') {
            const oldUrl = change.oldValue;
            currentOaLocations = currentOaLocations.map(loc => {
              if (loc && loc.url === oldUrl) {
                return { ...loc, ...newLocationDetails };
              }
              return loc;
            });
            if (originalBestOaUrl === oldUrl) {
              bestOaLocationCandidate = currentOaLocations.find(loc => loc && loc.url === newLocationDetails.url) || null;
            }
          }
        } else if (change.action === 'remove' && change.field === 'best_oa_location.url') {
          const urlToRemove = change.oldValue;
          currentOaLocations = currentOaLocations.filter(loc => !(loc && loc.url === urlToRemove));
          if (originalBestOaUrl === urlToRemove) {
            bestOaLocationCandidate = null;
          }
        }
      });

      derivedChanges.forEach(change => {
        if (change.field === 'oa_locations' && Array.isArray(change.newValue) && change.newValue.length === 0) {
          currentOaLocations = [];
          bestOaLocationCandidate = null;
        }
        if (change.field === 'best_oa_location' && change.newValue === null) {
          bestOaLocationCandidate = null;
        }
      });

      if (currentOaLocations.length === 0) {
        bestOaLocationCandidate = null;
      } else if (bestOaLocationCandidate && !currentOaLocations.some(loc => loc && loc.url === bestOaLocationCandidate.url)) {
        bestOaLocationCandidate = currentOaLocations.length > 0 ? currentOaLocations[0] : null;
      }

      return {
        finalOaLocations: currentOaLocations,
        finalBestOaLocation: bestOaLocationCandidate,
        finalIsOa: currentOaLocations.length > 0
      };
    },
    applyDirectFieldChanges(newDoc, allChanges) {
      allChanges.forEach(change => {
        if (change.field === 'journal_is_oa') {
          this.setProp(newDoc, change.field, change.newValue);
        }
      });
    },
    buildPatchObject(originalDoc, newDoc) {
      const patch = {
        doi: originalDoc.doi,
        new: {},
        old: {}
      };

      const originalKeys = Object.keys(originalDoc);
      const newKeys = Object.keys(newDoc);
      const allKeys = new Set([...originalKeys, ...newKeys]);

      allKeys.forEach(key => {
        if (key === 'doi') return;

        const originalValue = this.getProp(originalDoc, key);
        const newValue = this.getProp(newDoc, key);

        if (!isEqual(originalValue, newValue)) {
          patch.new[key] = newValue;
          patch.old[key] = originalValue;
        }
      });

      if (Object.keys(patch.new).length === 0) {
        return null;
      }

      return patch;
    },
  }
};
</script>

<style scoped>
.doi-field {
  border-bottom: 1px solid #eee;
  padding: 6px 16px;
}
.v-list-item__content > .v-list-item__title.wrap-text {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: clip !important;
  line-height: 1.3em !important;
  height: auto !important;
}
.v-list-item__content > .v-list-item__subtitle.wrap-text {
  white-space: normal !important;
  word-break: break-all;
  overflow: visible !important;
  text-overflow: clip !important;
}
.v-list-item {
  padding: 0 !important;
}
.change-item {
  line-height: 1.3 !important;
}
.change-item code {
  line-height: 1.3 !important;
}
pre {
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 400px;
  overflow-y: auto;
}
.button-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
