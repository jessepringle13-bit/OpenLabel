const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const source=fs.readFileSync(path.join(__dirname,'..','ingredient-food-basics.js'),'utf8');
let calls=0,records;const window={OLIngredientEntries:{add(batch){calls++;records=batch;}}};
vm.runInNewContext(source,{window});vm.runInNewContext(source,{window});assert.equal(calls,1);assert.equal(records.length,22);
const names=records.flatMap(r=>r.names);assert.equal(names.length,41);assert.equal(new Set(names).size,41);
for(const r of records){for(const k of ['role','use','form','purpose','difference','source','sourceLabel','reviewed'])assert(r[k]);assert(r.source.startsWith('https://'));assert.equal(typeof r.formUnspecified,'boolean');}
assert(names.includes('cocoa(processed with alkali)'));assert(names.includes('peanut butter (peanuts)'));
for(const n of ['corn starch','rice starch','flaxseed oil','cocoa butter','fractionated palm kernel oil'])assert(!names.includes(n));
assert.throws(()=>vm.runInNewContext(source,{window:{}}),/requires/);
const failure={OLIngredientEntries:{add(){throw new Error('conflict');}}};assert.throws(()=>vm.runInNewContext(source,{window:failure}),/conflict/);assert(!failure.__olFoodBasicsAdded);
console.log('PASS: food-basics schema and registration controls. Mock registration API only; not main overlap or browser validation.');
