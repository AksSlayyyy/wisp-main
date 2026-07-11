# IRS Template Replacement Spec

## Goal

Replace the current fake HTML draft preview with a real IRS-template-based document pipeline:

1. Start from the IRS WISP source document.
2. Map each builder topic and sub-editor to a specific replaceable paragraph or block.
3. Inject the user's edited content back into that source document.
4. Render the merged artifact as the real preview and final PDF.

The current builder already behaves like a paragraph editor for the IRS template. The missing piece is a stable replacement map and a real document merge/render pipeline.

## Current State

- Top-level builder topics are defined in [app.js](G:\WISP\app.js:342).
- Paragraph-level editor blocks are rendered in [app.js](G:\WISP\app.js:3228).
- The current preview is handcrafted HTML from [renderBuilderReviewPage()](G:\WISP\app.js:2606).
- The IRS visual reference PDF provided by the user is [p5708.pdf](C:\Users\Kilometre Morales\Downloads\p5708.pdf).

## Source-of-Truth Model

We should treat the document as three layers:

1. `template_source`
   The editable IRS base document, preferably DOCX/Word. The PDF is the visual reference and final-render target, not the ideal merge surface.

2. `replacement_map`
   A stable mapping from builder editor ids to exact IRS template blocks.

3. `merged_output`
   The generated document after replacements, exported as PDF and used directly in preview.

## Replacement Rules

Each replaceable block should be represented as:

```json
{
  "key": "inside-firm-collection",
  "topicId": "inside-the-firm",
  "sectionTitle": "PII Collection and Retention Policy",
  "templateLocator": {
    "strategy": "bookmark_or_tag",
    "value": "inside_firm_collection"
  },
  "contentType": "rich_block",
  "sourceText": "...original IRS block...",
  "editedText": "...user-edited block...",
  "allowLists": true,
  "allowMultiParagraph": true,
  "preserveHeading": true
}
```

Preferred locator priority:

1. DOCX content controls / bookmarks
2. Explicit template markers
3. Named merge tags
4. Fallback text-anchor matching against original source text

We should avoid pure text-search replacement as the primary strategy because it will be brittle after template updates.

## Top-Level Topic Map

| Topic ID | Builder Topic | Current Role | Merge Strategy |
| --- | --- | --- | --- |
| `intro` | Introduction | App-only guidance screen | Not merged into IRS document |
| `firm-details-roles` | Firm Details & Responsible Roles | Collects merge fields | Merge into named fields/placeholders |
| `objective` | Objective | Replaceable IRS section | Replace full block |
| `purpose` | Purpose | Replaceable IRS section | Replace full block |
| `scope` | Scope | Replaceable IRS section | Replace full block |
| `officials` | Officials | Multi-block section | Replace named sub-blocks |
| `inside-the-firm` | Inside the Firm | Multi-block section | Replace named sub-blocks |
| `outside-the-firm` | Outside the Firm | Multi-block section | Replace named sub-blocks |
| `policies` | Policies | Multi-block section | Replace named sub-blocks |
| `resources` | Resources | Intro paragraph plus mostly fixed references | Replace intro only, preserve reference lists unless intentionally made editable |
| `glossary` | Glossary | Large mostly standardized block | Replace full block or preserve as controlled section |
| `attachments` | Attachments | Supporting PDFs outside base text | Append after main document or package separately |
| `finalize` | Finalize | Workflow screen | Not merged into IRS document |

## Paragraph-Level Replacement Map

### Firm Details & Roles

These are merge fields, not freeform paragraph replacements.

| Key | Type | Source |
| --- | --- | --- |
| `companyName` | plain field | [app.js](G:\WISP\app.js:3135) |
| `principalOperatingOfficer` | plain field | [app.js](G:\WISP\app.js:3136) |
| `dataSecurityCoordinator` | plain field | [app.js](G:\WISP\app.js:3137) |
| `publicInformationOfficer` | plain field | [app.js](G:\WISP\app.js:3138) |
| `signatureTitle` | plain field | [app.js](G:\WISP\app.js:3139) |

These should map to named placeholders in the IRS source template such as:

- `{{firm_name}}`
- `{{principal_operating_officer}}`
- `{{data_security_coordinator}}`
- `{{public_information_officer}}`
- `{{signature_title}}`

### Single-Block Sections

