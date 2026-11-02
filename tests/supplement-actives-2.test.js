// Supplement actives, second batch (carnitine): every sentence the entry quotes from the NIH Office of Dietary Supplements fact sheet
// must appear word for word in the saved passages, and the entry's own wording must hold no health claim or verdict. No network.
// Run: node tests/supplement-actives-2.test.js
const fs = require('fs'), vm = require('vm'), assert = require('assert'), path = require('path');
const source = fs.readFileSync(path.join(__dirname, '..', 'ingredient-supplement-actives-2.js'), 'utf8');
const fx = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'ods-carnitine-2026-11-02.json'), 'utf8'));
let calls = 0, records; const window = { OLIngredientEntries: { add(b) { calls++; records = b; } } };
vm.runInNewContext(source, { window }); vm.runInNewContext(source, { window });
assert.equal(calls, 1, 'registers once even if loaded twice'); assert.equal(records.length, 1);
const r = records[0], QUOTE = /“([^”]+)”/g;
assert.equal(JSON.stringify(r.names), JSON.stringify(['carnitine', 'l-carnitine', 'acetyl-l-carnitine', 'propionyl-l-carnitine']));
for (const k of ['role', 'use', 'form', 'purpose', 'difference', 'source', 'sourceLabel', 'reviewed']) assert(r[k], k);
assert.equal(r.bracketOk, true); assert.equal(typeof r.formUnspecified, 'boolean');
const page = fx.pages[r.source]; assert(page && page.text.length > 500, 'no saved passages for ' + r.source);
let total = 0;
for (const f of ['form', 'purpose', 'difference']) {
  const qs = [...r[f].matchAll(QUOTE)].map(m => m[1]); assert(qs.length > 0, f + ' has no quotation');
  for (const x of qs) { total++; assert(page.text.includes(x), f + ' quotes text not in the saved passages: ' + x.slice(0, 80)); }
  assert(/says: “/.test(r[f]), f + ' lacks attribution');
}
const upd = r.difference.match(/was last updated in ([A-Za-z]+ \d{4})\./); assert(upd && /Updated: April \d+, 2023/.test(page.text) && upd[1] === 'April 2023');
const own = [r.form, r.purpose, r.difference].join(' ').replace(QUOTE, ' ');
assert(!/\b(safe|unsafe|harmful|healthy|toxic|dangerous|effective|works|cures?|treats?|prevents?|recommend(ed)?)\b/i.test(own), 'verdict or claim in own wording');
assert(/not medical advice/.test(r.difference) && /assigns no verdict/.test(r.difference));
// both sides are shown: a role the page names, and limits (amount not set, side effects, medication interactions)
assert(/essential cofactor/.test(r.purpose) && /do not need to consume carnitine/.test(r.purpose));
for (const w of ['tolerable upper intake level', 'nausea', 'interact with carnitine supplements', 'mixed']) assert(r.difference.includes(w), w);
assert.throws(() => vm.runInNewContext(source, { window: {} }), /requires/);
const bad = { OLIngredientEntries: { add() { throw new Error('registration conflict'); } } };
assert.throws(() => vm.runInNewContext(source, { window: bad }), /registration conflict/); assert(!bad.__olSupplementActives2Added);
console.log('PASS: 1 record / 4 names; ' + total + ' quotations word for word in the saved ODS passages; last-updated month matches; no verdict or claim in our own wording. Not an application integration test.');
