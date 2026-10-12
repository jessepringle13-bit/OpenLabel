# Bounded supplement parser
Recorded 2026-10-12. Prototype; not loaded by normal scanning or the diagnostic page yet.

## Evidence
Owner supplied a browser response envelope at 2026-10-12T22:52:28.089Z for DSLD label 82118, EuroMedica Strontium. It names 680 mg strontium supplied as strontium citrate per two capsules, and is marked off market with an event dated 2019-10-25. This is not a current-package comparison or laboratory verification. The earlier supplied empty array establishes a successful empty JSON response, not proof of product absence.

## Implemented
parser.js preserves the full input envelope by reference, exact stored names and forms, serving references, quantities, daily values, other ingredients, statements, relationship records and target-group claims. It separates historical status from retrieval date. Absent off-market evidence yields unknown, never a claim of current market availability. Empty arrays and unsupported response shapes get distinct states. Fixed serving consistency requires a single order match, equal positive minimum/maximum serving quantities, matching quantity and unit references, an equality operator and a finite nonnegative amount. This is internal consistency, not package confirmation or medical validity. Nested rows remain raw and get an issue; no blend dose allocation or nutrient-form conversion occurs. Return data and raw objects are shared references; consumers must not mutate them.

## Tests and limits
17 assertions ran successfully in Node against the parser and selected-field test logic. The committed test imports the same parser. The fixture is an explicitly partial excerpt of the owner-supplied response, not the full label; omitted other ingredients must not be interpreted as absent. Serving mismatch, historical status, unknown current status, empty/unsupported payload, null DV, separate form, raw preservation and nested-row limitations are exercised. Full malformed-field validation, broad record coverage, live requests, full app regression, browser rendering and iPhone tests are pending.

## Next
Retrieve more actual records, especially folate, multiple forms, botanicals and blends. Add executable schema validation and tests for every missing or malformed field before a development-only facts view. Display source-reported data and manufacturer statements separately, with historical warnings. Current supplement matching, photo verification, intake calculations, safety thresholds and genetic recommendations are not implemented. Live food scanning is unchanged.
