# Historical lab-report matching

Prepared 2026-10-22. This change strengthens candidate matching, not exact-product or lot verification.

- Product candidates require the configured brand in the product brand field and the configured product phrase in its name. A combined brand/name string cannot satisfy both identities.
- Existing required and excluded phrases remain enforced. Parenthesized vanilla, vanilla milkshake and chocolate variants in report titles must also appear in the product name. This is deliberately limited, not a general flavor parser.
- Product candidates display a possible historical name-match warning in the result and an explanation in the test detail sheet. No UPC, package, formulation or lot verification is claimed.
- Category evidence remains category-level. Records without brand/name matching rules remain browse-only, including all eight batch-3 chocolate records.
- Existing tester-result colors are unchanged; they describe the historical findings, not match confidence.

Validation: 16 isolated matcher cases executed in Node before approval. The repository test loads the matcher from evidence.js in a stubbed DOM; that full-file harness and mobile UI still require execution. Run from repository root: node tests/lab-match-scope.test.cjs. No browser, deployment or current-stock verification is claimed.
