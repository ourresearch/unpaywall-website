<template>
    <div class="page product-page simple-query-tool">
        <h1>Simple Query Tool</h1>
        <p>
            If you want to check a few articles to see if they are Open Access and don't want to mess with the <router-link to="/products/api">REST API,</router-link> you're in the right place. You can check up to 500 DOIs at once using this tool.
        </p>
        <p>
            We'll run the list through our API for you and give you a report on the Open Access status of each DOI. The results will be automatically downloaded to your computer in two formats:
        </p>
        <ul>
            <li>A CSV file that lets you easily import results into a spreadsheet like Excel.</li>
            <li>A <a href="http://jsonlines.org/">JSON Lines</a> file that shows what you'd get if you called our API once for each DOI.</li>
        </ul>
        <p>
             Don't forget to check the <router-link to="/data-format">schema documentation,</router-link> which includes definitions that will help you interpret the result files.
        </p>




        <!-- Ready state with input form -->
        <div class="io input" v-if="readyState === 'ready'">
                <h2>Submit DOIs</h2>
                <md-field :class="{'md-invalid': doisList.length > 500}">
                    <label for="dois-textarea">Paste DOIs here, one per line</label>
                    <md-textarea 
                        id="dois-textarea" 
                        v-model="dois"
                        class="dois-textarea"></md-textarea>
                    <span class="md-error" v-if="doisList.length > 500">Maximum 500 DOIs allowed</span>
                </md-field>

                <div class="info-text" v-if="doisList.length > 0">
                    <p>DOIs to process: {{ doisList.length }}</p>
                </div>

                <div>
                    <md-button @click="submit"
                               :disabled="!dois || doisList.length > 500"
                               class="md-primary md-raised">
                        Get Unpaywall data
                    </md-button>
                </div>
        </div>
        
        <!-- Working state with just processing message -->
        <div class="io working" v-if="readyState === 'working'">
                <h2>Creating download...</h2>
                <div class="processing-message">
                    <p>We are fetching your data now. This may take up to 30 seconds.</p>
                    <md-progress-bar md-mode="indeterminate"></md-progress-bar>
                </div>
        </div>


        <!-- SUCCESS! -->
        <div class="io success" v-show="readyState=='success'">
            <div class="results-container">
                <h2 class="results-title">Processing Complete!</h2>
                <p class="results-summary">
                    Processed {{ results.total }} DOIs. Found Unpaywall results for {{ results.success }} of them.
                    <span v-if="results.errors > 0" class="error-count">
                        Found {{ results.errors }} errors 
                        <md-button @click="toggleErrors" class="md-accent md-dense error-toggle-btn">
                            {{ showErrors ? 'Hide' : 'Show' }} DOIs
                        </md-button>
                    </span>
                </p>
                
                <!-- Error details section -->
                <div v-if="showErrors && Object.keys(errorDetails).length > 0" class="error-details">
                    <p class="error-explanation">
                        We weren't able to find results for these DOIs. They might be malformed, or they might not be Crossref DOIs (eg DataCite)... 
                        Unpaywall only works on Crossref DOIs.
                    </p>
                    <div class="doi-list">
                        <ul>
                            <li v-for="(_, doi) in errorDetails" :key="doi">{{ doi }}</li>
                        </ul>
                    </div>
                    <md-button @click="toggleErrors" class="md-accent">Hide DOIs</md-button>
                </div>
                
                <p class="download-instructions">
                    Download your results in CSV or JSON format:
                </p>
                <div class="download-buttons">
                    <md-button @click="downloadCsvFile" class="md-primary md-raised download-btn">
                        Download CSV
                    </md-button>
                    <md-button @click="downloadJsonFile" class="md-primary download-btn">
                        Download JSON
                    </md-button>
                </div>
            </div>
        </div>


        <!-- ERROR! -->
        <div class="io error" v-show="readyState=='error'">
                <h2>Sorry, there was a problem!</h2>
                <p>
                    Looks like we're having trouble processing your request. {{ errorMessage }}
                </p>
                <p>
                    Please try again with fewer DOIs or ensure your DOIs are valid. If the problem persists, contact us at 
                    <a href="mailto:support@unpaywall.org">support@unpaywall.org</a>.
                </p>
        </div>







    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "SimpleQueryTool",
        metaInfo: {
            title: "Simple Query Tool"
        },
        data: () => {
            return {
                readyState: "ready", // ready, working, success, error
                dois: "",
                processingBatches: false,
                csvData: [],
                jsonlData: [],
                errorMessage: "There may have been a problem with the DOIs you entered.",
                progressPercentage: 0,
                resultSummary: "",
                // The API can handle up to 500 DOIs in a single request
                csvFileData: null,
                jsonlFileData: null,
                errorDetails: {},
                showErrors: false,
                results: {
                    total: 0,
                    success: 0,
                    errors: 0
                }
            }
        },
        computed: {
            doisList() {
                return this.dois.split("\n")
                    .map(doi => doi.trim())
                    .filter(doi => doi !== "")
            }
        },
        methods: {
            // Download file helper
            downloadFile(data, filename, type) {
                const blob = new Blob([data], { type: type })
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', filename)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url) // Clean up memory
            },
            
            // Download CSV file
            downloadCsvFile() {
                if (this.csvFileData) {
                    const timestamp = new Date().toISOString().replace(/[:T.]/g, '-').substring(0, 19)
                    this.downloadFile(this.csvFileData, `unpaywall-results-${timestamp}.csv`, 'text/csv')
                }
            },
            
            // Download JSON file
            downloadJsonFile() {
                if (this.jsonlFileData) {
                    const timestamp = new Date().toISOString().replace(/[:T.]/g, '-').substring(0, 19)
                    this.downloadFile(this.jsonlFileData, `unpaywall-results-${timestamp}.jsonl`, 'application/json')
                }
            },

            // Process DOIs with a single API call that returns both CSV and JSONL formats
            async processDois(doisList) {
                const url = "https://unpaywall-simple-query-tool-c76bcdcacd9a.herokuapp.com/v2/dois"
                const postData = { dois: doisList }
                
                try {
                    // Make a single API call that returns both formats
                    const resp = await axios.post(url, postData, {
                        timeout: 60000 // 60 second timeout
                    })
                    
                    // The API response includes both CSV and JSONL formats
                    if (resp.data && resp.data.csv && resp.data.jsonl) {
                        // Convert the CSV and JSONL strings to array buffers for download
                        const encoder = new TextEncoder()
                        const csvBuffer = encoder.encode(resp.data.csv).buffer
                        const jsonlBuffer = encoder.encode(resp.data.jsonl).buffer
                        
                        // Return both formats along with success/error counts and error details
                        return {
                            csvData: csvBuffer,
                            jsonlData: jsonlBuffer,
                            success: resp.data.success || 0,
                            errors: resp.data.errors || 0,
                            total: resp.data.total || doisList.length,
                            errorDetails: resp.data.errors_dict || {}
                        }
                    } else {
                        console.error("Unexpected API response format:", resp.data)
                        throw new Error("The API response did not contain the expected CSV and JSONL data formats")
                    }
                } catch (error) {
                    console.error(`Error processing DOIs:`, error)
                    if (error.response) {
                        console.error("Response status:", error.response.status)
                        // Try to decode error message if possible
                        if (error.response.data) {
                            try {
                                // If the response is a string or buffer, decode it
                                const errorText = typeof error.response.data === 'string'
                                    ? error.response.data
                                    : new TextDecoder('utf-8').decode(error.response.data)
                                console.error("Error response:", errorText)
                            } catch (e) {
                                console.error("Could not decode error response", e)
                            }
                        }
                    }
                    throw error
                }
            },

            // Process all DOIs with a single API call that returns both formats
            async processAllDois() {
                // Reset state
                this.csvData = []
                this.jsonlData = []
                
                // Show progress
                this.progressPercentage = 50
                
                try {
                    // Single API call that returns both formats
                    const result = await this.processDois(this.doisList)
                    
                    // Store results
                    this.csvData = [result.csvData]
                    this.jsonlData = [result.jsonlData]
                    this.csvFileData = result.csvData
                    this.jsonlFileData = result.jsonlData
                    
                    // Update progress
                    this.progressPercentage = 100
                    
                    // Return results with metadata
                    return { 
                        csvData: this.csvData, 
                        jsonlData: this.jsonlData,
                        success: result.success,
                        errors: result.errors,
                        total: result.total,
                        errorDetails: result.errorDetails
                    }
                } catch (error) {
                    // Let the submit method handle the error
                    throw error
                }
            },

            // Extract contents from array buffer (simplified as we now have just one buffer)
            extractBuffer(buffers) {
                // Since we have a single API call now, we can just return the first buffer
                return buffers[0]
            },

            // Main submission function
            // Toggle error details display
            toggleErrors() {
                this.showErrors = !this.showErrors;
            },
            
            async submit() {
                if (this.doisList.length === 0) {
                    return
                }
                
                if (this.doisList.length > 500) {
                    this.errorMessage = "You can process a maximum of 500 DOIs at once. Please reduce the number of DOIs and try again."
                    this.readyState = "error"
                    return
                }
                
                this.readyState = "working"
                this.processingBatches = true
                
                try {
                    const results = await this.processAllDois()
                    
                    // Results are already in the right format, just extract the buffers
                    const csvData = results.csvData[0]
                    const jsonlData = results.jsonlData[0]
                    
                    // Store file data for download buttons
                    this.csvFileData = csvData
                    this.jsonlFileData = jsonlData
                    
                    // Log stats if available
                    if (results.success !== undefined && results.errors !== undefined) {
                        console.log(`DOI processing complete: ${results.success} successful, ${results.errors} errors`);
                        
                        // Store any error details from the API
                        this.errorDetails = results.errorDetails || {};
                        
                        // Store results for display in the template
                        this.results = {
                            total: results.total,
                            success: results.success,
                            errors: results.errors
                        };
                        
                        // Reset the show errors state
                        this.showErrors = false;
                        
                        // Log errors if present
                        if (results.errors > 0) {
                            console.warn(`Note: ${results.errors} of ${results.total} DOIs could not be processed.`);
                        }
                    }
                    
                        // Update UI
                    this.readyState = "success"
                    this.processingBatches = false
                    
                } catch (error) {
                    console.error("Error processing DOIs:", error)
                    this.errorMessage = "There was a problem processing your request. This might be due to server timeout or invalid DOIs."
                    this.readyState = "error"
                    this.processingBatches = false
                }
            }
        }

    }
