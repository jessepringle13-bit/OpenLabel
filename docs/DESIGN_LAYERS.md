# Layered design: scan, takeaways, deep dive (draft v0.1)

Decided with the project owner on 2026-09-30. Follows PRINCIPLES.md. Nothing here is built yet except where marked.

## Goal
A customer scans a product and immediately sees clear, easy-to-read information. Research runs in the background on the ingredients found. The customer can then open deeper layers for any item to see what we found and what to understand.

## Flow after a scan
1. Scan the barcode.
2. Look up the product in Open Food Facts (built).
3. Show Layer 1 at once (below).
4. In the background, find which ingredients have claims attached, query the literature databases (PubMed, OpenAlex, Crossref), and run the source checks from SOURCE_CHECK_SPEC.md on every study found.
5. As results arrive, Layer 2 items appear quietly. Nothing interrupts the customer.
6. Results are cached per ingredient and re-checked on a schedule.
The live step does the mechanical work: finding studies and flagging funding, conflicts, retractions and relationships. Judgments about study design, human relevance and directness stay human-reviewed. Without a reviewed dossier, the app says "not yet reviewed" instead of guessing.

## Layer 1: instant (facts only, no research claims)
- Name and brand
- Ingredients
- Allergens and may-contain traces, matched to the customer's profile
- Processing level (Nova group, when the database has it)
- Recent changes: for now "last updated in the database" (a community edit date, not proof of a formula change). A real formula-change view waits until we confirm we can see what changed.
- News: first version limited to official recall notices (openFDA food enforcement reports). Matches are shown as "possible match"; no result never means no recall. Broader news comes later, with each source vetted by the same standard as studies.

## Layer 2: plain-language takeaways
- One or two sentences per item, no jargon, with a "what this means" line.
- A status word from a small fixed set: well established, mixed, unproven, contested, checking, not yet reviewed.
- Never a verdict and never a good/bad score.
- While checks run the status is "checking". While funding and relationship checks are incomplete the claim stays provisional and shows no outcome sentence (see Open items).

## Layer 3: deep dive (built for seed oils, hand-written)
Both sides of the evidence, who paid for each study and any flags, limits of each source, and what to understand. This is the existing evidence sheet.

## Showing all warnings without a wall
- Pinned at the top, always: allergen matches and recall matches, however many there are.
- Then up to three more items, ranked by the customer's profile first, then by how contested the claim is.
- A visible count, for example "3 shown, 5 more", so nothing looks hidden.
- "See all findings" opens the full list with filters: allergies, recalls, additives, processing, research, changes.

## Stance
The whole-foods stance stays in the deep dive and the About page for now. The processing level on Layer 1 already shows the lean as a fact. Revisit later.

## Open items
- Withhold the outcome sentence on claims until every source has passed the funding and relationship check (the app currently shows an outcome line while 2 of 11 sources are fully checked).
- Move claim data out of the code into a record the app reads, so the source check can update it.
- Confirm browsers can call PubMed, OpenAlex and Crossref directly (not yet verified).
- OpenAlex now requires a free API key; the source check code and spec still use the old email method and need updating.
- Confirm whether recent-change details (what actually changed) are available from Open Food Facts revisions.
