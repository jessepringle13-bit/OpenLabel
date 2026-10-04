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
- Confirmed on owner iPhone 2026-10-03: barcode lookup of 012000163173 (Mountain Dew) after the parallel Open Food Facts fix, and the added sugar rows shown for that product (owner: worked and looks good). Still not tested on a phone: Sweeteners and Aspartame rows, sugar alcohol only case, watch list off case.
- Sweeteners and added sugar (2026-10-03, status Built, not Confirmed): four records, owner signed off as written 2026-10-03 (colors approved; tooth decay row applies to all products with added sugar): aspartame-cancer (yellow, unresolved), sweeteners-weight-disease (yellow, contested), added-sugar-dental-caries (orange, converging), sugary-drinks-weight-diabetes (orange, converging). Dossiers: docs/dossiers/non-sugar-sweeteners.md and added-sugar.md. Tested: register validity and resolve cases (86 pass); added sugar rows opened and checked on the live desktop page using the Maple oat drink sample (both rows appear, orange, on watch list). Built but not tested in the app: the Sweeteners and Aspartame rows (no sample product has an ingredient list with sweeteners); nothing tested on a phone. Known issue: the sweetened-drinks row appears above the tooth decay row. Drink detection guesses from the product name, so it can miss or misfire. Open: owner decisions on colors, IARC full monograph, EFSA opinion and panel interests, AHA disclosures, newer trials, sugar alcohols (erythritol, xylitol), 100 percent juice.
- IARC Monograph 114: closed 2026-10-03. Programme funders identified (NCI, NIEHS, European Commission); tables spot-checked. Not closable: the journal PDF of the Lancet Oncology paper could not be retrieved, so the author version was used.
- Funding and conflicts: closed as far as sources allow 2026-10-03. WCRF 2025 companion paper states funding and no author conflicts; EFSA process and 2014-2017 panel roster documented. Not available: Volume 114 meeting-specific funding; individual EFSA panel declarations (request-only, optional email to interestmanagement at efsa.europa.eu).
- Retraction check for Arnold 2012 and the OEHHA report.
- Seed oils split (owner approved 2026-10-03): two records. seed-oils-inflammation is status unsupported and shown as a gray row with the chip "Not shown in trials so far" (no color means "unsupported"; validator now requires unsupported to be grey with 2+ sources). seed-oils-heart-outcomes is contested yellow. Both owner-signed as written 2026-10-03 (Jesse Pringle); source checks stay partial. Result page shows two rows (Seed oils: inflammation; Seed oils: heart outcomes), only for people who watch seed oils. Built; 52 register tests pass; not yet tested in the app or on a phone. The hand-written seed oil sheet opened from the inflammation row (evidence.js) still holds the old combined wording and needs aligning.
- Seed oils record (before split): round 1 review done 2026-10-03 (12 sources with links, funding read for 11; round 2 added the 2025-2030 Dietary Guidelines, its Scientific Foundation review and author interests; MAHA report passage noted). Validator passes, 46 cases; not yet checked on a phone. Open: color decision (see docs/reviews/2026-10-03-seed-oils.md), Su 2017 full text, MAHA strategy report (Sept 2025), Simopoulos 2008, WHO omega-6 review, Ramsden 2016 critiques; owner sign-off pending.
- Full-text reads of remaining primary papers (2025 meta-analysis, UK Biobank, EPIC, NutriNet-Santé).
- Re-run the search for dye trials after 2021 and the IARC priorities page at each review date.
