// Main allergen check (index.html): realistic ingredient wording must be caught, and look-alikes must not.
// Runs the real code pulled out of index.html. No jsdom, no network. Run: node tests/allergen-words.test.cjs
const fs = require('fs'), vm = require('vm'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const list = html.match(/const ALLERGENS=\[.*?\];if\(typeof window!=='undefined'\)window\.OLAllergens=ALLERGENS;/s);
const helpers = html.match(/function tagName[^\n]*\nfunction textKey[^\n]*\nfunction hasWord[^\n]*/);
const check = html.match(/function checkAllergens\(p\)\{.*?\}(?=\nfunction allergenGapNote)/s);
if (!list || !helpers || !check) { console.error('FAIL: could not find the allergen code in index.html'); process.exit(1); }

const ctx = { window: {}, state: { allergies: [], custom: [] } };
vm.createContext(ctx);
vm.runInContext(list[0] + '\n' + helpers[0] + '\n' + check[0] + '\nthis.checkAllergens=checkAllergens;this.ALLERGENS=ALLERGENS;', ctx);

const LABEL = { milk: 'Milk', egg: 'Eggs', fish: 'Fish', shellfish: 'Crustacean shellfish', treenuts: 'Tree nuts', peanuts: 'Peanuts', wheat: 'Wheat', soy: 'Soy', sesame: 'Sesame' };
function caught(id, ingText) {
  ctx.state.allergies = [id];
  return ctx.checkAllergens({ ingText, allergenTags: [], traceTags: [], live: true }).hits.some(h => h.label === LABEL[id]);
}

// [allergen id, ingredient wording that must be caught]
const MUST_CATCH = [
  ['milk', 'Cultured buttermilk, salt'], ['milk', 'Nonfat dry milk'], ['milk', 'Cheeses (cheddar)'], ['milk', 'Milkfat'], ['milk', 'Kefir'],
  ['milk', 'Sodium caseinate'], ['milk', 'Half-and-half'], ['milk', 'Curds'], ['milk', 'Whey protein'], ['milk', 'Butters'],
  ['egg', 'Egg yolks'], ['egg', 'Eggs'], ['egg', 'Dried egg white'], ['egg', 'Mayonnaise'],
  ['fish', 'Catfish fillet'], ['fish', 'Halibut'], ['fish', 'Swordfish'], ['fish', 'Surimi'], ['fish', 'Snapper'], ['fish', 'Caviar'],
  ['fish', 'Anchovies'], ['fish', 'Fish sauce'], ['fish', 'Fish oil'], ['fish', 'Basses'],
  ['shellfish', 'Shellfish extract'], ['shellfish', 'Crustaceans'], ['shellfish', 'Scampi'], ['shellfish', 'Crab meat'], ['shellfish', 'Shrimp paste'],
  ['treenuts', 'Mixed nuts'], ['treenuts', 'Filberts'], ['treenuts', 'Chestnuts'], ['treenuts', 'Nut paste'], ['treenuts', 'Almond flour'],
  ['treenuts', 'Cashews'], ['treenuts', 'Pine nut pesto'],
  ['peanuts', 'Peanut oil'], ['peanuts', 'Groundnuts'], ['peanuts', 'Monkey nuts'],
  ['wheat', 'Enriched flour (wheat flour, niacin)'], ['wheat', 'Enriched flour'], ['wheat', 'Whole wheat'], ['wheat', 'Farina'], ['wheat', 'Graham flour'], ['wheat', 'Matzo meal'],
  ['soy', 'Soy lecithin'], ['soy', 'Tamari'], ['soy', 'Shoyu'], ['soy', 'Natto'], ['soy', 'Textured vegetable protein'], ['soy', 'Soybean oil'],
  ['sesame', 'Sesame seeds'], ['sesame', 'Tahini'], ['sesame', 'Gomasio'],
];

// Look-alikes that must NOT be flagged for that allergen.
const MUST_NOT_CATCH = [
  ['milk', 'Coconut milk'], ['milk', 'Cocoa butter'], ['milk', 'Peanut butter'], ['milk', 'Almond milk'], ['milk', 'Oat milk'], ['milk', 'Butternut squash'],
  ['wheat', 'Rice flour'], ['wheat', 'Almond flour'], ['wheat', 'Oat bran'], ['wheat', 'Corn flour'],
  ['treenuts', 'Roasted peanuts'], ['treenuts', 'Coconut'], ['treenuts', 'Doughnuts'], ['treenuts', 'Nutmeg'],
  ['fish', 'Codes of practice'], ['fish', 'Sea salt'],
  ['peanuts', 'Tree nuts'],
  ['egg', 'Eggplant'], ['soy', 'Sesame oil'],
];

// Known limits, kept visible on purpose: wording the list does not catch. Update when a word is added.
const KNOWN_GAPS = [['milk', 'Dairy blend'], ['wheat', 'Bran']];

let failed = 0;
for (const [id, t] of MUST_CATCH) if (!caught(id, t)) { failed++; console.log('MISSED  ' + id + ': "' + t + '"'); }
for (const [id, t] of MUST_NOT_CATCH) if (caught(id, t)) { failed++; console.log('WRONGLY FLAGGED  ' + id + ': "' + t + '"'); }
for (const [id, t] of KNOWN_GAPS) if (caught(id, t)) { failed++; console.log('Known gap now caught (move it to MUST_CATCH): ' + id + ': "' + t + '"'); }

// The row-cue matcher reads this same list, so it must stay exposed.
if (!Array.isArray(ctx.window.OLAllergens) || !ctx.window.OLAllergens.length) { failed++; console.log('window.OLAllergens is not exposed'); }

const total = MUST_CATCH.length + MUST_NOT_CATCH.length + KNOWN_GAPS.length;
console.log(failed ? failed + ' failed of ' + total : 'allergen-words: all ' + total + ' checks passed');
process.exit(failed ? 1 : 0);
