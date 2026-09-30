# OpenLabel roadmap and tracker (living document)
Last updated 2026-09-30. Update this file with every batch.

Status key: LIVE = works in the repo now. CHECK = live but needs a check on a real phone. NEXT = decided and queued in order. RESEARCH = needs a source or a test before we can build it. LATER = wanted, not scheduled. CANNOT = not possible yet, with the reason.

## How a customer moves through the app
The app opens on Scan. A scan leads to the Result page. Items on the Result page open sheets for more detail. The bottom dock has Home, Explore, Library and Profile.

One job per page:
| Page | Its one job |
|---|---|
| Scan | Get a barcode, fast |
| Result | Show what this product is and what matters to this customer |
| Sheets | Explain one item in more depth, then close |
| Explore | Find a product by name |
| Library | Find saved and recent products again |
| Profile | Tell the app what matters to you |
| Home | Start a scan and pick up where you left off |

## LIVE now
| Feature | Status | How it was checked |
|---|---|---|
| Barcode scanning with camera, digit-reader backup, manual entry | CHECK | Not tested on a real phone camera; home-screen mode on iPhone unverified |
| Product lookup in Open Food Facts | CHECK | Logic tested with sample data; live lookups not testable from my side |
| Allergen and trace matching | LIVE | Tested with sample products |
| Caffeine limit and sweetener highlight | LIVE | Tested with sample products |
| Saved and recent products | LIVE | Tested |
| Home-screen install, icon | CHECK | Safari and Firefox on iPhone showed a fallback icon |
| Seed-oil evidence sheet (outcome pending checks) | LIVE | Tested in browser at phone size |
| Independent test results register v0 and Testing cards | LIVE | Matching tested with sample products; real-product naming from the database not yet tested |

## NEXT (in order)
1. Batch 1: Result page tags (processing level first), remove Nutri-Score, new Profile picker (allergies, intolerances, diets, topics to watch), diet fit statements.
2. Batch 2: Explore becomes a live search by product name.
3. Batch 3: warnings list (allergen and recall matches pinned, up to three more, See all findings) and recall checks.
4. Batch 4: Library markers and recent changes.
5. Batch 5: live research after each scan with automatic source checks.

Diet rules already agreed: vegan and vegetarian show yes, no, maybe or can not tell. Keto and low-carb compare carbs per serving with the customer's own daily target. High carb means 35 g or more carbs, or more than 10 g sugar, per serving. Whole food means processing group 1.

## RESEARCH needed before building
- Whether browsers can call PubMed, OpenAlex and Crossref directly; OpenAlex now needs a free API key.
- Whether Open Food Facts shows what changed between versions of a product.
- How reliably the database marks plant-based meat, organic and gluten-free.
- Where California baby-food test disclosures are published, brand by brand.
- Sources for plastic chemical leaching, glyphosate by food, and more independent testers.
- A sourced list of less common allergens beyond the official lists.
- How accurately recall notices can be matched to a scanned product.
- Funding and relationship checks on every source already shown (seed-oil sources, test register testers).

## LATER
- Dyes, plant-based meat and contaminant topics with full coverage.
- Longer processing-level explanation lower on the Result page.
- Broader news, once each source is vetted.

## CANNOT yet
- Product-specific contaminant results for most products: the data mostly does not exist.
- Saying a specific product contains a metal, pesticide or plastic without a test of that product.
- Saying a food will knock someone out of ketosis as a certainty: it depends on the whole day and the person.
- Testing on a real phone or with a live camera from my side.

## Guardrails against sprawl
1. Every feature declares its page, its place on that page, what it replaces, and how it looks on a small screen before it is built.
2. Result page order stays fixed: identity and tags; pinned alerts (allergens, recalls); For you; Worth knowing; On this label; What we do not know; Where this came from.
3. No list shows more than three items without a See all.
4. Status words come from one fixed set: well established, mixed, unproven, contested, checking, not yet reviewed.
5. No scores and no good or bad verdicts. Diet and allergy statements match the customer's own choices.
6. Use the existing calm palette and type sizes. A new color or size needs a reason.
7. After every batch: screenshot every page, run the checklist in TESTING.md, and update this file.
8. Keep index.html for structure. Evidence content lives in evidence.js and registry.json.

## Format checklist: what looks right means
- Fits a 390 by 844 phone, a small 320 by 568 phone, and a wide tablet, with no sideways scrolling.
- Every tap target is at least 44 px; every button has a label.
- Each page has one clear main action.
- Sheets scroll, close with the button, the backdrop and Escape, and never trap the customer.
- Text is plain language at about a school-age reading level.
