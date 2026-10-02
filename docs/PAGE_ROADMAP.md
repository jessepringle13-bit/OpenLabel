# OpenLabel — Page-by-Page Product Roadmap

**Working name:** OpenLabel  
**Product type:** Scanner-first food transparency app  
**Primary promise:** Help people understand what is in a food product, what is known about it, what may matter to them personally, and what remains uncertain—without hiding the evidence behind a simplistic score.

## How to use this roadmap

Each page has:

- **One job** — the main problem it solves.
- **User outcome** — what a person should leave knowing or able to do.
- **Must have** — minimum experience required for the page to feel complete.
- **Quality bar** — how the page should feel and behave.
- **Data and evidence rules** — what the page may and may not claim.
- **Failure states** — what happens when data is unavailable or something fails.
- **Current status** — built, confirmed, prototype, planned, or research needed.
- **Next work** — the next specific work for that page.

A page is not “done” merely because the UI exists. It is complete only when it has a clear job, mobile-friendly flow, understandable loading/error/unknown states, trustworthy language, and device testing.

# 1. Product promise

OpenLabel is not another universal “good food / bad food” scoring app.

It should help a person:

1. Scan or find a grocery product.
2. See the product label and important facts quickly.
3. Understand ingredients in plain language.
4. See what may matter specifically to their profile and priorities.
5. Inspect recalls, independent testing, processing, product changes, and evidence where available.
6. See what is known, what is inferred, what is disputed, and what is still unknown.
7. Decide for themselves without being asked to blindly trust a score, company claim, study headline, or AI summary.

> **Know more, worry less — while being able to check how OpenLabel knows what it says.**

# 2. Non-negotiable principles

## Evidence and transparency

- Show the label observation, source, and uncertainty separately.
- Distinguish between what the package states, what the product database states, what a manufacturer claims, what an independent test found, what general research suggests, what is inferred, and what is unknown.
- Do not turn a general research finding into a claim about a specific product or lot.
- Do not turn a category-level contaminant test into a result for an untested product.
- Do not describe missing data as reassuring.
- Do not call something safe simply because it is permitted, regulated, familiar, natural, or difficult to pronounce.
- Do not call something harmful simply because it is synthetic, chemical-sounding, processed, or controversial online.
- Show competing evidence, study limitations, funding, conflicts of interest, and relevance when making meaningful health-related claims.

## No simplistic scores

- No universal product score.
- No broad “good” or “bad” verdict.
- No green color merely because an ingredient is familiar or regulated.
- No red color merely because an ingredient has a chemical name.
- Product findings should be understandable without requiring users to trust a hidden formula.

## Personal relevance

- A user’s profile changes what is prioritized, not what the product label says.
- Allergies, sensitivities, diet preferences, ingredients/topics to watch, caffeine preferences, and other choices should be clearly separated from medical diagnoses.
- A missing match is never proof that a product is safe for a person.
- Personalized red warnings must state why they apply to that person.

## User control and privacy

- Keep preferences, saved products, and history local by default where possible.
- Do not add private medical, medication, genomic, or health-condition information until privacy, consent, security, source quality, and medical boundaries are designed properly.
- Users should be able to understand and change the preferences that drive their results.

## Design

- Scanner first.
- Bright, calm green-and-blue visual system.
- Familiar circular navigation dock remains for now.
- Transparency/glass effects belong mainly in the scanner experience, not across the whole app.
- Mobile first, thumb-friendly, readable, calm, and not overloaded.
- Every color has words beside it; color alone must never communicate a finding.

# 3. Status definitions

| Status | Meaning |
|---|---|
| **Complete** | Built, tested in the intended environment, documented, and has honest failure/unknown behavior |
| **Confirmed** | Tested by the owner on a real phone or with a real product, but may still need broader regression testing |
| **Built** | Code exists in the repository but has not been fully tested in the target environment |
| **Prototype** | Demonstrates a direction but is incomplete, narrow in coverage, or not production-ready |
| **Research needed** | Requires a reliable data source, methodology, legal/privacy decision, or evidence review before building |
| **Planned** | Agreed direction, not yet started |
| **Deferred** | Wanted, but intentionally not in the near-term build sequence |
| **Cannot claim** | A conclusion the app must not make with available data |

# 4. What OpenLabel can do

## Current foundation

The current app is a working prototype with a scanner-first flow and a mobile product-detail experience.

