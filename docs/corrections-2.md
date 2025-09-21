# Unpaywall Corrections Tool PRD

## Overview
Build a Vue 2 / Vuetify Single-File Component named `Corrections` that guides a user through submitting corrections for a Unpaywall DOI record. The component steps users through:
1. Retrieve metadata for a DOI
2. Let the user suggest edits
3. Gather any additional information required
4. Review Changes
5. Submit Corrections

## 1. Retrieve Document Metadata

Get a DOI and get its metadata from the Unpaywall API.
Normalize DOIs by removing any `https://doi.org/` prefix before calling API. Don't URL encode DOIs for API.

### 1.1 UI Layout
- **Container**: Centered, 800px wide.
- **Header**: “Submit a Correction to Unpaywall” (left-aligned).

### 1.2 DOI Input
- **Text field** (fills available width) + right-aligned “Submit” button, equal height.
- When clicked:
  - `GET https://api.openalex.org/unpaywall/<doi>`
  - Display loading/error states.

### 1.3 Test DOIs
Below the DOI input, two controls (equal height):
1. **Random DOI** (small, primary v-btn)
   - Fetch `GET https://api.openalex.org/works?filter=indexed_in:crossref&sample=1`
   - Extract `results[0].doi`, then fetch metadata as above.
2. **Dropdown** (300px wide) labeled “Test DOIs” with options:
   - gold — `10.2221/jcsj.9.70`
   - green — `10.1016/j.cell.2007.11.019`
   - hybrid — `10.1080/03057925.2025.2483691`
   - bronze — `10.2207/qjjws1943.22.275`
   - closed — `10.1109/pvsc.1996.564405`
   - On select, immediately fetch metadata.

## 2. Display & Edit Fields

### 2.1 Render Fields
- **Card** layout with light horizontal separators.
- **Title**: Large font, no label; right-aligned “API” link opens raw JSON in new tab.
- **DOI**: Subtitle under title (smaller font), no label; link to `doi_url`.
- **Other fields** (each with a label + value inline, wrapping long text):
  - `best_oa_location.url` (string url, links out to itself)
  - `is_oa` (boolean)
  - `journal_is_oa` (boolean)
- Missing values show as `None`.
- Show boolean values as `True` or `False` in `v-chip`.

### 2.2 Field Edit Buttons
Buttons (x-small, colored as marked, with white text) aligned to the right on the same row as each field value. 
- **best_oa_location.url**  If null: **Add URL** (green), else: **Correct URL** (orange) + **Remove Broken URL** (red), stacked vertically with margin between.
- **is_oa** if false **Change to True**, else **Change to False** (orange)
- **journal_is_oa** if false **Change to True**, else **Change to False** (orange)

### 2.3 Field Edit Buttons Effect
Field edit buttons create a list of user changes to the original DOI document, but original DOI document state is preserved.

FOR DEVELOPEMENT: after any of the edit buttons is clicked it should display a large check immediately to its right of that one button so the user can see it has been clicked. If a user later clicks a different button, the effect of the previous buttons should be undone, so that we can test only one path at time.

## 3. Gather Additional Information if Needed

### 3.1 Location Form
If the user correction implies a existence of a new location, display a form to collect the following information:
- `url` (string url verified)
- `host_type` (dropdown with `publisher`, `repository`)
- `version` (dropdown with `publishedVersion`, `acceptedVersion`, `submittedVersion`)
- `license` (dropdown with `unknown`,`cc-by`, `cc-by-nc-nd`, `cc-by-nc`, `cc-by-nc-sa`, `publisher-specific-oa`, `public-domain`, `cc-by-sa`, `mit`, `cc-by-nd`, `gpl-v3`, `apache-2-0`, `isc`, `other-oa`)

### 3.1.1 Locataion Form Title and Subtitle

If the location form is coming from a **Correct URL** correction, the title should be "Correct Location Details" with no subtitle.

If the location form is coming from an **Add URL** correction, the title should be "New Location" with subtitle that reads, "Please provide details for location where this article can be freely found online."

### 3.2 When Location Form is Required

User Corrections that require a new location:
- **Add URL**
- `is_oa` **Change to True**

User Corrections that required editing an existing location:
- **Correct URL** - this should prefill the form with all the form values from `best_oa_location`

If no new location is required, skip this step.

## 4. Review Changes

### 4.1 Generate Dependant Changes

Some user corrections imply changes to other parts of the document. We must generate a list of dependant changes separate from hte list of user changes.

#### 4.1.1 Adding, Removing, or Correcting Locations

In the DOI document `oa_locations` is a list of open access locations whose primary key is its `url` field. The value of the `best_oa_location` is also a single location.

- **Remove URL** removes the location with this URL from `oa_locations` and sets `best_oa_location` to null.
- `is_oa` **Change to False** removes all locations from `oa_locations` and sets `best_oa_location` to null.

- **Add URL** adds the new location to `oa_locations` and sets `best_oa_location` to this location.
- `is_oa` **Change to True** adds the new location to `oa_locations` and sets `best_oa_location` to this location.
- **Correct URL** - edits to the location should be applied to `best_oa_location` and also be applied to the matching location in `oa_locations`.

### 4.2 Show Changes for Review

Display to the user a human readable list of all changes.

Changes are displaed in a table that has the following columns:
- **Type**
- **Field**
- **New Value**
- **Old Value**

The types of changes are:
- **Update** - a simple field changed
- **Add** - a simple field value was changed from `null`
- **Remove** - a simple field value was changed to `null`
- **Add Location** - a location was added to `oa_locations`
- **Remove Location** - a location was removed from `oa_locations`
- **Update Location** - a location was updated in `oa_locations`

The table include all changes, starting with user changes and then listing derived changes. Before the the first derived change, there should be a row that spans all columns with a subheader that read "Derived Changes". The table should fill the width of its container without horizontal scrolling.

#### 4.2.1 Displaying the Value of a Location

For changes to locations list in `oa_locations` display each location in a small formatted block with width of 150px that includes only the fields in the location form.

This value of `best_oa_location` is a single location object so this format is also used when showing changes to the field `best_oa_location`.

## 5. Submit Corrections.

Sending correctins to the API is not yet implemented. For now, display a JSON PATCH object (with nice indentation and line breaks) that would be sent to the API. Only fields that have changed need to be included. 

Example PATHCH object:
{
  "doi": "<doi>",
  "new": { … },
  "old": { … }
}