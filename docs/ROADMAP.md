# OpenLabel roadmap pointer and status ledger
Canonical plan: docs/PAGE_ROADMAP.md (page-by-page roadmap, copied from project storage 2026-10-02). Follow its section 9 build sequence in order. This file keeps the older tracker below for history and holds the current ledger.

## Status ledger (2026-10-02, statuses use the page roadmap definitions)
| Build step (section 9) | Work done in repo | Tested | Status |
|---|---|---|---|
| 1 Global app shell | unchanged | not re-tested on iPhone | Built / owner testing needed |
| 2 Scan page | unchanged | not re-tested on iPhone or in Home Screen mode | Built / owner testing needed |
| 3 Product lookup states | partial-record wording, fetched-at timestamp (2026-10-02) | desktop browser only | Built |
| 4 Product panel | warnings list: pinned reds, up to three more, count, filters | simulated page only | Built |
| 5 Ingredients and sheets | compound and nested allergy-word matching, wording unified, 42 automated cases | automated + desktop browser with seeded products | Built, awaiting iPhone confirmation |
| 6 For you and Profile | unchanged | not re-tested | Built / needs validation |
| 7 Explore | live Open Food Facts name search (explore-search.js), debounced, opens panel directly, returns to Explore; emulated test 2026-10-02 | owner iPhone test needed; OFF search can return 503 | Built |
| 8 Library | library.js: last seen, database-record-changed markers, field-level before/after, three-level explanation, dismiss, recheck (fixed for real off- ids); emulated test with real product 2026-10-02 | owner iPhone test needed; no remove control on cards; nutrition not compared | Built |
| 9 Recalls | live openFDA verified 2026-10-02; dates, freshness, per-recall FDA link, grey lot-not-listed | USDA added 2026-10-02 (name match only, archived recalls may be missing); brand search capped at 25 records; owner iPhone test | Built (prototype scope) |
| 10 Lab tested | 10 entries compared with source pages 2026-10-02, corrected; calmer colors | funding/ties unchecked; relevance labels incomplete; tiny set | Prototype |
| 11 Evidence system | research check (PubMed and Crossref) and relationship registry v0 | simulated page | PARKED behind ?labs=1. Out of sequence. Hidden from normal use until step 11 |
| 12-13 | not started | | Planned |

# OpenLabel roadmap and tracker (living document)
Last updated 2026-10-01. Update this file with every batch.

Status key: LIVE = works and the owner has seen it on a phone. CHECK = live, but not yet confirmed on a phone or against the real service. NEXT = decided and queued in order. RESEARCH = needs a source or a test before we can build it. LATER = wanted, not scheduled. CANNOT = not possible yet, with the reason.

## How a customer moves through the app
The app opens on Scan. A scan raises the product panel over the scanner. The panel swipes between a partial and a full view. Tapping a tag, a row or a highlighted word opens more detail. Home and Explore each have two cards: Recent recalls and Lab tested. The bottom dock has Home, Explore, Library and Profile.

One job per page:
| Page | Its one job |
|---|---|
| Scan | Get a barcode, fast |
| Product panel | Show what this product is and what matters to this customer |
| Sheets | Explain one item in more depth, then close |
| Recent recalls | Browse current FDA food recalls |
| Lab tested | Browse independent contaminant test results, grouped by category |
| Explore | Find a product (name search not built yet) |
| Library | Find saved and recent products again |
| Profile | Tell the app what matters to you |
| Home | Start a scan and reach recalls and lab tests |

## LIVE or CHECK now
| Feature | Status | Notes |
|---|---|---|
| Barcode scanning, digit-reader backup, manual entry | LIVE | Confirmed on phone |
| Product lookup in Open Food Facts | LIVE | Confirmed with a real product. Typing a product name does not search yet |
| Home-screen install button | LIVE | Confirmed |
| Product panel: swipe-up sheet, photo, macros, colored tags, ingredients, dropdown rows | LIVE | Confirmed and reordered to the owner's layout |
| Color system (red, orange, yellow, green, grey) with words on every chip | LIVE | Rules below |
| Allergen and trace matching, caffeine limit, sweetener highlight | LIVE | Tested with sample products |
| Seed-oil evidence sheet (outcome pending source checks) | LIVE | |
| Independent test register: 10 starter entries, Testing row and Lab tested page by category | LIVE | Page confirmed by the owner. Testers' funding and ties not yet checked |
| Recalls tag and dropdown with lot check (FDA reports, last 18 months) | CHECK | Tested with stand-in data. Real FDA access from a browser not confirmed |
| Recent recalls page (FDA, last 90 days, search, filters) | CHECK | Same dependency on FDA access |
| Tappable ingredients: 11 sourced entries | CHECK | Tested with a stand-in panel only |
| Details sheets always open at the top | CHECK | Bug reproduced and fixed. Needs a phone check |
| Home-screen icon fallback in Safari and Firefox on iPhone | CHECK | Open since the first install tests |

