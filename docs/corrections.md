# Unpaywall Corrections Tool PRD

## Overview
Build a Vue 2 / Vuetify Single-File Component named `Corrections` that guides a user through submitting corrections for a Unpaywall DOI Journal record. The component steps users through:
1. Retrieve metadata for a DOI or Journal
2. Let the user suggest edits
3. Gather any additional information required
4. Review Changes and Submit
5. Corrections POST Preview (for development)

## UI Layout
- **Container**: Centered, 800px wide.
- **Header**: Fix Unpaywall Errors (left-aligned).
- Step 1 should appear first in its own card. 
- Starting with step 2, the top content of step 2 (the title / journal name and DOI link / ISSN) should remain fixed. Subsequent steps should replace the content below top content in a subcard inside the main card.

## URL Behavior
- `/fix` - the root page this app
- `/fix/work` - the root page of this app only showing the option to Fix a DOI
- `/fix/journal` - the root page of this app only showing the option to Fix a Journal
- `/fix/work/:doi` - the app loading to step 2 after fetching the DOI metadata for :doi
- `/fix/journal/:issn` - the app loading to step 2 after fetching the Journal metadata for :issn

URLs should work for direct entry in the app state. 
URLs should update as user steps through app state, allowing back/forward navigation.

## 1. Retrieve Document Metadata

Get a DOI or Journal ISSN and get its metadata from the API.
Normalize DOIs by removing any `https://doi.org/` prefix before calling API. Don't URL encode DOIs for API.

Show two UI sections, side by side labeled "Correct a DOI" and "Correct a Journal".

### 1.1 Correct a DOI

#### 1.1.1 DOI Input
- **Text field** (fills available width) + right-aligned “Submit” button, equal height.
- When clicked:
  - `GET https://api.openalex.org/unpaywall/<doi>`
  - Display loading/error states.

### 1.2 Correct a Journal

#### 1.2.1 Journal Input
- **Text field** (fills available width) + right-aligned “Submit” button, equal height.
- When clicked:
  - `GET https://api.openalex.org/sources/issn:<issn>`
  - Display loading/error states.

### 1.3 Test Section

For development purposes, during step 1 show a card positioned absolutely to the left of the main card. This card should be 200px wide and contain three control stacked vertically

- **Random DOI** (small, primary v-btn)
   - Fetch `GET https://api.openalex.org/works?filter=indexed_in:crossref&sample=1`
   - Extract `results[0].doi`, then fetch metadata as above and move to step 2.
- **Dropdown** labeled “Test DOIs” with options:
   - gold — `10.2221/jcsj.9.70`
   - green — `10.1016/j.cell.2007.11.019`
   - hybrid — `10.1080/03057925.2025.2483691`
   - bronze — `10.2207/qjjws1943.22.275`
   - closed — `10.1109/pvsc.1996.564405`
   - For development purposes load data for the Test DOIs from '../test-doi-data.json'
   - On select, immediately fetch metadata and move to step 2.
- **Random ISSN** (small, primary v-btn)
   - Fetch `GET https://api.openalex.org/sources?filter=has_issn:true&sample=1`
   - Extract `results[0].issn_l`, then fetch metadata as above and move to step 2.
- **Dropdown** labeled “Test ISSNs" with options:
   - open — `2693-8499`
   - close — `1040-8401`
   - For development purposes load data for the data from '../test-doi-data.json'
   - On select, immediately fetch metadata and move to step 2.

## 1.4 Loading State

While any API calls are in progress, indicate looading state only with a v-progress-linear in its own empty card. No other cards should be displayed while the loading card is visible.

## 2. Display & Edit Fields

### 2.1 DOI

#### 2.1.1 DOI Top Section
- **Card** layout
- **Title**: right-aligned “API” link opens raw JSON in new tab.
- **DOI**:sSubtitle under title (smaller font), no label; link out to `doi_url`.

#### 2.1.2 DOI Subcard 
- If `is_oa` is true
-- show text "Unpaywall thinks this work is **free to read** at [the publisher | a repository]:" depending on `host_type`.
-- show `best_oa_location.url` (string url, links out to itself)
-- show button "This link is paywalled" (red, action name: "Remove")
-- show button "This link is wrong" (orange, action name: "Correct")

