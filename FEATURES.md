# OpenLabel — Features and Capabilities

A living log of what OpenLabel can do, what it can't do yet, and what we're building next. Updated whenever something is added or changed.

**Last updated:** 2026-11-01 (this log was last brought up to date on 2026-09-29, so entries between then and 2026-10-30 live in docs/ROADMAP.md and docs/TESTING.md)

## What OpenLabel is

A food transparency app: scan a product, see what the label actually says, and see what matters to you specifically. It shows sources and gaps instead of a single good/bad score.

## Design principles

- Evidence first. Show what the data says and where it came from.
- No simple scores. No universal "good" or "bad" ratings.
- Unknown is never safe. Missing data is shown as "we don't know," never as a pass.
- Personal relevance over generic advice. Findings are matched to your own preferences.
- Your data stays with you. Preferences, history and saved products are stored only in your browser on your device.
- Education, not diagnosis. Nothing here is medical advice.
- Calm, light, green-and-blue look. Transparency effects only on the scanner.

## What works today

### Scanner
- Opens straight to the scanner; the live camera fills the whole screen behind the scan frame.
- Camera starts automatically (no on/off button).
- Reads EAN-13, EAN-8, UPC-A and UPC-E barcodes using a WebAssembly ZXing reader loaded from a public CDN on first use.
- Backup digit reader (Tesseract.js OCR): reads the printed number under a damaged barcode, accepts it only if it passes the UPC/EAN check digit on two frames in a row. Not yet tested on a damaged barcode.
- Manual barcode entry.
- Status pill under the frame shows what the scanner is doing or why it failed.

### Product lookup
- Live lookups in Open Food Facts (community database, Open Database License): tries the v3 API for 12 s, then v2 for 12 s.
- Shows name, brand, category, ingredients, allergens listed, additives listed, package and serving size, Nutri-Score and NOVA group when the database has them.
- Clear messages when a barcode isn't in the database or the lookup fails. Neither implies the product is safe.
- One built-in sample product (barcode 012345678905) for demos.

### Allergen and trace check
- Profile: pick your allergies from the nine major US allergens (milk, eggs, fish, crustacean shellfish, tree nuts, peanuts, wheat, soy, sesame), a "More" row (gluten, mustard, celery, molluscs, sulphites, lupin), and your own words.
- Each scan is checked three ways: the database's declared allergens ("Contains"), its "may contain" traces ("May contain"), and the ingredient text ("Contains", naming the matching word).
- Results lead the "For you" section, each with a "Why am I seeing this?" explanation.
- If a product has no ingredient or allergen data, the app says it cannot check. If nothing matches, it says so and states that no match never means safe.
- Wheat matches the database's gluten tag, with a note that the source may be rye or barley.
- Products saved before this feature ask you to scan them again.
- Limits: the database can be missing ingredients or traces; the word lists are a starting set, not exhaustive (known gaps: generic "dairy" and "bran", which are too ambiguous to match); it is not medical advice.

### Result page
- "For you": findings matched to your profile.
- "On this label": the product facts.
- "What we don't know": missing data and community-data caveats.
- "Where this came from": source and license attribution.
- Save/unsave a product.

### Profile
- Allergies and sensitivities (see above).
- Daily caffeine limit: compared with the product's caffeine amount when the database lists one.
- Highlight sweeteners: flags sweeteners found in ingredient text or additive codes.

### Warnings list (result panel)
- "For you": red items pinned first, then up to three orange or yellow items. A count line states how many findings exist. Breakdown has See all, Findings only and No findings filters. No scores.

### Ingredient research check (ingredient sheet)
- relationship-registry.json: seed list of 4 documented entries (Sugar Research Foundation, Global Energy Balance Network, ILSI, Coca-Cola), each with source links and tier. Matches against study affiliations, grant agencies, conflict text and Crossref funders produce a "flag for human review" (a lead about the organization, not a finding about the study). Not yet owner-reviewed and not balanced across sides.
- (Parked: only loads with ?labs=1 or localStorage openlabel-labs=1.) ingredient-research.js: opening an ingredient sheet searches PubMed for human trials and reviews naming it, then runs standing (PubMed types + Crossref notices) and declared-funding checks on the top three. Declared conflicts are shown verbatim from the PubMed record when present. No claims about what studies show. Status words: checking, studies found not yet reviewed, none found, could not check. Cached 7 days.

### Allergy row cue
- Matches allergen words inside ingredient wording (compound and nested), shows the matched word, and never treats an uncolored row as safe. Plant milks and cocoa butter are not treated as dairy. See docs/TESTING.md for what was and was not tested.

