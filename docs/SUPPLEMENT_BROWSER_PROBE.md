# Supplement browser diagnostic
Recorded 2026-10-12. This standalone developer page does not modify index.html, normal scanning, Profile or Library.

## Reason
Production DSLD guide was retrieved in full at https://dsld.od.nih.gov/api-guide. Record requests for its label 82118 and barcode 80004843 examples failed again through the retrieval tool. SwaggerHub page, raw specification and public label page also could not be retrieved. No live payload schema has been validated. Do not guess candidate or nutrient fields.

## Test procedure
Open supplements/dev.html on the deployed app host. Select Public DSLD label ID and enter 82118, a documented example, not an asserted current product. Submit and inspect status and raw JSON. Then select Barcode and try a current package barcode. Preserve leading zeros. The guide also gives 80004843 and formatted 0 33674 13941 7 examples; the current adapter removes spaces, so formatted-versus-compact search equivalence remains unverified. Do not interpret an empty result as proof of no matching label.

Record browser, timestamp, lookup type, input, response state, any HTTP status and top-level response keys. Compare successful product responses against current-package images before interpreting serving or nutrient fields. Do not send health/genetic information. Requests go directly to NIH DSLD; this page stores nothing locally and does not save to Library. The page is public, standalone and marked noindex, not access-controlled.

## Limits
No request occurs on page load. Inputs changed during a request invalidate its displayed result. Timeout is handled by the existing source adapter. No automatic retries, pagination, schema normalization, exact candidate matching, photo capture or Supplement Facts rendering is added.

## Validation status
Browser diagnostic prepared; not executed in a browser or on an iPhone. Existing 12 adapter mocked checks passed in the prior batch, not a live API test. No real supplement records added.

## Next gate
Use a successful real response to implement and test provenance-preserving field extraction and candidate matching. If browser access fails while server access succeeds, evaluate a narrowly scoped server adapter before exposing this feature in normal scanning. Keep the app unchanged until the gate is met.
