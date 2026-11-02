// Regulated additives, next batch (wheat gluten, whey, whey protein concentrate, DATEM, ammonium sulfate, glycerol ester of rosin, polyethylene glycol):
// every use and fact an entry states must appear in the saved regulation text. No network. Run: node tests/regulated-additives-2.test.js
const fs = require('fs'), vm = require('vm'), assert = require('assert'), path = require('path');
const source = fs.readFileSync(path.join(__dirname, '..', 'ingredient-regulated-additives-2.js'), 'utf8');
const fx = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'ecfr-title21-2026-10-29-b.json'), 'utf8'));
let calls = 0, records;
const window = { OLIngredientEntries: { add(b) { calls++; records = b; } } };
vm.runInNewContext(source, { window }); vm.runInNewContext(source, { window });
assert.equal(calls, 1, 'registers once even if loaded twice');
assert.equal(records.length, 7);
const names = records.flatMap(r => r.names); assert.equal(names.length, 16); assert.equal(new Set(names).size, 16);
const norm = s => s.toLowerCase().replace(/\s+/g, ' ').trim();
const sec = id => { const t = fx.sections[id]; assert(t, 'fixture missing ' + id); return norm(t.replace(/ as defined (?:in )?§ 170\.3\([no]\)\(\d+\) of this chapter/g, '')); };
const byId = {}; records.forEach(r => { byId[r.source.split('section-')[1]] = r; });
for (const r of records) {
  for (const k of ['role', 'use', 'form', 'purpose', 'difference', 'source', 'sourceLabel', 'reviewed']) assert(r[k], k + ' missing for ' + r.names[0]);
  assert.equal(typeof r.formUnspecified, 'boolean');
  assert(/^https:\/\/www\.ecfr\.gov\/current\/title-21\/section-\d+\.\d+[a-z]?$/.test(r.source), r.source);
  assert(fx.sections[r.source.split('section-')[1]], 'no saved text for ' + r.source);
  assert(/not a finding about this product/.test(r.difference) && /No new health verdict/.test(r.difference));
  assert(!/\b(safe for|unsafe|harmful|healthy|toxic|dangerous|good for|bad for|effective|cures?|treats?|prevents?)\b/i.test([r.form, r.purpose, r.difference].join(' ')), 'verdict word in ' + r.names[0]);
}
// listed uses: exactly the set in the regulation
const split = s => s.split(/;|,\s+and\s+|,/).map(x => norm(x).replace(/^and\s+/, '')).filter(Boolean).sort();
const regUses = { '184.1322': /used as (.*?)\. \(2\)/, '184.1101': /used in food as (.*?)\. \(2\)/, '184.1143': /used as (.*?)\. \(d\)/ };
for (const [id, re] of Object.entries(regUses)) {
  const m = byId[id].purpose.match(/names these uses: (.*)\.$/); assert(m, id);
  const theirs = sec(id).match(re); assert(theirs, 'regulation use list not found ' + id);
  assert.deepStrictEqual(split(m[1]), split(theirs[1].replace(/ and a flavoring/, ', a flavoring')).map(x => x.replace(/^an? /, '')).sort(), 'uses differ ' + id);
}
// facts: each sentence-level claim appears in the regulation
const facts = {
  '184.1322': ['gliadin and glutenin', 'hydrating wheat flour', 'vital gluten is dried gluten that has retained its elastic properties', 'no limitation other than current good manufacturing practice'],
  '184.1979': ['separating the coagulum from milk, cream, or skim milk in cheesemaking', 'acid whey', 'sweet whey', 'concentrated whey', 'dry (dried) whey', 'in accordance with good manufacturing practice', 'shall be listed as “whey.”'],
  '184.1979c': ['not less than 25 percent protein', 'precipitation, filtration, or dialysis', 'fluid, concentrate, or dry', 'in accordance with good manufacturing practice', 'percent of protein present on a dry product basis', 'package sold to food manufacturers'],
  '184.1101': ['one or more of the hydroxyl groups of glycerin has been esterified by diacetyl tartaric acid and by fatty acids', 'diacetyl tartaric anhydride', 'edible sources', 'no limitation other than current good manufacturing practice', 'baked goods and baking mixes', 'nonalcoholic beverages', 'confections and frostings', 'dairy product analogs', 'fats and oils', 'acronym “datem” may be used on food labeling as the alternate common or usual name'],
  '184.1143': ['colorless or white, odorless crystals or granules', 'occurs naturally', 'neutralization of sulfuric acid with ammonium hydroxide', '0.15 percent for baked goods', '0.1 percent for gelatins and puddings'],
  '172.735': ['wood rosin, gum rosin, or tall oil rosin', 'countercurrent steam distillation or steam stripping', 'adjust the density of citrus oils used in the preparation of beverages', '100 parts per million of the finished beverage'],
  '172.820': ['addition polymer of ethylene oxide and water', 'mean molecular weight of 200 to 9,500', 'no more than 0.2 percent total by weight of ethylene and diethylene glycols', 'except in milk or preparations intended for addition to milk', 'coating, binder, plasticizing agent, and/or lubricant in tablets used for food', 'improve flavor and as a bodying agent in nonnutritive sweeteners', 'dispersing vitamin and/or mineral preparations', 'coating on sodium nitrite to inhibit hygroscopic properties', 'not greater than that required to produce the intended physical or technical effect', 'tolerance of zero is established for residues of polyethylene glycol in milk']
};
for (const [id, list] of Object.entries(facts)) for (const f of list) assert(sec(id).includes(norm(f)), id + ' regulation lacks: ' + f);
// the entry really says what the facts say (numbers and key terms present in the entry, not just in the regulation)
const says = { '184.1143': ['0.15 percent for baked goods', '0.1 percent for gelatins and puddings'], '172.735': ['100 parts per million'], '172.820': ['200 to 9,500', '0.2 percent', 'tolerance of zero'], '184.1322': ['gliadin and glutenin'], '184.1979c': ['25 percent protein'], '184.1101': ['“DATEM”'] };
for (const [id, list] of Object.entries(says)) for (const f of list) assert(norm(byId[id].form + ' ' + byId[id].difference + ' ' + byId[id].purpose).includes(norm(f)), id + ' entry lacks: ' + f);
// listings that name no functions must not invent any
for (const id of ['184.1979', '184.1979c']) { assert(/does not itemize specific functions/.test(byId[id].purpose) && !/names these uses/.test(byId[id].purpose), id); assert(!/ as (a|an) (emulsifier|stabilizer|thickener|binder)/.test(byId[id].purpose)); }
// allergen-source entries say they are not an allergen declaration
for (const id of ['184.1322', '184.1979', '184.1979c']) assert(/not an allergen declaration/.test(byId[id].difference), id);
// skipped on purpose: gum base (long specification list), enzymes, sodium caseinate (listing names no functions)
for (const n of ['gum base', 'sodium caseinate', 'gluten', 'monoglycerides', 'carrageenan', 'protease']) assert(!names.includes(n), n + ' should not be in this batch');
// failure behavior
assert.throws(() => vm.runInNewContext(source, { window: {} }), /requires/);
const failure = { OLIngredientEntries: { add() { throw new Error('registration conflict'); } } };
assert.throws(() => vm.runInNewContext(source, { window: failure }), /registration conflict/); assert(!failure.__olRegulatedAdditives2Added);
console.log('PASS: 7 records / 16 names; listed uses and facts match the saved regulation text; no function invented for no-function listings; no verdict words. Not an application integration test.');
