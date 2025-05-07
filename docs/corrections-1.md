# 0.0 Unpaywall User Corrections Tool

This document summarizes the behavior of the of the Unpaywall Corrections Tool which is visible to users at /corrections. This tool is designed to help user submit corrections to data they encounter from the Unpaywall API. 

This tool is currently in progress and is not fully functional nor intended to be full functional. At this stage our goal is create a user friendly interface for seeing and creating a correction to be submitted to the backend. Instead of actually submitting corrections, for now we want to summarize to the user the correction data that would need to be submitted to the backend, which we will build at a future point. 

### 0.1 Interaction Flow Overview

The overal flow of the application happens in the following steps. Each step will be displayed to the user in sequential order in sections that appear one after the other vertically on the page together.

1. Getting a DOI to Work With.
2. Viewing the document and making specific corrections to it. This stage should show the initial state of the document and well as specific corrections that this user has made to it.
3. (Optional) Adding addition information required for the corrections to be valid. This stage will prompt for and represent additional data that must be collected to make the corrections valid.
4. Reviewing and confirming the corrections. This stage will show a summary of changes that the user had made as well as a summary of additional changes that are required to be made to keep the final document valid. 
5. Submitting the corrections (currently not implemented as we are not building the backend yet).

### 0.2 Header and Page Style

The page header should read "Submit a Correction to Unpaywall" and be aligned left. The Corrections tool content should have a width of 800px and be centered on the page.

## 1.0 Getting A Document

This step lets a user find a DOI to work with. At the end of this step we have the data for a single DOI document.

### 1.1 User Inputed DOI

The user should see a text input with a field for entering a DOI. The Input and "Submit" button should be the same height with a gap between them. When the user enters a DOI and clicks a button "Submit", the tool should make a request to the Unpaywall API to get the document metadata. The API endpoint is `https://api.openalex.org/unpaywall/:doi` where `:doi` is the DOI entered by the user. The input field should grow in width to fill its container so the "Submit" butten ends up aligned to the right.

NOTE: The API Endpoint is currently down. While this notes here please use this endpoint instead `https://api.unpaywall.org/:doi?email=team@ourresearch.org`.

### 1.2 Testing DOIs

For testing, the user should also see two options fo getting test DOIs a second line. First, a v-btn for a "Random DOI". This button should be small and color primary. Clicking this button should called this endpoint `https://api.openalex.org/works?filter=indexed_in:crossref&sample=1` then look in `results[0].doi` and use that DOI to make a request to the Unpaywall API to get the document metadata. 

Second, a dropdown for "Test DOIs" be available with the following labels and DOI values:
* gold - `10.2221/jcsj.9.70`
* green - `10.1016/j.cell.2007.11.019`
* hybrid - `10.1080/03057925.2025.2483691`
* bronze - `10.2207/qjjws1943.22.275`
* closed - `10.1109/pvsc.1996.564405`
Selecting an item from the dropdown should immediately load the document metadata for that DOI. The dropdown should have a width of 200px. The dropdown and the "Random DOI" button should be have equal heights.

### 1.3 Normalizing DOIs

Any DOIs either entered by the user or fetched from the API should be normalized to the form of a DOI without a prefix of https://doi.org/. When adding DOIs to URLs for API calls, DOIs do not need to be URL encoded.

## 2.0 Displaying a DOI Document

This step shows the user the document they have selected to correct and gives them specigic options to make edits to it. At the end of this step we have the data for a single DOI document as edited by the user.

Once a DOI document is obtained by the tool it should be displayed to the user with a subset of its fields which are helpful for the user or relevant to the corrections available. This section decribes their general layout while section 2.2 describes the buttons and interactions for creating corrections which are displayed inline with each field, but aligned to the right.

### 2.1 Fields to Display

The document should be displayed in a card with the following fields and no additional header. Unless stateed otherwise, fields should be prefaced with a label that is their exact field name as listed below. The label and value should appear inline, so each field is on single line. There should be a light horizontal line beween fields. The DOI field should appear more closely connected to the Title as as subtitle without a line above it, in smaller font than the title. To the right of the Title, aligned to the title's top, there should be a link named "API" with a link-out icon next to it which opens the API URL for this DOI document in a new tab.

The values of each field should wrap lines inside the space they have if they length is too long for a single line. With the exception of `title` and `doi` each of these fields should have custom edit butons alinged right on their line as described in the next section.

- `title` - display in larger font without a label
- `doi` - should be displayed as link to `doi_url` without a label
- `best_oa_location.url` - should be displayed as link to itself
- `best_oa_location.license`
- `is_oa`
- `oa_status`
- `journal_is_oa`

If a field is not present on the document it should be displayed as "None".

### 2.2 Editing the Document to Suggest Corrections

The following fields are correctable and should have one or more buttons which may each have a different function. The buttons should be aligned to the right of the container to their right edges are on the right of their container. When the user clicks a button that leads to an editing state, an input or dropdown should appear in place of the field value. For the buttons that change the value of Boolean field, they should just change the value immeditately with no intermediate editing state. 

#### 2.2.1 Edit Buttons