| Capability | Current status | Notes |
|---|---:|---|
| Barcode scanning | Confirmed | Barcode scan, manual barcode entry, and fallback behavior exist |
| Live product lookup | Confirmed | Uses Open Food Facts when data is available |
| Product panel | Confirmed | Swipe-up panel with product photo, macros, tags, ingredients, personal findings, breakdown rows, and sources/unknowns |
| Product-panel scrolling | Confirmed | iPhone scrolling issue was fixed and confirmed by the owner |
| Saved and recent products | Built | Stored locally in the browser |
| Profile preferences | Built | Includes allergies/sensitivities, custom watch words, caffeine, sweetener preferences, and expanded profile-related features |
| Allergens and traces | Built | Uses declared allergens, may-contain traces, and ingredient text where available |
| Ingredient list | Built | Separate ingredient rows, expandable list, original label text preserved |
| Ingredient sheets | Prototype | Common-use explanations and selected vitamin/mineral form information are available for a limited set of ingredients |
| Ingredient purpose labels | Prototype | Some ingredients show common use; many still need library coverage and consistency review |
| Ingredient allergy-row cue | Built | Uses saved profile IDs after correction; needs live browser/iPhone validation |
| Recall features | Prototype | Recall tag, dropdown, lot-related messaging, and recall browsing exist; live data integration and match reliability need validation |
| Lab-tested page/register | Prototype | Independent-test register and category browsing exist; coverage and tester/source review remain limited |
| Processing level | Built | Uses available product-processing information, including NOVA where supplied |
| Seed-oil evidence view | Prototype | Evidence sheet exists; must remain transparent about contested evidence and source review |
| Explore tab | Prototype | Browses samples; live product-name search is not built yet |
| Library change markers | Prototype | Intended to flag database-record changes; must not imply package reformulation without verification |
| Home Screen install | Built | Needs broader iPhone camera/icon verification |

# 5. What OpenLabel cannot claim

OpenLabel must not claim any of the following without stronger product-specific evidence:

- That a product is universally safe or unsafe.
- That a missing allergy warning means the product is safe for an allergic person.
- That an uncolored ingredient row means there is no concern.
- That an ingredient is harmful or beneficial based only on its name.
- That a generic vitamin label identifies the exact vitamin form, source, or manufacturing process.
- That a product contains a contaminant without a relevant product or lot test.
- That a product is free of contaminants because no test was found.
- That a recall applies to a user’s package without matching the relevant product, date, lot, UPC, and other available details.
- That a category-level test applies to a specific product.
- That an ingredient will cause a health outcome for a specific user.
- That an ingredient or product fits a medical condition without clinically appropriate evidence and boundaries.
- That product-database data always match the package currently in the user’s hand.
- That a label-data change proves a formula or package changed.
- That OpenLabel is medical advice, a diagnostic tool, a food safety certification, or a substitute for package-label verification.

# 6. Intended app experience

## Scan

**Job:** Identify a product quickly.

- App opens to the scanner.
- Live camera fills the scanner background.
- Barcode scan is the primary action.
- Manual barcode entry is available when scanning fails.
- Clear status messages explain loading, camera problems, no product found, partial data, and lookup failures.
- A failed lookup never implies the product is safe.

## Product panel

**Job:** Help a user understand this product.

Approved information order:

1. Product photo, name, brand, and category.
2. Macros/nutrition context.
3. Tags.
4. Ingredients.
5. Personal findings: “For you.”
6. Breakdown rows.
7. Sources and unknowns.

Rules:

- The panel begins as a partial sheet and expands by swipe/tap.
- A long ingredient list must remain reachable.
- The panel must scroll fully above the bottom dock.
- Red/personal findings appear first when relevant.
- Keep initial warnings concise; allow expansion for full details.
- Every important warning must have an explanation path.

## Ingredient sheets

**Job:** Explain one ingredient without pretending to know more than the label supports.

Each ingredient sheet should eventually include:

1. **Label says** — exact wording from the package/product record.
2. **What it is** — plain-language identity.
3. **What it may be used for** — common functions, not assumed manufacturer intent.
4. **Form and source** — only when the form/source is actually named or verifiable.
5. **How the form differs** — when a meaningful difference exists.
6. **What research says** — only after review.
7. **What is uncertain** — dose, origin, manufacturing process, effects for an individual, incomplete label information, and gaps in research.
8. **Sources and review date** — direct links and date of editorial review.

A generic term such as “vitamin B12” should explain B12’s general purpose while stating that the exact form is unspecified. A named form such as cyanocobalamin should identify that form without automatically claiming it is better or worse than another form.

## Recalls and independent testing

**Job:** Surface defensible product-safety signals.

- Recalls must be based on official sources and framed as possible matches unless details align.
- Independent testing must clearly distinguish exact product, exact product but different lot, brand/product family, category-level result, and no relevant test found.
- Tester methodology, report date, product identity, funding/ties, and limitations should be visible where available.

## Explore

**Job:** Find products without scanning.

- Existing Explore search field becomes live product-name search.
- Search real product records.
- Results display product name, brand, and photo when available.
- Sample products remain visibly marked as samples.
- Tapping a result opens the same product panel as a barcode scan.
- Handle loading, no results, partial data, and network/API failures clearly.

## Library

