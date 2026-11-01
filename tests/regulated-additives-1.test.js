// Batch 1 of regulated additives: every claim an entry makes must match the regulation text it cites.
// Uses a snapshot of eCFR Title 21 (current as of 2026-10-29) in tests/fixtures. No network. Run: node tests/regulated-additives-1.test.js
const fs = require('fs'), vm = require('vm'), assert = require('assert'), path = require('path');
const source = fs.readFileSync(path.join(__dirname, '..', 'ingredient-regulated-additives-1.js'), 'utf8');
const fx = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'ecfr-title21-2026-10-29.json'), 'utf8'));
let calls = 0, records;
const window = { OLIngredientEntries: { add(batch) { calls++; records = batch; } } };
vm.runInNewContext(source, { window }); vm.runInNewContext(source, { window });
assert.equal(calls, 1, 'registers once even if loaded twice');
assert.equal(records.length, 16);

const names = records.flatMap(r => r.names);
assert.equal(names.length, 24); assert.equal(new Set(names).size, 24);
for (const r of records) {
  for (const k of ['role', 'use', 'form', 'purpose', 'difference', 'source', 'sourceLabel', 'reviewed']) assert(r[k], k + ' missing for ' + r.names[0]);
  assert.equal(typeof r.formUnspecified, 'boolean');
  assert(/^https:\/\/www\.ecfr\.gov\/current\/title-21\/section-\d+\.\d+$/.test(r.source), 'source form: ' + r.source);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(r.reviewed));
}

// the regulation text, with the 170.3 cross-references removed
const sec = id => { const t = fx.sections[id]; assert(t, 'fixture missing ' + id); return t.replace(/ as defined (?:in )?§ 170\.3\(o\)\(\d+\) of this chapter/g, ''); };
const norm = s => s.toLowerCase().replace(/\s+/g, ' ').trim();
// the list of uses a Part 184 section names: text after "used as"/"used in food as" up to the end of that sentence
function listedUses(id) {
  const t = sec(id);
  const m = t.match(/is used (?:in food )?as (.*?)(?:, with no limitation|\.\s*(?:\(\d\)|\(d\)|$))/i);
  assert(m, 'no use list found in ' + id);
  return m[1].replace(/[;,]\s+and\s+/g, '; ').split(/[;,]/).map(x => norm(x).replace(/^(?:and\s+)?(?:as\s+)?(?:an?\s+)?/, '')).filter(Boolean);
}
const byId = {}; records.forEach(r => { byId[r.source.split('section-')[1]] = r; });

// Part 184 entries: the uses in the entry are exactly the uses in the regulation (same set, nothing added or dropped)
for (const id of ['184.1230', '184.1193', '184.1622', '184.1207', '184.1639', '184.1742', '184.1619', '184.1090', '184.1978', '184.1370', '184.1375']) {
  const r = byId[id]; assert(r, 'no entry for ' + id);
  const m = r.purpose.match(/names these uses: (.*)\.$/); assert(m, 'purpose format ' + id);
  const mine = m[1].split(', ').map(norm).sort(), theirs = listedUses(id).sort();
  assert.deepStrictEqual(mine, theirs, 'listed uses differ from the regulation for ' + id);
}

// Part 182 entries: the regulation names the product and says "generally recognized as safe ... good manufacturing practice"; the purpose must not invent functions
const gras = 'generally recognized as safe when used in accordance with good manufacturing practice';
const titles = { '182.1217': 'Calcium phosphate (mono-, di-, and tribasic)', '182.1778': 'Sodium phosphate (mono-, di-, and tribasic)', '182.6285': 'Dipotassium phosphate', '182.1810': 'Sodium tripolyphosphate', '182.6760': 'Sodium hexametaphosphate',
  '182.6215': 'Monobasic calcium phosphate', '182.8217': 'Calcium phosphate (mono-, di-, and tribasic)', '182.6778': 'Sodium phosphate (mono-, di-, and tribasic)', '182.8778': 'Sodium phosphate (mono-, di-, and tribasic)', '182.6810': 'Sodium tripolyphosphate' };
