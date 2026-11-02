// Supplement actives, first batch: every sentence an entry quotes from NIH NCCIH must appear word for word on the saved page,
// and the entry's own wording must contain no health claim or verdict. No network. Run: node tests/supplement-actives-1.test.js
const fs = require('fs'), vm = require('vm'), assert = require('assert'), path = require('path');
const source = fs.readFileSync(path.join(__dirname, '..', 'ingredient-supplement-actives-1.js'), 'utf8');
const fx = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'nccih-2026-11-01.json'), 'utf8'));
let calls = 0, records;
const window = { OLIngredientEntries: { add(batch) { calls++; records = batch; } } };
vm.runInNewContext(source, { window }); vm.runInNewContext(source, { window });
assert.equal(calls, 1, 'registers once even if loaded twice');
assert.equal(records.length, 12);

const names = records.flatMap(r => r.names);
assert.equal(names.length, 29); assert.equal(new Set(names).size, 29);
const QUOTE = /“([^”]+)”/g;
let totalQuotes = 0;
for (const r of records) {
  for (const k of ['role', 'use', 'form', 'purpose', 'difference', 'source', 'sourceLabel', 'reviewed']) assert(r[k], k + ' missing for ' + r.names[0]);
  assert.equal(typeof r.formUnspecified, 'boolean');
  assert(/^https:\/\/www\.nccih\.nih\.gov\/health\/[a-z0-9-]+$/.test(r.source), 'source form: ' + r.source);
  const page = fx.pages[r.source]; assert(page, 'no saved page for ' + r.source);
  // 1. every quotation is word for word on the saved page
  for (const field of ['form', 'purpose', 'difference']) {
    const quotes = [...r[field].matchAll(QUOTE)].map(m => m[1]);
    assert(quotes.length > 0, field + ' of ' + r.names[0] + ' has no quotation');
    for (const q of quotes) { totalQuotes++; assert(page.text.includes(q), r.names[0] + ' ' + field + ' quotes text not on the page: ' + q.slice(0, 80)); }
  }
  // 2. the stated "last updated" month matches the saved page
  const upd = r.difference.match(/was last updated in ([A-Za-z]+ \d{4})\./); assert(upd, 'no last-updated note for ' + r.names[0]);
  assert(page.text.includes('Last Updated: ' + upd[1]), 'last-updated month differs from the page for ' + r.names[0]);
  // 3. attribution is present and our own words (everything outside quotations) hold no verdict or claim
  assert(/says: “/.test(r.form) && /says: “/.test(r.purpose) && /says: “/.test(r.difference));
  const own = [r.form, r.purpose, r.difference].join(' ').replace(QUOTE, ' ');
  const bad = own.match(/\b(safe|unsafe|harmful|healthy|toxic|dangerous|effective|works|cures?|treats?|prevents?|recommend(ed)?)\b/i);
  assert(!bad, 'verdict or claim in own wording for ' + r.names[0] + ': ' + (bad && bad[0]));
  assert(/not medical advice/.test(r.difference) && /assigns no verdict/.test(r.difference));
}
// 4. every page used is saved with its title, and the fixture holds only pages used
assert.deepStrictEqual(Object.keys(fx.pages).sort(), [...new Set(records.map(r => r.source))].sort());
for (const [url, p] of Object.entries(fx.pages)) assert(p.title && p.text.length > 1000, url);
// 5. both sides are shown: every entry carries a benefit-side sentence and a limits-side sentence
for (const r of records) { assert(r.purpose.length > 60); assert(r.difference.length > 200); }
// 6. skipped on purpose: names already in the app, plain 'turmeric' (a food) and anything this source does not cover
for (const n of ['turmeric', 'turmeric extract', 'green tea extract', 'ubiquinone', 'taurine', 'l-carnitine', 'creatine', 'lactobacillus acidophilus']) assert(!names.includes(n), n + ' should not be in this batch');
// failure behavior
assert.throws(() => vm.runInNewContext(source, { window: {} }), /requires/);
const failure = { OLIngredientEntries: { add() { throw new Error('registration conflict'); } } };
assert.throws(() => vm.runInNewContext(source, { window: failure }), /registration conflict/); assert(!failure.__olSupplementActives1Added);
console.log('PASS: 12 records / 29 names; ' + totalQuotes + ' quotations all word for word on the saved NCCIH pages; last-updated months match; no verdict or claim in our own wording. Not an application integration test.');