**Job:** Return to a product and notice meaningful label-data changes.

- Separate saved and recent products.
- Show when the user last viewed a product.
- Compare dated product snapshots where possible.
- Explain exactly what changed: ingredients, allergens, traces, additives, nutrition, size, claims, or missing data.
- “Database record changed” is not the same as “manufacturer reformulated the product.”

## Profile

**Job:** Let a user decide what should matter most to them.

Profile should eventually support:

- Allergies and sensitivities.
- Custom watch words.
- Caffeine preferences.
- Sweetener visibility.
- Diet preferences.
- Intolerances.
- Topics to watch.
- Personal priority ordering.

Later and only after careful privacy/clinical work:

- Medication interactions.
- Pregnancy considerations.
- Health conditions.
- Genetic information.

# 7. Build roadmap

## Phase 0 — Stabilize trust-critical features

**Purpose:** Do not build beyond features that could create misleading health or safety expectations until they are verified.

### Work

- Validate ingredient allergy-row cues on a live browser and iPhone.
- Test profile allergy settings against positive exact ingredient match, negative/nonmatching ingredient, peanuts and tree nuts, milk/egg/wheat/soy/sesame/fish/shellfish, custom watch words, profile change while a product panel is open, nested ingredients, and trace statements.
- Ensure the row cue does not replace the full Allergens section.
- Ensure uncolored rows never imply “safe.”
- Fix inconsistent ingredient wording:
  - Replace “Not yet reviewed” where common purpose is already explained.
  - Use “Common use explained,” “Form/source unspecified,” “Purpose not yet verified,” and “Research review pending” correctly.
- Review Home Screen app camera, scanner layout, and Home Screen icon in Safari/Firefox.
- Run the full mobile interaction checklist after every batch.

### Exit criteria

- Allergy-row behavior is confirmed on a real device.
- There are no misleading positive/negative allergy messages.
- Ingredient labels and sheets agree.
- Current feature status is accurately documented.

## Phase 1 — Complete the core product loop

**Purpose:** Make the app feel like one complete, usable product from scan to later reference.

### Work

- Improve product lookup states: loading, complete data, partial data, product not found, and API/network failure.
- Finish live Explore product-name search.
- Ensure Scan, Explore, Product panel, Library, Profile, and Home navigation work together.
- Improve back behavior and panel close behavior.
- Complete Library:
  - Saved products.
  - Recent products.
  - Last seen.
  - Product-data snapshot/change notices.
  - “Check saved products for changes.”
- Add clear sample-vs-live product labels.

### Exit criteria

A user can scan a real product, understand the result, save it, find it later, search for another product by name, change a profile preference, and see an updated result without losing context.

## Phase 2 — Build the ingredient knowledge layer

**Purpose:** Make the ingredient list the app’s most useful educational feature.

### Work

Expand the ingredient library in this order:

1. Vitamins, minerals, and named nutrient forms.
2. Sweeteners.
3. Preservatives.
4. Acids and acidity regulators.
5. Antioxidants.
6. Colors and dyes.
7. Emulsifiers.
8. Thickeners, gums, and stabilizers.
9. Anti-caking agents.
10. Leavening agents.
11. Oils and fats.
12. Starches and modified starches.
13. Natural/artificial flavor terms.
14. Common compound/sub-ingredient structures.

For each reviewed entry, include:

- Plain-language identity.
- Common uses.
- Known named form.
- Form/source limitations.
- Meaningful research summary.
- Relevant exposure/dose limitations.
- Source links.
- Last review date.
- Review status.

### Technical cleanup

- Consolidate ingredient metadata into one structured source of truth.
- Avoid duplicate matching rules across multiple scripts.
- Improve ingredient parsing without pretending parentheses and compound ingredients are always unambiguous.
- Preserve original label text.
- Add a way to report incorrect/incomplete ingredient data later.

### Exit criteria

- Every ingredient remains tappable.
- Common ingredient classes have useful explanations.
- The app clearly distinguishes identity/function explanation from health/evidence review.
- No unsupported ingredient-level verdicts.

## Phase 3 — Evidence-based color system

**Purpose:** Add visual meaning without recreating an opaque scoring app.

### Color rules

| Color | Meaning |
|---|---|
| Red | Direct, well-scoped reason for this user to avoid/check urgently, such as a verified personal allergy match or official recall match |
| Orange | Supported reason to limit, moderate, investigate amount, or consider a personal context |
| Yellow | Evidence is mixed, limited, contested, or unresolved |
| Green | A reviewed finding is reassuring within a clearly stated scope |
| Gray | Not enough data, not reviewed, or a general purpose is known but no evidence finding has been assigned |

### Requirements before assigning color

Every color must show:

- The reason.
- The source.
- Whether it is product-specific, category-level, or general research.
- Who it applies to.
- Relevant amount/exposure if known.
- Limitations.
- Review status/date.

