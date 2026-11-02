// Supplement actives, third batch (creatine): every sentence the entry quotes from the Operation Supplement Safety (OPSS) creatine page
// must appear word for word in the saved passages, and the entry's own wording must hold no health claim or verdict. No network.
// Run: node tests/supplement-actives-3.test.js
const fs = require('fs'), vm = require('vm'), assert = require('assert'), path = require('path');
const source = fs.readFileSync(path.join(__dirname, '..', 'ingredient-supplement-actives-3.js'), 'utf8');
const fx = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'opss-creatine-2026-11-02.json'), 'utf8'));
let calls = 0, records; const window = { OLIngredientEntries: { add(b) { calls++; records = b; } } };
vm.runInNewContext(source, { window }); vm.runInNewContext(source, { window });
assert.equal(calls, 1, 'registers once even if loaded twice'); assert.equal(records.length, 1);
const r = records[0], QUOTE = /“([^”]+)”/g;
assert.equal(JSON.stringify(r.names), JSON.stringify(['creatine', 'creatine monohydrate']));
for (const k of ['role', 'use', 'form', 'purpose', 'difference', 'source', 'sourceLabel', 'reviewed']) assert(r[k], k);
assert.equal(r.bracketOk, true); assert.equal(typeof r.formUnspecified, 'boolean');
const page = fx.pages[r.source]; assert(page && page.text.length > 500, 'no saved passages for ' + r.source);
let total = 0;
for (const f of ['form', 'purpose', 'difference']) {
  const qs = [...r[f].matchAll(QUOTE)].map(m => m[1]); assert(qs.length > 0, f + ' has no quotation');
  for (const x of qs) { total++; assert(page.text.includes(x), f + ' quotes text not in the saved passages: ' + x.slice(0, 80)); }
  assert(/says: “/.test(r[f]), f + ' lacks attribution');
}
const posted = r.difference.match(/was posted (\d+ [A-Za-z]+ \d{4})\./); assert(posted && page.text.includes('Posted ' + posted[1]), 'posted date differs from the saved page');
const own = [r.form, r.purpose, r.difference].join(' ').replace(QUOTE, ' ');
assert(!/\b(safe|unsafe|harmful|healthy|toxic|dangerous|effective|works|cures?|treats?|prevents?|recommend(ed)?)\b/i.test(own), 'verdict or claim in own wording');
assert(/not medical advice/.test(r.difference) && /assigns no verdict/.test(r.difference));
// both sides are shown: a role the page names, and limits (amount not set, side effects, medication interactions)
assert(/used as a source of energy/.test(r.purpose) && /have shown benefits/.test(r.purpose));
for (const w of ['does not appear to be any benefit', 'isn\'t enough scientific evidence', 'weight gain', 'healthcare provider']) assert(r.difference.includes(w), w);
assert.throws(() => vm.runInNewContext(source, { window: {} }), /requires/);
const bad = { OLIngredientEntries: { add() { throw new Error('registration conflict'); } } };
assert.throws(() => vm.runInNewContext(source, { window: bad }), /registration conflict/); assert(!bad.__olSupplementActives3Added);
console.log('PASS: 1 record / 2 names; ' + total + ' quotations word for word in the saved OPSS passages; posted date matches; no verdict or claim in our own wording. Not an application integration test.');