### Library and history
- Saved and recent products, stored locally in the browser (live products keep a trimmed copy).
- Library markers (library.js): each card shows when the product was last seen and an orange "Label data changed" tag when the Open Food Facts record differs from the last snapshot (ingredients, allergens, traces, additives, sizes). A "Recent changes" list and a "Check saved for changes" button (up to 10 saved products, one lookup every 4.5 s) sit at the top of Library. A change means the database record changed, not necessarily the package.

### App shell
- Add to Home Screen support: full-screen app mode, app name, web app manifest, app icon (magnifier with check mark, file: generated-image (3).png).
- Icon showed correctly when added through Comet. Safari and Firefox on iPhone showed the fallback letter tile; not yet resolved.

## Known limits and open items

- Camera behavior inside the full-screen Home Screen app is not yet verified on iPhone (reports say cameras can fail in installed web apps).
- Icon fallback in Safari/Firefox: an apple-touch-icon link (icon-180.png) is now in index.html. Not re-checked on an iPhone.
- Open Food Facts data is volunteer-contributed and can be missing, outdated or wrong.
- The lookup API is rate limited (about 15 lookups per minute per user for reads); browsers can't send the custom User-Agent the API asks for.
- Explore tab searches the three sample products only.
- Barcode reading depends on lighting, focus and glare; curved or reflective packaging is hard.
- Repository housekeeping: duplicate icon file generated-image (4).png.

## Roadmap (planned)

1. Verify the Home Screen app: camera, layout, icon.
2. Tap-to-explain ingredients and additives, with sources and honest unknowns.
3. Recall check against FDA food enforcement reports (shown as "possible match"; no result never means no recall).
4. Better swaps: alternatives in the same category that fit your profile.
5. Deeper personalization: genome, medications and health context, after privacy design and medical-grade sources are settled.

## Changelog

### 2026-11-01 (coverage audit tool and handoff)
- Added docs/coverage-audit (corpus of 71 typical labels, a headless-Chrome script and a README) so coverage can be re-measured after every batch, and docs/COVERAGE_HANDOFF.md describing the next work: sourced entries for additives, mineral salts and supplement actives, written only from source text that has actually been read. No app code changed.

### 2026-11-01 (ingredient coverage: plain foods)
- Coverage audit (read-only): 673 ingredient names from 45 typical US food labels and 26 typical supplement labels, written from general knowledge, not scanned products, were run through the app's real ingredient lookup. 61% had a sourced "common use explained" status (food 64%, supplement actives 42%, supplement other ingredients 72%). Fully covered labels (every ingredient explained or identified): food 1 of 45 before this change and 9 of 45 after; supplements 0 of 26 before and after. Average ingredients per product still not verified: food 3.6 before, 2.4 after; supplements 3.9 before, 3.8 after.
- New status "Plain food ingredient" for ingredients whose name simply identifies a food (an apple, rolled oats, garlic powder, skim milk). It is identification only: variety, amount, farming and processing are not stated, no health assessment is made, and research review stays shown as pending. It comes from a short curated list (ingredient-plain-foods.js), not from the food-word vocabulary, which contains generic words like "extract" and "sodium" and would have mislabeled caffeine, creatine and stearic acid. Oils, sugars, salt, extracts, isolates, concentrates, flavors, colors, additives, cultures, anything with a bracketed sub-list, and anything with a reviewed entry are never treated as plain foods.
- On the audit set this identified 60 more ingredients as plain foods (9%), raising "explained or identified" from 61% to 70%. The sourced "explained" count did not change. About 30% are still "Purpose not yet verified", mostly supplement actives (56% of them), additives and capsule ingredients.
- New test: tests/plain-foods.test.cjs (106 checks). Version string moved to 20261103-plain2.
- Not tested: a real iPhone, real scanned products, dark mode. The audit set is representative, not a measure of real-world coverage.

### 2026-11-02 (ingredient coverage: more regulated food additives)
- 7 new entries covering 16 label names, each restating one section of the US food-additive regulation (21 CFR, read from the eCFR data service, Title 21 current as of 2026-10-29): wheat gluten / vital wheat gluten (§ 184.1322); whey and its sweet, acid, dry, dried and concentrated forms (§ 184.1979); whey protein concentrate (§ 184.1979c); DATEM / diacetyl tartaric acid esters of mono- and diglycerides (§ 184.1101); ammonium sulfate (§ 184.1143); glycerol ester of rosin (§ 172.735); polyethylene glycol (§ 172.820).
- Wording: what the regulation lists and under what limits, nothing more. Whey and whey protein concentrate are listed only "in accordance with good manufacturing practice", so those entries say the listing does not itemize functions. Wheat gluten and whey entries say they are not an allergen declaration. The regulation covers permitted uses only, so these entries carry no evidence side beyond "existing health-evidence findings are unchanged".
- Checked by tests/regulated-additives-2.test.js against a saved copy of the regulation text (tests/fixtures/ecfr-title21-2026-10-29-b.json): every listed use matches the regulation's list exactly, every stated fact (numbers, limits, definitions) appears in it, and three deliberate changes to the entries were each caught. The whole app loads them (checked in headless Chromium with no page errors).
- Coverage audit on the same 673 names: explained 65% to 66%, plain foods 9%, still not verified 25%. A small gain: most remaining gaps have no regulation section to quote.
- Skipped on purpose: monoglycerides and carrageenan-type gums (the regulation covers permitted uses only and their evidence side needs other sources), gum base (a long specification list), enzyme preparations, sodium caseinate (its listing names no functions). Version string moved to 20261102-add2.
- Not tested: a real iPhone, real scanned products. Phone check: open an ingredient sheet for "wheat gluten" or "DATEM" and tap the eCFR source link.