### Work

- Build a structured evidence register for ingredient findings.
- Add reviewed dossiers rather than hardcoded color rules.
- Add yellow for genuinely contested/mixed evidence.
- Add orange only where moderation/limit context is defensible.
- Add green only after a properly scoped review.
- Never use colors based on chemical-sounding names, marketing claims, or popularity online.

### Exit criteria

Colors are understandable, inspectable, consistently applied, and never used as unsupported shorthand.

## Phase 4 — Mature personalization

**Purpose:** Make OpenLabel more relevant without crossing into unsupported medical guidance.

### Work

- Expand profile categories: allergies, sensitivities, intolerances, diet patterns, ingredients/topics to watch, caffeine preferences, and sweetener preferences.
- Add diet-fit statements for vegan, vegetarian, gluten-related preferences, and low-carb/keto preferences using user-selected thresholds.
- Use “Yes,” “No,” “Maybe,” and “Cannot tell” states.
- Allow users to prioritize what appears first.
- Keep preferences clearly separate from medical diagnosis.

### Deferred until privacy and clinical standards are designed

- Medications.
- Health conditions.
- Pregnancy.
- Pediatrics.
- Genetics/genome data.
- Personalized medical interaction guidance.

### Exit criteria

Users can make results more personally relevant while understanding the limits of the app’s recommendations.

## Phase 5 — Recalls, testing, contaminants, and official alerts

**Purpose:** Build a trustworthy safety-signal layer.

### Recalls

- Verify reliable access to FDA recall/enforcement data.
- Add USDA meat, poultry, and egg recall sources.
- Improve matching by product name, brand, UPC, date, lot, package size, and distribution area when available.
- Use **Possible match** until all required details align.
- Explain that “no match found” is not proof that no recall exists.

### Independent testing

Expand the test register gradually, starting with:

- Rice and rice-based products.
- Baby food.
- Chocolate/cocoa.
- Bottled water.
- Fruit juice.
- Plant-based meat.
- Foods with high consumer interest for metals, PFAS, glyphosate, or other contaminants.

For every register entry, capture:

- Exact product/brand/category.
- Lot information if available.
- Test date.
- Laboratory/tester.
- Methods.
- Measured result.
- Comparator or threshold.
- Report source.
- Funding/ties/conflicts.
- Exact-product vs category-level classification.

### Food concern dossiers

Build topic-specific research and evidence packages for:

- Food dyes.
- Plant-based meat.
- Metals.
- Pesticides/glyphosate.
- Packaging/plastic leaching.
- Additives.
- Ultra-processing.
- Contested nutrition claims.

### Exit criteria

OpenLabel only surfaces safety signals that are sourced, scoped, understandable, and not overstated.

## Phase 6 — Better decisions without a score

**Purpose:** Help users choose alternatives while respecting their priorities and uncertainty.

### Work

- Similar-product comparison.
- Better swaps in the same category.
- Ingredient, allergen, nutrition, processing, evidence coverage, recall, and personal-fit comparisons.
- Explain why an alternative may better fit a user’s chosen priorities.
- Do not imply the original product is unsafe because another option fits better.
- Add historical label-change comparisons using dated snapshots.
- Add product/photo verification workflow for stale database records.

### Exit criteria

Recommendations are explainable comparisons, not black-box ratings.

## Phase 7 — Production readiness

**Purpose:** Move from prototype to dependable application.

### Data and engineering

- Move critical data workflows beyond browser-only prototype logic as needed.
- Add caching, retry behavior, rate-limit handling, data timestamps, monitoring, and error reporting.
- Use versioned product snapshots.
- Build a source/review data model for ingredient and evidence entries.
- Add automated tests for parsing, profile matching, recall matching, and data-state handling.
- Add a reliable deployment process.

### Research operations

- Editorial review workflow.
- Contributor/reviewer roles.
- Review dates and version history.
- Correction and dispute process.
- Funding/conflict disclosure rules.
- Evidence standard for moving from “checking” to “reviewed.”

### Privacy and security

- Define local-only versus synced data.
- Add consent, export, deletion, and account controls before collecting sensitive data.
- Encrypt sensitive data where applicable.
- Obtain legal/privacy review before handling medication, condition, genomic, or other high-sensitivity data.

### Accessibility and quality

- Screen-reader support.
- Keyboard support.
- Color-independent labels.
- Mobile testing across browsers.
- Performance checks.
- Offline/error states.
- Privacy-preserving analytics only.

### Brand and launch

- Confirm name, domain, trademark, and app-store availability before launch.
- OpenLabel remains a working name until cleared.

### Exit criteria

The app is technically stable, evidence governance is defined, privacy boundaries are clear, and launch claims match actual capabilities.

# 8. Page specifications

## 8.1 Global app shell

### One job

