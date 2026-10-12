const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync(require('path').join(__dirname,'..','ingredient-starches-fibers.js'),'utf8');
let calls=0,records;const window={OLIngredientEntries:{add(batch){calls++;records=batch;}}};
vm.runInNewContext(source,{window});vm.runInNewContext(source,{window});
assert.equal(calls,1);assert.equal(records.length,21);
const names=records.flatMap(r=>r.names);assert.equal(names.length,34);assert.equal(new Set(names).size,34);
for(const r of records){for(const k of ['role','use','form','purpose','difference','source','sourceLabel','reviewed'])assert(r[k]);assert(/^https:\/\//.test(r.source));assert.equal(typeof r.formUnspecified,'boolean');}
for(const n of ['corn starch','tapioca starch','modified starch','modified food starch','cellulose','guar gum','maltodextrin'])assert(!names.includes(n));
assert.throws(()=>vm.runInNewContext(source,{window:{}}),/requires/);
const failure={OLIngredientEntries:{add(){throw new Error('registration conflict');}}};assert.throws(()=>vm.runInNewContext(source,{window:failure}),/registration conflict/);assert(!failure.__olStarchesFibersAdded);
console.log('PASS: data schema, 21 records/34 names, exclusions, repeat load, missing engine, registration failure flag. Not an application integration test.');
