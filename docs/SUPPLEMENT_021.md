# Supplement adapter 0.2.1 / cache 021
Recorded 2026-10-12. Fix based on the owner-supplied response for barcode 766298024844: raw hits=[], stats.count=0, adapter 0.2.0 stopped without spaced fallback.

Source searchState now recognizes bare empty arrays and structured hits/count empty results. Nonempty arrays or hits with a consistent integer count are candidates, not verified identities. Empty hits with a positive count or hits exceeding count are conflicting. Missing/invalid count in object responses is unsupported. Stop on unsupported, conflicting or unavailable responses; only empty triggers the next format. Lookup metadata records searchState per attempt and overall; emptyArray remains only a literal-array indicator for compatibility.

Diagnostic now loads source.js?v=021, shows loaded adapter version 0.2.1 and attempt summaries, and displays structured empty results honestly. Parser is unchanged; search hits are not automatically selected or rendered as individual labels. No pagination or identity verification added. Normal scanning, Profile and Library unchanged.

17 new assertions passed with mocked responses in Node. No new live query or browser/phone test was executed. Existing full app suite was not run. After deployment, test the compact barcode and confirm both compact and spaced attempts if first query is empty. No result guarantees are made; if both return empty, investigate name search/source coverage rather than infer product absence.
