# Testing checklist (v0.2)

## What is run before every push
1. Syntax check of every changed script.
2. Open the app in a browser at 390 by 844, then 320 by 568, then 768 wide.
3. Click through every page: Scan, Home, Explore, Library, Profile, product panel, Recent recalls, Lab tested.
4. Open and close every sheet by button, backdrop and Escape. Check each sheet opens at the top.
5. Check the product panel for: a sample product, a product with allergens and traces, a product with a seed oil, a product with a test result in the register, a product with a recall match, and a product with almost no data.
6. Check the swipe gestures: up to full, down to partial, down again to close, tap on the header.
7. Check there are no errors in the browser console and no sideways scrolling.
8. Check wording: plain language, allowed status words only, no scores, no verdicts.
9. Take a screenshot of every changed page.
10. After the push, compare the file sizes and fingerprints in the repo with the tested copies.

## How the checks are run
The build side drives the app in a headless browser with stand-in data for the online services (Open Food Facts, the FDA recall database). That proves the logic, layout and gestures. It does not prove the live services work.

## What only a phone can show, so the owner checks
- Camera scanning, in the browser and in the home-screen app.
- A real barcode lookup, product photo and nutrition values.
- Whether the FDA recall data loads in a phone browser (Recalls tag, Recent recalls page).
- How the pages feel to swipe, scroll and tap.
For each release the build side lists the two or three exact things to check.

## Known gaps
- Recall matching is tested only against stand-in records.
- Ingredient descriptions are tested in a stand-in panel.
- Sample products on Explore cannot show photos, macros or recalls.

## Pass rule
Nothing is pushed if any step above fails. A failed step is fixed, or the change is held and explained.

## Reporting a problem
Send a screenshot and say which page and what you tapped. The build side reproduces it before changing anything.

## Phase 0 allergy-row hardening (2026-10-02)
Automated: `node tests/allergy-match.test.js` (needs jsdom). 42 cases, 0 failed. Covers exact names, compound wording (peanut oil, milk powder, sesame seeds), nested parentheses, plant milks and cocoa butter not treated as dairy, eggplant and buckwheat not matched, custom watch words, profile off, and no leakage between allergens.
Desktop browser (cloud Chrome, live GitHub Pages, seeded test products, not real scans): compound and nested rows show "Allergy word in ingredient"; exact names show "Saved allergy match"; non-matching rows stay uncolored; changing the profile while a panel is open updates the rows; the ingredient sheet shows the matched word and states that an uncolored row is not proof of safety.
NOT yet tested: real iPhone, installed Home Screen app camera, the full Allergens section on real scans (seeded products lack stored allergen fields), trace statements on real data, Home Screen icon in Safari and Firefox.
Known limits: word matching can still miss derivatives with unrelated names and misspellings; "coconut milk" is not flagged for tree nuts (FDA no longer lists coconut as a tree nut).

## Step 4 panel regression (2026-10-02, cloud Chrome, 390x844 mobile emulation, live Pages)
Tested (emulated, not a real iPhone):
- Peek and full states, tap on handle toggles, all sections reachable, last row clears the bottom dock (long and real product).
- Close and return: from Scan, Explore, Home and Library the panel closes to the originating page. Dock tap closes the panel and navigates.
- Save and unsave from the panel header updates stored saved list.
- Long ingredient list (70 items): 7 rows shown, Show all ingredients, View label text, last row opens its sheet.
- Profile change: no allergies gives "Allergens: not set up"; adding milk gives "matches you" on reopen.
- Real Open Food Facts lookup (Nutella 3017620422003) fills macros, tags, ingredients and rows.
Bugs found and fixed (commit after aa5c302 deployed):
- Drag-to-resize threw "d is not defined" on every pointer move, so the sheet only changed state on release. Fixed; height now follows the finger in emulated mouse drag.
- Recalls and Seed oils showed green "None found". Now grey "No match found" / "None named in list", recall text says it is not proof that no recall applies.
- Category showed raw tag "fr:Nutella". Language prefix stripped.
- Camera error sheet could appear on other pages after leaving Scan. Suppressed.
Not tested: real touch swipe on iPhone, rubber-banding, Safari address-bar resize, live profile edit with the panel visible (dock tap closes the panel, so only reopen was tested), very long names in header.
Open decision for owner: Processing level uses green/orange for NOVA. That is a health-leaning color on a descriptive field; consider grey until the Phase 3 evidence review.

