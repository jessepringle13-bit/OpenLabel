// usage: PLAYWRIGHT_DIR=$(npm root -g) node run.mjs <folder with corpus.json> <app url>
const { chromium } = await import('file://' + process.env.PLAYWRIGHT_DIR + '/playwright/index.mjs');
const fs = await import('node:fs');
const corpus = JSON.parse(fs.readFileSync(process.argv[2] + '/corpus.json', 'utf8'));
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
await p.goto(process.argv[3] + '/index.html', { waitUntil: 'load' });
// wait for the ingredient modules to finish loading (entry count stops growing)
await p.waitForFunction(() => window.OLIngredientStatus && window.OLIngredients && window.OLPurpose, null, { timeout: 30000 });
let last = -1, stable = 0;
for (let i = 0; i < 40 && stable < 4; i++) { const n = await p.evaluate(() => { try { return ['magnesium glycinate', 'zinc picolinate', 'carrageenan', 'methylcobalamin', 'ashwagandha', 'sucralose'].filter(x => window.OLIngredients.lookup(x)).length } catch (e) { return -2 } }); if (n === last) stable++; else { stable = 0; last = n; } await p.waitForTimeout(500); }
const out = await p.evaluate((corpus) => {
  // split on commas that are not inside parentheses
  function split(s) { const out = []; let d = 0, cur = ''; for (const ch of s) { if (ch === '(') d++; if (ch === ')') d = Math.max(0, d - 1); if (ch === ',' && d === 0) { out.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) out.push(cur.trim()); return out.filter(Boolean); }
  const base = t => t.replace(/\s*\(.*$/, '').trim();
  const S = window.OLIngredientStatus, rows = [];
  function judge(group, product, token, part) {
    const full = S.describe(token), b = S.describe(base(token));
    const known = full.known || b.known;
    const entry = (window.OLIngredients.lookup(token) || window.OLIngredients.lookup(base(token)));
    const research = (full.research && !/pending/i.test(full.research)) || (b.research && !/pending/i.test(b.research));
    rows.push({ knownFull: full.known, plainFull: !!full.plain, plain: !!(full.plain || b.plain), group, product, token, part, known, fromEntry: !!(entry && entry.purpose), research });
  }
  for (const [name, list] of Object.entries(corpus.food)) split(list).forEach(t => judge('Food', name, t, 'ingredient'));
  for (const [name, o] of Object.entries(corpus.supp)) { split(o.active).forEach(t => judge('Supplement', name, t, 'active')); if (o.other) split(o.other).forEach(t => judge('Supplement', name, t, 'other')); }
  return rows;
}, corpus);
fs.writeFileSync(process.argv[2] + '/results.json', JSON.stringify(out, null, 1));
console.log('rows', out.length, 'page errors', JSON.stringify(errs.slice(0, 2)), 'modules settled at', last);
await b.close();