- If `is_oa` is false 
-- show text "Unpaywall thinks this work is **paywalled**."
-- show button "It's free to read" (green, action name: "Add")

### 2.2 Journal

#### 2.2.1 Journal Top Section
- **Card** layout
- **Name**: Large font, no label; right-aligned “API” link opens raw JSON in new tab.
- **ISSN**: Subtitle under name (smaller font), no label.

#### 2.2.2 Journal Subcard
- If `is_oa` is true  
  -- show text: "Unpaywall thinks this journal is **open access**."
  -- show button: "No, this journal is closed access" (red, action name: "Close")

- If `is_oa` is false  
  -- show text: "Unpaywall thinks this journal is **closed access**."
  -- show button: "No, this journal is open access" (green, action name: "Open")

### 2.3 Field Edit Buttons Effect
Field edit buttons create a list of user changes to the original document, but original document state is preserved.

FOR DEVELOPEMENT: after any of the edit buttons is clicked it should display a large check immediately to its right of that one button so the user can see it has been clicked. If a user later clicks a different button, the effect of the previous buttons should be undone, so that we can test only one path at time.

## 3. Gather Additional Information if Needed

### 3.1 DOI Location Form
If the user correction implies a existence of a new location, display a form to collect the following information:
- `url` (string url verified)
- `host_type` (radio buttons with `publisher` (default), `repository`)

### 3.1.1 DOI Location Form Title and Subtitle

If the location form is coming from a **Correct URL** correction, the title should be "Correct Location Details" with no subtitle.

If the location form is coming from an **Add URL** correction, the title should be "New Location" with subtitle that reads, "Please provide details for location where this article can be freely found online."

### 3.1.2 When Location Form is Required

User Corrections that require a new location:
- **Add URL**

User Corrections that required editing an existing location:
- **Correct URL** - this should prefill the form with all the form values from `best_oa_location`

If no new location is required, skip this step.

### 3.2 Journal Open Access Status Form

If the user correction changes the `is_oa` field from false to true, display a form labeled "In what year did this journal become open access?" with a radio button group and a text field with two options:
- Next to the first option show an input field for `oa_date` (number year)
- Label the second option: "This journal has always been open access"

If the first radio is selected a year is required in the input.
If the second radio is selected set `oa_date` to null.

### 3.3 Final Data Gathered
The final data gathered the user the following fields:
- DOI Case
-- `best_oa_location.url`
-- `best_oa_location.host_type`
- Journal Case
-- `is_oa`
-- `oa_date`

### 3.4 Saving Addtion Information

A "Save" button appears at the end of the form. After clicking it, the user moves to step 4.

## 4. Review Changes

### 4.2 Show Changes for Review

Under header that reads "Submit changes" display to the user a list of all changes. The text for each 
type of action should be:
- **Add** - "<span class="emoji-icon">✅</span> Added an <a>open access link</a> (<type>)." linking to the added URL; <type> is either "repository" or "publisher"
- **Remove** - "<span class="emoji-icon">❌</span> Reported a <a>broken open access link</a>." link to the removed link
- **Update** - "<span class="emoji-icon">✴️</span> Corrected an open access link to <a>:link</a>" linking to the updated link.
- **Open** - "<span class="emoji-icon">🟢</span> Reported a <journal> as open access since <year>." where <year> is `oa_date`
- **Close** - "<span class="emoji-icon">🛑</span> Reported a <journal> as closed access." where <journal> is the journal `display_name`.

### 4.2 Collect Email and Submit

Show a input with the label "Add your email in case we need to follow up (optional)" a button "Submit Correction".

## 5. Submit Corrections.

Post the data to the API endpoint `localhost:5006/corrections`.

After a successful POST, return to the entry state of `/fix` with a message about the main card that reads "You're correction has beeen received and will be reviewed within a a few days. Thank you for your help."

If there is an error, show an error message below the submit button.