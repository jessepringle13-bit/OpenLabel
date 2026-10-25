# Two-food sodium comparison — implementation status

Engine: product-comparison.js. Initial UI: comparison-ui.js. Tests: node tests/product-comparison.test.cjs.

The engine's 43 assertions and minimal renderer checks passed during preparation. The UI passed syntax and eight isolated candidate-filter checks. DOM interaction, cancellation/timing, real-browser and phone checks remain pending.

The UI is not loaded by index.html and is not connected to a live source adapter. It does not fetch data or read stored preferences by itself. This commit makes no deployment or feature-availability claim.

UI contract: OLComparisonUI.mount(host, {candidates, loadRecord, engine}). Candidates require unique IDs, names and explicit food kind; supplements and baby/infant products are excluded. loadRecord(id, {signal}) must return the selected record in the engine contract. Changing either selection or basis clears the previous result and cancels stale requests. Missing adapter disables comparison.

Next integration: add a Compare action and supply saved/recent food candidates from the existing state without modifying them. Implement source retrieval and normalization with explicit sodium basis/unit, source category, preparation state, requested/returned barcode and retrieval time. Unknown preparation must not be automatically filled as-sold. Never infer mass-versus-volume basis from an ambiguous source field or salt-to-sodium conversion. Do not infer a current-package/lot match from a database barcode response.

Test rapid selection changes, timeouts, failed retrievals, missing fields, unequal servings, repeated opens, safe source links, keyboard behavior and mobile rendering before wiring the page. Keep existing recalls, allergen warnings, lab evidence and ingredient context accessible; this comparison does not reassess or clear them. Search-candidate selection and automatic alternative suggestions are deferred.

Only source-record sodium differences are displayed. No overall health/safety ranking, supplement potency comparison, personal dose or clinical recommendation is supplied.