| Key | Builder Surface | Source | Merge Note |
| --- | --- | --- | --- |
| `objective` | Objective | [app.js](G:\WISP\app.js:358) | Replace full section body |
| `purpose` | Purpose | [app.js](G:\WISP\app.js:367) | Replace full section body |
| `scope` | Scope | [app.js](G:\WISP\app.js:376) | Replace full section body |
| `glossary` | Glossary | [app.js](G:\WISP\app.js:425) | Replace full block only if glossary stays editable |

### Officials

| Key | Section Label | Editor Source | Merge Note |
| --- | --- | --- | --- |
| `officials-dsc` | Data Security Coordinator responsibilities | [app.js](G:\WISP\app.js:3228) | Replace DSC role block |
| `officials-pio` | Public Information Officer responsibilities | [app.js](G:\WISP\app.js:3254) | Replace PIO role block |

### Inside the Firm

| Key | Section Label | Editor Source | Merge Note |
| --- | --- | --- | --- |
| `inside-firm-intro` | Internal risk mitigation intro | [app.js](G:\WISP\app.js:3273) | Replace intro paragraph |
| `inside-firm-collection` | PII Collection and Retention Policy | [app.js](G:\WISP\app.js:3296) | Replace full policy block |
| `inside-firm-personnel` | Personnel Accountability Policy | [app.js](G:\WISP\app.js:3319) | Replace full policy block |
| `inside-firm-disclosure` | PII Disclosure Policy | [app.js](G:\WISP\app.js:3342) | Replace full policy block |
| `inside-firm-reportable` | Reportable Event Policy | [app.js](G:\WISP\app.js:3365) | Replace full policy block |

### Outside the Firm

| Key | Section Label | Editor Source | Merge Note |
| --- | --- | --- | --- |
| `outside-firm-intro` | External risk mitigation intro | [app.js](G:\WISP\app.js:3384) | Replace intro paragraph |
| `outside-firm-network` | Network Protection Policy | [app.js](G:\WISP\app.js:3407) | Replace full policy block |
| `outside-firm-access` | Firm User Access Control Policy | [app.js](G:\WISP\app.js:3430) | Replace full policy block |
| `outside-firm-exchange` | Electronic Exchange of PII Policy | [app.js](G:\WISP\app.js:3453) | Replace full policy block |
| `outside-firm-wifi` | Wi-Fi Access Policy | [app.js](G:\WISP\app.js:3476) | Replace full policy block |
| `outside-firm-remote` | Remote Access Policy | [app.js](G:\WISP\app.js:3499) | Replace full policy block |
| `outside-firm-devices` | Connected Devices Policy | [app.js](G:\WISP\app.js:3522) | Replace full policy block |
| `outside-firm-training` | Information Security Training Policy | [app.js](G:\WISP\app.js:3545) | Replace full policy block |

### Policies

| Key | Section Label | Editor Source | Merge Note |
| --- | --- | --- | --- |
| `policies-rules` | Rules of Behavior and Conduct Safeguarding Client PII | [app.js](G:\WISP\app.js:3569) | Replace full policy block |
| `policies-breach` | Security Breach Notifications and Procedures | [app.js](G:\WISP\app.js:3592) | Replace full policy block |

### Resources

| Key | Section Label | Editor Source | Merge Note |
| --- | --- | --- | --- |
| `resources-intro` | Resources intro paragraph | [app.js](G:\WISP\app.js:3611) | Replace intro only |

The reference link lists currently rendered below this intro should likely remain controlled/static until we intentionally make them editable and map them to repeatable template blocks.

### Attachments

Attachments are not paragraph replacements in the IRS body. They should be modeled as appended supporting pages or as separately packaged supporting PDFs.

| Key | Role |
| --- | --- |
| `builderAttachments[]` | Ordered appended supporting documents |

## Controlled vs Editable Content

We should explicitly separate:

- `editable_replaceable`
  User can change text and it flows back into the IRS template.

- `controlled_fixed`
  Reference content, glossary content, and structural boilerplate that should remain standardized unless product intentionally unlocks it.

- `merge_fields`
  Firm/person names and role assignments inserted into fixed text.

That distinction matters because the template pipeline should not treat every block as freeform.

## Recommended Document Pipeline

### Preferred Path

1. Convert or obtain the editable IRS source document in DOCX format.
2. Add stable markers/bookmarks/content controls for every replacement block above.
3. Merge builder edits into the DOCX.
4. Export the merged DOCX to PDF.
5. Use the exported PDF as the preview source.

### Why DOCX First

- Much safer for paragraph/block replacement
- Easier to preserve formatting than trying to rewrite PDFs directly
- Lets preview and final export come from the same rendered artifact

