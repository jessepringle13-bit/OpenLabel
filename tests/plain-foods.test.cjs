// Plain-food status: a label name that simply identifies a food gets "Plain food ingredient" instead of "Purpose not yet verified".
// It is identification only, it must never swallow additives, extracts, oils, sugars, salt or active supplement ingredients,
// and a reviewed entry must always win. Run: node tests/plain-foods.test.cjs
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const plain = require('../ingredient-plain-foods.js'), status = require('../ingredient-row-fix.js');
let checks = 0; const check = fn => { fn(); checks++; };

// plain foods, in the shapes they appear on labels
for (const t of ['onion powder', 'Organic Garlic', 'whole grain oats', 'Tomatoes', 'skim milk', 'distilled vinegar', 'Eggs', 'almonds', 'carbonated water', 'yeast',
  'corn', 'cherries', 'rolled oats', 'brown rice', 'black beans', 'sesame seeds', 'sweet potatoes', 'cheddar cheese', 'tomato paste', 'lemon juice', 'spices',
  'whole wheat flour', 'peaches', 'Brussels sprouts', 'pork', 'green tea', 'cocoa powder', 'dried egg white', 'bay leaf', 'water'])
  check(() => assert.equal(plain.has(t), true, 'should be plain: ' + t));

// never plain: additives, extracts, actives, oils, sugars, salt, processed foods, compound items (all seen in the coverage audit)
for (const t of ['caffeine anhydrous', 'creatine monohydrate', 'stearic acid', 'sodium caseinate', 'artificial color', 'colors', 'hydrolyzed soy protein', 'hydrogenated vegetable oil',
  'calcium chloride', 'potassium chloride', 'vegetable capsule', 'gelatin capsule', 'apple extract', 'beet juice extract', 'sodium', 'potassium', 'cheese culture', 'enzymes',
  'mechanically separated chicken', 'pepperoni', 'whey protein isolate', 'protein blend', 'modified corn starch', 'brown sugar', 'cane sugar', 'glucose syrup', 'molasses',
  'chocolate', 'enriched flour', 'enriched wheat flour', 'vegetable shortening', 'ashwagandha', 'Bifidobacterium lactis', 'taurine', 'melatonin', 'soy sauce', 'soy lecithin',
  'olive oil', 'soybean oil', 'sea salt', 'salt', 'natural flavor', 'citric acid', 'cocoa butter', 'peanut butter', 'coconut milk', 'cream of tartar', 'codes', 'xanthan gum',
  'tomato paste (water, tomato)', 'cheddar cheese (milk, cheese cultures, salt, enzymes)', 'vitamin B6', 'ascorbic acid', 'honey', 'yeast extract', 'vanilla extract', '', null])
  check(() => assert.equal(plain.has(t), false, 'must not be plain: ' + t));

// describe(): a reviewed entry always wins over plain-food identification
const entry = { purpose: 'Reviewed', use: 'Reviewed use', role: 'Reviewed role' };
const env = { OLPlainFoods: plain, OLIngredients: { lookup: n => n === 'garlic' ? entry : null }, OLPurpose: { lookup: () => null } };
check(() => assert.equal(status.describe('garlic', env).known, true));
check(() => assert.equal(status.describe('garlic', env).plain, false));
check(() => assert.equal(status.describe('onion powder', env).plain, true));
check(() => assert.equal(status.describe('onion powder', env).known, false));
check(() => assert.equal(status.describe('onion powder', env).role, 'Plain food ingredient'));
check(() => assert.equal(status.describe('stearic acid', env).role, 'Purpose not yet verified'));
check(() => assert.equal(status.describe('onion powder', {}).plain, false)); // list missing: unchanged behavior
check(() => assert.equal(status.rowText(status.describe('onion powder', env)), 'Plain food ingredient  ›'));
check(() => assert.equal(status.rowText(status.describe('stearic acid', env)), 'Purpose not yet verified  ›'));

// wording: identification only, research stays "pending", never a verdict
const note = status.reviewText(status.describe('onion powder', env));
check(() => assert.match(note, /^Plain food ingredient\./));
check(() => assert.match(note, /Research review pending/));
check(() => assert.match(note, /not a health assessment/));
check(() => assert.doesNotMatch(note, /\b(safe|healthy|good for|bad for|nutritious)\b/i));

// wiring is in place
const read = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
check(() => assert.match(read('ingredient-loader.js'), /"ingredient-plain-foods\.js"/));
check(() => assert.match(read('ingredients.js'), /OLPlainFoods&&window\.OLPlainFoods\.has\(label\)\?window\.OLPlainFoods\.note/));
check(() => assert.match(read('ingredient-purpose.js'), /OLPlainFoods&&window\.OLPlainFoods\.has\(label\)\?window\.OLPlainFoods\.note/));
check(() => assert.doesNotMatch(plain.note, /\b(safe|healthy|nutritious|good for|bad for)\b/i));
check(() => assert.match(plain.note, /no health assessment/));

console.log(JSON.stringify({ checksPassed: checks, scope: 'plain-food list rules and status wording; not a full browser or device test' }));