Let the user understand where they are, move between core areas easily, and always have a clear route back to scanning.

### User outcome

A user never wonders where they are, how to get back, what a button does, or whether they lost a product result.

### Must have

- Familiar bottom navigation dock.
- Clear primary areas: Home, Explore, Scan, Library, Profile.
- Scanner remains the fastest, most visible action.
- Consistent page title, back behavior, and close behavior.
- Product panel can be dismissed without losing the previous screen.
- Navigation remains thumb-friendly on mobile.

### Quality bar

- Light, calm, modern green-and-blue system.
- No cluttered utility buttons.
- No dark, heavy, overly medical appearance.
- Motion supports understanding rather than decoration.

### Failure states

- If scanner camera is unavailable, explain plainly and offer manual entry.
- If page data are loading, show useful loading state rather than blank content.
- If offline, explain unavailable functions and preserve locally stored recent/saved products where possible.

### Current status

**Built / mostly confirmed**

### Next work

- Confirm all navigation routes on iPhone.
- Confirm product-panel close/back behavior from Scan, Explore, Home, and Library.
- Add app-wide loading/error pattern.

## 8.2 Scan page

### One job

Get a product barcode quickly and reliably.

### User outcome

A user can scan, manually enter, or recover from a failed barcode attempt without confusion.

### Must have

- Full-screen camera background.
- Clear scan frame.
- Automatic camera start where permissions allow.
- Common retail barcode support: EAN-13, EAN-8, UPC-A, UPC-E.
- Manual barcode entry.
- Status for starting camera, looking for barcode, barcode found, looking up product, camera unavailable, product not found, and network/API problem.
- Recovery path when lighting, glare, focus, or packaging makes scanning difficult.

### Quality bar

- Fast and focused.
- Smooth product result panel over the scanner.
- No unnecessary camera controls.
- No distracting white background behind the camera.
- One-handed usability.

### Data and evidence rules

- “Product not found” means the database has no matching record; it does not imply the product is safer, less processed, or unsupported.
- Barcode lookup results identify community/product database source where relevant.

### Failure states

- Permission denied.
- No camera found.
- Barcode not readable.
- Barcode found but no product record.
- Network failure.
- Partial product record.

### Current status

**Confirmed for core barcode scanning**

### Next work

- Test scanner in installed Home Screen mode on iPhone.
- Test damaged/reflective/curved packaging.
- Test low-light and glare recovery.
- Add “Having trouble?” recovery action only if user testing shows a need.

## 8.3 Product lookup and loading state

### One job

Turn a barcode or search result into an honest product record.

### User outcome

A user understands whether OpenLabel found the product, whether the data are complete, and what source supplied it.

### Must have

- Product name, brand, category, barcode where useful, and image when available.
- Clear source attribution.
- Data-freshness/source limitation wording where possible.
- Clear distinction between found with data, found with partial data, not found, lookup failed, and loading/checking.

### Quality bar

- Product information appears quickly.
- User sees useful information before optional details are complete.
- Loading does not look like a safety result.
- Weak/incomplete record does not imply certainty.

### Data and evidence rules

- Community databases can be missing, outdated, crowdsourced, or wrong.
- Product details may differ from the package currently in the user’s hand.
- Missing details are unknown, not absence.

### Failure states

- No product record.
- Missing ingredient, allergen/traces, nutrition, or image data.
- Product database unavailable.

### Current status

**Confirmed for core lookup; prototype for data-quality handling**

### Next work

- Standardize partial-data messaging.
- Add “Check the current package” language where data may be stale.
- Add product snapshot timestamps for Library comparison later.

## 8.4 Product detail panel

### One job

Give the user a clear, complete answer to: **“What is this product, and what should I look at first?”**

### User outcome

The user can understand the product in seconds, then deepen into evidence without losing the main context.

### Must have

- Partial sheet at first.
- Swipe/tap to full detail.
- Full vertical scrolling.
- All content reachable above the bottom dock.
- Close and save/unsave actions.
- Product photo, macros/nutrition, tags, ingredients, personal findings, breakdown rows, and sources/unknowns.

### Quality bar

- Polished and calm, with Olive-style interaction quality.
- No clipped ingredient text or hidden lower sections.
- Long product record stays readable and navigable.
- Important findings appear first without alarmist presentation.

### Data and evidence rules

- Tags summarize but link to explanation.
- Color alone is never enough.
- Product-level, category-level, and general evidence are distinct.
- Unknowns remain visible.

### Failure states

- No photo, nutrition, ingredients, allergen data, testing, recall information, or processing classification.

### Current status

**Confirmed for scrolling and overall order**

### Next work

- Complete panel regression tests on iPhone.
- Test very long ingredient lists.
- Test all expandable rows with full panel.
- Confirm navigation back to originating page.
- Confirm panel remains correct after profile changes.

## 8.5 Tags and findings layer

### One job

