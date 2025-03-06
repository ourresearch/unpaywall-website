import requests
import json
import os

# The API endpoint from SimpleQueryTool.vue
API_URL = "https://unpaywall-simple-query-tool-c76bcdcacd9a.herokuapp.com/v2/dois"

# Create a directory to store API responses if it doesn't exist
os.makedirs("api_responses", exist_ok=True)

# Sample valid DOIs from the test_dois.txt file
valid_dois = [
    "10.1037/018882",
    "10.1086/466942",
    "10.1186/gb-2004-5-10-r80",
    "10.1080/00273171.2011.568786",
    "10.1016/j.cell.2007.11.019"
]

# Some malformed DOIs to test error handling
malformed_dois = [
    "10.1234/invalid",
    "not-a-doi",
    "10.1037/018882.invalid",
    "10.1",
    ""
]

# Combined test set
all_dois = valid_dois + malformed_dois

def test_csv_format():
    """Test the API with CSV format response"""
    print("Testing CSV format...")
    try:
        response = requests.post(API_URL, json={"dois": all_dois}, timeout=60)
        
        # Save the response
        with open("api_responses/response_csv.txt", "w") as f:
            f.write(response.text)
        
        print(f"CSV response saved to api_responses/response_csv.txt")
        return response.text
    except Exception as e:
        print(f"Error with CSV request: {str(e)}")
        if hasattr(e, 'response') and e.response:
            print(f"Response status: {e.response.status_code}")
            with open("api_responses/error_csv.txt", "w") as f:
                f.write(e.response.text)
            print(f"CSV error response saved to api_responses/error_csv.txt")
        return None

def test_jsonl_format():
    """Test the API with JSONL format response"""
    print("Testing JSONL format...")
    try:
        response = requests.post(API_URL, json={"dois": all_dois}, params={"format": "jsonl"}, timeout=60)
        
        # Save the response
        with open("api_responses/response_jsonl.txt", "w") as f:
            f.write(response.text)
        
        print(f"JSONL response saved to api_responses/response_jsonl.txt")
        return response.text
    except Exception as e:
        print(f"Error with JSONL request: {str(e)}")
        if hasattr(e, 'response') and e.response:
            print(f"Response status: {e.response.status_code}")
            with open("api_responses/error_jsonl.txt", "w") as f:
                f.write(e.response.text)
            print(f"JSONL error response saved to api_responses/error_jsonl.txt")
        return None

def test_single_doi(doi):
    """Test the API with a single DOI"""
    print(f"Testing single DOI: {doi}...")
    try:
        response = requests.post(API_URL, json={"dois": [doi]}, params={"format": "jsonl"}, timeout=60)
        
        # Create a valid filename
        filename = doi.replace("/", "_").replace(":", "_")
        
        # Save the response
        with open(f"api_responses/response_{filename}.txt", "w") as f:
            f.write(response.text)
        
        print(f"Response for DOI {doi} saved to api_responses/response_{filename}.txt")
        return response.text
    except Exception as e:
        print(f"Error with DOI {doi}: {str(e)}")
        if hasattr(e, 'response') and e.response:
            print(f"Response status: {e.response.status_code}")
            with open(f"api_responses/error_{filename}.txt", "w") as f:
                f.write(e.response.text)
            print(f"Error for DOI {doi} saved to api_responses/error_{filename}.txt")
        return None

def create_combined_response_file():
    """Create a single file with all responses for easier reference"""
    print("Creating combined response file...")
    
    content = "# API Test Results\n\n"
    
    # Add CSV format results
    content += "## CSV Format (All DOIs)\n\n"
    try:
        with open("api_responses/response_csv.txt", "r") as f:
            csv_content = f.read()
        content += "```csv\n" + csv_content + "\n```\n\n"
    except:
        content += "CSV response not available\n\n"
    
    # Add JSONL format results
    content += "## JSONL Format (All DOIs)\n\n"
    try:
        with open("api_responses/response_jsonl.txt", "r") as f:
            jsonl_content = f.read()
            
        # Try to pretty format each JSON line
        pretty_jsonl = ""
        for line in jsonl_content.strip().split("\n"):
            try:
                obj = json.loads(line)
                pretty_jsonl += json.dumps(obj, indent=2) + "\n\n"
            except:
                pretty_jsonl += line + "\n"
                
        content += "```json\n" + pretty_jsonl + "\n```\n\n"
    except:
        content += "JSONL response not available\n\n"
    
    # Add individual DOI results
    content += "## Individual DOI Tests\n\n"
    
    # Valid DOIs
    content += "### Valid DOIs\n\n"
    for doi in valid_dois:
        filename = doi.replace("/", "_").replace(":", "_")
        content += f"#### DOI: {doi}\n\n"
        try:
            with open(f"api_responses/response_{filename}.txt", "r") as f:
                response_content = f.read()
                
            # Try to pretty format JSON
            try:
                obj = json.loads(response_content)
                pretty_json = json.dumps(obj, indent=2)
                content += "```json\n" + pretty_json + "\n```\n\n"
            except:
                content += "```\n" + response_content + "\n```\n\n"
        except:
            content += f"Response not available for {doi}\n\n"
    
    # Malformed DOIs
    content += "### Malformed DOIs\n\n"
    for doi in malformed_dois:
        if not doi:  # Skip empty string
            doi_display = "(empty string)"
            filename = "empty"
        else:
            doi_display = doi
            filename = doi.replace("/", "_").replace(":", "_")
            
        content += f"#### DOI: {doi_display}\n\n"
        try:
            with open(f"api_responses/response_{filename}.txt", "r") as f:
                response_content = f.read()
                
            # Try to pretty format JSON
            try:
                obj = json.loads(response_content)
                pretty_json = json.dumps(obj, indent=2)
                content += "```json\n" + pretty_json + "\n```\n\n"
            except:
                content += "```\n" + response_content + "\n```\n\n"
        except:
            content += f"Response not available for {doi_display}\n\n"
    
    # Save the combined file
    with open("api_responses.md", "w") as f:
        f.write(content)
        
    print("Combined response saved to api_responses.md")

def run_tests():
    """Run all tests"""
    # Test batch requests
    test_csv_format()
    test_jsonl_format()
    
    # Test individual valid DOIs
    for doi in valid_dois:
        test_single_doi(doi)
    
    # Test individual malformed DOIs
    for doi in malformed_dois:
        if doi:  # Skip empty string
            test_single_doi(doi)
    
    # Create combined response file
    create_combined_response_file()
    
    print("All tests completed!")

if __name__ == "__main__":
    run_tests()
