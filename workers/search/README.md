# OpenLabel search Worker

Target: existing Worker `open-label-0674`. Confirmed Cloudflare Builds: repository `jessepringle13-bit/OpenLabel`, branch `main`, root `/`, no dashboard build command, deploy `npx wrangler deploy`.

Root `wrangler.jsonc` deploys only `workers/search/worker.js`. Its custom build runs simulated policy tests, then a real server-side U.S. milk query using the candidate Worker handler. A failing command stops Wrangler before deployment. The live preflight must return nonempty U.S.-listed milk matches and reports whether the response is partial. No static-site assets, database bindings, AI services, secrets or billing-plan changes are configured.

Local check: `node workers/search/worker.test.cjs` (Node 22). Live preflight: `node workers/search/preflight.cjs` (uses the network). Neither is a deployed-Worker/physical-iPhone test. Build success and the browser product-opening flow still need separate verification.

After Cloudflare reports deployment success, inspect the existing workers.dev URL:
- `/health` should show version `4`.
- `/search?q=Jello%20sugar%20free&country=us`
- `/search?q=milk&country=us`
- `/search?q=milk&country=all`

Default: U.S.-listed source records; missing/foreign country tags are excluded, never silently broadened. This is not Wisconsin/store-stock verification. All meaningful query terms are required upstream and checked again in returned names/brands. Sugar-free evidence must come from name/label fields. Only one returned page is inspected; partial/approximate-count metadata disclose limits. Frontend barcode checks still apply.

Complete nonempty responses cache for five minutes, separated by query, market and policy version. Errors, empty/partial responses are not cached. The in-memory guard is per instance, not global protection. Provider errors/timeouts remain possible; there is no latency guarantee.

The frontend relevance recheck, market picker and four-mode Explore bar are separate work. This commit does not change the website frontend.