Each field should have exactly and only the buttons listed below in its initial state (note: there is no "Remove License" or "Remove Status" button).

* `best_oa_location.url`
** if null, button says "Add URL"
** if not null, show two buttons, one says "Correct URL" and one says "Remove Broken URL"
** After clicking "Add" or "Correct" and input should appear for the user to either change or add a new URL.
* `best_oa_location.license`
** if null, button says "Add License"
** if not null, button says "Correct License"
** After clicking either button a dropdown should appear with the following options: `["cc-by", "cc-by-nc-nd", "cc-by-nc", "cc-by-nc-sa", "publisher-specific-oa", "public-domain", "cc-by-sa", "mit", "cc-by-nd", "gpl-v3", "apache-2-0", "isc", "other-oa", "unknown"]`
* `is_oa`
** This is a boolean field, it should have a button which says "Correct to True" or "Correct to False"
* `oa_status`
** This is a string field, it should show a button that says "Correct OA Status". 
** After clicking "Correct OA Status" a dropdown should appear with the following options: `["gold", "green", "hybrid", "bronze", "closed"]`
* `journal_is_oa`
** This is a boolean field, it should have a button which says "Correct to True" or "Correct to False"

In the case where there are two edit buttons available (which is just the "Correct URL" and "Remove Broken URL" buttons for `best_oa_location.url_for_pdf`), they should displayed on top of one another with a gap between them.

#### 2.2.2 Edit State

Whenever a user is in editing state there should always appear and x-small, color primary "Save" button and a x-small, color gray "Cancel" button. These buttons should be inline with a gap between them so that they do not touch. While editing any field that has an input, the input should grow to fill availbe horizontal space. Once a user has clicked "Save" the field value should appear as it did originally, no longer in an editable form.

Whenever a user has made a correction to a field, there should appear on that line only a button that says "Undo" which will revert that field to its original value. This makes three possible button states
* Edit buttons as described in 2.2.2
* Edit State buttons while edit is in progress
* Undo button after an edit has been made.
Only the buttons for one of those three states should be visible at any time.


## 3.0 Checking Dependencies and Gathering Additional Information

This step checks for any dependencies among fields in the DOI document that the user has edited and prompts the user for additional information if required. At the end of this step we have the data for a single valid DOI document as edited by the user with any additional information required they have added to make it valid. We also may have a list of additional changes that we know are required by dependency rules to keep the document valid, even if the user has not specified them.

A UI representing this step is optional: if the dependancy checks shows that additional locations must be added, then it displays as a step to the user. If not, the UX skips to step 4. 

### 3.1 Understanding the Data Model and Dependencies in Corrections

The DOI Document model includes several depedencies among fields, and in certain cases changing one field will require changing depedent fields or prompting the user for additional information. There are three core entity types that are represented in the API response:

* Work - the DOI document itself represents a work.
* Location - a location is place on the internet where the work is available, at core definied by a `url` field. Each work may have zero or more locations which are repesented int the `oa_locations` array.
* Source - a source is an organization that publishes or hosts a work (typically a publisher or repository). Each location is conneted to a source. Information about the source of each location is not directly represented in the API response, but underlies the data on the backend that generates this API response, with the exception of the fields which begin with `journal_` - these fields are properties of the publisher source. 

The DOI document contains an array of all Open Access locations in `oa_locations`. One of those locations is marked with `is_best`. The location data of the best location is then copied into the `best_oa_location` field. The following top level fields depend on the values of the `oa_locations` array:
* `is_oa` - is true if `oa_locations` is not empty and false if it is.
* `has_repository_copy` - is true if `oa_locations` includes a location where `host_type` ==  `repository`
* `oa_status` is set according to the following logic, which matches conditions form top to bottom. The first condition that matches sets the value of `oa_status`:
** `gold` - if `journal_is_oa` == `true` and there is a location with `host_type` == `publisher`
** `green` - if `journal_is_oa` == `false` and there is a location with `host_type` == `repository`
** `hybrid` - if `journal_is_oa` == `false` and there is a location with `host_type` == `publisher` and the `license` field is set and is not `null`.
** `bronze` - if `journal_is_oa` == `false` and there is a location with `host_type` == `publisher` and `license` == `null` or is not set.
** `closed` - none of the above mathces

### 3.2 Data Dependency Rules

Keeping these depedencies true is required before a user can submit a correction. A user may make a single correction that requires other fields to change as well. The dependant changes may be clear and automatic (in which case they just need to be listed as a depedant change in section 4), or they may require additional user input to create a new location. 

We should treat the treat changes that the user has made as fixed. A dependancy rule may imply that given a field that a user has changed, a different field must change; but we cannot imply from the state of a field that the user has not changed that the user's change is invalid.

For changes that effect fields withn the `best_oa_location` object, the changes need to be applied to the underlying location object in `oa_locations` as well. 
* If `best_oa_location.url` is removed, this implies removing the corresponding location object from `oa_locations` as well (corresponding as having the same `url` field).
* If `best_oa_location.url` is changed, this implies changing the `url` field of the corresponding location object in `oa_locations`.
* If `best_oa_location.url` is added where previously there was none, this implies adding a new location object to `oa_locations` with the newly added `url` field.