for (const [id, product] of Object.entries(titles)) { const t = sec(id); assert(t.includes('(a) Product. ' + product), id + ' product'); assert(t.includes(gras), id + ' GRAS wording'); }
for (const id of ['182.1217', '182.1778', '182.6285', '182.1810', '182.6760']) {
  const r = byId[id]; assert(/does not itemize specific functions/.test(r.purpose), id); assert(!/used as|names these uses/.test(r.purpose), id + ' must not claim functions');
}
// every section number an entry mentions exists in the snapshot
for (const r of records) for (const m of (r.difference + r.purpose).matchAll(/§ (18[24]\.\d+)/g)) assert(fx.sections[m[1]], 'mentioned section not in snapshot: ' + m[1]);
// headings the entries describe: sequestrant listings are the 182.6xxx sections, nutrient listings the 182.8xxx sections
assert(/sequestrants?/i.test(byId['182.6285'].difference) && /182\.6285/.test(byId['182.6285'].difference));
assert(norm(fx.sequestrant_definition).includes('substances which combine with polyvalent metal ions to form a soluble metal complex, to improve the quality and stability of products'));
for (const r of records) if (/FDA defines a sequestrant/.test(r.difference)) assert(norm(r.difference).includes('substances which combine with polyvalent metal ions to form a soluble metal complex, to improve the quality and stability of products'));

// facts stated in "limits" sentences appear in the regulation text
const facts = { '184.1230': ['1.3 percent for baked goods', '3.0 percent for confections and frostings', '0.07 percent or less for all other food categories'],
  '184.1193': ['0.3 percent for baked goods', '0.22 percent for nonalcoholic beverages and beverage bases'], '184.1207': ['except in infant foods and infant formulas'], '184.1639': ['does not authorize its use in infant foods and infant formulas'],
  '184.1622': ['section 412(g)'], '184.1370': ['special dietary foods', 'section 412(g)'], '184.1375': ['reduced iron', 'electrolytic iron', 'carbonyl iron', 'section 412(g)'], '184.1978': ['Copernicia cerifera', 'baked goods and baking mixes', 'chewing gum', 'soft candy'],
  '184.1090': ['tallow', 'completely hydrogenated vegetable oil'], '184.1742': ['trona', 'Solvay'], '184.1619': ['electrolysis of potassium chloride'] };
for (const [id, list] of Object.entries(facts)) for (const f of list) assert(norm(sec(id)).includes(norm(f)), id + ' text should contain: ' + f);

// the numbers an entry states are the numbers in the regulation, and the entry really says them
for (const [id, list] of Object.entries({ '184.1230': ['1.3 percent for baked goods', '3.0 percent for confections and frostings', '0.07 percent or less for all other food categories'], '184.1193': ['0.3 percent for baked goods', '0.22 percent for nonalcoholic beverages and beverage bases'], '184.1207': ['except in infant foods and infant formulas'] }))
  for (const f of list) { assert(norm(sec(id)).includes(norm(f)), id + ' regulation lacks: ' + f); assert(norm(byId[id].difference).includes(norm(f)), id + ' entry lacks: ' + f); }

// wording rules: no verdicts, no health claims of our own
for (const r of records) assert(!/\b(safe for|unsafe|harmful|healthy|toxic|dangerous|good for|bad for)\b/i.test([r.form, r.purpose, r.difference].join(' ')), 'verdict word in ' + r.names[0]);
// skipped on purpose: names that already exist in the app, and sodium bicarbonate (its listing names no functions)
for (const n of ['sodium bicarbonate', 'dicalcium phosphate', 'magnesium stearate', 'silicon dioxide', 'hydroxypropyl methylcellulose', 'glycerin', 'sodium caseinate', 'hypromellose']) assert(!names.includes(n), n + ' should not be in this batch');
// failure behavior
assert.throws(() => vm.runInNewContext(source, { window: {} }), /requires/);
const failure = { OLIngredientEntries: { add() { throw new Error('registration conflict'); } } };
assert.throws(() => vm.runInNewContext(source, { window: failure }), /registration conflict/); assert(!failure.__olRegulatedAdditives1Added);
console.log('PASS: 16 records / 24 names; listed uses match the regulation exactly for 11 sections; Part 182 listings do not claim functions; quoted definition verbatim; limit facts present; no verdict words. Not an application integration test.');