Give a person a quick, plain-language map of what is most relevant before they read full details.

### User outcome

The user can immediately see what may apply to them, what is known, what is uncertain, and where to tap for details.

### Must have

- Short tags with word-based status.
- Tags open the correct section.
- Tags sort by relevance and severity, not visual drama.
- Personal findings are visually distinct from general information.
- Concise initial set with expansion to full list.

### Quality bar

- Every tag carries words, not color only.
- No alarmist red usage.
- No fake reassurance through green.
- Tags invite evidence inspection rather than blind trust.

### Data and evidence rules

Every colored finding identifies reason, source, scope, whether it is personal/product/category/general research, limitations, and review status.

### Current status

**Built / prototype evidence system**

### Next work

- Validate personal allergy red cues.
- Build structured, source-backed ingredient evidence records before expanding green/orange/yellow usage.
- Add visible distinction between “common use explained” and “evidence reviewed.”

## 8.6 Ingredients section

### One job

Help users understand exactly what is listed in the product—not just see a wall of label text.

### User outcome

A user can select an ingredient, understand what it is, why it might be present, and what OpenLabel does or does not know about it.

### Must have

- Ingredient rows with comfortably sized tap targets.
- Full original label wording under “View label text.”
- “Show all ingredients” for long lists.
- Careful handling of parenthetical/nested ingredients.
- Accurate row labels: common use explained, form/source unspecified, purpose not yet verified, research review pending.

### Quality bar

- Easier to select than inline highlighted text.
- Long names wrap clearly.
- Nested ingredients are understandable.
- Educational, not fear-driven.

### Data and evidence rules

- Preserve package wording.
- Do not infer exact form from generic nutrient name.
- Do not infer natural/synthetic origin when label does not disclose it.
- Do not state manufacturer’s exact reason without product-specific evidence.
- “Commonly used for” is acceptable when sourced; “used here for” requires product-specific evidence.

### Current status

**Built / prototype library**

### Next work

- Expand reviewed ingredient library.
- Improve nested/compound ingredient parsing.
- Consolidate ingredient metadata and matching logic.
- Make row/sheet status agree.
- Add review dates and source references.

## 8.7 Ingredient detail sheet

### One job

Explain one ingredient honestly and deeply enough to be useful.

### User outcome

A user understands what the ingredient is, why it may be included, whether the label identifies a meaningful form, what evidence says and does not say, and what they should not assume.

### Required sheet structure

1. **Label says**
2. **What it is**
3. **What it may be used for**
4. **Form and source**
5. **How this form differs**
6. **What research says**
7. **What we still do not know**
8. **Sources**
9. **Last reviewed**

### Quality bar

- Short understandable answer first.
- Deeper evidence below.
- No exaggerated top-line conclusion.
- Direct source links.
- Clear uncertainty language.
- Sheet opens at top and closes easily.

### Data and evidence rules

- Vitamin name alone does not prove form/source.
- Named form does not automatically prove superior/inferior effects.
- General research is labeled as general research.
- Research review pending is better than pretending a conclusion exists.

### Current status

**Prototype**

### Next work

- Build structured ingredient registry.
- Add citations and review dates.
- Define evidence-review template.
- Prioritize vitamins/minerals, sweeteners, preservatives, colors, emulsifiers, gums, oils, acids, starches, and flavor terms.

## 8.8 “For you” section

### One job

Show product information relevant to user choices and settings.

### User outcome

The user sees why a finding matters without confusing preference with medical diagnosis.

### Must have

- Allergy/sensitivity findings.
- Trace findings.
- Custom watch-word findings.
- Caffeine limit findings.
- Sweetener visibility/preferences.
- “Why am I seeing this?” explanation.
- Direct route to Profile.

### Quality bar

- Personal relevance appears before general information when warranted.
- Warnings are concise at first.
- User can expand full list.
- No overly clinical or frightening language.
- User understands finding source: ingredient text, declared allergen, trace data, custom word, or profile preference.

### Data and evidence rules

- No match never means safe.
- Missing data means cannot check.
- Product data may not match current package.
- Custom watch words are not medically diagnosed allergies.
- Trace information is not hidden behind ingredient-row cues.

### Current status

**Built / needs continued validation**

### Next work

- Validate saved profile settings against product results.
- Clarify custom-word versus allergy warnings.
- Add future diet/intolerance logic only after criteria are defined.
- Ensure profile changes update results reliably.

## 8.9 Breakdown rows

### One job

Let users inspect specific topics without forcing every person through the same long analysis.

### Required rows

- Allergens and traces.
- Independent testing.
- Recalls.
- Seed oils.
- Processing level.
- Sweeteners.
- Additives.
- Caffeine.
- Diet fit.
- Intolerances.
- Emulsifiers.
- Gut-related information.
- Sources and unknowns.

