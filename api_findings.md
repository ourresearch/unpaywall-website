# Unpaywall Simple Query Tool API Analysis

This document summarizes the behavior of the API endpoint used in the SimpleQueryTool.

## API Endpoint Details

- **URL**: `https://unpaywall-simple-query-tool-c76bcdcacd9a.herokuapp.com/v2/dois`
- **Method**: POST
- **Payload**: JSON object with a `dois` array
- **Format Parameter**: Optional query parameter `format=jsonl` for JSONL format

## Response Structure

The API returns an object with the following structure:

```json
{
  "results": {
    "10.1037/018882": { /* DOI metadata */ },
    "10.1234/invalid": { /* Error information */ }
  },
  "errors_dict": {
    "10.1234/invalid": { /* Error information */ }
  },
  "total": 10,
  "success": 9,
  "errors": 1,
  "jsonl": "...",  // JSONL-formatted version of results
  "csv": "..."     // CSV-formatted version of results
}
```

### Valid DOI Response Example

For a valid DOI, the API returns extensive metadata:

```json
{
  "doi": "10.1037/018882",
  "doi_url": "https://doi.org/10.1037/018882",
  "title": "Review of Psychometric theory (2nd ed.).",
  "genre": "journal-article",
  "is_paratext": false,
  "published_date": "1979-07-01",
  "year": 1979,
  "journal_name": "Contemporary Psychology: A Journal of Reviews",
  "journal_issns": "0010-7549",
  "journal_issn_l": "0010-7549",
  "journal_is_oa": false,
  "journal_is_in_doaj": false,
  "publisher": "Portico",
  "is_oa": false,
  "oa_status": "closed",
  "has_repository_copy": false,
  "best_oa_location": null,
  "first_oa_location": null,
  "oa_locations": [],
  "oa_locations_embargoed": [],
  "updated": "2021-03-28T06:00:46.270660",
  "data_standard": 2,
  "z_authors": [
    {
      "given": "ROSEDITH",
      "family": "SITGREAVES",
      "sequence": "first"
    }
  ]
}
```

### Open Access DOI Example

For an open access article, the `is_oa` field is `true` and additional OA location information is provided:

```json
{
  "is_oa": true,
  "oa_status": "gold",
  "has_repository_copy": true,
  "best_oa_location": {
    "updated": "2025-03-06T15:09:14.020297",
    "url": "https://genomebiology.biomedcentral.com/counter/pdf/10.1186/gb-2004-5-10-r80",
    "url_for_pdf": "https://genomebiology.biomedcentral.com/counter/pdf/10.1186/gb-2004-5-10-r80",
    "url_for_landing_page": "https://doi.org/10.1186/gb-2004-5-10-r80",
    "evidence": "oa journal (via doaj)",
    "license": "cc-by",
    "version": "publishedVersion",
    "host_type": "publisher",
    "is_best": true,
    "pmh_id": null,
    "endpoint_id": null,
    "repository_institution": null,
    "oa_date": "2004-09-15"
  },
  "oa_locations": [
    /* Array of available OA locations */
  ]
}
```

### Invalid DOI Response Example

For invalid DOIs, the API includes them in both `results` and `errors_dict` with error details:

```json
{
  "doi": "10.1234/invalid",
  "error": "HTTP error: 404",
  "message": "Client error '404 NOT FOUND' for url 'https://api.unpaywall.org/10.1234/invalid?email=team%40ourresearch.org'\nFor more information check: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404"
}
```

## Error Handling

The API doesn't fail the entire request if some DOIs are invalid. Instead, it:

1. Processes all valid DOIs normally
2. For invalid DOIs, it includes error information in both `results` and `errors_dict`
3. The response includes counts of total, successful, and error cases

## CSV and JSONL Formats

The API response always includes:

1. A `jsonl` field with JSONL-formatted results (one JSON object per line)
2. A `csv` field with CSV-formatted results 

When using `format=jsonl` in the request, the response is still the same structure, but the focus is on the JSONL format.

## Key Observations for SimpleQueryTool Modification

1. The API successfully handles batches of DOIs, even when some are invalid
2. No special error handling is needed for invalid DOIs, as they're included in the response
3. The API already provides both CSV and JSONL formats in a single response
4. For large numbers of DOIs, batching is still recommended as shown in the current code
5. Both `arraybuffer` and JSON responses appear to be supported
