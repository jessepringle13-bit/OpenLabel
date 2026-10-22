const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, 'worker.js'), 'utf8');
const context = { URL, URLSearchParams, Request, Response, Headers, AbortController, fetch: globalThis.fetch.bind(globalThis), setTimeout, clearTimeout, Date, console };
vm.createContext(context);
vm.runInContext(source.replace('export default', 'globalThis.handler='), context);

async function diagnose() {
  const queries = [
    'milk',
    '(milk)',
    'countries_tags:"en:united-states" AND (milk)',
    'countries:"United States" AND (milk)',
    'countries.en:"en:united-states" AND (milk)'
  ];
  for (const query of queries) {
    await new Promise(resolve => setTimeout(resolve, 1100));
    const url = new URL('https://search.openfoodfacts.org/search');
    url.searchParams.set('q', query);
    url.searchParams.set('page_size', '3');
    url.searchParams.set('langs', 'en');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const report = { query };
    try {
      const response = await fetch(url.toString(), {
        signal: controller.signal, redirect: 'follow',
        headers: { Accept: 'application/json', 'User-Agent': 'OpenLabel/1.0 (https://jessepringle13-bit.github.io/OpenLabel/)' }
      });
      report.status = response.status;
      const data = await response.json();
      const hits = Array.isArray(data.hits) ? data.hits.filter(p => p && typeof p === 'object') : [];
      report.provider_count = typeof data.count === 'number' ? data.count : null;
      report.returned = hits.length;
      report.us_records = hits.filter(p => context.listedInUS(p)).length;
      report.us_milk_matches = hits.filter(p => context.listedInUS(p) && context.relevant(p, context.queryTerms('milk'))).length;
      report.response_keys = Object.keys(data || {}).slice(0, 40);
      report.sample_fields = hits[0] ? Object.keys(hits[0]).sort().slice(0, 80) : [];
      report.samples = hits.slice(0, 3).map(p => ({
        code: String(p.code || ''),
        name: (context.text(p.product_name) || context.text(p.product_name_en)).slice(0, 160),
        countries: JSON.stringify(p.countries || null).slice(0, 600),
        countries_tags: JSON.stringify(p.countries_tags || null).slice(0, 600)
      }));
      if (data.errors) report.errors = JSON.stringify(data.errors).slice(0, 600);
    } catch (error) {
      report.error = controller.signal.aborted ? 'Diagnostic query timed out.' : error.message;
    } finally { clearTimeout(timer); }
    console.log('OPENLABEL_DIAGNOSTIC ' + JSON.stringify(report));
  }
}

(async () => {
  const response = await context.handler.fetch(new Request('https://open-label-0674.jessepringle13.workers.dev/search?q=milk&country=us'), {}, { waitUntil() {} });
  const data = await response.json();
  if (!response.ok || data.version !== '4' || data.country !== 'us' || !Array.isArray(data.products) || !data.products.length || !data.products.every(p => context.listedInUS(p) && context.relevant(p, context.queryTerms('milk')))) {
    console.error('Original U.S. milk preflight failed. Deployment remains blocked. Response: ' + JSON.stringify(data));
    await diagnose();
    throw new Error('Deployment blocked: diagnostic results do not override the original U.S. preflight. Review OPENLABEL_DIAGNOSTIC lines before changing the Worker.');
  }
  console.log('Live server-side Worker preflight passed: ' + JSON.stringify({ version: data.version, country: data.country, count: data.products.length, partial: data.partial, upstream_query: data.upstream_query }));
  console.log('This is not a deployed-Worker or physical-device test.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
