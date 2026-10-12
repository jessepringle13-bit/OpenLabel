const api=require('../supplements/source.js');
const assert=require('node:assert/strict');
async function run(api){let calls=0;
assert.equal(api.barcode('0 33674 13941 7'),'033674139417');
assert.throws(()=>api.barcode(33674139417));
assert.throws(()=>api.barcode('033674139417x'));
assert.throws(()=>api.barcode('12345'));
let source=api.create(async(url)=>{calls++;assert.equal(url,'https://api.ods.od.nih.gov/dsld/v9/search-filter?q=%22033674139417%22');return {ok:true,json:async()=>({mock:true})}});
let result=await source.searchBarcode('0 33674 13941 7');assert.equal(result.state,'source-response-unvalidated');assert.equal(result.raw.mock,true);assert.equal(calls,1);
result=await api.create(async()=>({ok:false,status:429})).getLabel('82118');assert.equal(result.reason,'rate-limited');
result=await api.create(async()=>({ok:true,json:async()=>{throw Error('bad')}})).getLabel('82118');assert.equal(result.reason,'invalid-json');
result=await api.create(async()=>({ok:true,json:async()=>null})).getLabel('82118');assert.equal(result.reason,'unexpected-response');
result=await api.create(async()=>{throw Error('network')}).getLabel('82118');assert.equal(result.reason,'network-error');
result=await api.create((u,o)=>new Promise((resolve,reject)=>o.signal.addEventListener('abort',()=>reject(Error('aborted')))),5).getLabel('82118');assert.equal(result.reason,'timeout');
assert.throws(()=>source.getLabel('../secret'));
assert.equal(await api.create(async()=>({ok:true,json:async()=>[]})).getLabel('1').then(x=>x.state),'source-response-unvalidated');
console.log('12 mocked checks passed; no live requests');}
run(api).catch(e=>{console.error(e);process.exitCode=1});
