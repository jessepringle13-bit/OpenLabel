// Bracketed labels: "Coenzyme Q10 (ubiquinone)" is explained by the entry for the text before the bracket,
// but only for entries flagged bracketOk (supplement actives). Everything else keeps whole-text matching. Run: node tests/bracket-lookup.test.cjs
const assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const read = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const base = { lookup: () => null, render: () => ({ querySelectorAll: () => [] }) };
const window = { OLIngredients: base }; window.window = window;
vm.runInNewContext(read('ingredient-entry-extension.js'), { window, document: {} });
const mk = (n, extra) => Object.assign({ names: [n], role: 'r', use: 'u', form: 'f', purpose: 'p', difference: 'd', source: 'https://x.org', sourceLabel: 's', reviewed: '2026-11-02' }, extra);
window.OLIngredientEntries.add([mk('coenzyme q10', { bracketOk: true }), mk('turmeric'), mk('calcium chloride')]);
const L = window.OLIngredients.lookup; let n = 0; const ok = f => { f(); n++; };
ok(() => assert.equal(L('Coenzyme Q10 (ubiquinone)').names[0], 'coenzyme q10'));
ok(() => assert.equal(L('COENZYME Q10  (as ubiquinol) (Kaneka)').names[0], 'coenzyme q10'));
ok(() => assert.equal(L('coenzyme q10').names[0], 'coenzyme q10'));
ok(() => assert.equal(L('Turmeric (color)'), null));            // not flagged: stays unexplained
ok(() => assert.equal(L('Calcium chloride (firming agent)'), null));
ok(() => assert.equal(L('(coenzyme q10)'), null));              // bracket first: no prefix
ok(() => assert.equal(L('Coenzyme Q10 powder (x)'), null));      // prefix must equal a flagged name exactly
// wiring: every supplement-active record carries the flag, no additive record does
const recs = []; vm.runInNewContext(read('ingredient-supplement-actives-1.js'), { window: { OLIngredientEntries: { add: b => recs.push(...b) } } });
ok(() => assert(recs.length === 12 && recs.every(r => r.bracketOk === true)));
const adds = []; vm.runInNewContext(read('ingredient-regulated-additives-2.js'), { window: { OLIngredientEntries: { add: b => adds.push(...b) } } });
ok(() => assert(adds.length === 7 && adds.every(r => !r.bracketOk)));
console.log(JSON.stringify({ checksPassed: n, scope: 'prefix lookup rule only; not a browser test' }));