### 2026-11-01 (ingredient coverage: supplement actives, batch 1)
- 12 new sourced entries covering 29 label names: melatonin; omega-3 / omega-3 fatty acids; fish oil; EPA and DHA; cod liver oil; krill oil; algal oil; coenzyme Q10 (CoQ10); probiotics; ginkgo (ginkgo biloba extract, leaf extract); curcumin, curcuminoids and turmeric root extract; ashwagandha (root, root extract, Withania somnifera).
- Each entry quotes sentences from one NIH National Center for Complementary and Integrative Health (NCCIH) page word for word, attributed, and adds no health claim of its own: what it is, why it may be used, and the evidence and safety limits that page states, both sides shown. Each sheet states when the NCCIH page was last updated (CoQ10 January 2019, probiotics August 2019, ashwagandha March 2023, melatonin May 2024, omega-3 November 2024, ginkgo February 2025, turmeric April 2025) and that it is not a review of the product, dose or purity and not medical advice.
- Checked by tests/supplement-actives-1.test.js against saved copies of those pages (tests/fixtures/nccih-2026-11-01.json): all 105 quotations appear word for word, the last-updated months match, and our own wording contains no verdict or claim; deliberate errors are caught. docs/coverage-audit/build-nccih-batch.py builds the data from the pages for the next batch.
- Coverage audit on the same 673 names: explained 64% to 65% (supplement actives 42% to 46%). Small because most supplement actives on real labels are written with a bracket, for example "Ashwagandha (Withania somnifera) root extract (KSM-66)" or "Coenzyme Q10 (ubiquinone)", and the app looks up the whole bracketed text. Counting the part before the bracket would explain about 17 more of the 673, but not safely in every case ("turmeric (color)" is a colorant, not a plain food), so that is left as a design decision. Version string moved to 20261101-supp1.
- Not done: taurine, L-carnitine and creatine (the NIH Office of Dietary Supplements pages could not be read from the build environment), and ubiquinone as a separate name (the NCCIH page does not say ubiquinone is CoQ10). Not tested: a real iPhone.

### 2026-11-01 (ingredient coverage: regulated additives, batch 1)
- 16 new sourced ingredient entries covering 24 label names: calcium sulfate, calcium chloride, potassium chloride, calcium lactate, potassium lactate, sodium carbonate, potassium carbonate, stearic acid, carnauba wax, inositol (myo-inositol), elemental iron (reduced, carbonyl, electrolytic), calcium phosphate (also tricalcium and monocalcium), sodium phosphate, dipotassium phosphate, sodium tripolyphosphate and sodium hexametaphosphate.
- Every entry restates only what the US food-additive regulation says (21 CFR Part 182 or 184, read from the official eCFR data service, Title 21 current as of 2026-10-29): what the substance is, which uses the listing names, and the limits it states. The sheet says plainly that a regulatory listing is not a finding about the product and does not say which listed use applies. No health verdict is assigned. Part 182 listings that name no functions say so and quote FDA's definition of "sequestrant"; the FDA phrase "generally recognized as safe" appears only in quotes and is described as a regulatory listing.
- Checked against a snapshot of the regulation text (tests/fixtures/ecfr-title21-2026-10-29.json): tests/regulated-additives-1.test.js confirms the listed uses of each entry are exactly the regulation's, the quoted definition is verbatim, and the limits stated appear in the text. Skipped on purpose: sodium bicarbonate (its listing names no functions) and names the app already explained.
- Coverage audit on the same 673 names: explained (sourced) 61% to 64%; food labels fully covered 9 to 11 of 45, supplements 0 to 1 of 26; still not verified 27%. Version string moved to 20261101-reg1.
- Not tested: a real iPhone, dark mode. The eCFR links follow the standard https://www.ecfr.gov/current/title-21/section-N format but could not be opened from the build environment, so please open one on a phone.

