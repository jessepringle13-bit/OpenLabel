# Ingredient status consistency — 2026-10-25

## Scope
Replace the duplicate purpose/form rules in ingredient-row-fix.js with the current OLIngredients lookup and OLPurpose fallback. Unknown purpose remains explicit in both row and sheet. Preserve descriptive named-form roles and personal allergy/watch-word row metadata. Keep olBaseMeta current so clearing a personal match restores the correct neutral text.

## Research status
Read OLIngredientEducation.resolve and its existing reviews metadata. Display the recorded partial-review status when available; otherwise distinguish an existing education entry with incomplete research coverage from research review pending. A purpose explanation, form identity, source-check date, or this formatter is not a completed health assessment. No ingredient content, clinical conclusion, color rule, allergy matcher, product record, supplement amount or comparison logic is changed.

## Verification
Run: node tests/ingredient-status.test.cjs
18 isolated assertions passed locally in Node: canonical/fallback lookup, generic/named forms, unknown and missing APIs, partial-review wording, preservation of allergy and custom watch-word metadata, restored neutral text, reused-sheet updates, one copy of each note, and idempotent refresh.
These use synthetic metadata and a minimal DOM harness. The full app, existing suite, browser MutationObserver scheduling, mobile layout, and live/device behavior have not been verified by this test. Do not mark the feature device-confirmed.

## Device follow-up
After deployment and cache refresh, open generic magnesium, a named form, and an unmatched term. Check row/sheet agreement, existing education content, source links, allergy/watch-word toggles, repeated opening/closing, and panel scrolling. Existing loader URLs are unchanged; allow cached script responses to refresh before judging the update.

## Next work
Audit existing nutrient coverage before adding more entries; magnesium and other vitamin-form expansions already exist. Physical-package nutrition retrieval remains paused.
