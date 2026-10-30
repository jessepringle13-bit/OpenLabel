/* Run: node tests/allergen-gap-note.test.js. Pulls the helper and its dependencies out of index.html. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const lines=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8').split('\n');
const pick=prefix=>{const l=lines.find(x=>x.startsWith(prefix));assert.ok(l,'missing '+prefix);return l};
const ctx={};vm.createContext(ctx);
vm.runInContext([pick('const ALLERGENS='),pick('function textKey('),pick('function hasWord('),pick('function allergenGapNote(')].join('\n').replace(/^const ALLERGENS/m,'var ALLERGENS'),ctx);
const gap=p=>ctx.allergenGapNote(p);
const nutella={live:true,ingText:'sugar, palm oil',allergenTags:['en:milk','en:nuts','en:soybeans']};
assert.match(gap(nutella),/may be incomplete: this product lists milk, tree nuts, soy as allergens/);
assert.match(gap(nutella),/Check the package\./);
assert.equal(gap({live:true,ingText:'sugar, skim milk powder, hazelnuts, soy lecithin',allergenTags:['en:milk']}),'');
assert.match(gap({live:true,ingText:'water, coconut milk',allergenTags:['en:milk']}),/lists milk as an allergen, but that word does not appear/);
assert.equal(gap({live:true,ingText:'sugar',allergenTags:[]}),'');
assert.equal(gap({live:true,ingText:'',allergenTags:['en:milk']}),'');
assert.equal(gap({live:false,ingText:'sugar',allergenTags:['en:milk']}),'');
console.log('7 allergen gap note assertions passed');
