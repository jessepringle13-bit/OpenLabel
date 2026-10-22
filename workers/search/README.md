# OpenLabel search Worker

Target: existing Worker `open-label-0674`. Cloudflare Builds uses `jessepringle13-bit/OpenLabel`, branch `main`, root `/`, no dashboard build command, deploy `npx wrangler deploy`.

Root `wrangler.jsonc` deploys only `workers/search/worker.js`. Its custom build runs the policy tests and then the live U.S. milk preflight. A failing step stops deployment. Failure diagnostics inspect the live schema and country queries but never override the preflight. No frontend assets, paid bindings, credentials or billing-plan changes are configured.

Run `node workers/search/worker.test.cjs` for simulated checks. Run `node workers/search/preflight.cjs` for the network preflight. Neither proves deployed-Worker or physical-device success.

On 2026-10-22, Cloudflare build diagnostics verified `milk countries_tags:"en:united-states"`: all three returned samples were U.S.-listed milk matches, and the provider debug query used an exact country-tag filter. The `countries:` variants and bare `(milk)` failed. The Worker now uses plain candidate text followed by the exact country-tag filter, without generated Boolean groups.

The upstream text query can return partial-query matches; every meaningful term is therefore enforced by the Worker's unchanged relevance predicate before a result is returned. Sugar-free evidence must come from name/label fields, not brand alone. Only one candidate page is inspected. Country filtering happens before provider pagination; full-query validation happens after retrieval. Coverage of Jell-O and other multiword searches still requires live verification; unit fixtures do not prove live catalog coverage.

Default market: U.S.-listed source records. Missing/foreign country records are excluded, never silently broadened. `country=all` explicitly selects worldwide records. Neither setting verifies Wisconsin/store stock. Frontend barcode validation still applies.

After deployment success, check `/health` for version `4`, then `/search?q=milk&country=us`, `/search?q=Jello%20sugar%20free&country=us`, and the browser product-opening flow. A successful milk build preflight does not establish success for all queries.

Complete nonempty responses cache for five minutes per query/market/version. Empty, partial and error responses are not cached. The request guard is per instance, not global protection; no latency guarantee is made.

Frontend relevance recheck, market picker and four-mode Explore bar remain separate work.