## Step 6 For you and Profile (2026-10-02, cloud Chrome, mobile emulation, live Pages)
Tested (emulated, not a real iPhone): saved allergy, watch words, intolerances, diets, topics and caffeine limit each change results on reopen, using a real Open Food Facts product (Coca-Cola Zero Sugar 5449000131805).
Found and fixed:
- Daily caffeine limit had no visible control after the Profile redesign (stuck at 150 mg). Added a Caffeine limit group with validation (whole number 0-1000, invalid input reverts).
- Custom watch words were reported as a red "Matches your allergy" finding. Now a separate orange row "Your watch words" ("Word on your list"), with text that it is a word the user chose, not a medical allergy, and a link to edit. Allergy findings stay red and allergy-only.
- Allergens "No match" and Intolerances "No match" were green. Now grey.
- Processing level was orange and counted in For you even when Ultra-processed was not a chosen topic. Now grey unless chosen (matches the Profile promise). This resolves the earlier open decision.
- Watch words now save while typing, not only on blur.
Not tested: real iPhone keyboard behavior in Profile inputs, diet-fit correctness across many products (rule definitions still to be written), intolerance word lists.

## Step 7 Explore (2026-10-02, cloud Chrome, mobile emulation, live Pages)
Tested (emulated): live name search on Open Food Facts (oat milk, almond milk), debounce after typing stops, results with image/brand/size/barcode ending, open result in the standard panel, close returns to Explore with query and results kept, sample products, recalls and lab-tested entries.
Found and fixed:
- Opening an Explore result detoured through the Scan page; closing the panel left the user on Scan (camera would start). Lookup now runs from Explore directly and returns to Explore.
- Search required the Search button. Added a debounced search (about 0.9 s after typing, 3+ characters, queued when inside the rate-limit window).
- Duplicate-looking results (many "oat drink") had no distinguishing info. Subtitle now shows brand, package size and last 4 barcode digits.
- Intro said three sample products (there are four). Recalls and Lab tested cards had title and subtitle run together.
- No-result and error wording now says it does not mean the product is missing.
Observed: Open Food Facts search returned 503 for several minutes during testing, and the error state displayed correctly; the faster search-a-licious endpoint is blocked by CORS in browsers, so it cannot be used directly. Relevance is weak on some queries (Toblerone for "almond milk"). Thumbnail sizing is uneven.
Not tested: real iPhone keyboard/scroll, offline mode, very slow connections, category filter chips combined with live results.

## Step 8 Library (2026-10-02, cloud Chrome, mobile emulation, live Pages, real Open Food Facts product)
Tested (emulated): saved and recent separation, last-seen tags, "Check saved for changes" against a stale seeded snapshot, field-level before/after (ingredients before/now, allergens and additives added or removed), card marker, See current details (refreshes stored product and returns to Library), Dismiss, unsave via panel star.
Found and fixed:
- The saved-product check never ran on real products. Real ids are off-<barcode> but the check only accepted pure digits, so it always said there was nothing to check. Fixed (earlier desktop test used digit-only ids).
- Changes listed only field names. Now show before/after or added/removed items.
- Explanation now states three levels: 1 database record changed (what we detect), 2 label may have been reformulated (not claimed), 3 package change confirmed (only the owner can confirm). Marker renamed "Database record changed".
- Added Dismiss and See current details. Package-size formatting noise (400 g vs 400 g e) no longer counts as a change.
Not built or not tested: remove control on Library cards (removal is via the star in the panel), automatic background rechecks (none, by design), real iPhone, the 10-product check limit with Open Food Facts rate limits, changes in nutrition values (not compared).

