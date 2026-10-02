# OpenLabel — Features and Capabilities

A living log of what OpenLabel can do, what it can't do yet, and what we're building next. Updated whenever something is added or changed.

**Last updated:** 2026-09-29

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
- Limits: the database can be missing ingredients or traces; the word lists are a starting set, not exhaustive; it is not medical advice.

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

### Library and history
- Saved and recent products, stored locally in the browser (live products keep a trimmed copy).
- Library markers (library.js): each card shows when the product was last seen and an orange "Label data changed" tag when the Open Food Facts record differs from the last snapshot (ingredients, allergens, traces, additives, sizes). A "Recent changes" list and a "Check saved for changes" button (up to 10 saved products, one lookup every 4.5 s) sit at the top of Library. A change means the database record changed, not necessarily the package.

### App shell
- Add to Home Screen support: full-screen app mode, app name, web app manifest, app icon (magnifier with check mark, file: generated-image (3).png).
- Icon showed correctly when added through Comet. Safari and Firefox on iPhone showed the fallback letter tile; not yet resolved.

## Known limits and open items

- Camera behavior inside the full-screen Home Screen app is not yet verified on iPhone (reports say cameras can fail in installed web apps).
- Icon fallback in Safari/Firefox: likely needs a clean file name such as apple-touch-icon.png (not yet tried).
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