Not every product needs every row. Rows appear only when relevant or when a meaningful unknown needs explanation.

### Quality bar

- Expandable sections are readable and compact.
- Each row has short status plus deeper explanation.
- No universal health claim without evidence.
- Unknown is visible and acceptable.

### Data and evidence rules

- Processing level describes processing, not nutrition/health by itself.
- Seed-oil evidence is represented fairly where contested.
- Additive presence does not establish harm.
- No independent test found does not establish safety.
- Recall matching is clear about uncertainty and lot limits.

### Current status

**Built / mixed verification**

### Next work

- Verify live recall access.
- Expand/review independent test register.
- Create consistent evidence wording across rows.
- Define when rows appear, collapse, or remain gray.

## 8.10 Recalls page

### One job

Let users browse and understand official food recalls without confusing a general alert with a match to their package.

### User outcome

A user can see current recalls, search/filter them, and understand product/lot/date details that matter.

### Must have

- Official-source recall feed.
- Search and filters.
- Product name, brand/company, recall date, reason/hazard, affected product details, lot/date/UPC where available.
- Clear “possible match” versus “confirmed details align” language.
- Link to original official recall source.

### Quality bar

- Factual, calm, official feel.
- No sensational headlines.
- Easy mobile search.
- Date and scope immediately visible.
- Honest empty state.

### Data and evidence rules

- No result does not mean no recall exists.
- Product-name match alone is not confirmed match.
- Use official FDA and USDA sources where applicable.
- Recall status is date-aware.

### Current status

**Prototype / check**

### Next work

- Verify real FDA data access.
- Add USDA meat/poultry/egg recalls.
- Improve matching by UPC, lot, package size, date, and distribution details.
- Add source timestamps/update cadence.

## 8.11 Lab tested page

### One job

Let people explore independent product testing without treating every category-level result as a verdict on every product.

### User outcome

A user can see what was tested, by whom, what was found, how directly it applies to a product, and what remains unknown.

### Must have

- Search and category filters.
- Exact product/brand/category distinction.
- Tester/lab name, test date, finding/result, original report link.
- Relevance label: exact product, exact product/different lot, brand family, category-level only, or no relevant test found.
- Funding/conflict/tie information where available.

### Quality bar

- Easy category browsing.
- Every result explains scope.
- No scary language for loosely applicable evidence.
- Sheets open at top.

### Data and evidence rules

- Exact-product results do not automatically apply to future lots.
- Category-level results are not claims about a product.
- No test found is not a clean bill of health.
- Tester threshold/method matter.

### Current status

**Prototype**

### Next work

- Expand rice products, baby food, chocolate/cocoa, bottled water, fruit juice, and plant-based meat.
- Add full report-review workflow.
- Add funding/ties/method fields.
- Move category/status into structured registry data.

## 8.12 Explore page

### One job

Let users find a product when they do not have it in front of them to scan.

### User outcome

A user can search by product name and open the same useful product panel they get after scanning.

### Must have

- Live name search.
- Debounced input.
- Results with product name, brand, image when available, and basic category.
- Visible sample-product labeling.
- Loading/no-results/network-error states.
- Result opens standard product panel.

### Quality bar

- Fast/simple search.
- No separate/confusing detail experience.
- Enough result information to distinguish duplicates.
- Empty state guides user back to scan when appropriate.

### Data and evidence rules

- Search results may be incomplete.
- Search failure is not product absence.
- No result does not mean unavailable, unsafe, or unapproved.

### Current status

**Planned**

### Next work

- Build live Open Food Facts name search in existing Explore field.
- Test loading, failure, duplicates, selected result, and return navigation.

## 8.13 Library page

### One job

Let users return to scanned/saved products and notice meaningful label-data changes.

### User outcome

A user can find prior products, recognize saved items, and understand when the database record may have changed.

### Must have

- Saved products.
- Recent products.
- Product image/name/brand.
- Last seen date.
- Remove/save controls.
- Recent changes area.
- Change markers.
- Option to recheck saved products.
- Clear distinction between database record changed, label may have changed, and package change confirmed.

### Quality bar

- Easy to scan/revisit.
- Saved/recent visually distinct.
- No clutter/duplicate cards.
- Changes understandable rather than alarming.

### Data and evidence rules

- Database record change is not proof of reformulation.
- Old snapshots may be incomplete.
- Changes explain differing fields.

### Current status

**Prototype**

### Next work

- Confirm snapshot comparisons.
- Show field-level differences.
- Test saved-product recheck flow.
- Add source timestamps.

## 8.14 Profile page

### One job

Let users tell OpenLabel what matters to them and understand how choices affect results.

### User outcome

A user can customize findings without providing unnecessary sensitive information.

### Must have

- Allergies/sensitivities.
- Custom words to watch.
- Caffeine limit.
- Sweetener preference.
- Diet preferences.
- Intolerances.
- Topics to watch.
- Clear explanation of each setting.
- Local storage/privacy explanation.