</script>

<style scoped>
    h2 {
        margin: 0;
    }
    
    .info-text {
        margin: 1rem 0;
        font-size: 0.9rem;
    }
    
    .note {
        color: #db7719;
        font-style: italic;
    }
    
    .download-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .download-btn {
        min-width: 150px;
    }
    
    .error-details {
        background-color: #ffebee;
        border-radius: 4px;
        padding: 1rem;
        margin: 1rem 0;
        border-left: 4px solid #f44336;
    }
    
    .error-explanation {
        margin-top: 0;
        font-weight: 500;
    }
    
    .doi-list {
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        background-color: rgba(255, 255, 255, 0.5);
        padding: 0.5rem;
        margin: 0.5rem 0;
    }
    
    .doi-list ul {
        margin: 0;
        padding-left: 1.5rem;
    }
    

    
    .progress-container {
        margin: 1rem 0;
    }
    
    .disabled-textarea {
        background-color: #f5f5f5 !important;
        color: #757575 !important;
    }
    
    .processing-message {
        background-color: #e3f2fd;
        border-radius: 4px;
        padding: 1rem;
        margin: 1rem 0;
        border-left: 4px solid #2196F3;
    }
    
    .io.success {
        background-color: #f7fcf7 !important;
        color: #333;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        border: 1px solid #edf6ed;
        margin-top: 1.5rem;
    }
    
    .results-container {
        padding: 2rem;
    }
    
    .results-title {
        margin-top: 0;
        color: #88c477;
        font-weight: 500;
        margin-bottom: 1.5rem;
    }
    
    .results-summary {
        font-size: 1.1rem;
        line-height: 1.5;
        margin-bottom: 1.5rem;
    }
    
    .error-count {
        display: inline-block;
        margin-left: 5px;
    }
    
    .error-toggle-btn {
        margin: 0 0 0 5px;
        height: 20px;
        min-height: 20px;
        font-size: 12px;
        padding: 0 6px;
        vertical-align: baseline;
        line-height: 1;
        position: relative;
        top: -1px;
    }
    
    .download-instructions {
        margin-top: 2rem;
        font-weight: 500;
    }
</style>