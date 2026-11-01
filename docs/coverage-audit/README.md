# Coverage audit

Measures how many ingredient names the app can explain, using the app's own lookup (`OLIngredientStatus.describe`) on the **full label text as a row would show it** (not with brackets removed; an earlier version of this script did that and overstated coverage).

- `corpus.json`: 45 food ingredient lists and 26 supplement labels (active and other ingredients). Written from general knowledge of typical US labels, not scanned products. It measures coverage of typical labels, not of real-world scans, and it measures whether an explanation exists, not whether it is correct.
- `run.mjs`: loads the app in headless Chrome with all outside network blocked, waits for the ingredient modules to finish loading, and writes `results.json` next to the corpus (one row per ingredient: `knownFull`, `plainFull`, `research`, ...).

## Run
Needs Node and Playwright (Chromium). From the repo root:

    python3 -m http.server 8772 --bind 127.0.0.1 &
    PLAYWRIGHT_DIR=$(npm root -g) node docs/coverage-audit/run.mjs docs/coverage-audit http://127.0.0.1:8772

Read `results.json`: "explained" = `knownFull`; "plain food identified" = `plainFull && !knownFull`; the rest are not yet verified. Compare before and after each batch on the same corpus.
- Do not commit `results.json` (it is a local output; delete it after reading).