### 2026-11-01 (Home, Recent list)
- Home's Recent list now shows what the Library lists already showed, in the same way: when you last looked at the product, and an orange "Database record changed" tag when its Open Food Facts record changed.
- Once you have chosen allergies or watch words in Profile, each Recent and Library card also gets an allergy chip with the same wording as the product panel: red "Contains: Milk", orange "May contain: Milk" or "Your watch words: ...", and grey "No detected match \u00b7 unverified", "Cannot check allergens" or "Scan again to check allergens". A grey chip is shown instead of nothing so a missing chip is never read as safe. Until you choose allergies or watch words, no allergy chips appear.
- Card text stays centered, matching the rest of the app.
- New test: tests/home-chips.test.cjs (14 checks, no extra packages). Version string moved to 20261102-home1 (library.js now uses it too, instead of a fixed 20261004c).
- Tested: Node tests, and headless Chrome with seeded products, allergies and library history on the old and new code: Home and Library both showed the expected tags and chips, with no page errors. Not tested: a real iPhone, real saved products, swipe-to-remove on the Library cards with the new tags, dark mode.

### 2026-11-01 (scanner)
- The backup digit reader no longer starts 1.8 seconds after the camera opens. It now waits until the barcode reader is ready and has had about 8 seconds without a read (or starts at once if the barcode reader cannot load). Before, a session where the barcode took more than about 2 seconds to read also downloaded several MB for the digit reader (about 2.9 MB of language data plus about 3.9 MB of engine) and ran it alongside the barcode reader.
- Short UPC-E barcodes: an 8-digit UPC-E typed by hand, or returned by a browser's built-in reader, is now expanded to the 12-digit UPC-A form that product databases use. The ZXing reader already returned the expanded form, so scanning with it was not affected. Not tested with a native reader or on a phone.
- The status line now shows "Found <digits>. Looking up product..." and, after about 5 to 10 seconds without a read, a short tip about distance, glare and keeping every bar in frame.
- New test: tests/scanner-barcodes.test.cjs (154 checks: valid and broken barcodes of each length, equivalent forms, UPC-E expansion against an independent check-digit calculation, and noisy digit-reader text).
- Tested end to end in headless Chrome with a fake camera playing real EAN-13, UPC-A, EAN-8 and UPC-E barcodes: all four were read and looked up correctly, and with no barcode in view the digit reader was requested at about 7.6 seconds (was 1.4 seconds before). Not tested: a real iPhone camera, real packaging, glare, curved or damaged barcodes, and read speed (the fake feed reads in well under a second, so speed was not measured).

### 2026-11-01
- Third-party scripts pinned: barcode reader to barcode-detector 3.2.3 and the backup digit reader to tesseract.js 5.1.1 (both were floating @3 and @5), plus Tesseract's English data to an exact package version. The two script loads now carry integrity (SRI) hashes. Details, limits and how to update: docs/CDN_PINS.md. New test: tests/cdn-pins.test.cjs.
- Limits: the hashes come from the published npm packages and were confirmed to match the files jsDelivr serves (checked from a Windows PC with certutil). The ES-module fallback for the barcode reader has no integrity check. Not tested on a real iPhone: scanning must be checked on the phone.
- Allergen matching audit. Of 53 realistic ingredient phrases, the main "For you" check missed 29 (for example buttermilk, cheeses, halibut, mixed nuts, enriched flour, tamari). No look-alike false positives were found.
- Main check now also matches plurals ("cheeses", "basses") and about 60 more common words per allergen group. The ingredient-row cue now reads the same shared list (window.OLAllergens) so the two cannot drift apart.
- New test: tests/allergen-words.test.cjs (75 checks, no extra packages). Cache-busting version moved to 20261101-allergen1 in index.html, evidence.js, result.js and ingredient-loader.js.
- Tested: Node tests, and the page loaded in headless Chrome with all outside network blocked (no errors). NOT tested: a real iPhone, or real products from the live database.

### 2026-09-29
- Built scanner-first app shell with calm green-and-blue design and circular navigation dock.
- Live camera as full-screen scanner background; automatic camera start; removed camera buttons and status clutter.
- Barcode reading working on iPhone (ZXing WebAssembly); digit-reader backup added.
- Live product lookup from Open Food Facts with two-endpoint retry and honest not-found/failed states.
- Product results, saved items and profile preferences (caffeine, sweeteners) now work with live data.
- Camera error messages made browser-neutral.
- Removed the old test pages.
- Added Home Screen app mode, app name, manifest and icon.
- Added allergen and trace matching (profile chips, three-way check, honest unknown states).
- Added this feature log.
