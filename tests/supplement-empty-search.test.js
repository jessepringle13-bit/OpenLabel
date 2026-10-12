const api=require('../supplements/source.js');
const assert=require('node:assert/strict');
async function run(){
assert.equal(api.searchState([]),'empty');assert.equal(api.searchState({hits:[],stats:{count:0,pct:0}}),'empty');assert.equal(api.searchState({hits:[{id:1}],stats:{count:1}}),'candidates');assert.equal(api.searchState({hits:[],stats:{count:1}}),'conflicting');assert.equal(api.searchState({hits:[{id:1}],stats:{count:0}}),'conflicting');assert.equal(api.searchState({hits:[]}), 'unsupported');assert.equal(api.searchState({hits:[],stats:{count:'0'}}),'unsupported');
let queries=[],n=0;let r=await api.create(async u=>{queries.push(new URL(u).searchParams.get('q'));return {ok:true,json:async()=>n++===0?{hits:[],stats:{count:0,pct:0}}:{hits:[{id:1}],stats:{count:1}}}}).searchBarcode('766298024844');
assert.deepEqual(queries,['"766298024844"','"7 66298 02484 4"']);assert.equal(r.lookup.version,'0.2.1');assert.equal(r.lookup.attempts[0].searchState,'empty');assert.equal(r.lookup.searchState,'candidates');
n=0;r=await api.create(async()=>{n++;return {ok:true,json:async()=>({hits:[],stats:{count:0}})}}).searchBarcode('766298024844');assert.equal(n,2);assert.equal(r.lookup.searchState,'empty');
n=0;r=await api.create(async()=>{n++;return {ok:true,json:async()=>({hits:[],stats:{count:1}})}}).searchBarcode('766298024844');assert.equal(n,1);assert.equal(r.lookup.searchState,'conflicting');
n=0;r=await api.create(async()=>{n++;return {ok:false,status:429}}).searchBarcode('766298024844');assert.equal(n,1);assert.equal(r.lookup.searchState,'unavailable');
console.log('17 assertions passed; no live requests');}
run().catch(e=>{console.error(e);process.exitCode=1});
