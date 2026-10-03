# Evidence Register and Color System - Design (draft v0.1, 2026-10-03)

Status: Design only. Nothing in this document is built. Phase 3 of docs/PAGE_ROADMAP.md. Follows PRINCIPLES.md and the dossier method in CLAIM_DOSSIER_TEMPLATE.md.

## 1. Problem
Today colors on the product panel come from three places: hand-set rules in result.js (for example seed oils are always yellow, caffeine above a limit is orange), a hand-set test table (TEST in result.js) for lab entries, and personal matches (allergy red). The "Why this color" block explains each, but the explanation lives in code, so it cannot be inspected, reviewed or dated. The goal is that every non-grey color is produced from one reviewed record, and a color with no record cannot exist.

## 2. Core rule
A color is a function of (finding record, this user, this product). The app never decides a color from an ingredient name alone. If no finding record applies, the row is grey with the words "No reviewed finding".

## 3. Finding record (one JSON object per finding, in evidence-register.json)
| Field | Meaning |
|---|---|
| id | Stable id, for example seed-oils-inflammation |
| subject | What it is about: ingredient group (word list), nutrient, or product-specific test |
| claim | One measurable claim, stated precisely (one claim per record) |
| scope_type | product-specific, category-level, or general research |
| applies_to | Who: everyone, or a named group (for example people who set a caffeine limit). Never inferred from health data |
| amount | Exposure the finding depends on (per serving, per day, per kg body weight) or "not amount-dependent" |
| color | red, orange, yellow, green or grey, set by the rubric in section 4 and justified in color_reason |
| color_reason | One plain sentence shown to the user |
| status | converging, contested, unresolved, unsupported (same as dossier outcome) |
| shows / does_not_show | Two short lists, shown in the row |
| sources | List of {title, publisher, url, type, date, verified}. At least two independent sources for any orange, yellow or green; the strongest case for each side where status is contested |
| source_check | Result of the C1-C6 checks from SOURCE_CHECK_SPEC.md: passed, flagged, not found, not run. Not found is never a pass |
| reviewed_by / reviewed_on / next_review | Named reviewer, date, and a review-by date. Past the review-by date the row shows "Review overdue" and drops to grey |
| dossier | Link to the full dossier file |
| changelog | Date, change, reason |

## 4. Color rubric (extends the Phase 3 table)
A record may use a color only if every listed condition holds. The register validator refuses to load a record that breaks them.

- Red: direct and well-scoped reason, and either a personal match (the user's own saved allergy matched on the label, with the matched word shown) or an official source (recall match with all identifiers aligned, or a tester advisory for that exact product). Never from general research alone.
- Orange: a supported reason to limit or check amount, with an amount or context stated, status converging, two independent sources, and a user-specific link (their own saved limit, topic or diet) or a stated population.
- Yellow: status contested or unresolved. Must show the strongest case on each side. Yellow never implies "probably fine" or "probably harmful".
- Green: only a reviewed reassuring finding with scope written in the row (for example "no lead detected in the lots tested"). Never for absence of a finding, never for a missing record. Green requires status converging and a complete source check.
- Grey: no record, record overdue for review, source check incomplete, or purpose known but no evidence finding assigned.

Color is always paired with words, and the words are written from the record, not from the color.

## 5. What the user sees
Row (collapsed): name, chip with color and plain label. Row (open): reason, who it applies to, amount, scope tag (product-specific, category-level, general research), what it shows, what it does not show, sources with dates, source-check state, reviewed on and by. Existing "Why this color" block becomes a view of this record, not separate text.

Loading / failure / unknown: the register is a static file shipped with the app, so there is no network state. If the file fails to load, every evidence row is grey with "Evidence register unavailable", and personal and official-data colors (allergy, recall) still work. A record that fails validation is skipped and listed under Sources and unknowns.

Mobile: same collapsed-row pattern as today; open content in the row, sources as a short list, no new screens.

## 6. Migration of current hardcoded colors
| Today | Becomes |
|---|---|
| Seed oils yellow (result.js) | Record seed-oils-inflammation, status contested, from the existing dossier. First migrated item |
| Caffeine above own limit orange | Record caffeine-personal-limit, applies_to "people who set a limit"; amount from the user's own number; source is the label amount, not a medical claim |
| Processing level (NOVA) | Grey base stays. Orange only when the user put processing on their watch list, with reason "You asked to watch this" and no health claim |
| Lab TEST table | One record per tested product with scope product-specific and the tester's own threshold. Red only for "Tester advises avoiding" |
| Allergy red, recall | Stay personal and official-data colors, outside the register. They still use the same row layout and reason fields |

## 7. Candidate findings (not yet researched; none are claimed)
Nothing here is a finding. Each needs a dossier before it is added.
1. Seed oils and inflammation (dossier exists).
2. Added sugar amount against the label's percent daily value and public guidance (category-level).
3. Sodium amount per serving (needs a source for the threshold; deferred in DIET_RULES.md).
4. Sugar alcohols and digestive effects (intolerance topic, user-chosen).
5. Sweeteners (aspartame, sucralose, stevia, monk fruit): evidence differs by agency and question; likely yellow records with both sides.
6. Processed and cured meats (nitrite): official classification exists but needs scope wording per source.
7. Food dyes: regulatory status differs by country; needs scope wording.

## 8. Build slices
1. Schema file, validator and unit tests (refuses records that break the rubric, past review date, fewer than two sources for orange/yellow/green, green without scope).
2. Loader plus the row renderer reading a record; migrate seed oils only; compare output to today's row.
3. Migrate caffeine and processing level; migrate lab entries.
4. Add the first new records, one dossier at a time, each reviewed by you before it ships.
5. "Evidence" page listing all records, their status and review dates.

Test cases per slice: record with each color passes; record missing a source for orange fails; overdue record shows grey; register fetch failure shows grey with message; a product with no matching record shows no color; user who has not set caffeine limit sees no caffeine finding.

## 9. Decisions needed from the owner
1. Reviewer name: records need a named human reviewer. Is that you, or should reviews be marked "draft, unreviewed" and stay grey until you sign off?
2. Review interval: suggest 12 months for general research, 6 months for anything tied to a regulator or recall feed.
3. First new topic to research after seed oils: which of the candidates matters most to you?
4. Should yellow rows ever show for people who did not put the topic on their watch list, or only appear once the user opts in?

## 10. Not in scope
Scores, overall good or bad verdicts, medical or genomic data, automatic color from AI text, any color from ingredient name alone.
