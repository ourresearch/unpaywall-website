# Unpaywall Corrections Tool PRD

## Overview
Build a Vue 2 Single-File Component named `CorrectionsTool` that guides a user through submitting corrections for a Unpaywall DOI record. The component must:
1. Retrieve metadata for a DOI.
2. Let the user suggest edits.
3. Enforce data-model dependencies.
4. Gather any additional information required.
5. Render a preview of the final PATCH payload.

---

## 1. Retrieve Document Metadata

### 1.1 UI Layout
- **Container**: Centered, 800 px wide.
- **Header**: “Submit a Correction to Unpaywall” (left-aligned).

### 1.2 DOI Input
- **Text field** (fills available width) + right-aligned “Submit” button, equal height.
- When clicked:
  - Normalize DOI (strip any `https://doi.org/` prefix).
  - `GET https://api.unpaywall.org/<doi>?email=team@ourresearch.org`
  - Display loading/error states.

### 1.3 Test DOIs
Below the DOI input, two controls (equal height):
1. **Random DOI** (small, primary v-btn)
   - Fetch `GET https://api.openalex.org/works?filter=indexed_in:crossref&sample=1`
   - Extract `results[0].doi`, then fetch metadata as above.
2. **Dropdown** (200 px wide) labeled “Test DOIs” with options:
   - gold — `10.2221/jcsj.9.70`
   - green — `10.1016/j.cell.2007.11.019`
   - hybrid — `10.1080/03057925.2025.2483691`
   - bronze — `10.2207/qjjws1943.22.275`
   - closed — `10.1109/pvsc.1996.564405`
   - On select, immediately fetch metadata.

---

## 2. Display & Edit Fields

### 2.1 Render Fields
- **Card** layout with light horizontal separators.
- **Title**: Large font, no label; right-aligned “API” link opens raw JSON in new tab.
- **DOI**: Subtitle under title (smaller font), no label; link to `doi_url`.
- **Other fields** (each with a label + value inline, wrapping long text):
  - `best_oa_location.url`
  - `best_oa_location.license`
  - `is_oa` (boolean)
  - `oa_status` (string)
  - `journal_is_oa` (boolean)
- Missing values show as `None`.

### 2.2 Editable Controls

| Field                      | Initial Button(s)                                      | Edit UI                                                      |
|----------------------------|--------------------------------------------------------|--------------------------------------------------------------|
| **best_oa_location.url**   | • If null: **Add URL** (green)  
• Else: **Correct URL** (orange) + **Remove Broken URL** (red, stacked) | Inline text input (fills width)  
x-small **Save** (primary) + **Cancel** (gray)             |
| **best_oa_location.license** | • If null: **Add License** (green)  
• Else: **Correct License** (orange)                    | Dropdown of licenses + Save/Cancel                          |
| **is_oa**                  | Toggle: **Correct to True** / **Correct to False** (orange) | Immediate toggle                                           |
| **oa_status**              | **Correct OA Status** (orange)                          | Dropdown: `gold`, `green`, `hybrid`, `bronze`, `closed` + Save/Cancel |
| **journal_is_oa**          | Toggle: **Correct to True** / **Correct to False** (orange) | Immediate toggle                                           |

- After saving any change, show x-small **Undo** (gray) on that line.
- URL inputs must validate format and show inline errors.

---

## 3. Enforce Data Dependencies

### 3.1 Data Model Recap
- **oa_locations**: array of `{ url, host_type, version, license }`.
- **best_oa_location**: one item copied from `oa_locations`.
- **Dependent fields**:
  - `is_oa` ← `oa_locations.length > 0`
  - `has_repository_copy` ← any `host_type === 'repository'`
  - `oa_status` ← first-match logic (below)

### 3.2 `oa_status` Logic (in order)
1. `gold` if `journal_is_oa && has publisher location`  
2. `green` if `!journal_is_oa && has repository location`  
3. `hybrid` if `!journal_is_oa && has publisher location && license set`  
4. `bronze` if `!journal_is_oa && has publisher location && license null`  
5. Else `closed`

### 3.3 Dependency Processing
- Treat user edits as fixed.
- Compute implied changes:
  - Adding/removing URLs ↔ insert/delete in `oa_locations`.
  - License edits ↔ update underlying location.
  - Toggling `is_oa` ↔ add/remove all `oa_locations`.
  - Toggling `journal_is_oa` ↔ recompute `oa_status`.
- Maintain a list of **implied** field updates separate from user-made edits.

---

## 4. Gather Additional Information

If any implied change cannot be auto-computed, show an **Additional Information Needed** section with prompts, e.g.:
> To set OA Status to “green,” please add a repository URL.

Then render a mini-form to collect:
- `url`
- `host_type` (publisher | repository)
- `version` (publishedVersion | acceptedVersion | submittedVersion)
- `license` (dropdown)

Prefill and lock any fields implied by the dependency.

---

## 5. Confirm & Preview PATCH

### 5.1 Confirm Corrections
- Section **Confirm Corrections** split into:
  1. **User-made changes**
  2. **Implied dependency changes**
- List each change in human-readable form (e.g., “Change `oa_status` from ‘closed’ to ‘green’”).
- If conflicts exist, show an error with instructions to resolve.

### 5.2 Example PATCH Request
```http
PATCH /api/unpaywall/:doi
Content-Type: application/json

{
  "doi": "<doi>",
  "new": { … },
  "old": { … }
}