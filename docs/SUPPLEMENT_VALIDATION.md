# Supplement adapter validation
Recorded 2026-10-12. Runtime code is an isolated prototype, not live scanning.

## Inspection
index.html has a demo supplement with explicitly unverified dose and forms. Its norm helper strips leading zeros when matching samples. New supplement-source code preserves zeros and rejects numeric barcode inputs. Main lookup and complete result panel were truncated in retrieval, so their lifecycle is not fully inspected.
library.js compares only ingredients, allergens, traces, additives, package size and serving size. Saved-product checks call Open Food Facts and filter off-style numeric IDs. Supplement source-specific snapshots and checks need separate integration; do not force supplement label IDs into that path.

## Production source
https://dsld.od.nih.gov/api-guide documents https://api.ods.od.nih.gov/dsld/v9/ and quoted barcode searches. It documents 1,000 requests/hour/IP without a key and CC0 data. Actual record retrieval failed for label 82118 and barcode 80004843 via the research retrieval tool. This does not prove the API is down. Real payload schema, pagination, exact barcode matching, CORS and browser availability remain unverified.

## Implemented
supplements/source.js provides injected-fetch barcode search and label lookup, preserves raw response objects and retrieval times, and distinguishes timeout, network, HTTP/rate-limit, invalid JSON and unexpected primitive/null responses. Object/array responses remain source-response-unvalidated. No candidate normalization, empty-search interpretation or facts rendering is implemented. Barcode validation checks string shape only, not GTIN checksum or UPC/EAN equivalence. No retries, caching, production monitoring or private API keys are added.

## Tests
The adapter and test logic ran successfully with Node in the execution environment: 12 mocked check groups, no live requests. Tests cover leading zeros, invalid barcode types/characters/lengths, quoted request construction, unvalidated raw responses, rate limits, malformed JSON, null responses, network errors, timeout, invalid label IDs and unvalidated arrays. The repository test file uses the same logic with a require import. Full existing suite, real API, browser and iPhone tests have not run.

## Next gates
Obtain real production responses and confirm their schema. Then implement exact candidate checks, version conflicts, provenance-preserving normalization and stale-response cancellation. Only afterward wire a development-only Supplement Facts view and source-aware storage. Photo extraction, nutrient calculations, clinical interactions and genetic interpretation are not implemented. Agency label data is not independent testing or endorsement.