## Keto and per-100 g nutrition (2026-10-02, owner report: Lemon Perfect)
Owner found keto saying carbs were not listed when the nutrition table showed them. Cause: diet rows used per-serving values only, while the table falls back to per 100 g. Fixed for keto, low-carb, low-sugar and low-sodium, with a clear "per 100 g, no per-serving amount" message and a "database lists no value" message when nothing exists. Verified live on Lemon Perfect (0850003748887). 37 diet test cases pass.

## Steps 9 and 10 review: Recalls and Lab tested (2026-10-02, cloud Chrome, mobile emulation, live Pages)
Recalls verified: live openFDA data loads (100 records, grouped by event), search and filters present, details show reason, products, lots, distribution, status. The panel check uses UPC (confirmed), name (possible match) and brand (other) levels.
Fixed:
- Dates were ambiguous: the list showed the recall start date but was sorted by FDA report date. Now both are shown.
- No data freshness. Now shows the openFDA last-updated date and when the list was checked, and says recent recalls may lag.
- All links went to the general FDA list. Each recall now links to its FDA enforcement report (verified to open).
- "Lot not listed" was green. Now grey, with wording that it does not confirm the product is unaffected.
- Closing a camera error sheet: sheet is now dismissed when leaving Scan.
Lab tested verified against source pages (Consumer Reports baby food Sep 17 2026, protein powders Oct 14 2025 updated Jan 8 2026, Clean Label Project Jan 9 2025). Corrections:
- Clean Label Project: tested 165, analyzed 160 products from 70 brands; the page does not say plant-based and chocolate had the highest lead (it says highest contaminants overall, and chocolate had 110x more cadmium). Rewritten.
- Mum-Mum: removed an unsupported "heavy metals below concern" claim; the page gives no BPA number.
- Microplastics: 16 products tested, evidence in each of 15 purées.
- Exact publish and update dates added. Company responses checked; all consistent.
Colors: red only where the tester says to avoid (Naked Nutrition, Huel); other above-limit results are orange; "lead not detected" is grey with scope in the text.
Not done: USDA meat, poultry and egg recalls; matching by package size and distribution; lab relevance labels (exact product / different lot / brand family) beyond product and category; tester funding and ties (all still "not checked"); recall brand search is capped at 25 records per brand, which large brands can exceed; a real iPhone pass.

## USDA recalls and Phase 3 color slice (2026-10-02, cloud Chrome, mobile emulation, live Pages)
USDA FSIS feed (fsis.usda.gov/fsis/api/recall/v/1?field_archive_recall=0, about 1 MB, 189 records, reduced and cached 6 hours on the device):
- Recent recalls page now merges FDA and USDA items, newest first, with source label, USDA notice link, USDA data-modified date, and an error note if USDA cannot be reached (FDA still shows). Verified live: 3 USDA items in the last 90 days, Fontanini pork sausage opened with reason, product, states, status, official link.
- Product recall check now searches both sources by brand and name. Verified on Lemon Perfect: "No match found", wording says FDA and USDA, both official links shown. A USDA match was not yet exercised on a real meat product barcode (needs owner test).
- Limits: the feed filter available for current data returns active recalls, public health alerts and unarchived closed recalls; recalls already archived may be missing from the 90-day list. FSIS lacks barcodes, so matching is by brand and name only. Public health alerts are labelled as alerts, not recalls. Direct browser access works (CORS open); the server blocks command-line requests, so this cannot be moved to a script without a proxy.
Phase 3 audit (color rules in PAGE_ROADMAP Phase 3):
- Processing level base color was green/yellow/orange by NOVA group. Now grey; orange only if the user put ultra-processed on their watch list.
- Caffeine: "Within your limit" was green and the over-limit chip also said "Within your limit" (bug). Now orange "Above your limit" or grey "Within your limit".
- Diets: chip "Fits your diets" changed to "Fits by label" (green kept, since rules are documented and tested, but scoped to label data).
- Every red, orange, yellow or green row now has a collapsed "Why this color" block with reason, source, scope, who it applies to, limits and review status. Verified for watch-list rows live. Topic orange states it is the user's choice, not an evidence finding.
- Still open: no structured evidence register yet; green and yellow are not assigned from reviewed dossiers except seed oils (grey by default, contested evidence in the row text); ingredient highlight legend still colors seed oils yellow while the row is grey; test-result rows rely on a hand-set color table.

