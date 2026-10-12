# Spaced barcode fallback
Recorded 2026-10-12. Source adapter version 0.2.0.

Search compact digits first. On an exact empty-array response only, try deduplicated original input spacing and, for 12-digit UPC-style inputs, 1-5-5-1 spacing. Example: 766298024844 then 7 66298 02484 4. Preserve leading zeros. Do not invent spacing for other lengths; user-provided spacing may be tried. No checksum, UPC-E expansion or UPC/EAN identity equivalence is asserted.

Return lookup metadata with version, compact barcode, query attempts, empty-array states, errors and returned query. Results remain unvalidated candidates. Stop on nonempty or unknown-shape responses and on failures, including rate limits and timeouts. Two empty responses do not prove product absence. No pagination, deduplication of candidate records, exact barcode verification or automatic candidate selection is added.

21 assertions passed with mocked responses in Node; no live requests or browser tests ran. Tests verify request formatting, no duplicate variants, no fallback after nonempty/error responses, empty-array handling, zero preservation and error states. The diagnostic page still imports source.js using its existing URL; reload and verify raw lookup.version is 0.2.0. A cached older script will lack this metadata. Normal app scanning is unchanged. Next test the same barcode in the diagnostic page and inspect both attempts and any returned candidates before matching a package.