Similar logic applies to changes to `best_oa_location.license` except that the `license` field is not required to be set on the location object, so changing it implies a change to the underlying location, but does not require adding or deleting a location. A change in `license` may require a change to `oa_status`.

Changing `is_oa` may imply a change to `oa_locations`. 
* If `is_oa` is set to `true`, this implies adding a new location object to `oa_locations`.
* If `is_oa` is set to `false`, this implies removing all location objects from `oa_locations`.

Changing `journal_is_oa` may imply a change to `oa_status`. The above rules for `oa_status` should be checked from top to bottom to find the first `oa_status` value that now matches.

Adding or removing locations from `oa_locations` may require changes to `is_oa`, `oa_status`, and `has_repository_copy`. After a location is added or removed from `oa_locations` the definitions to each of these fields should be checked to see if a dependant change is required.

### 3.3 Adding Additional Required Data

If the user's corrections require additional data to be valid, the tool should display a section labeled "Add New Locations". Given the requirements for data dependencies listed, the tools should create a human readable explanation of what data is required to make the corrections valid. Some example explanation texts include:

* "To change the OA Status to 'green', please add the URL of a repository copy of this document."
* "To change the OA Status to 'hybrid', please add the license of this document."
* "To change the Is OA value to 'true', please add a location with the URL where the article can be freely accessed."


### 3.4 Adding New Locations

If a user's initial corrections require adding a new location, the tool should show a form for the user to gather the required information for the new location:
* `url`
* `host_type` - one of `publisher`, `repository`
* `version` - one of `publishedVersion`, `acceptedVersion`, `submittedVersion`
* `license` - same as list of licenses above. 

If the user's corrections already have requirements for the values of the fields of a new location, they should be prefilled and fixed.

## 4.0 Displaying and Confirming Corrections to User 

This step shows a summary of changes made to the user for them to confirm before submitting. The changes are separeted into those that the user made directly and those that are a result of dependancy rules. After this step we have all the data we need oranized to sent to the API to update the document.

### 4.1 Summary of Changes

After the user has made corrections to the DOI and after additional information has been gather (if required) the user should see a section labeled "Confirm Corrections". This section should contain a summary of the changes that have been made to the document in human readable language. It should be divided into two sections: first the changes that the user actively made themselves, and second the changes that are required to satisfy the data dependencies of the corrections. Each change should be listed in only one of these sections but never both: either the user made the change themselves, or the change was a dependant change as a reuslt of the rules in section 3.

When locations have been deleted or added from `oa_locations`, the summary should list each added or deleted location, naming it by it's displaying is in a consise format that inclides its `url`, `version`, `license`, and `host_type`.

If the corrections submitted by the user result in a state that is inconsistent and cannot be fixed by prompting the user for additional information, this section should explain to the user why the corrections are invalid and what they need to do to fix it.

### 4.2 Example PATCH Request

Below that section for development purposes we should show an example PATCH request that might be sent to the API to represent all of these changes. The PATCH request be a JSON object that should include:
* `doi` - the doi of the document
* `new` - a object showing each field that has changed with its new value. This should include any changes to the top level fields listed in section 2, as well as the values of `oa_locations` if any locations have been added or removed.
* `old` - for every field included in `new`, this field should like those fields with their original values. 

For display, make sure the JSON is foratted with line breaks and indents.

If `oa_locations` has been added or removed, the the they can be displayed in the `old` and `new` fields with only a subset of their fields for readabily. The fields to show should be: `url`, `version`, `license`, and `host_type`.

## 5.0 Sending Corrections to the API

Currently we are not implementing any funcationality to send corrections to the API, this is being used now for testing and development.

## 6.0 Style and Tech Stack

### 6.1 Tech Stack

- The Corrections Tool is implemented as a Vue 2 single-file component.
- It uses the Options API, with an `export default {}` structure for the component definition.
- Use standard Vue 2 data, methods, computed, and lifecycle hooks.
- Axios is preferred for HTTP requests.
- All logic, state, and UI should be organized according to Vue 2 best practices.
- All code for the Corrections Tool must follow this Vue 2 Options API structure for compatibility with the rest of the app.
- Avoid modern JavaScript features (ES2020+) like optional chaining (`?.`), nullish coalescing (`??`), or other features not supported by Vue 2 with Babel 7. Use traditional property checks instead (e.g., `obj && obj.prop` instead of `obj?.prop`).

### 6.2 Code Style

- JS methods of the same object should be separated with a single newline, leaving no blank space between them.
- Each CSS block should be separated with a single newline, leaving no blank space between them. Each CSS rule should be on its own line.

### 6.3 UI Style

- Inputs should be outlined
- Buttons should have color="primary" unless otherwise specified.
- Buttons for field editing should be x-small size.
- Field editing buttons that include the word "Add" should be green.
- Field editing buttons that include the word "Correct" should be orange.
- Field editing buttons that include the word "Remove" should be red.
- Field editing buttons that include the word "Undo" should be grey.
- Any input that requires adding or editing a URL should validate the URL entered and display an error message if the URL is invalid.