## Garbled ingredient lists (2026-10-02, owner report: Kevin's Thai Style Coconut Chicken)
Owner's pasted list was software-read label text: nutrition-panel words mixed in and misspelled ingredients. Added: cleanIng() strips pre-"Ingredients" nutrition text and flags garbled lists (warning in list and in Sources and unknowns); long lists no longer cut at 1,200 characters; with a garbled flag, rows containing words not in an ingredient vocabulary (ingredient-vocab.json, 2,963 words from the Open Food Facts ingredients taxonomy) show "Looks misread · check the package" in italics. Verified live with the pasted text injected into the lookup. Words are not auto-corrected. Not verified against the real record, which had no ingredients when checked. Possible false flags: valid but unusual words not in the vocabulary, only when the list is already flagged garbled.

## Own ingredient list override (2026-10-02)
Owner supplied the true Kevin's Thai Style Coconut Chicken ingredients. Typed list parses into 5 rows (Chicken, Thai coconut sauce with nested brackets, cauliflower rice, broccoli, carrots). Added a device-only override: Enter it from the package, saved per barcode in localStorage, replaces database text for display and for allergen, diet and seed-oil checks, labeled as user-entered and unverified, with Edit and Remove. Panel now re-renders when ingredient text changes. Verified live with an injected garbled record. Not sent to Open Food Facts. Limit: nested lists stay as one row per top-level item; sub-ingredients inside parentheses are not separately tappable.

## USDA ingredient fallback (2026-10-02, owner decision)
Open Food Facts had no ingredient text for either Kevin's Thai coconut chicken record when checked directly; owner saw an unreadable list after searching in Explore (source not reproduced). When the Open Food Facts list is missing or looks garbled (and the user has not entered their own), the app searches USDA FoodData Central branded foods (own free api.data.gov key since 2026-10-03, 3,600 requests per hour) by barcode, else brand plus name (brand match required, 80% of name words). The list is shown lowercased with a note naming the source, the USDA record name, its last-modified date and the match type, and saying the recipe may have changed. Verified live: the USDA record is dated 2020-06-19 and lacks the cauliflower rice, broccoli and carrots the owner read off the current package, so the note matters. User-entered lists take priority. Gaps: Key limit 3,600 per hour; name-only matching can pick a variant (this one is titled MILD); not yet shown in the Library change detection.

## Owner device test results (2026-10-03, "Test products" file)
Steps 1-5, 8-10 passed. Failures and suggestions, with status:
- Step 1 rotate: landscape did not fill the screen. Fixed in CSS (full width under landscape phone sizes); Built, checked in an emulated viewport only, needs iPhone recheck.
- Step 5: unverified "Form and origin" line removed, "Still unknown" now small print, Sources note smaller. Built; needs iPhone recheck.
- Step 6: Drizzilicious 857900005174 (21 g carbs per 28 g serving, 75 g per 100 g) did not trip Keto. Rule now also says no when carbs are 25 g or more per 100 g. Verified live: Diets row shows "1 not a fit". Unit tests 40/40.
- Step 7: Processing level chip overlapped its title. Fixed (title and chip share the row); verified in emulated phone view.
