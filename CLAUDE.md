# OpenLabel

@AGENTS.md

## What it is
A food transparency web app. Scan a product barcode and see what the label says, what is in it, and what matters to you (allergens, caffeine, sweeteners). It shows sources and gaps, never a single good/bad score. Own wording rules live in `PRINCIPLES.md`; the feature log and known limits live in `FEATURES.md`.

## Stack
- No build step and no package.json. Plain static site: `index.html` (inline CSS and one large inline script) plus many small browser scripts loaded with `?v=` cache-busting query strings.
- Hosted on GitHub Pages (`https://jessepringle13-bit.github.io/OpenLabel`).
- One Cloudflare Worker, `workers/search/worker.js` (deployed as `open-label-0674`), proxies and filters product name search from Open Food Facts. `wrangler.jsonc` runs its tests at build time.
- Barcode reading: ZXing/BarcodeDetector polyfill and Tesseract.js, loaded from jsDelivr on first use.
- Data sources: Open Food Facts (products), openFDA and USDA (recalls), PubMed and Crossref (parked research check).
- All user data (profile, saved, history) lives in the browser's `localStorage` (key `openlabel-calm-dock-v1`). There is no backend, account or API key.

## How to run
- App: serve the folder over HTTP, e.g. `python3 -m http.server 8000`, then open `http://localhost:8000`. The camera needs HTTPS or localhost.
- Tests (Node 22): `node tests/<name>.test.js` or `.cjs`. `allergy-match.test.js` and other DOM tests need jsdom (`npm i jsdom`).
- Worker tests: `node workers/search/worker.test.cjs` (no network). `workers/search/preflight.cjs` makes live network calls.
- Full pre-push checklist: `docs/TESTING.md`.

## Layout
- `index.html`: shell, scanner, product lookup, result page, profile.
- Root `*.js`: feature modules (`ingredient-*.js`, `nutrient-*.js`, `recall-*.js`, `library.js`, `result-*.js`, etc.), each attached to `window.OL*`.
- `supplements/`: supplement label scanner (own parser, lookup, view, tests).
- `docs/`: roadmap (`PAGE_ROADMAP.md`, `ROADMAP.md`), specs, evidence dossiers and reviews.
- `.github/workflows/`: 18 one-off workflows that patch files and commit to `main` (see Conventions).

## Conventions
- Wording: plain language, allowed status words only, no scores, no "safe", "healthy" or "bad" verdicts. Missing data is "we don't know", never a pass. No match never means safe. Education, not medical advice.
- Color rules are fixed (red/orange/yellow/green/grey), and every chip carries words, never color alone.
- Our whole-food stance is labeled as a stance, separate from evidence (`PRINCIPLES.md`).
- Every change to a loaded script bumps its `?v=` string in `index.html`.
- Update `FEATURES.md` (and the roadmap ledger) with every batch.
- Tests: add or extend a `tests/*.test.js` for new logic. Nothing is pushed if the `docs/TESTING.md` steps fail.
- Phone-only checks (camera, real scans, Home Screen mode) are owner-tested; say which two or three to check each release.
- Be honest about what was tested: stand-in data and emulated browsers do not prove live services or real devices.
- Do not commit secrets. There are none today; keep it that way.
- Workflows in `.github/workflows` push to `main` using the repo token. Do not add more without asking.

## Working rules
- The owner is not an expert developer: explain choices briefly in plain language.
- Write a short plan and get approval before any big change.
- Ask before anything risky or irreversible (deleting data, changing storage, adding dependencies, workflows, plugins, or third-party services).
- Be efficient: the owner is on the Claude Pro plan and usage limits are shared.
- Before adding any third-party repo, plugin or MCP server, check stars, recent activity, open security issues and exactly what its setup changes, and tell the owner first.
- Do not install OmniRoute or use reverse-engineering tools to copy other companies' apps.