### Quality bar

- Simple grouped choices.
- No medical jargon unless needed.
- Clear selected-state/count visibility.
- Easy edit/undo.
- Clear separation between allergy, sensitivity, preference, custom watch term, and diet preference.

### Data and evidence rules

- Preference does not become medical conclusion.
- Local storage remains default in current prototype.
- Do not request medication, condition, pregnancy, or genomic data until privacy/clinical design is established.

### Current status

**Built / expanding**

### Next work

- Validate profile settings update results.
- Add diet-fit rule definitions.
- Distinguish medical allergy and custom watch word visually/language-wise.
- Defer sensitive health data.

## 8.15 Home page

### One job

Give returning users a calm starting point and route to the app’s highest-value information.

### User outcome

A user can immediately scan or reach important current information.

### Must have

- Prominent scan entry.
- Recent products or activity.
- Entry points to recalls, lab tested, Explore, and Library.
- Minimal useful overview rather than cluttered dashboard.

### Quality bar

- Calm/simple.
- Scan primary.
- Cards have one clear action each.
- Not a news feed or marketing page.

### Data and evidence rules

- No headline-driven fear content.
- Official alert cards link to sources.
- Recall/testing cards communicate scope.

### Current status

**Built / needs full page review**

### Next work

- Conduct dedicated Home usability review.
- Decide what recent information earns above-the-fold placement.
- Confirm Home does not distract from scanning.

## 8.16 Evidence and source experience

### One job

Allow users to inspect how OpenLabel reached an important conclusion.

### User outcome

A user can move from a short finding to supporting sources, counterevidence, limitations, and review status.

### Must have

- Direct source links.
- Source types: label, product database, official recall, independent test, study/review, company claim.
- Review statuses: checking, not yet reviewed, mixed, contested, well established.
- Funding/conflicts when relevant.
- Human relevance/exposure limits when relevant.
- Last-reviewed date for editorial entries.

### Quality bar

- Deep evidence available without overwhelming first screen.
- Understandable language.
- Supporting/challenging evidence shown for contested topics.
- No unsupported certainty.

### Data and evidence rules

- Funding/ties are context, not automatic disqualification.
- Study design, population, exposure, and outcomes matter.
- Research on one form, dose, animal model, or food context may not apply to scanned product.
- App says when it has not yet reviewed evidence.

### Current status

**Prototype**

### Next work

- Build reusable claim dossier template.
- Create source/review data model.
- Add editorial review dates/version history.
- Establish review criteria before scaling colors or health claims.

# 9. Page-by-page build sequence

1. **Global app shell** — verify navigation and installed-app behavior.
2. **Scan page** — complete iPhone camera and recovery testing.
3. **Product lookup** — standardize loading, partial-data, error, and unknown states.
4. **Product detail panel** — full regression test of scroll, swipe, close, save, and expanded rows.
5. **Ingredients and ingredient sheets** — fix wording consistency, validate allergy cue, expand starter library.
6. **For you and Profile** — validate personal matching, distinguish preferences from medical alerts.
7. **Explore** — build live product-name search.
8. **Library** — finish product snapshots, markers, and recent-change meaning.
9. **Recalls** — validate official live-data source and matching.
10. **Lab tested** — expand structured test register and source/method review.
11. **Evidence system** — build reviewed dossiers and structured color assignment.
12. **Comparisons and better swaps** — only after product facts, profile, and evidence flows are dependable.
13. **Production readiness** — backend/data architecture, privacy, security, accessibility, quality, brand/legal work.

# 10. Definition of complete for every page

A page is complete only when all of the following are true:

- Its one job is clear.
- A first-time user understands what to do.
- The primary action is easy to reach.
- Loading, empty, error, and missing-data states are designed.
- It works on a small iPhone screen.
- It is accessible without relying only on color.
- It does not overclaim from incomplete data.
- Sources and unknowns are available when relevant.
- Navigation away and back works.
- The owner has tested it in the intended flow.
- The feature/document status has been updated honestly.

# 11. Working agreement for future development

- Read the current repository, latest commits, roadmap, testing notes, and feature status before editing.
- Do not treat a committed file as a completed feature.
- Do not tell the user a feature is complete until it is wired into the app and tested in the intended flow.
- Do not ask for unnecessary intermediate approvals or give “almost done” updates when the requested work can be completed first.
- For every feature, define page/location, user job, data source, what it can say, what it cannot say, loading/failure/unknown state, mobile behavior, and test cases.
- After every batch: test the affected flow, update feature status, update this roadmap, and record what was actually tested versus only built.
- Preserve the product-panel order: product identity, macros, tags, ingredients, For you, breakdown, sources and unknowns.
- Keep the app focused: scan first, concise takeaways second, deep evidence third.
