const APP_ORIGIN="https://jessepringle13-bit.github.io";
const UPSTREAM="https://search.openfoodfacts.org/search";
const VERSION="4", BRAND_POLICY="source-brand-v1";
let recentRequests=[];
function reply(data,status=200,extra={}){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":APP_ORIGIN,"Access-Control-Allow-Methods":"GET, OPTIONS","Access-Control-Allow-Headers":"Content-Type","Access-Control-Expose-Headers":"Retry-After, X-OpenLabel-Cache","Vary":"Origin","Cache-Control":"no-store","X-Content-Type-Options":"nosniff",...extra}})}
function text(v){if(typeof v==="string")return v;if(Array.isArray(v))return v.map(text).filter(Boolean).join(", ");if(v&&typeof v.en==="string")return v.en;return ""}
function canonical(v){return text(v).normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[’']/g,"").replace(/[\u2010-\u2015\u2212]/g,"-").replace(/\bjell[\s-]*o\b/g,"jello").replace(/\bsugar[\s-]*free\b/g,"sugarfree").replace(/\bzero[\s-]+sugar\b(?![\s-]+added\b)/g,"sugarfree").replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim()}
function tokens(v){const plurals={puddings:"pudding",gelatins:"gelatin",strawberries:"strawberry"};return canonical(v).split(" ").filter(Boolean).map(w=>plurals[w]||w)}
function queryTerms(q){const stop=new Set(["the","a","an","and","of","with","for","in"]);return [...new Set(tokens(q).filter(w=>!stop.has(w)))]}
function relevant(p,terms){const names=text(p.product_name)+" "+text(p.product_name_en),identity=new Set(tokens(names+" "+text(p.brands))),attributes=canonical(names+" "+text(p.labels)+" "+text(p.labels_tags)),words=new Set(tokens(attributes));return terms.every(w=>w==="sugarfree"?!/\b(?:not|non) sugarfree\b/.test(attributes)&&words.has(w):identity.has(w))}
function countryValues(v){if(typeof v==="string")return v.split(",").map(s=>s.trim()).filter(Boolean);if(Array.isArray(v))return v.flatMap(countryValues);if(v&&typeof v==="object")return Object.values(v).flatMap(countryValues);return []}
function listedInUS(p){return countryValues(p.countries_tags).concat(countryValues(p.countries)).some(v=>["united states","united states of america","us","usa"].includes(canonical(v).replace(/^en /,"")))}
function brandNames(p){const missing=new Set(["unknown","unknown brand","brand unknown","brand not listed","not listed","not specified","unspecified","no brand","unbranded","none","null","undefined","n a","na","not applicable","brand"]);return text(p.brands).split(/[,;]/).map(s=>s.trim().replace(/\s+/g," ")).filter(s=>s.length<=100&&/[\p{L}\p{N}]/u.test(s)&&!/^(?:https?:|www\.|[a-z]{2}:)/i.test(s)&&!missing.has(canonical(s)))}
function broadQuery(terms){return terms.length===1&&new Set(["milk","yogurt","bread","cereal","cheese","eggs","butter","water","coffee","tea","juice","rice","pasta"]).has(terms[0])}
function selectProducts(products,terms){const ranked=products.map((p,index)=>{const names=new Set(tokens(text(p.product_name)+" "+text(p.product_name_en)));const exact=tokens(p.product_name_en||p.product_name).join(" ")===terms.join(" ");return {p,index,score:terms.reduce((n,w)=>n+(names.has(w)?100:10),0)+(exact?1000:0)}}).sort((a,b)=>b.score-a.score||(Number(b.p.unique_scans_n)||0)-(Number(a.p.unique_scans_n)||0)||a.index-b.index);const counts=new Map(),selected=[];for(const {p}of ranked){const key=canonical(brandNames(p)[0]||"");if(broadQuery(terms)&&(counts.get(key)||0)>=2)continue;counts.set(key,(counts.get(key)||0)+1);const {unique_scans_n,...product}=p;selected.push(product);if(selected.length===20)break}return selected}
function upstreamQuery(terms,country){const words=terms.map(w=>w==="sugarfree"?"sugar free":w).join(" ");return country==="us"?words+' countries_tags:"en:united-states"':words}
export default {async fetch(request,env,ctx){
  const url=new URL(request.url),origin=request.headers.get("Origin");
  if(origin&&origin!==APP_ORIGIN&&origin!==url.origin)return reply({error:"Origin not permitted."},403);
  if(request.method==="OPTIONS")return reply({});
  if(request.method!=="GET")return reply({error:"Use GET."},405);
  if((url.pathname==="/"||url.pathname==="/health")&&!url.searchParams.has("q"))return reply({ok:true,service:"OpenLabel search helper",version:VERSION,brand_policy:BRAND_POLICY,default_country:"us",matching:"all-meaningful-terms",test:"/search?q=milk",note:"Worker health only; upstream searches require separate live verification."});
  if(url.pathname!=="/search"&&url.pathname!=="/")return reply({error:"Use /search?q=product-name"},404);
  const raw=(url.searchParams.get("q")||"").trim(),country=(url.searchParams.get("country")||"us").toLowerCase();
  if(!["us","all"].includes(country))return reply({error:"Supported country selections: us or all."},400);
  if(raw.length<2||raw.length>100)return reply({error:"Enter a product name between 2 and 100 characters."},400);
  const terms=queryTerms(raw);
  if(!terms.length||terms.length>12||terms.join(" ").length<2)return reply({error:"Use a short product name, brand or flavor."},400);
  const cacheUrl=new URL(url.origin+"/__cache/search-v4-brand-v1");cacheUrl.searchParams.set("q",terms.slice().sort().join(" "));cacheUrl.searchParams.set("country",country);const key=new Request(cacheUrl.toString());let cache=null;
  try{cache=caches.default;const hit=await cache.match(key);if(hit){const data=await hit.json();data.query=raw;return reply(data,200,{"X-OpenLabel-Cache":"hit"})}}catch{cache=null}
  const now=Date.now();recentRequests=recentRequests.filter(t=>now-t<61000);
  if(recentRequests.length>=9)return reply({error:"Search is busy. Please try again shortly."},429,{"Retry-After":"61"});recentRequests.push(now);
  const query=upstreamQuery(terms,country),upstream=new URL(UPSTREAM);upstream.searchParams.set("q",query);upstream.searchParams.set("page_size","80");upstream.searchParams.set("langs","en");
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
  try{
    const response=await fetch(upstream.toString(),{signal:controller.signal,redirect:"follow",headers:{"Accept":"application/json","User-Agent":"OpenLabel/1.0 (https://jessepringle13-bit.github.io/OpenLabel/)"}});
    if(!response.ok)return reply({error:response.status===429?"Product search is temporarily rate-limited.":"The product data service is unavailable.",upstream_status:response.status},response.status===429?429:502,response.status===429?{"Retry-After":response.headers.get("Retry-After")||"60"}:{});
    let data;try{data=await response.json()}catch{return reply({error:"Product search returned unreadable data."},502)}
    if(!data||!Array.isArray(data.hits)||(data.errors&&data.errors.length))return reply({error:"Product search returned an unexpected response."},502);
    if(!data.hits.length&&typeof data.count==="number"&&data.count>0)return reply({error:"Product search returned an incomplete page."},502);
    const rejected={market:0,relevance:0,identity:0,brand:0},eligible=[],seen=new Set();
    for(const p of data.hits.slice(0,80)){
      if(!p||typeof p!=="object"){rejected.identity++;continue}
      if(country==="us"&&!listedInUS(p)){rejected.market++;continue}
      const brands=brandNames(p);if(!brands.length){rejected.brand++;continue}
      const branded={...p,brands:brands.join(", ")};if(!relevant(branded,terms)||(broadQuery(terms)&&!tokens(text(p.product_name)+" "+text(p.product_name_en)).includes(terms[0]))){rejected.relevance++;continue}
      const code=String(p.code||""),name=text(p.product_name)||text(p.product_name_en);
      if(!/^\d{8,14}$/.test(code)||!name){rejected.identity++;continue}
      if(seen.has(code))continue;seen.add(code);
      eligible.push({code,product_name:name,product_name_en:text(p.product_name_en),brands:branded.brands,unique_scans_n:Number.isFinite(Number(p.unique_scans_n))?Math.max(0,Number(p.unique_scans_n)):0,quantity:text(p.quantity),labels:text(p.labels)||text(p.labels_tags),countries:countryValues(p.countries_tags).concat(countryValues(p.countries)),image_front_small_url:text(p.image_front_small_url),image_small_url:text(p.image_small_url)});
    }
    const products=selectProducts(eligible,terms);
    if(data.timed_out&&!products.length)return reply({error:"Product search did not finish. Please try again."},504);
    const more=(typeof data.count==="number"&&data.count>Math.min(data.hits.length,80))||data.hits.length>80,partial=data.timed_out===true||(Object.values(rejected).some(n=>n>0)&&more)||eligible.length>products.length;
    const result=reply({version:VERSION,brand_policy:BRAND_POLICY,query:raw,country,location_scope:country==="us"?"U.S.-listed in source data; Wisconsin store availability is not verified.":"Worldwide source records.",upstream_query:query,source:"Open Food Facts Search-a-licious",candidate_limit:80,candidate_count:Math.min(data.hits.length,80),eligible_count:eligible.length,distinct_brands:new Set(products.map(p=>canonical(brandNames(p)[0]))).size,brand_cap:broadQuery(terms)?2:null,count:products.length,upstream_total:typeof data.count==="number"?data.count:null,upstream_total_exact:data.is_count_exact===true,partial,coverage_limited:more||eligible.length>products.length,match_scope:"Bounded source sample after market, brand and full-query checks; not an exhaustive catalog search.",rejected,products});
    result.headers.set("X-OpenLabel-Cache","miss");
    if(cache&&!data.timed_out&&products.length){const stored=result.clone();stored.headers.set("Cache-Control","public, max-age=300");ctx.waitUntil(cache.put(key,stored).catch(()=>{}))}
    return result;
  }catch(error){console.error("OpenLabel upstream search failed:",error instanceof Error?error.message:String(error));return reply({error:controller.signal.aborted?"Product search did not respond. Please try again.":"Could not reach the product data service."},controller.signal.aborted?504:502)}finally{clearTimeout(timer)}
}};