## Color rules (fixed)
Red: a direct match to you, a recall found, or a tested result above the tester's limit. Orange: on your watch list, elevated, or contested. Yellow: mixed or unproven evidence. Green: we checked and found no concern. Grey: not enough data or not yet reviewed. Every colored chip carries words, never color alone. No scores and no good or bad verdicts.

## NEXT (in order)
1. Profile picker: allergies (full list), intolerances, diets, topics to watch, plus diet fit statements (vegan and vegetarian show yes, no, maybe or can not tell; keto and low-carb compare carbs per serving with the customer's own target; high carb means 35 g or more carbs, or more than 10 g sugar, per serving).
2. Explore becomes a live search by product name.
3. Library markers and recent changes.
4. Warnings list: BUILT, not device-tested (red pinned, up to three more, filters). Recall-driven reds depend on the recall matcher.
5. Live research: BUILT (prototype, tested only in a simulated page against live PubMed and Crossref, not on a phone): ingredient sheet with C1 standing, C2 funding, C3 conflict text (verbatim), C4 registry flags. Next: owner review of registry, add entries on all sides (e.g. trade associations, supplement and organic industry, advocacy groups), reviewed dossiers feeding status words, scheduled re-checks.

## Content to grow
- Test register: chocolate and cocoa, bottled water, fruit juice and rice products are the next categories. Each needs the full report read, and the tester's funding and ties checked.
- Ingredient descriptions: citric acid, more additives, colors, preservatives, each with a real source.
- USDA meat, poultry and egg recalls (FDA recalls only so far).

## RESEARCH needed
- Whether browsers can call the FDA recall service directly. If not, route the request another way.
- USDA recall API details and browser access.
- Whether Open Food Facts shows what changed between versions of a product.
- How reliably the database marks plant-based meat, organic and gluten-free.
- A better source of product photos (Open Food Facts photos are user-contributed).
- Funding and relationship checks on every source and tester already shown.

## LATER
- Keeping the live camera behind the product panel (needs a change to the main app file).
- Dyes, plant-based meat and more contaminant topics with full coverage.
- A similar-products list without scores.
- Official-alerts feed. Not a headline feed.

## CANNOT yet
- Product-specific contaminant results for most products: the data mostly does not exist.
- Saying a specific product contains a metal, pesticide or plastic without a test of that product.
- Saying a food will knock someone out of ketosis as a certainty.
- Testing on a real phone or against live services from the build side.

## How the code is organized
| File | Job |
|---|---|
| index.html | The original app: scanning, lookup, pages, profile, library |
| evidence.js | Seed-oil evidence, test sheet, register matching. Loads result.css and result.js |
| result.css, result.js | The product panel. Hides the original result page and reads from it |
| recalls.js | Recalls row for the panel. Loads the other add-on files |
| recalls-page.js | Recent recalls page |
| glossary.js | Tappable ingredient descriptions |
| lab-tested.js | Lab tested page, plus the fix that resets sheets to the top |
| registry.json | The independent test register |

## Known shortcuts to clean up
- The panel and add-ons sit on top of index.html and read the original result page. Fold them into index.html the next time that file is rewritten (the profile picker will need that).
- Result colors for each test are listed in result.js and lab-tested.js. Move them into registry.json along with a category field.
- The Lab tested category is worked out from the test id until registry.json carries it.
- Each push re-sends whole files, so we keep files small and separate.

## Guardrails against sprawl
1. Every feature declares its page, its place on that page, what it replaces, and how it looks on a small screen before it is built.
2. Product panel order stays fixed: photo and name; Macros; Tags; Ingredients; For you (red and orange); Breakdown rows.
3. No list shows more than three items without a See all, except browse pages, which paginate.
4. Status words come from one fixed set: well established, mixed, unproven, contested, checking, not yet reviewed.
5. No scores and no good or bad verdicts. Diet and allergy statements match the customer's own choices.
6. Use the existing calm palette and type sizes. A new color or size needs a reason.
7. After every batch: screenshot every page, run the checklist in TESTING.md, and update this file.
8. New features go in their own small file where possible.


## Update 2026-10-03
Phase 3 evidence register: design drafted in docs/EVIDENCE_REGISTER_DESIGN.md (Planned, nothing built). Waiting on owner decisions in section 9.

## Evidence register: open items (updated 2026-10-03)
- Additives health rows and hidden topics (2026-10-03, status Built; the three records are owner signed off 2026-10-03, rows not phone tested): three yellow records (titanium-dioxide-genotoxicity, potassium-bromate-cancer, benzoate-preservatives-intake), shown as sub-rows of Additives. Owner request: all topic rows are hidden unless the topic is on the watch list (a note under the tags counts the hidden topics). Known limits: only three additives covered; the EFSA benzoate opinion was read through trade press; code coverage list is fixed.
- Additives round 2 (2026-10-03; caramel-color-4mei, msg-glutamate, phosphate-additives owner signed off 2026-10-04; the other four still provisional; rows not phone tested): seven records under topic additives: bha-cancer, bht-intake, sulfites-sensitivity (orange converging, scoped to sensitive people), propylparaben-endocrine, caramel-color-4mei (yellow contested), msg-glutamate (yellow contested), phosphate-additives. Sub-rows appear only when Additives is watched and the ingredient is listed; E-codes for these now count as having their own row. Known limits: several sources read at abstract or news-release level; propylparaben EU food status not verified from a primary source; caramel class usually not on labels; TBHQ, azodicarbonamide, artificial flavors, sorbates not yet covered. Tests: 195 register cases pass.
- Additives round 3 (2026-10-04, status Built, not tested on a phone, not signed off): four provisional records: tbhq-intake and azodicarbonamide-safety (yellow unresolved, sub-rows under Additives), sorbates-intake (grey, no evidence finding, sub-row under Additives), artificial-flavors-health (grey, no evidence finding, own row under the Flavors topic; topic label renamed from Natural flavors, saved key unchanged). Known limits: EFSA 2016 TBHQ statement read through a Japanese summary; TBHQ mouse allergy study read through a university center summary; azodicarbonamide cancer classifications of breakdown products read only on an advocacy page; EFSA 2019 sorbate opinion read through the EU regulation. Tests: 214 register cases pass.
- Additives and natural flavors (2026-10-03, status Built; the two records are owner signed off 2026-10-03, rows not phone tested): two grey records, natural-flavors-health (topic flavors) and additives-label-review (topic additives, about review process not health). Replaces the hand-set orange rows shown when either topic was watched. The Additives row now lists which codes have their own row (dyes, cured meats, sweeteners, carrageenan, emulsifiers) and which are not yet reviewed. Known limits: no studies of natural flavors as a class found; FEMA process, FDA flavor guidance and the Federal Register GRAS proposal not read in full; coverage of codes by other rows is a fixed list.
- Emulsifiers, carrageenan and ultra-processed food (2026-10-03, owner signed off all three records and the yellow colors 2026-10-03 after testing on his phone and reporting it looks fine; status Confirmed for the rows he saw; specific products he tried were not recorded, and the Carrageenan row and lecithin-only case were not exercised in my desktop cloud-browser check on Mountain Dew 012000163173 showed Emulsifiers and Processing rows yellow "Contested evidence · on your watch list"; Carrageenan row and lecithin-only case not exercised in a browser): three provisional records, all recommended yellow: emulsifiers-gut-disease, carrageenan-gut-disease (topic emulsifiers; separate Carrageenan row only when carrageenan/E407/E407a is listed; lecithin-only lists show grey 'may not apply') and ultra-processed-health (topic ultra; drives the Processing level row for NOVA group 4, keeps the NOVA bar and notes). Replaces the hand-written orange emulsifier row and orange ultra-processed override. Also fixed: the old Sweeteners row color override no longer overwrites register colors. Cleanups done: seed oil sheet now from the register, tooth decay row before sweetened drinks, drink detection uses category. Known limits: Lancet Series, SACN, Belgian trial full text, EFSA follow-up, JECFA/FDA, retraction checks. Per owner, these topics are considered good enough for the app for now.
- Seed oils gaps (2026-10-03, second pass): MAHA strategy report closed (read in full, 20 pages; no mention of seed oils). Simopoulos 2008 partly closed (abstract and PubMed type read; full text, funding and interests not reached). No change to either color.
- Seed oils gaps (2026-10-03): WHO omega-6 cohort review closed (read via repository copy; added as a source to seed-oils-heart-outcomes; WHO commissioned and partly funded, no author declarations in the copy). Su 2017 partly closed: authors and affiliation read; funding and conflicts could not be found in page text or Crossref, so listed as unchecked. The added source does not change either color; owner may want to re-confirm.
- Confirmed on owner iPhone 2026-10-03: barcode lookup of 012000163173 (Mountain Dew) after the parallel Open Food Facts fix, and the added sugar rows shown for that product (owner: worked and looks good). Still not tested on a phone: Sweeteners and Aspartame rows, sugar alcohol only case, watch list off case.
- Sweeteners and added sugar (2026-10-03, status Built, not Confirmed): four records, owner signed off as written 2026-10-03 (colors approved; tooth decay row applies to all products with added sugar): aspartame-cancer (yellow, unresolved), sweeteners-weight-disease (yellow, contested), added-sugar-dental-caries (orange, converging), sugary-drinks-weight-diabetes (orange, converging). Dossiers: docs/dossiers/non-sugar-sweeteners.md and added-sugar.md. Tested: register validity and resolve cases (86 pass); added sugar rows opened and checked on the live desktop page using the Maple oat drink sample (both rows appear, orange, on watch list). Built but not tested in the app: the Sweeteners and Aspartame rows (no sample product has an ingredient list with sweeteners); nothing tested on a phone. Known issue: the sweetened-drinks row appears above the tooth decay row. Drink detection guesses from the product name, so it can miss or misfire. Open: owner decisions on colors, IARC full monograph, EFSA opinion and panel interests, AHA disclosures, newer trials, sugar alcohols (erythritol, xylitol), 100 percent juice.
- IARC Monograph 114: closed 2026-10-03. Programme funders identified (NCI, NIEHS, European Commission); tables spot-checked. Not closable: the journal PDF of the Lancet Oncology paper could not be retrieved, so the author version was used.
- Funding and conflicts: closed as far as sources allow 2026-10-03. WCRF 2025 companion paper states funding and no author conflicts; EFSA process and 2014-2017 panel roster documented. Not available: Volume 114 meeting-specific funding; individual EFSA panel declarations (request-only, optional email to interestmanagement at efsa.europa.eu).
- Retraction check for Arnold 2012 and the OEHHA report.
- Seed oils split (owner approved 2026-10-03): two records. seed-oils-inflammation is status unsupported and shown as a gray row with the chip "Not shown in trials so far" (no color means "unsupported"; validator now requires unsupported to be grey with 2+ sources). seed-oils-heart-outcomes is contested yellow. Both owner-signed as written 2026-10-03 (Jesse Pringle); source checks stay partial. Result page shows two rows (Seed oils: inflammation; Seed oils: heart outcomes), only for people who watch seed oils. Built; 52 register tests pass; not yet tested in the app or on a phone. The hand-written seed oil sheet opened from the inflammation row (evidence.js) still holds the old combined wording and needs aligning.
- Seed oils record (before split): round 1 review done 2026-10-03 (12 sources with links, funding read for 11; round 2 added the 2025-2030 Dietary Guidelines, its Scientific Foundation review and author interests; MAHA report passage noted). Validator passes, 46 cases; not yet checked on a phone. Open: color decision (see docs/reviews/2026-10-03-seed-oils.md), Su 2017 full text, MAHA strategy report (Sept 2025), Simopoulos 2008, WHO omega-6 review, Ramsden 2016 critiques; owner sign-off pending.
- Full-text reads of remaining primary papers (2025 meta-analysis, UK Biobank, EPIC, NutriNet-Santé).
- Re-run the search for dye trials after 2021 and the IARC priorities page at each review date.

- Additive records sign-off (2026-10-04): owner signed off all additive records: bha-cancer, bht-intake, sulfites-sensitivity, propylparaben-endocrine, tbhq-intake, azodicarbonamide-safety (kept yellow), sorbates-intake (kept grey), artificial-flavors-health. Rows built but not phone tested.
- Batch 2026-10-04 (status Built, not phone tested): (1) sorbates row chip now says on your watch list; (2) recalls: brand search now reads up to 100 FDA reports (was 25) and runs a separate search by barcode, and says when the cap was reached; (3) Lab tested: 11 new entries across four new categories (chocolate and cocoa, rice, fruit juice, bottled water; all Consumer Reports) plus funding and ties text for the existing Consumer Reports entries and Clean Label Project (own statements and trade press, not an audit; the bottled water testing was funded by the Forsythia Foundation per CR); registry test added (tests/registry.test.js); (4) ingredient descriptions: 14 new sourced entries from FDA's inventory of substances added to food (BHT, MSG, azodicarbonamide, potassium benzoate, potassium bromate, maltodextrin, dextrose, disodium guanylate, sulfites, caffeine, sodium phosphates, titanium dioxide, sodium nitrate, malic acid). Known limits: CR rice and juice product charts could not be read, so only named products with stated results were added; CR articles do not name the laboratory; juice tests are from 2019 and water tests from 2020; phosphoric acid, TBHQ, sodium citrate and cellulose gum had no usable FDA inventory page; recall barcode search not yet confirmed against a product with a real recall.- Tested 2026-10-04 in a desktop cloud browser, not on a phone: recalls found a real Ghirardelli recall by barcode with lots and FDA link; Lab tested lists 21 tests in 6 categories and the Lundberg sheet shows result, limits, response, funding text; caffeine description with FDA source shows when the ingredient sheet opens. Not yet seen live: the sorbates watch-list chip, the 100-record cap note, other new ingredient sheets. Known quirk: the ingredient list row says Purpose not yet verified until the sheet is opened once.
- 2026-10-04: ingredient list rows now show Common use explained for every ingredient that has a sourced description, before the sheet is opened (Built; cloud-browser check pending).
- 2026-10-04: ingredient descriptions also match when the label adds a trailing parenthetical, such as potassium benzoate (to protect taste). A name with a list of sub-ingredients in parentheses still gets no description. Built; unit-checked, live check pending.
- 2026-10-04 (Built, cloud-checked only): scan results simplified. Tags show only the tag name with its color (full status text kept for screen readers). The For you section now holds one dropdown per tag, with a color dot and no status chip; the status line is the first thing inside each dropdown. Breakdown rows are unchanged.
- 2026-10-04 (Built; cloud-checked, not phone tested): Library now has a Remove button on every Saved and Recent card and a two-tap Clear all Recent. Recalls: a product with no brand but a barcode is now searched by barcode only, with a note that brand matches were not possible. Not changed: wrong ingredient text from Open Food Facts (for example Diet Coke) still needs the existing enter-it-from-the-package control.
- 2026-10-04 (Built; cloud-checked, not phone tested): the whole-list 'enter it from the package' editor is removed. Each ingredient sheet now has 'Wrong on the package? Change this ingredient', with Save and recheck, Remove this entry, and Undo all my changes. Changes are stored on this device per product and applied to the database text before every check. Old whole-list entries are deleted from the device.
- 2026-10-04 (Built; cloud-checked, not phone tested): scan panel cleanup. One Seed oils tag and one Seed oils dropdown (inflammation and heart outcomes sit inside it). Removed: the Tags heading and profile name, the For you heading and count line, the hidden-topics sentence, the nutrition-panel warnings in the ingredient intro, and the Purpose not yet verified label on ingredient rows. Breakdown dropdowns now show only a count of findings for the topic, in the worst color among its results; the status words (for example No match found) moved inside each dropdown.
- 2026-10-04 (Built; cloud-checked, not phone tested): ingredient rows and sheets now state the actual use (for example Sweetener, Stimulant, Flavor enhancer) instead of 'common use explained'; tags are sized to their wording and wrap; Nutrition facts moved to sit right after the tags.
- 2026-10-04 (Built; cloud-checked, not phone tested): removed the 'Tap an ingredient...' sentence under Ingredients; ingredient rows are now smaller, with a soft green tint and 13px text, so they look different from the topic dropdowns.
- 2026-10-04 (Built; cloud-checked, not phone tested): removed the warning/note paragraph under Ingredients; View label text is now a button on the same row as Show all/fewer ingredients, at the opposite end; section titles (Macros, Ingredients, Topics, Breakdown) are centered, larger, with a short line under each; the topic dropdowns now have a Topics title; scripts and styles load with a version tag so phones pick up updates immediately. Fixed a file-corruption slip from the earlier ingredient-change edit (a duplicated block in ingredients.js).
- 2026-10-04 (Built; cloud-checked, not phone tested): a divider line sits between section titles on the product panel. Home and Explore show Recalls and Lab tested as two square tiles side by side (Home: under Scan a product; Explore: above the search). Recent on Home shows up to 6 scans in smaller rows. Explore results use the same smaller rows, and the Explore intro heading is hidden so the search is the first thing under the tiles.