## Current DOCX Candidate Assessment

Candidate file:

- [wisp-template.docx](C:\Users\Kilometre Morales\Downloads\wisp-template.docx)

Initial assessment:

- The file is a valid editable DOCX with standard Word parts such as `document.xml`, `styles.xml`, and `numbering.xml`.
- It contains a recognizable WISP template body that aligns well with our builder sections:
  - `OBJECTIVE`
  - `PURPOSE`
  - `SCOPE`
  - `IDENTIFIED RESPONSIBLE OFFICIALS`
  - `INSIDE THE FIRM RISK MITIGATION`
  - `OUTSIDE THE FIRM RISK MITIGATION`
  - `IMPLEMENTATION`
  - sample attachments
- It is clearly a converted/community Word version, not a pristine official editable source. The top of the file contains commentary such as:
  - "This material is taken directly from IRS Publication 5708..."
  - "Dude, like, seriously, read the original publication..."

That means this file is usable for prototype work, but should not yet be treated as production-clean without cleanup.

### What Matches Well

- The major section flow largely matches our builder model.
- Many of the editable policy sections we already expose in the app appear as separable paragraph blocks in the DOCX.
- The document has list structure and heading structure, which makes replacement more realistic than working against raw PDF.

### What Needs Cleanup

- The intro contains non-IRS commentary that should be removed before production use.
- Some content is split across awkward paragraph boundaries from conversion.
  - Example: parts of `Personnel Accountability Policy` flow into adjacent body paragraphs instead of staying in clean list blocks.
- Some headings use inconsistent paragraph styles:
  - some are `Heading1` / `Heading3`
  - some important subheads are style `-` instead of a named heading style
- Some converted bullets/symbols and characters look suspect, especially in attachment sections.
- The template appears to include sample attachments and outline material in the same file, so we will likely need to separate:
  - outline/instructions
  - main WISP body
  - optional attachment templates

### Prototype Recommendation

Use this DOCX now for:

- section/block mapping
- replacement pipeline prototyping
- proof-of-concept DOCX merge

Do not use it yet as final production source until we:

1. Remove non-template commentary from the top.
2. Normalize heading and list structure.
3. Confirm all paragraph boundaries for replaceable blocks.
4. Compare the rendered PDF output back against [p5708.pdf](C:\Users\Kilometre Morales\Downloads\p5708.pdf).

### Best Practical Approach

Create a cleaned working base from this file:

1. duplicate the DOCX into the project
2. strip the non-IRS commentary and outline pages
3. preserve only the actual sample template body plus any attachment sections we want
4. add explicit replacement markers/bookmarks for each mapped builder block

That gives us a controlled editable base now, while still leaving open the option to rebuild from the official IRS PDF later if visual parity is not good enough.
## Preview Architecture Change

Replace the current review flow:

- current: `builder data -> handcrafted HTML cards -> fake preview`
- target: `builder data -> IRS template merge -> real PDF -> preview pages`

This means the modal should eventually render actual PDF pages, not [renderBuilderReviewPage()](G:\WISP\app.js:2606).

## Edge Cases

### Pagination Drift

Long user edits will shift page breaks. That is acceptable as long as:

- the preview comes from the real rendered PDF
- the preview and final export are generated from the same artifact

### List Preservation

Many sections contain `<ol>` / `<ul>` content today. The replacement model must preserve:

- paragraph boundaries
- ordered list numbering
- unordered list bullets
- bold inline fragments

### Partial Section Replacement

Some sections, especially `resources`, are mixed:

- editable intro paragraph
- fixed reference lists

These should be modeled as separate template blocks, not one giant replaceable blob.

## Immediate Next Steps

1. Obtain or build the editable IRS base document in DOCX form.
2. Create stable template locators for every block in this spec.
3. Add a serializer that converts each builder editor's HTML into a structured rich-text representation safe for document merge.
4. Build the first merge prototype for:
   - `companyName`
   - `objective`
   - `purpose`
   - `officials-dsc`
   - `inside-firm-collection`
5. Export that prototype to PDF and compare against [p5708.pdf](C:\Users\Kilometre Morales\Downloads\p5708.pdf).

## Open Questions

- Do we already have the original editable IRS/Word template somewhere outside this repo?
- Should `glossary` stay editable, or should it be converted into a controlled section?
- Should attachments be appended into one final combined PDF, or kept as separate PDFs in a package viewer?
- Do we want exact page-for-page parity with the IRS template, or just visual parity plus correct merged content?

