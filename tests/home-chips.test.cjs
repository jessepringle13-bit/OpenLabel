// Allergy chips on Home's Recent list and the Library lists (index.html window.OLAllergyChips).
// The wording matches the product panel: "Contains: X" (red), "May contain: X" (orange), grey for no match or cannot check.
// "No match" must never read as safe, and nothing is shown at all until the person has chosen allergies or watch words.
// Runs the real code pulled out of index.html. No jsdom, no network. Run: node tests/home-chips.test.cjs
const fs = require('fs'), vm = require('vm'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const list = html.match(/const ALLERGENS=\[.*?\];if\(typeof window!=='undefined'\)window\.OLAllergens=ALLERGENS;/s);
const helpers = html.match(/function tagName[^\n]*\nfunction textKey[^\n]*\nfunction hasWord[^\n]*/);
const check = html.match(/function checkAllergens\(p\)\{.*?\}(?=\nfunction allergenGapNote)/s);
const chips = html.match(/window\.OLAllergyChips=function\(id\)\{[^\n]*/);
if (!list || !helpers || !check || !chips) { console.error('FAIL: could not find the allergen or chip code in index.html'); process.exit(1); }

const ctx = { window: {}, state: { allergies: [], custom: [] }, PRODUCTS: {} };
vm.createContext(ctx);
vm.runInContext('function getProduct(id){return PRODUCTS[id]||null}\n' + list[0] + '\n' + helpers[0] + '\n' + check[0] + '\n' + chips[0] + '\nthis.chips=window.OLAllergyChips;', ctx);

let failed = 0, total = 0;
function eq(label, got, want) { total++; if (JSON.stringify(got) !== JSON.stringify(want)) { failed++; console.log('FAIL  ' + label + '\n      got  ' + JSON.stringify(got) + '\n      want ' + JSON.stringify(want)); } }
function run(allergies, custom, product) { ctx.state.allergies = allergies; ctx.state.custom = custom; ctx.PRODUCTS.p = product; return ctx.chips('p'); }
const live = (o) => Object.assign({ id: 'p', live: true, allergenTags: [], traceTags: [] }, o);

// nothing chosen: no chips at all, so Home stays quiet
eq('no allergies chosen', run([], [], live({ ingText: 'sugar, milk' })), null);
eq('unknown product', ctx.chips('missing'), null);

// matches, worded as in the product panel
eq('declared allergen tag', run(['milk'], [], live({ allergenTags: ['en:milk'], ingText: 'sugar, milk' })), [{ t: 'Contains: Milk', c: 'red' }]);
eq('found in ingredient text', run(['milk'], [], live({ ingText: 'sugar, cultured buttermilk' })), [{ t: 'Contains: Milk', c: 'red' }]);
eq('two allergens', run(['milk', 'peanuts'], [], live({ ingText: 'milk chocolate, peanuts' })), [{ t: 'Contains: Milk, Peanuts', c: 'red' }]);
eq('trace only', run(['milk'], [], live({ traceTags: ['en:milk'], ingText: 'sugar, cocoa' })), [{ t: 'May contain: Milk', c: 'orange' }]);
eq('contains and traces', run(['milk', 'soy'], [], live({ ingText: 'milk powder', traceTags: ['en:soybeans'] })), [{ t: 'Contains: Milk', c: 'red' }, { t: 'May contain: Soy', c: 'orange' }]);
eq('own watch word', run([], ['carrageenan'], live({ ingText: 'milk, carrageenan' })), [{ t: 'Your watch words: carrageenan', c: 'orange' }]);

// no match is never green and never says safe
eq('no match, label data present', run(['milk'], [], live({ ingText: 'water, salt' })), [{ t: 'No detected match · unverified', c: 'grey' }]);
eq('no ingredient or allergen data', run(['milk'], [], { id: 'p', live: false }), [{ t: 'Cannot check allergens', c: 'grey' }]);
eq('only watch words chosen, none found', run([], ['carrageenan'], live({ ingText: 'water' })), [{ t: 'No watch word found', c: 'grey' }]);
eq('saved before allergy checks existed', run(['milk'], [], { id: 'p', live: true, ingText: 'water, salt' }), [{ t: 'Scan again to check allergens', c: 'grey' }]);

// plain look-alikes are not flagged
eq('coconut milk is not dairy', run(['milk'], [], live({ ingText: 'coconut milk, water' })), [{ t: 'No detected match · unverified', c: 'grey' }]);

// no wording that reads as a verdict
const all = [run(['milk'], [], live({ ingText: 'water' })), run(['milk'], [], { id: 'p', live: false })].map(x => x[0].t).join(' ');
eq('no verdict words', /\b(safe|healthy|good|bad|ok|clear)\b/i.test(all), false);

console.log(failed ? failed + ' of ' + total + ' checks failed' : 'home-chips: all ' + total + ' checks passed');
process.exit(failed ? 1 : 0);
