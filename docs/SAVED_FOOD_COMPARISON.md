# Saved-food comparison picker

The saved-food bridge reads saved IDs and live product identity fields from openlabel-calm-dock-v1. It does not write to storage, fetch source data, use health preferences or change existing product records. It includes saved records only, not Recent-only products. Demos, supplements, unknown categories, missing brands/identity, unusable barcodes and duplicate source barcodes are omitted. Candidate selection does not establish current-package verification or usable nutrition data.

Library receives a Compare saved foods disclosure next to savedArea. Saved-list changes rebuild the picker and clear old selections. The UI is intentionally mounted without loadRecord, so comparison stays disabled with an explicit adapter-unavailable message. This step connects candidates, not a nutrition comparison engine to live data.

Prepared local verification: 14 candidate-selection assertions and syntax checks passed. The workflow runs the engine tests and saved-candidate tests, then desktop/mobile-sized local Chromium checks before committing index.html wiring. Deployment, actual-user saved-record coverage, browser accessibility and physical-phone behavior remain separate checks.

Next: implement and review a source-data adapter, including explicit sodium units/basis, preparation state and returned identity. Do not infer missing values to enable comparison. Then add stale-request, failure and end-to-end comparison tests before activating the comparison button.
