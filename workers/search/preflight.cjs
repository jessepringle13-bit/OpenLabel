const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, 'worker.js'), 'utf8');
const context = { URL, URLSearchParams, Request, Response, Headers, AbortController, fetch: globalThis.fetch.bind(globalThis), setTimeout, clearTimeout, Date, console };
vm.createContext(context);
vm.runInContext(source.replace('export default', 'globalThis.handler='), context);

async function readJSON(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(url, {
      signal: controller.signal, redirect: 'follow',
      headers: { Accept: 'application/json', 'User-Agent': 'OpenLabel/1.0 (https://jessepringle13-bit.github.io/OpenLabel/)' }
    });
    return { status: response.status, data: await response.json() };
  } finally { clearTimeout(timer); }
}

async function diagnose() {
  let parameters = [];
  try {
    const { status, data } = await readJSON('https://search.openfoodfacts.org/openapi.json');
    parameters = data.paths?.['/search']?.get?.parameters || [];
    console.log('OPENLABEL_SCHEMA ' + JSON.stringify({
      status, version: data.info?.version,
      parameters: parameters.map(p => ({ name: p.name, schema: p.schema, description: String(p.description || '').slice(0, 700) }))
    }));
  } catch (error) { console.log('OPENLABEL_SCHEMA ' + JSON.stringify({ error: error.message })); }
  const names = new Set(parameters.map(p => p.name));
  const queries = [
    'milk countries_tags:"en:united-states"',
    'milk countries:"en:united-states"',
    'milk countries:"United States"',
    'milk AND countries_tags:"en:united-states"'
  ];
  for (const query of queries) {
    await new Promise(resolve => setTimeout(resolve, 1100));
    const url = new URL('https://search.openfoodfacts.org/search');
    url.searchParams.set('q', query);
    url.searchParams.set('page_size', '3');
    url.searchParams.set('langs', 'en');
    if (names.has('debug_info')) url.searchParams.set('debug_info', 'lucene_query,es_query');
    else if (names.has('debug')) url.searchParams.set('debug', 'true');
    const report = { query };
    try {
      const { status, data } = await readJSON(url.toString());
      const hits = Array.isArray(data.hits) ? data.hits.filter(p => p && typeof p === 'object') : [];
      Object.assign(report, {
        status, provider_count: typeof data.count === 'number' ? data.count : null,
        returned: hits.length, timed_out: data.timed_out,
        us_records: hits.filter(p => context.listedInUS(p)).length,
        us_milk_matches: hits.filter(p => context.listedInUS(p) && context.relevant(p, context.queryTerms('milk'))).length,
        warnings: JSON.stringify(data.warnings || null).slice(0, 1500),
        errors: JSON.stringify(data.errors || null).slice(0, 1500),
        debug: JSON.stringify(data.debug || null).slice(0, 6000),
        samples: hits.slice(0, 3).map(p => ({
          code: String(p.code || ''),
          name: (context.text(p.product_name) || context.text(p.product_name_en)).slice(0, 160),
          countries_tags: JSON.stringify(p.countries_tags || null).slice(0, 600),
          countries: JSON.stringify(p.countries || null).slice(0, 600)
        }))
      });
    } catch (error) { report.error = error.message; }
    console.log('OPENLABEL_DIAGNOSTIC ' + JSON.stringify(report));
  }
}

(async () => {
  const response = await context.handler.fetch(new Request('https://open-label-0674.jessepringle13.workers.dev/search?q=milk&country=us'), {}, { waitUntil() {} });
  const data = await response.json();
  if (!response.ok || data.version !== '4' || data.country !== 'us' || !Array.isArray(data.products) || !data.products.length || !data.products.every(p => context.listedInUS(p) && context.relevant(p, context.queryTerms('milk')))) {
    console.error('Original U.S. milk preflight failed. Deployment remains blocked. Response: ' + JSON.stringify(data));
    await diagnose();
    throw new Error('Deployment blocked: diagnostics never override the original U.S. preflight. Review OPENLABEL_SCHEMA and OPENLABEL_DIAGNOSTIC lines.');
  }
  console.log('Live server-side Worker preflight passed: ' + JSON.stringify({ version: data.version, country: data.country, count: data.products.length, partial: data.partial, upstream_query: data.upstream_query }));
  console.log('This is not a deployed-Worker or physical-device test.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
