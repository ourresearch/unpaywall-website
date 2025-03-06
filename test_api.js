const axios = require('axios');
const fs = require('fs');

// The API endpoint from SimpleQueryTool.vue
const API_URL = "https://unpaywall-simple-query-tool-c76bcdcacd9a.herokuapp.com/v2/dois";

// Sample valid DOIs from the test_dois.txt file
const validDois = [
  "10.1037/018882",
  "10.1086/466942",
  "10.1186/gb-2004-5-10-r80",
  "10.1080/00273171.2011.568786",
  "10.1016/j.cell.2007.11.019"
];

// Some malformed DOIs to test error handling
const malformedDois = [
  "10.1234/invalid",
  "not-a-doi",
  "10.1037/018882.invalid",
  "10.1",
  ""
];

// Combined test set
const allDois = [...validDois, ...malformedDois];

// Function to get response in CSV format
async function testCSVFormat() {
  console.log("Testing CSV format...");
  try {
    const response = await axios.post(API_URL, { dois: allDois }, {
      responseType: 'arraybuffer',
      timeout: 60000
    });
    
    // Convert ArrayBuffer to string
    const decoder = new TextDecoder('utf-8');
    const data = decoder.decode(response.data);
    
    fs.writeFileSync('api_response_csv.txt', data);
    console.log("CSV response saved to api_response_csv.txt");
    return data;
  } catch (error) {
    console.error("Error with CSV request:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      if (error.response.data) {
        try {
          const decoder = new TextDecoder('utf-8');
          const errorText = decoder.decode(error.response.data);
          console.error("Error response:", errorText);
          fs.writeFileSync('api_error_csv.txt', errorText);
          console.log("CSV error response saved to api_error_csv.txt");
        } catch (e) {
          console.error("Could not decode error response");
        }
      }
    }
    return null;
  }
}

// Function to get response in JSONL format
async function testJSONLFormat() {
  console.log("Testing JSONL format...");
  try {
    const response = await axios.post(API_URL, { dois: allDois }, {
      responseType: 'arraybuffer',
      params: { format: 'jsonl' },
      timeout: 60000
    });
    
    // Convert ArrayBuffer to string
    const decoder = new TextDecoder('utf-8');
    const data = decoder.decode(response.data);
    
    fs.writeFileSync('api_response_jsonl.txt', data);
    console.log("JSONL response saved to api_response_jsonl.txt");
    return data;
  } catch (error) {
    console.error("Error with JSONL request:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      if (error.response.data) {
        try {
          const decoder = new TextDecoder('utf-8');
          const errorText = decoder.decode(error.response.data);
          console.error("Error response:", errorText);
          fs.writeFileSync('api_error_jsonl.txt', errorText);
          console.log("JSONL error response saved to api_error_jsonl.txt");
        } catch (e) {
          console.error("Could not decode error response");
        }
      }
    }
    return null;
  }
}

// Test individual DOI to see detailed response
async function testSingleDoi(doi) {
  console.log(`Testing single DOI: ${doi}...`);
  try {
    const response = await axios.post(API_URL, { dois: [doi] }, {
      responseType: 'arraybuffer',
      params: { format: 'jsonl' },
      timeout: 60000
    });
    
    // Convert ArrayBuffer to string
    const decoder = new TextDecoder('utf-8');
    const data = decoder.decode(response.data);
    
    fs.writeFileSync(`api_response_${doi.replace('/', '_')}.txt`, data);
    console.log(`Response for DOI ${doi} saved to api_response_${doi.replace('/', '_')}.txt`);
    return data;
  } catch (error) {
    console.error(`Error with DOI ${doi}:`, error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      if (error.response.data) {
        try {
          const decoder = new TextDecoder('utf-8');
          const errorText = decoder.decode(error.response.data);
          console.error("Error response:", errorText);
          fs.writeFileSync(`api_error_${doi.replace('/', '_')}.txt`, errorText);
          console.log(`Error for DOI ${doi} saved to api_error_${doi.replace('/', '_')}.txt`);
        } catch (e) {
          console.error("Could not decode error response");
        }
      }
    }
    return null;
  }
}

// Run tests
async function runTests() {
  // Test batch requests
  await testCSVFormat();
  await testJSONLFormat();
  
  // Test a few individual DOIs
  await testSingleDoi(validDois[0]);
  await testSingleDoi(malformedDois[0]);
  
  console.log("All tests completed!");
}

runTests();
