const APP_ORIGIN = "https://jessepringle13-bit.github.io";
const UPSTREAM = "https://search.openfoodfacts.org/search";
const VERSION = "4";
let recentRequests = [];

function reply(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), { status, headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": APP_ORIGIN,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Expose-Headers": "Retry-After, X-OpenLabel-Cache",
    "Vary": "Origin", "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff", ...extra
  }});
}
function text(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(text).filter(Boolean).join(", ");
  if (value && typeof value.en === "string") return value.en;
  return "";
}
function canonical(value) {
  return text(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\bjell[\s-]*o\b/g, "jello")
    .replace(/\bsugar[\s-]*free\b/g, "sugarfree")
    .replace(/\bzero[\s-]+sugar\b(?![\s-]+added\b)/g, "sugarfree")
    .replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}
function tokens(value) {
  const plurals = { puddings: "pudding", gelatins: "gelatin", strawberries: "strawberry" };
  return canonical(value).split(" ").filter(Boolean).map(w => plurals[w] || w);
}
function queryTerms(query) {
  const stop = new Set(["the", "a", "an", "and", "of", "with", "for", "in"]);
  return [...new Set(tokens(query).filter(w => !stop.has(w)))];
}
function relevant(product, terms) {
  const names = text(product.product_name) + " " + text(product.product_name_en);
  const identity = new Set(tokens(names + " " + text(product.brands)));
  const attributeText = canonical(names + " " + text(product.labels) + " " + text(product.labels_tags));
  const negated = /\b(?:not|non) sugarfree\b/.test(attributeText);
  const attributes = new Set(tokens(attributeText));
  return terms.every(term => term === "sugarfree" ? !negated && attributes.has(term) : identity.has(term));
}
function countryValues(value) {
  if (typeof value === "string") return value.split(",").map(s => s.trim()).filter(Boolean);
  if (Array.isArray(value)) return value.flatMap(countryValues);
  if (value && typeof value === "object") return Object.values(value).flatMap(countryValues);
  return [];
}
function listedInUS(product) {
  return countryValues(product.countries_tags).concat(countryValues(product.countries)).some(value => {
    const country = canonical(value).replace(/^en /, "");
    return ["united states", "united states of america", "us", "usa"].includes(country);
  });
}
function upstreamQuery(terms, country) {
  // Live-verified syntax: milk countries_tags:"en:united-states".
  // Plain text retrieves candidates; relevant() enforces every meaningful term.
  const words = terms.map(term => term === "sugarfree" ? "sugar free" : term).join(" ");
  return country === "us" ? words + ' countries_tags:"en:united-states"' : words;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    if (origin && origin !== APP_ORIGIN && origin !== url.origin) return reply({error:"Origin not permitted."},403);
    if (request.method === "OPTIONS") return reply({});
    if (request.method !== "GET") return reply({error:"Use GET."},405);
    if ((url.pathname === "/" || url.pathname === "/health") && !url.searchParams.has("q")) {
      return reply({ok:true,service:"OpenLabel search helper",version:VERSION,default_country:"us",matching:"all-meaningful-terms",test:"/search?q=milk",note:"Worker health only; upstream searches require separate live verification."});
    }
    if (url.pathname !== "/search" && url.pathname !== "/") return reply({error:"Use /search?q=product-name"},404);
    const raw = (url.searchParams.get("q") || "").trim();
    const country = (url.searchParams.get("country") || "us").toLowerCase();
    if (!["us", "all"].includes(country)) return reply({error:"Supported country selections: us or all."},400);
    if (raw.length < 2 || raw.length > 100) return reply({error:"Enter a product name between 2 and 100 characters."},400);
    const terms = queryTerms(raw);
    if (!terms.length || terms.length > 12 || terms.join(" ").length < 2) return reply({error:"Use a short product name, brand or flavor."},400);
    const cacheUrl = new URL(url.origin + "/__cache/search-v4");
    cacheUrl.searchParams.set("q", terms.slice().sort().join(" "));
    cacheUrl.searchParams.set("country", country);
    const key = new Request(cacheUrl.toString());
    let cache = null;
    try {
      cache = caches.default;
      const hit = await cache.match(key);
      if (hit) {
        const data = await hit.json();
        data.query = raw;
        return reply(data,200,{"X-OpenLabel-Cache":"hit"});
      }
    } catch { cache = null; }
    // Best-effort request guard within this Worker instance, not a global quota.
    const now = Date.now();
    recentRequests = recentRequests.filter(t => now - t < 61000);
    if (recentRequests.length >= 9) return reply({error:"Search is busy. Please try again shortly."},429,{"Retry-After":"61"});
    recentRequests.push(now);
    const query = upstreamQuery(terms,country);
    const upstream = new URL(UPSTREAM);
    upstream.searchParams.set("q",query);
    upstream.searchParams.set("page_size","20");
    upstream.searchParams.set("langs","en");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(),8000);
    try {
      const response = await fetch(upstream.toString(),{
        signal:controller.signal,redirect:"follow",
        headers:{"Accept":"application/json","User-Agent":"OpenLabel/1.0 (https://jessepringle13-bit.github.io/OpenLabel/)"}
      });
      if (!response.ok) return reply({error:response.status===429?"Product search is temporarily rate-limited.":"The product data service is unavailable.",upstream_status:response.status},response.status===429?429:502,response.status===429?{"Retry-After":response.headers.get("Retry-After")||"60"}:{});
      let data;
      try { data = await response.json(); }
      catch { return reply({error:"Product search returned unreadable data."},502); }
      if (!data || !Array.isArray(data.hits) || (data.errors && data.errors.length)) return reply({error:"Product search returned an unexpected response."},502);
      if (!data.hits.length && typeof data.count === "number" && data.count > 0) return reply({error:"Product search returned an incomplete page."},502);
      const rejected = {market:0,relevance:0,identity:0};
      const products = [];
      const seen = new Set();
      for (const p of data.hits) {
        if (!p || typeof p !== "object") { rejected.identity++; continue; }
        if (country === "us" && !listedInUS(p)) { rejected.market++; continue; }
        if (!relevant(p,terms)) { rejected.relevance++; continue; }
        const code = String(p.code || "");
        const name = text(p.product_name) || text(p.product_name_en);
        if (!/^\d{8,14}$/.test(code) || !name) { rejected.identity++; continue; }
        if (seen.has(code)) continue;
        seen.add(code);
        products.push({code,product_name:name,product_name_en:text(p.product_name_en),brands:text(p.brands),quantity:text(p.quantity),labels:text(p.labels)||text(p.labels_tags),countries:countryValues(p.countries_tags).concat(countryValues(p.countries)),image_front_small_url:text(p.image_front_small_url),image_small_url:text(p.image_small_url)});
      }
      if (data.timed_out && !products.length) return reply({error:"Product search did not finish. Please try again."},504);
      const rejectedCount = Object.values(rejected).reduce((a,b) => a+b,0);
      const moreCandidates = typeof data.count === "number" && data.count > data.hits.length;
      const partial = data.timed_out === true || (rejectedCount > 0 && moreCandidates);
      const result = reply({version:VERSION,query:raw,country,location_scope:country==="us"?"U.S.-listed in source data; Wisconsin store availability is not verified.":"Worldwide source records.",upstream_query:query,source:"Open Food Facts Search-a-licious",count:products.length,upstream_total:typeof data.count==="number"?data.count:null,upstream_total_exact:data.is_count_exact===true,partial,match_scope:"Returned page after market and full-query checks; not an exhaustive catalog search.",rejected,products});
      result.headers.set("X-OpenLabel-Cache","miss");
      if (cache && !partial && products.length) {
        const stored = result.clone();
        stored.headers.set("Cache-Control","public, max-age=300");
        ctx.waitUntil(cache.put(key,stored).catch(() => {}));
      }
      return result;
    } catch (error) {
      console.error("OpenLabel upstream search failed:",error instanceof Error?error.message:String(error));
      return reply({error:controller.signal.aborted?"Product search did not respond. Please try again.":"Could not reach the product data service."},controller.signal.aborted?504:502);
    } finally { clearTimeout(timer); }
  }
};
