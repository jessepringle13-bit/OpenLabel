const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'worker.js'),'utf8');
const context={URL,URLSearchParams,Request,Response,Headers,AbortController,fetch:globalThis.fetch.bind(globalThis),setTimeout,clearTimeout,Date,console};
vm.createContext(context);vm.runInContext(source.replace('export default','globalThis.handler='),context);
async function search(q){const r=await context.handler.fetch(new Request('https://open-label-0674.jessepringle13.workers.dev/search?q='+encodeURIComponent(q)+'&country=us'),{},{waitUntil(){}});return {status:r.status,data:await r.json()}}
(async()=>{
  await require('./brand-quality.test.cjs')();
  const {status,data}=await search('milk');
  if(status!==200||data.brand_policy!=='source-brand-v1'||!data.products?.length||data.distinct_brands<2||!data.products.every(p=>context.brandNames(p).length&&context.listedInUS(p)&&context.relevant(p,context.queryTerms('milk'))))throw new Error('Branded U.S. milk preflight failed; deployment blocked: '+JSON.stringify(data));
  console.log('Live server-side Worker preflight passed: '+JSON.stringify({version:data.version,brand_policy:data.brand_policy,count:data.count,distinct_brands:data.distinct_brands,partial:data.partial,upstream_query:data.upstream_query}));
  for(const [name,q,terms]of [["Dean's",'deans milk',['deans']],['Organic Valley','organic valley milk',['organic','valley']],['Prairie Farms','prairie farms milk',['prairie','farms']],['Kemps','kemps milk',['kemps']]]){
    await new Promise(resolve=>setTimeout(resolve,1100));
    try{const {status,data}=await search(q);const matches=(data.products||[]).filter(p=>terms.every(w=>context.tokens(p.brands).includes(w)));console.log('OPENLABEL_BRAND_COVERAGE '+JSON.stringify({brand:name,query:q,status,result:status!==200?'provider_error':matches.length?'found':'not_found_in_bounded_results',matching_records:matches.length,upstream_total:data.upstream_total,candidates:data.candidate_count,partial:data.partial,samples:matches.slice(0,2).map(p=>({code:p.code,name:p.product_name,brands:p.brands})),error:data.error||null}))}catch(error){console.log('OPENLABEL_BRAND_COVERAGE '+JSON.stringify({brand:name,result:'provider_error',error:error.message}))}
  }
  console.log('Coverage audits are informational, not proof of catalog absence or inclusion in generic milk results. This is not a deployed-Worker, store-stock or physical-device test.');
})().catch(error=>{console.error(error.message);process.exitCode=1});
