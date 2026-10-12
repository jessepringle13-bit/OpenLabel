const api=require('../supplements/source.js');
const assert=require('node:assert/strict');
async function run(){
assert.deepEqual(api.formats('766298024844'),['766298024844','7 66298 02484 4']);
assert.deepEqual(api.formats('0 33674 13941 7'),['033674139417','0 33674 13941 7']);
assert.equal(api.barcode('0 33674 13941 7'),'033674139417');
assert.deepEqual(api.formats('80004843'),['80004843']);
assert.throws(()=>api.formats(766298024844));
assert.throws(()=>api.formats('766298024844x'));
let urls=[],n=0;let r=await api.create(async u=>{urls.push(u);return {ok:true,json:async()=>n++===0?[]:[{id:1}]}}).searchBarcode('766298024844');
assert.deepEqual(urls.map(u=>new URL(u).searchParams.get('q')),['"766298024844"','"7 66298 02484 4"']);assert.equal(r.lookup.attempts.length,2);assert.equal(r.lookup.returnedQuery,'7 66298 02484 4');assert.equal(r.lookup.candidateIdentity,'unvalidated');
n=0;r=await api.create(async()=>{n++;return {ok:true,json:async()=>({mock:true})}}).searchBarcode('766298024844');assert.equal(n,1);
n=0;r=await api.create(async()=>{n++;return {ok:false,status:429}}).searchBarcode('766298024844');assert.equal(n,1);assert.equal(r.reason,'rate-limited');
n=0;r=await api.create(async()=>{n++;return {ok:true,json:async()=>[]}}).searchBarcode('766298024844');assert.equal(n,2);assert.deepEqual(r.raw,[]);
n=0;r=await api.create(async()=>{n++;return {ok:true,json:async()=>[]}}).searchBarcode('80004843');assert.equal(n,1);
r=await api.create(async()=>({ok:true,json:async()=>null})).getLabel('82118');assert.equal(r.reason,'unexpected-response');
r=await api.create(async()=>({ok:true,json:async()=>{throw Error('bad')}})).getLabel('82118');assert.equal(r.reason,'invalid-json');
r=await api.create(async()=>{throw Error('network')}).getLabel('82118');assert.equal(r.reason,'network-error');
r=await api.create((u,o)=>new Promise((resolve,reject)=>o.signal.addEventListener('abort',()=>reject(Error('abort')))),5).getLabel('82118');assert.equal(r.reason,'timeout');
assert.throws(()=>api.create(async()=>{}).getLabel('../secret'));
console.log('21 mocked assertions passed; live formatting equivalence unverified');}
run().catch(e=>{console.error(e);processCode=1});
