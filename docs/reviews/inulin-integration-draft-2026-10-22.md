# Inulin education integration draft

Date: 2026-10-22
Status: Draft specification and proposed copy. Not implemented, browser-tested or clinically reviewed. This document does not change live education sheets.

## Scope and prerequisites

Follow the source-use decisions in `fiber-followup-2026-10-22.json`. Retain the original fiber draft as research history, not a set of cleared publication claims. Do not publish new Reynolds-derived conclusions, the held 2018 psyllium quantitative claim, or the newer psyllium pooled estimate in this integration.

Preserve compact product styling, existing identity/form explanations, upper-right close control and back behavior. No personalized dosing, intake totals, new scores, warning badges or evidence colors.

## Entry points

1. Ingredient detail sheets: add an expandable section headed 'Inulin-type fructans: research context' beneath the existing identity/form explanation. Initially attach only to exact, normalized 'inulin' and 'inulin-type fructans' terms. Do not use substring matching.
2. Nutrition Facts > Fiber and Explore > Learn > Fiber: add a collapsed section headed 'Inulin-type fructans — one specific fiber family'. This is general education, not a finding that the selected product contains inulin.
3. Chicory root fiber, oligofructose and fructooligosaccharides/FOS remain distinct. Defer automatic attachment until preparation-specific explanatory wording and tests exist. Do not infer pure inulin, chain length, purity, amount or a particular preparation from those terms.

## Proposed user-facing copy

### Introductory explanation

Inulin-type fructans are a family of carbohydrates studied for their effects on gut microbes and bowel function. Findings depend on the preparation, amount, study population, and outcome measured. Evidence about this family does not apply automatically to every dietary fiber.

Ingredient-sheet context: The label names this ingredient, but its name alone does not establish the amount, chain lengths, purity, or effects of the product you are viewing.

General Fiber-sheet context: This is an example of research on one fiber family. It does not establish that this product contains inulin-type fructans.

### Expandable: What the research found

A systematic review examined 78 publications involving inulin-type fructans in generally healthy adults. Many studies reported increases in Bifidobacterium, while findings for other gut microbes and short-chain fatty acids varied. These publications are not necessarily 78 independent trials. A change in microbial abundance alone does not establish symptom improvement or a health benefit for every person.

### Expandable: Digestive tolerance

Some participants experienced gas, bloating, cramping, or other digestive symptoms. Responses varied with the preparation, amount, and individual. This research does not establish one universal excessive-fiber threshold, and it cannot diagnose an intolerance from an ingredient name.

OpenLabel does not calculate your exposure to this ingredient, recommend a dose, or infer that this product will cause—or prevent—digestive symptoms.

### Expandable: Who supported the research

The review states that the work was partially supported by General Mills. The authors separately report no conflicts of interest. These are the publication’s statements, not an independent financial audit. The sponsor’s role and funding or relationships within the underlying studies have not been fully established in our review.

Display both statements together. Industry support is disclosed, not automatic invalidation.

### Expandable: What this does not establish

- A guaranteed benefit from the product you are viewing.
- That all inulin, chicory fiber, oligofructose, or FOS preparations are interchangeable.
- How much of this ingredient the product contains.
- That a microbial change means fewer clinical events.
- A personal intake target or safety threshold.

### Review-status footer

Source review: October 22, 2026 · Partial, not clinically reviewed. Selected review sections and reported funding/disclosures were examined. Independent correction/retraction checks, sponsor-role review, and underlying-trial audits remain incomplete.

### Fiber reference: Understanding the amount

The US Nutrition Facts Daily Value for dietary fiber is 28 g. It is a labeling reference—not an upper limit or a personal supplement dose.

Total dietary fiber on a label cannot tell us how much is inulin when multiple fibers are present.

## Sources and provenance

- Hughes et al., The Prebiotic Potential of Inulin-Type Fructans: A Systematic Review. DOI 10.1093/advances/nmab119. Canonical article: https://pmc.ncbi.nlm.nih.gov/articles/PMC8970830/
- Funding and author declarations were read on the article’s first page in a laboratory-hosted PDF mirror and compared with the canonical title, authors and DOI: https://cassara.com.ar/descargas/prebioticos-probioticos-estudios/laboratorio-pablo-cassara-inufiber-osteopenia-osteoporosis.pdf
- FDA label reference: https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label

Attach source links beside relevant research/tolerance copy, disclosures and labeling references. Do not imply FDA conducted the inulin review or independently cleared its conclusions.

## Loading and navigation

- Keep existing education available if the expanded research fails to load.
- Say expanded research is unavailable; infer no new conclusion.
- Offer a bounded retry without duplicate sections.
- Preserve close/back behavior and scroll reachability.
- Guard asynchronous rendering by current topic and current sheet instance.

## Acceptance checks before completion

1. Exact normalized inulin and inulin-type fructans receive the section once.
2. Unrelated fibers, chicory root fiber, oligofructose and FOS do not receive an automatic exact-inulin finding.
3. General Fiber education explicitly avoids claiming the product contains inulin.
4. Missing inulin amounts remain unknown; total fiber is not substituted.
5. General Mills support and the authors’ no-conflicts declaration appear together.
6. Held Reynolds and psyllium claims do not appear in the new sections.
7. Closing or switching sheets during loading cannot insert content into another topic.
8. Failed load, retry, duplicate prevention and reopening work correctly.
9. Ingredient-sheet, Nutrition Facts and Learn routes remain readable and fully reachable on the compact mobile layout.
10. Existing saturated-fat/protein education, close controls and return navigation still work.

Implementation and testing have not been performed for this draft. Separate approval of a fully specified code patch is required before changing the live app.
