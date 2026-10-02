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
4. Warnings list: DONE (red pinned, up to three more, filters). Recall-driven reds depend on the recall matcher.
5. Live research: first slice DONE (ingredient sheet, C1 and C2 checks). Next: C3 conflicts from PubMed text, relationship registry v0, reviewed dossiers feeding status words.

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
