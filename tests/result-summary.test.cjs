// "At a glance" card: it must come after the product findings, stay last when later sections render, and never point "below" when it is below.
// Real file, minimal page in headless Chromium (no network). Run: node tests/result-summary.test.cjs
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const { chromium } = require('playwright');
const src = fs.readFileSync(path.join(__dirname, '..', 'result-summary.js'), 'utf8');
const model = require('../result-summary.js').model; // node side: no document needed
(async () => {
  const m = model({ hint: '', type: '', serving: '12 fl oz', ingredients: false, priorityCount: 2 });
  assert(!/\bbelow\b/.test(JSON.stringify(m)), 'wording must not say below');
  const b = await chromium.launch(); const p = await b.newPage();
  await p.setContent('<div id="resultName">Bloom Pop</div><div id="olPanel"><div class="olp-id"><h2>Bloom Pop</h2></div><div class="olp-body"><details class="olr pin"><summary>Finding</summary></details></div></div>');
  await p.addScriptTag({ content: src }); await p.waitForTimeout(300);
  const order = () => p.evaluate(() => [...document.querySelector('.olp-body').children].map(c => c.className || c.tagName));
  assert.deepEqual(await order(), ['olr pin', 'ols-summary']);
  await p.evaluate(() => { const d = document.createElement('details'); d.className = 'olr'; d.innerHTML = '<summary>Later section</summary>'; document.querySelector('.olp-body').appendChild(d); });
  await p.waitForTimeout(300);
  assert.deepEqual(await order(), ['olr pin', 'olr', 'ols-summary'], 'card moves back to the end after a later section renders');
  assert.equal(await p.evaluate(() => document.querySelectorAll('.ols-summary').length), 1);
  assert.equal(await p.evaluate(() => /Go to existing findings/.test(document.body.textContent)), false);
  console.log(JSON.stringify({ checksPassed: 6, scope: 'placement and wording of the At a glance card; not the full result page' })); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
